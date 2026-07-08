import ExcelJS from "exceljs";

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Esperar listado de alertas en req.body (POST) o generar vacías si no hay datos
  const { alerts = [] } = req.body || {};

  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Historial Normativo");
    sheet.views = [{ showGridLines: true }];

    const FONT_NAME = "Arial";

    // Bloque del Título Principal
    sheet.mergeCells("A2:G3");
    const titleCell = sheet.getCell("A2");
    titleCell.value = "AGE FRIEND SEAL - HISTORIAL DE ALERTAS NORMATIVAS";
    titleCell.font = { name: FONT_NAME, size: 16, bold: true, color: { argb: "FFFFFF" } };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0F172A" } // Dark Slate
    };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Fila de Encabezados (Fila 5)
    sheet.getRow(5).height = 25;
    const colHeaders = [
      "ID Alerta",
      "Jurisdicción",
      "Título de la Normativa",
      "Resumen Legal (LLM)",
      "Pilar Impactado",
      "Relevancia (Score)",
      "Recomendación de Ajuste"
    ];

    colHeaders.forEach((h, colIdx) => {
      const cell = sheet.getCell(5, colIdx + 1);
      cell.value = h;
      cell.font = { name: FONT_NAME, size: 11, bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E293B" } // Medium Slate
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "94A3B8" } },
        bottom: { style: "medium", color: { argb: "94A3B8" } }
      };
    });

    // Cargar datos de alertas
    let currentRow = 6;
    alerts.forEach((alert) => {
      sheet.getRow(currentRow).height = 22;
      
      const pilarMap = {
        1: "Pilar 1: Eje Laboral / Contratación",
        2: "Pilar 4: Eje Salud / Ergonomía",
        3: "Pilar 2: Eje Conciliación / Transición retiro",
        4: "Pilar 3: Eje Consumidor / Silver Economy"
      };

      sheet.getCell(`A${currentRow}`).value = alert.id || "";
      sheet.getCell(`B${currentRow}`).value = alert.source || "";
      sheet.getCell(`C${currentRow}`).value = alert.title || "";
      sheet.getCell(`D${currentRow}`).value = alert.summary || alert.description || "";
      sheet.getCell(`E${currentRow}`).value = pilarMap[alert.pilarImpacted] || `Pilar ${alert.pilarImpacted}`;
      
      const scoreCell = sheet.getCell(`F${currentRow}`);
      scoreCell.value = alert.relevanceScore !== undefined ? parseFloat(alert.relevanceScore.toFixed(2)) : 0.0;
      scoreCell.numFmt = "0.00";

      sheet.getCell(`G${currentRow}`).value = alert.recommendedChange || "";

      // Alineaciones y formato de celdas
      sheet.getCell(`A${currentRow}`).alignment = { horizontal: "center", vertical: "middle" };
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: "center", vertical: "middle" };
      sheet.getCell(`C${currentRow}`).alignment = { wrapText: true, vertical: "middle" };
      sheet.getCell(`D${currentRow}`).alignment = { wrapText: true, vertical: "middle" };
      sheet.getCell(`E${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
      sheet.getCell(`F${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
      sheet.getCell(`G${currentRow}`).alignment = { wrapText: true, vertical: "middle" };
      
      for (let col = 1; col <= 7; col++) {
        const cell = sheet.getCell(currentRow, col);
        cell.font = { name: FONT_NAME, size: 10 };
        cell.border = {
          bottom: { style: "thin", color: { argb: "E2E8F0" } }
        };
      }
      currentRow++;
    });

    // Ajustar anchos de columnas
    sheet.getColumn(1).width = 15; // ID
    sheet.getColumn(2).width = 15; // Jurisdiccion
    sheet.getColumn(3).width = 30; // Title
    sheet.getColumn(4).width = 45; // Summary
    sheet.getColumn(5).width = 25; // Pilar
    sheet.getColumn(6).width = 18; // Score
    sheet.getColumn(7).width = 45; // Recommendation

    // Configurar respuesta HTTP para forzar descarga directa de archivo Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=historial_normativo.xlsx");

    const buffer = await workbook.xlsx.writeBuffer();
    return res.send(buffer);

  } catch (error) {
    console.error("Error generating Excel report:", error);
    return res.status(500).json({
      status: "error",
      message: "Could not generate Excel report",
      error: error.message
    });
  }
}
