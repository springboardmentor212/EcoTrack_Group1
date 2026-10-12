const fs = require("fs");
const path = require("path");
const agg = require("../utils/reportAggregations");
const { generatePdf } = require("./pdfGenerator");
const { generateExcel } = require("./excelGenerator");

const REPORTS_DIR = path.join(__dirname, "..", "uploads", "reports");
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const statusLabel = (s) => (s === "completed" ? "Ended" : cap(s));

const SECTION_DEFS = {
  emissions: {
    title: "Emissions by category",
    columns: [
      { header: "Category", key: "category" },
      { header: "Entries", key: "entries" },
      { header: "Total (kg CO2e)", key: "totalKg" },
      { header: "Share (%)", key: "share" },
    ],
    load: async (from, to) =>
      (await agg.emissionsByCategory(from, to)).map((r) => ({
        ...r,
        category: cap(r.category),
      })),
  },
  goals: {
    title: "Goal results",
    columns: [
      { header: "Category", key: "category" },
      { header: "Goals", key: "goals" },
      { header: "Completed", key: "completed" },
      { header: "Within cap", key: "withinCap" },
      { header: "Exceeded", key: "exceeded" },
      { header: "Success rate (%)", key: "successRate" },
    ],
    load: async (from, to) =>
      (await agg.goalResults(from, to)).map((r) => ({
        ...r,
        category: cap(r.category),
      })),
  },
  challenges: {
    title: "Challenge participation",
    columns: [
      { header: "Challenge", key: "title" },
      { header: "Category", key: "category" },
      { header: "Status", key: "status" },
      { header: "Members", key: "members" },
      { header: "Avg progress (%)", key: "avgProgress" },
      { header: "Points", key: "points" },
    ],
    load: async (from, to) =>
      (await agg.challengeParticipation(from, to)).map((r) => ({
        ...r,
        category: cap(r.category),
        status: statusLabel(r.status),
      })),
  },
  users: {
    title: "Per user breakdown",
    columns: [
      { header: "Name", key: "name" },
      { header: "Email", key: "email" },
      { header: "Entries", key: "entries" },
      { header: "Total (kg)", key: "totalKg" },
      ...agg.CATEGORIES.map((c) => ({ header: `${cap(c)} (kg)`, key: c })),
    ],
    load: (from, to) => agg.perUserBreakdown(from, to),
  },
};
const INCLUDE_KEYS = Object.keys(SECTION_DEFS);

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

async function createReportFile({ from, to, format, includes, generatedBy }) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const sections = [];
  for (const key of includes) {
    const def = SECTION_DEFS[key];
    sections.push({
      key,
      title: def.title,
      columns: def.columns,
      rows: await def.load(from, to),
    });
  }

  const ext = format === "pdf" ? "pdf" : "xlsx";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `ecotrack-report-${stamp}.${ext}`;
  const absPath = path.join(REPORTS_DIR, fileName);

  const meta = {
    fromLabel: fmt(from),
    toLabel: fmt(to),
    generatedLabel: fmt(new Date()),
    generatedBy,
  };
  if (format === "pdf") await generatePdf(sections, meta, absPath);
  else await generateExcel(sections, meta, absPath);

  return {
    fileName,
    filePath: path.posix.join("uploads", "reports", fileName),
    absPath,
  };
}

const resolveReportPath = (fileName) =>
  path.join(REPORTS_DIR, path.basename(fileName));

module.exports = {
  createReportFile,
  resolveReportPath,
  INCLUDE_KEYS,
  REPORTS_DIR,
};
