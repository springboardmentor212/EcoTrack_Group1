const fs = require("fs");
const Report = require("../models/Report");
const User = require("../models/User");
const {
  createReportFile,
  resolveReportPath,
  INCLUDE_KEYS,
} = require("../services/reportService");

const fail = (res, code, message) =>
  res.status(code).json({ success: false, message });

function parseDate(value, endOfDay) {
  if (!value) return null;
  const d = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`)
    : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

const exportReport = async (req, res) => {
  let created = null;
  try {
    const { format, includes } = req.body;
    const from = parseDate(req.body.from, false);
    const to = parseDate(req.body.to, true);

    if (!from || !to)
      return fail(res, 400, "Valid From and To dates are required.");
    if (from > to) return fail(res, 400, "From date must be before To date.");
    if (!["pdf", "excel"].includes(format))
      return fail(res, 400, "format must be 'pdf' or 'excel'.");
    if (!Array.isArray(includes) || includes.length === 0) {
      return fail(res, 400, "Select at least one item to include.");
    }
    const clean = [...new Set(includes)];
    if (clean.some((i) => !INCLUDE_KEYS.includes(i))) {
      return fail(
        res,
        400,
        `includes may only contain: ${INCLUDE_KEYS.join(", ")}.`,
      );
    }

    const me = await User.findById(req.user.userId).select("name");
    created = await createReportFile({
      from,
      to,
      format,
      includes: clean,
      generatedBy: me ? me.name : "",
    });

    const report = await Report.create({
      scope: "admin",
      periodFrom: from,
      periodTo: to,
      format,
      includes: clean,
      fileName: created.fileName,
      filePath: created.filePath,
      createdBy: req.user.userId,
    });

    res
      .status(201)
      .json({ success: true, message: "Report exported.", data: report });
  } catch (err) {
    console.error("Export failed:", err);
    if (created) fs.unlink(created.absPath, () => {});
    fail(res, 500, "Could not generate the report.");
  }
};

const getHistory = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      100,
    );
    const reports = await Report.find({ scope: "admin" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("periodFrom periodTo format includes fileName createdAt")
      .lean();
    res.json({ success: true, data: reports });
  } catch (err) {
    console.error(err);
    fail(res, 500, "Could not load past exports.");
  }
};

const downloadReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, scope: "admin" });
    if (!report || !report.fileName) return fail(res, 404, "Report not found.");

    const abs = resolveReportPath(report.fileName);
    if (!fs.existsSync(abs))
      return fail(res, 404, "The report file is no longer available.");

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
    fs.createReadStream(abs).pipe(res);
  } catch (err) {
    console.error(err);
    fail(res, 500, "Could not download the report.");
  }
};

module.exports = { exportReport, getHistory, downloadReport };
