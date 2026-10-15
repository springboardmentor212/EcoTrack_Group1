const fs = require("fs");
const PDFDocument = require("pdfkit");

const MAX_ROWS = 50;

const CATEGORY_COLORS = {
  energy: "#F59E0B",
  transportation: "#0EA5E9",
  waste: "#94A3B8",
  food: "#10B981",
  water: "#6366F1",
};
const colorFor = (key) => CATEGORY_COLORS[key] || "#94A3B8";

function ensureSpace(doc, height) {
  if (doc.y + height > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
}

/* ---------- Pie chart: emissions by category ---------- */
function drawEmissionPie(doc, rows) {
  const data = rows
    .map((r) => ({
      label: String(r.category),
      key: String(r.category).toLowerCase(),
      value: Number(r.totalKg) || 0,
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (!total) return;

  const radius = 60;
  ensureSpace(doc, radius * 2 + 20);

  const left = doc.page.margins.left;
  const top = doc.y + 4;
  const cx = left + radius + 10;
  const cy = top + radius;

  let angle = -Math.PI / 2; // start at 12 o'clock, go clockwise
  data.forEach((d) => {
    const fraction = d.value / total;
    const color = colorFor(d.key);

    if (fraction >= 0.9999) {
      doc.circle(cx, cy, radius).fill(color);
      return;
    }

    const end = angle + fraction * 2 * Math.PI;
    const x1 = cx + radius * Math.cos(angle);
    const y1 = cy + radius * Math.sin(angle);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy + radius * Math.sin(end);
    const largeArc = fraction > 0.5 ? 1 : 0;

    doc
      .lineWidth(1)
      .path(
        `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      )
      .fillAndStroke(color, "#FFFFFF");

    angle = end;
  });

  // Legend
  const lx = cx + radius + 30;
  let ly = top + 6;

  doc
    .fillColor("#0F172A")
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(
      `Total: ${Math.round(total).toLocaleString("en-US")} kg CO2e`,
      lx,
      ly,
      {
        lineBreak: false,
      },
    );
  ly += 20;

  data.forEach((d) => {
    doc.rect(lx, ly + 1, 8, 8).fill(colorFor(d.key));
    doc
      .fillColor("#334155")
      .font("Helvetica")
      .fontSize(9)
      .text(
        `${d.label}  ${Math.round((d.value / total) * 100)}%  (${d.value.toFixed(1)} kg)`,
        lx + 14,
        ly,
        { lineBreak: false },
      );
    ly += 16;
  });

  doc.x = left;
  doc.y = top + radius * 2 + 16;
}

/* ---------- Bar chart: goal results by category ---------- */
function drawGoalBars(doc, rows) {
  const data = rows.map((r) => ({
    label: String(r.category),
    within: Number(r.withinCap) || 0,
    exceeded: Number(r.exceeded) || 0,
  }));

  const max = Math.max(...data.flatMap((d) => [d.within, d.exceeded]), 0);
  if (!max) return;

  const chartH = 100;
  ensureSpace(doc, chartH + 70);

  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const top = doc.y + 14; // room for the value labels
  const base = top + chartH;
  const groupW = width / data.length;
  const barW = 18;
  const gap = 4;

  doc
    .lineWidth(0.5)
    .moveTo(left, base)
    .lineTo(left + width, base)
    .strokeColor("#CBD5E1")
    .stroke();

  data.forEach((d, i) => {
    const groupX = left + i * groupW + (groupW - (barW * 2 + gap)) / 2;

    [
      { value: d.within, color: "#10B981", slot: 0 },
      { value: d.exceeded, color: "#EF4444", slot: 1 },
    ].forEach(({ value, color, slot }) => {
      const h = (value / max) * chartH;
      const x = groupX + slot * (barW + gap);

      if (h > 0) doc.rect(x, base - h, barW, h).fill(color);

      doc
        .fillColor("#334155")
        .font("Helvetica")
        .fontSize(8)
        .text(String(value), x - 6, base - h - 11, {
          width: barW + 12,
          align: "center",
          lineBreak: false,
        });
    });

    doc
      .fillColor("#64748B")
      .font("Helvetica")
      .fontSize(8)
      .text(d.label, left + i * groupW, base + 5, {
        width: groupW,
        align: "center",
        lineBreak: false,
      });
  });

  // Legend
  const ly = base + 24;
  doc.rect(left, ly + 1, 8, 8).fill("#10B981");
  doc
    .fillColor("#334155")
    .fontSize(9)
    .text("Within cap", left + 14, ly, { lineBreak: false });
  doc.rect(left + 90, ly + 1, 8, 8).fill("#EF4444");
  doc
    .fillColor("#334155")
    .text("Exceeded", left + 104, ly, { lineBreak: false });
  doc
    .fillColor("#94A3B8")
    .fontSize(8)
    .text("(number of goals)", left + 170, ly + 1, { lineBreak: false });

  doc.x = left;
  doc.y = ly + 22;
}

function drawSectionChart(doc, section) {
  if (section.key === "emissions") drawEmissionPie(doc, section.rows);
  else if (section.key === "goals") drawGoalBars(doc, section.rows);
}

/* ---------- Table ---------- */
function drawTable(doc, columns, rows) {
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const colW = width / columns.length;
  const rowH = 20;

  const drawRow = (cells, header) => {
    if (doc.y + rowH > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      if (!header)
        drawRow(
          columns.map((c) => c.header),
          true,
        );
    }
    const y = doc.y;
    if (header) doc.rect(left, y, width, rowH).fill("#F1F5F9");
    doc
      .fillColor("#0F172A")
      .font(header ? "Helvetica-Bold" : "Helvetica")
      .fontSize(9);
    cells.forEach((cell, i) => {
      doc.text(String(cell ?? ""), left + i * colW + 4, y + 6, {
        width: colW - 8,
        height: rowH - 6,
        ellipsis: true,
      });
    });
    doc
      .moveTo(left, y + rowH)
      .lineTo(left + width, y + rowH)
      .strokeColor("#E2E8F0")
      .stroke();
    doc.x = left;
    doc.y = y + rowH;
  };

  drawRow(
    columns.map((c) => c.header),
    true,
  );
  rows.forEach((r) =>
    drawRow(
      columns.map((c) => r[c.key]),
      false,
    ),
  );
}

function generatePdf(sections, meta, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc
      .fillColor("#0F172A")
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("EcoTrack Platform Report");
    doc
      .moveDown(0.3)
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#64748B")
      .text(`Period: ${meta.fromLabel} to ${meta.toLabel}`)
      .text(
        `Generated: ${meta.generatedLabel}${meta.generatedBy ? ` by ${meta.generatedBy}` : ""}`,
      );
    doc.moveDown();

    sections.forEach((s) => {
      if (doc.y > doc.page.height - 120) doc.addPage();
      doc
        .fillColor("#0284C7")
        .font("Helvetica-Bold")
        .fontSize(13)
        .text(s.title);
      doc.moveDown(0.4);
      if (!s.rows.length) {
        doc
          .fillColor("#64748B")
          .font("Helvetica")
          .fontSize(10)
          .text("No data for this period.");
      } else {
        drawSectionChart(doc, s); // chart first, then the table
        drawTable(doc, s.columns, s.rows.slice(0, MAX_ROWS));
        if (s.rows.length > MAX_ROWS) {
          doc
            .moveDown(0.3)
            .fillColor("#64748B")
            .font("Helvetica-Oblique")
            .fontSize(8)
            .text(
              `Showing ${MAX_ROWS} of ${s.rows.length} rows. Export as Excel for the full data.`,
            );
        }
      }
      doc.moveDown(1.2);
    });

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

module.exports = { generatePdf };
