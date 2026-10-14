const fs = require("fs");
const Report = require("../models/Report");
const User = require("../models/User");
const {
  emissionsByCategory,
  goalResults,
} = require("../utils/reportAggregations");

const {
  createReportFile,
  resolveReportPath,
  INCLUDE_KEYS,
} = require("../services/reportService");

const fail = (res, code, message) =>
  res.status(code).json({
    success: false,
    message,
  });

function parseDate(value, endOfDay = false) {
  if (!value) return null;

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`)
    : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

// Map service section keys to the enum values in models/Report.js.
const REPORT_INCLUDE_MAP = {
  emissions: "emissionsByCategory",
  goals: "goalResults",
  challenges: "challengeParticipation",
  users: "perUserBreakdown",
};

const exportReport = async (req, res) => {
  let created = null;

  try {
    const { format, includes } = req.body;

    const from = parseDate(req.body.from);
    const to = parseDate(req.body.to, true);

    if (!from || !to) {
      return fail(res, 400, "Valid From and To dates are required.");
    }

    if (from > to) {
      return fail(res, 400, "From date must be before To date.");
    }

    if (!["pdf", "excel"].includes(format)) {
      return fail(res, 400, "format must be 'pdf' or 'excel'.");
    }

    if (!Array.isArray(includes) || includes.length === 0) {
      return fail(res, 400, "Select at least one item to include.");
    }

    const clean = [...new Set(includes)];

    if (clean.some((key) => !INCLUDE_KEYS.includes(key))) {
      return fail(
        res,
        400,
        `includes may only contain: ${INCLUDE_KEYS.join(", ")}.`,
      );
    }

    const user = await User.findById(req.user.userId).select("name");

    // IMPORTANT: reportService expects emissions, goals, challenges, users.
    created = await createReportFile({
      from,
      to,
      format,
      includes: clean,
      generatedBy: user ? user.name : "",
    });

    // The Report model uses different enum values.
    const report = await Report.create({
      scope: "admin",
      periodFrom: from,
      periodTo: to,
      format,
      includes: clean.map((key) => REPORT_INCLUDE_MAP[key]),
      fileName: created.fileName,
      filePath: created.filePath,
      createdBy: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Report exported.",
      data: report,
    });
  } catch (err) {
    console.error("Export failed:", err);

    // Remove the generated file if saving the report failed.
    if (created && created.absPath) {
      try {
        await fs.promises.unlink(created.absPath);
      } catch (cleanupError) {
        if (cleanupError.code !== "ENOENT") {
          console.error("Report cleanup failed:", cleanupError);
        }
      }
    }

    return fail(res, 500, "Could not generate the report.");
  }
};

const getHistory = async (req, res) => {
  try {
    const requestedLimit = parseInt(req.query.limit, 10) || 20;
    const limit = Math.min(Math.max(requestedLimit, 1), 100);

    const reports = await Report.find({ scope: "admin" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("periodFrom periodTo format includes fileName createdAt")
      .lean();

    return res.json({
      success: true,
      data: reports,
    });
  } catch (err) {
    console.error("Load report history failed:", err);
    return fail(res, 500, "Could not load past exports.");
  }
};

const downloadReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      scope: "admin",
    });

    if (!report || !report.fileName) {
      return fail(res, 404, "Report not found.");
    }

    const absPath = resolveReportPath(report.fileName);

    if (!fs.existsSync(absPath)) {
      return fail(res, 404, "The report file is no longer available.");
    }

    res.setHeader(
      "Content-Type",
      report.format === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${report.fileName}"`,
    );

    return res.download(absPath, report.fileName, (err) => {
      if (err && !res.headersSent) {
        console.error("Report download failed:", err);
        res.status(500).json({
          success: false,
          message: "Could not download the report.",
        });
      }
    });
  } catch (err) {
    console.error("Download report failed:", err);
    return fail(res, 500, "Could not download the report.");
  }
};

const getPreview = async (req, res) => {
  try {
    const from = parseDate(req.query.from);
    const to = parseDate(req.query.to, true);

    if (!from || !to) {
      return fail(res, 400, "Valid from and to dates are required.");
    }

    if (from > to) {
      return fail(res, 400, "From date must be before To date.");
    }

    const [emissions, goals] = await Promise.all([
      emissionsByCategory(from, to),
      goalResults(from, to),
    ]);

    return res.json({ success: true, data: { emissions, goals } });
  } catch (err) {
    console.error("Report preview failed:", err);
    return fail(res, 500, "Could not load the preview.");
  }
};

module.exports = {
  exportReport,
  getHistory,
  downloadReport,
  getPreview,
};
