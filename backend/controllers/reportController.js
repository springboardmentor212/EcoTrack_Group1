
const Report = require("../models/Report");
const ExcelJS = require("exceljs");

const getPastExports = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const reports = await Report.find({ createdBy: userId })
      .select("-fileData")
      .sort({ createdAt: -1 });

    return res.status(200).json(reports);
  } catch (error) {
    console.error("Get past exports error:", error);
    return res.status(500).json({ message: "Failed to fetch exports" });
  }
};

const createReport = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    const { fromDate, toDate, format, sections } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (
      !fromDate ||
      !toDate ||
      Number.isNaN(Date.parse(fromDate)) ||
      Number.isNaN(Date.parse(toDate)) ||
      fromDate > toDate
    ) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    if (!["CSV", "Excel"].includes(format)) {
      return res.status(400).json({ message: "Choose CSV or Excel" });
    }

    const allowedSections = ["users", "carbon", "challenges", "goals"];

    if (
      !Array.isArray(sections) ||
      sections.length === 0 ||
      sections.some((section) => !allowedSections.includes(section))
    ) {
      return res.status(400).json({ message: "Select valid report sections" });
    }

    const labels = {
      users: "User Statistics",
      carbon: "Carbon Footprint Data",
      challenges: "Challenge Participation",
      goals: "Sustainability Goals",
    };

    const rows = [
      ["EcoTrack Platform Report"],
      ["From Date", fromDate],
      ["To Date", toDate],
      [],
      ["Report Section", "Status"],
      ...sections.map((section) => [labels[section], "Selected"]),
    ];

    let fileData;
    let fileName;

    if (format === "CSV") {
      const csv = rows
        .map((row) =>
          row
            .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\r\n");

      fileData = Buffer.from("\uFEFF" + csv, "utf8");
      fileName = `ecotrack-report-${fromDate}-to-${toDate}.csv`;
    } else {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Platform Report");

      rows.forEach((row) => sheet.addRow(row));
      sheet.getColumn(1).width = 30;
      sheet.getColumn(2).width = 25;

      fileData = Buffer.from(await workbook.xlsx.writeBuffer());
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
    return res.status(500).json({ message: "Failed to generate report" });
  }
};

const downloadReport = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const report = await Report.findOne({
      _id: req.params.id,
      createdBy: userId,
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const contentTypes = {
      CSV: "text/csv; charset=utf-8",
      Excel:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };

    res.setHeader(
      "Content-Type",
      contentTypes[report.format] || "application/octet-stream"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${report.fileName}"`
    );

    return res.send(report.fileData);
  } catch (error) {
    console.error("Download report error:", error);
    return res.status(500).json({ message: "Failed to download report" });
  }
};

module.exports = {
  createReport,
  getPastExports,
  downloadReport,
};
