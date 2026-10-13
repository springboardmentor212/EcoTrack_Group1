
const Report = require("../models/Report");
const User = require("../models/User");
const CarbonEntry = require("../models/CarbonEntry");
const Challenge = require("../models/Challenge");
const UserChallenge = require("../models/UserChallenge");
const Goal = require("../models/Goal");
const ExcelJS = require("exceljs");

const getUserId = (req) =>
    req.user?.id || req.user?.userId || req.user?._id;

const sectionLabels = {
    users: "User Statistics",
    carbon: "Carbon Footprint Data",
    challenges: "Challenge Participation",
    goals: "Sustainability Goals",
};

const getDateRange = (fromDate, toDate) => {
    const start = new Date(fromDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(toDate);
    end.setUTCHours(23, 59, 59, 999);

    return { start, end };
};

const getReportRows = async (
    fromDate,
    toDate,
    sections
) => {
    const { start, end } = getDateRange(fromDate, toDate);
    const rows = [
        ["EcoTrack Platform Report"],
        ["From Date", fromDate],
        ["To Date", toDate],
        [],
    ];

    for (const section of sections) {
        rows.push([sectionLabels[section]]);
        rows.push(["Metric", "Value"]);

        if (section === "users") {
            const [registeredUsers, totalUsers] = await Promise.all([
                User.countDocuments({
                    createdAt: { $gte: start, $lte: end },
                }),
                User.countDocuments(),
            ]);

            rows.push(
                ["Users Registered During Period", registeredUsers],
                ["Total Registered Users", totalUsers]
            );
        }

        if (section === "carbon") {
            const match = {
                date: { $gte: start, $lte: end },
                isDeleted: { $ne: true },
            };

            const [entryCount, aggregation] = await Promise.all([
                CarbonEntry.countDocuments(match),
                CarbonEntry.aggregate([
                    { $match: match },
                    {
                        $group: {
                            _id: null,
                            totalCO2: { $sum: "$calculatedCO2" },
                        },
                    },
                ]),
            ]);

            rows.push(
                ["Carbon Entries During Period", entryCount],
                [
                    "Total Calculated CO2",
                    Number((aggregation[0]?.totalCO2 || 0).toFixed(3)),
                ]
            );
        }

        if (section === "challenges") {
            const challengeMatch = {
                startDate: { $gte: start, $lte: end },
            };

            const [challengeCount, challenges] = await Promise.all([
                Challenge.countDocuments(challengeMatch),
                Challenge.find(challengeMatch)
                    .select("_id title status participants")
                    .lean(),
            ]);

            const challengeIds = challenges.map(
                (challenge) => challenge._id
            );

            const [participationCount, completedParticipations] =
                challengeIds.length > 0
                    ? await Promise.all([
                          UserChallenge.countDocuments({
                              challengeId: { $in: challengeIds },
                          }),
                          UserChallenge.countDocuments({
                              challengeId: { $in: challengeIds },
                              status: "completed",
                          }),
                      ])
                    : [0, 0];

            rows.push(
                ["Challenges Started During Period", challengeCount],
                ["Total Participations in Those Challenges", participationCount],
                ["Completed Participations", completedParticipations]
            );

            if (challenges.length > 0) {
                rows.push([], ["Challenge", "Status", "Participants"]);

                challenges.forEach((challenge) => {
                    rows.push([
                        challenge.title,
                        challenge.status,
                        challenge.participants?.length || 0,
                    ]);
                });
            }
        }

        if (section === "goals") {
            const goalMatch = {
                createdAt: { $gte: start, $lte: end },
            };

            const [goalCount, activeGoals, completedGoals, pausedGoals] =
                await Promise.all([
                    Goal.countDocuments(goalMatch),
                    Goal.countDocuments({
                        ...goalMatch,
                        status: "active",
                    }),
                    Goal.countDocuments({
                        ...goalMatch,
                        status: "completed",
                    }),
                    Goal.countDocuments({
                        ...goalMatch,
                        status: "paused",
                    }),
                ]);

            rows.push(
                ["Goals Created During Period", goalCount],
                ["Active Goals", activeGoals],
                ["Completed Goals", completedGoals],
                ["Paused Goals", pausedGoals]
            );
        }

        rows.push([]);
    }

    return rows;
};

const getPastExports = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const reports = await Report.find({ createdBy: userId })
            .select("-fileData")
            .sort({ createdAt: -1 });

        return res.status(200).json(reports);
    } catch (error) {
        console.error("Get past exports error:", error);

        return res.status(500).json({
            message: "Failed to fetch exports",
        });
    }
};

const createReport = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { fromDate, toDate, format, sections } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (
            !fromDate ||
            !toDate ||
            Number.isNaN(Date.parse(fromDate)) ||
            Number.isNaN(Date.parse(toDate)) ||
            fromDate > toDate
        ) {
            return res.status(400).json({
                message: "Invalid date range",
            });
        }

        if (!["CSV", "Excel"].includes(format)) {
            return res.status(400).json({
                message: "Choose CSV or Excel",
            });
        }

        const allowedSections = [
            "users",
            "carbon",
            "challenges",
            "goals",
        ];

        if (
            !Array.isArray(sections) ||
            sections.length === 0 ||
            sections.some(
                (section) => !allowedSections.includes(section)
            )
        ) {
            return res.status(400).json({
                message: "Select valid report sections",
            });
        }

        const rows = await getReportRows(
            fromDate,
            toDate,
            sections
        );

        let fileData;
        let fileName;

        if (format === "CSV") {
            const csv = rows
                .map((row) =>
                    row
                        .map((value) => {
                            const safeValue = String(value ?? "");

                            return `"${safeValue.replace(/"/g, '""')}"`;
                        })
                        .join(",")
                )
                .join("\r\n");

            fileData = Buffer.from("\uFEFF" + csv, "utf8");
            fileName = `ecotrack-report-${fromDate}-to-${toDate}.csv`;
        } else {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = "EcoTrack";
            workbook.created = new Date();

            const sheet = workbook.addWorksheet("Platform Report");

            rows.forEach((row) => {
                const addedRow = sheet.addRow(row);

                if (
                    row.length === 1 &&
                    sectionLabels &&
                    Object.values(sectionLabels).includes(row[0])
                ) {
                    addedRow.font = { bold: true, size: 12 };
                }

                if (
                    row[0] === "Metric" ||
                    row[0] === "Challenge"
                ) {
                    addedRow.font = { bold: true };
                }
            });

            sheet.columns = [
                { width: 42 },
                { width: 32 },
                { width: 20 },
            ];

            sheet.views = [{ state: "frozen", ySplit: 1 }];

            fileData = Buffer.from(
                await workbook.xlsx.writeBuffer()
            );

            fileName = `ecotrack-report-${fromDate}-to-${toDate}.xlsx`;
        }

        const report = await Report.create({
            fromDate,
            toDate,
            format,
            sections,
            fileName,
            fileData,
            createdBy: userId,
        });

        return res.status(201).json({
            message: "Report generated successfully",
            report: {
                _id: report._id,
                fromDate: report.fromDate,
                toDate: report.toDate,
                format: report.format,
                sections: report.sections,
                fileName: report.fileName,
                createdAt: report.createdAt,
            },
        });
    } catch (error) {
        console.error("Create report error:", error);

        return res.status(500).json({
            message: "Failed to generate report",
        });
    }
};

const downloadReport = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const report = await Report.findOne({
            _id: req.params.id,
            createdBy: userId,
        });

        if (!report) {
            return res.status(404).json({
                message: "Report not found",
            });
        }

        const contentTypes = {
            CSV: "text/csv; charset=utf-8",
            Excel:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        };

        res.setHeader(
            "Content-Type",
            contentTypes[report.format] ||
                "application/octet-stream"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${report.fileName}"`
        );

        return res.send(report.fileData);
    } catch (error) {
        console.error("Download report error:", error);

        return res.status(500).json({
            message: "Failed to download report",
        });
    }
};

module.exports = {
    createReport,
    getPastExports,
    downloadReport,
};