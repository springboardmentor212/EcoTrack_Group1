const fs = require("fs");
const PDFDocument = require("pdfkit");

const MAX_ROWS = 50;

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
