import ExcelJS from "exceljs";

export async function handleExportReports(req, res) {
  const { alerts = [], lang = "es" } = { ...req.query, ...req.body };

  const textDict = {
    es: {
      sheetName: "Historial Normativo",
      title: "AGE FRIEND SEAL - HISTORIAL DE ALERTAS NORMATIVAS",
      headers: ["ID Alerta", "Jurisdicción", "Título de la Normativa", "Resumen Legal (LLM)", "Pilar Impactado", "Relevancia (Score)", "Recomendación de Ajuste"],
      pillars: {
        1: "Pilar 1: Accesibilidad física",
        2: "Pilar 2: Trato respetuoso / Atención",
        3: "Pilar 3: Inclusión digital / Accesibilidad web",
        4: "Pilar 4: Salud laboral / Prevención desgaste",
        5: "Pilar 5: Empleabilidad / Transición retiro"
      }
    },
    en: {
      sheetName: "Regulatory History",
      title: "AGE FRIEND SEAL - REGULATORY ALERTS HISTORY",
      headers: ["Alert ID", "Jurisdiction", "Regulation Title", "Legal Summary (LLM)", "Pillar Impacted", "Relevance Score", "Adjust Recommendation"],
      pillars: {
        1: "Pillar 1: Physical accessibility",
        2: "Pillar 2: Respectful treatment / Service",
        3: "Pillar 3: Digital inclusion / Web accessibility",
        4: "Pillar 4: Occupational health / Wear prevention",
        5: "Pillar 5: Employability / Retirement transition"
      }
    },
    pt: {
      sheetName: "Histórico Regulatório",
      title: "AGE FRIEND SEAL - HISTÓRICO DE ALERTAS NORMATIVAS",
      headers: ["ID Alerta", "Jurisdição", "Título da Norma", "Resumo Legal (LLM)", "Pilar Impactado", "Relevância (Score)", "Recomendação de Ajuste"],
      pillars: {
        1: "Pilar 1: Acessibilidade física",
        2: "Pilar 2: Trato respeitoso / Atendimento",
        3: "Pilar 3: Inclusão digital / Acessibilidade web",
        4: "Pilar 4: Saúde ocupacional / Prevenção de desgaste",
        5: "Pilar 5: Empregabilidade / Transição aposentadoria"
      }
    }
  };

  const activeDict = textDict[lang] || textDict.es;

  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(activeDict.sheetName);
    sheet.views = [{ showGridLines: true }];

    const FONT_NAME = "Arial";

    sheet.mergeCells("A2:G3");
    const titleCell = sheet.getCell("A2");
    titleCell.value = activeDict.title;
    titleCell.font = { name: FONT_NAME, size: 16, bold: true, color: { argb: "FFFFFF" } };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0F172A" }
    };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    sheet.getRow(5).height = 25;
    const colHeaders = activeDict.headers;

    colHeaders.forEach((h, colIdx) => {
      const cell = sheet.getCell(5, colIdx + 1);
      cell.value = h;
      cell.font = { name: FONT_NAME, size: 11, bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E293B" }
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "94A3B8" } },
        bottom: { style: "medium", color: { argb: "94A3B8" } }
      };
    });

    let currentRow = 6;
    alerts.forEach((alert) => {
      sheet.getRow(currentRow).height = 22;

      sheet.getCell(`A${currentRow}`).value = alert.id || "";
      sheet.getCell(`B${currentRow}`).value = alert.source || "";
      sheet.getCell(`C${currentRow}`).value = alert.title || "";
      sheet.getCell(`D${currentRow}`).value = alert.summary || alert.description || "";
      sheet.getCell(`E${currentRow}`).value = activeDict.pillars[alert.pilarImpacted] || `Pilar ${alert.pilarImpacted}`;
      
      const scoreCell = sheet.getCell(`F${currentRow}`);
      scoreCell.value = alert.relevanceScore !== undefined ? parseFloat(alert.relevanceScore.toFixed(2)) : 0.0;
      scoreCell.numFmt = "0.00";

      sheet.getCell(`G${currentRow}`).value = alert.recommendedChange || "";

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

    sheet.getColumn(1).width = 15;
    sheet.getColumn(2).width = 15;
    sheet.getColumn(3).width = 30;
    sheet.getColumn(4).width = 45;
    sheet.getColumn(5).width = 25;
    sheet.getColumn(6).width = 18;
    sheet.getColumn(7).width = 45;

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
