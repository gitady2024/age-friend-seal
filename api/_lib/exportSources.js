import ExcelJS from "exceljs";

export async function handleExportSources(req, res) {
  const { alerts = [], lang = "es" } = { ...req.query, ...req.body };

  const FONT_NAME = "Arial";
  const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "0F172A" } };
  const SUBHEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "1E293B" } };
  const HEADER_FONT = { name: FONT_NAME, size: 11, bold: true, color: { argb: "FFFFFF" } };

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Age Friend Seal";
    workbook.created = new Date();

    // -------------------------------------------------------------
    // PESTAÑA 1: FUENTES NORMATIVAS Y REGULACIONES OFICIALES (4 JURISDICCIONES)
    // -------------------------------------------------------------
    const sheet1 = workbook.addWorksheet(lang === "en" ? "Official Regulatory Sources" : lang === "pt" ? "Fontes Regulatórias Oficiais" : "Fuentes Normativas Oficiales");
    sheet1.views = [{ showGridLines: true }];

    sheet1.mergeCells("A2:G3");
    const t1 = sheet1.getCell("A2");
    t1.value = "AGE FRIEND SEAL - FUENTES NORMATIVAS Y MONITOREO REGULATORIO OFICIAL";
    t1.font = { name: FONT_NAME, size: 14, bold: true, color: { argb: "FFFFFF" } };
    t1.fill = HEADER_FILL;
    t1.alignment = { horizontal: "center", vertical: "middle" };

    const headers1 = ["Jurisdicción", "Entidad / Organismo Oficial", "Dominio Canónico", "Endpoint RSS / REST API", "Pilares Afectados", "Marco Legal / Normas", "Estado"];
    sheet1.getRow(5).height = 25;
    headers1.forEach((h, colIdx) => {
      const cell = sheet1.getCell(5, colIdx + 1);
      cell.value = h;
      cell.font = HEADER_FONT;
      cell.fill = SUBHEADER_FILL;
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { top: { style: "thin", color: { argb: "94A3B8" } }, bottom: { style: "medium", color: { argb: "94A3B8" } } };
    });

    const officialSources = [
      {
        jurisdiction: "Unión Europea (EU)",
        entity: "Parlamento Europeo & EUR-Lex",
        domain: "europarl.europa.eu / eur-lex.europa.eu",
        endpoint: "https://www.europarl.europa.eu/rss/doc/top-stories/es.xml",
        pillars: "Pilar 1, Pilar 3, Pilar 4, Pilar 5",
        framework: "Directiva Europea de Accesibilidad (EAA), ISO 25550, WCAG 2.1",
        status: "Activa y Vigente"
      },
      {
        jurisdiction: "Estados Unidos (USA)",
        entity: "GovInfo & Congressional Bills / LegiScan",
        domain: "govinfo.gov / congress.gov / legiscan.com",
        endpoint: "https://www.govinfo.gov/rss/bills.xml",
        pillars: "Pilar 1, Pilar 5",
        framework: "ADEA (Age Discrimination in Employment Act +40), ADA Title III",
        status: "Activa y Vigente"
      },
      {
        jurisdiction: "Australia",
        entity: "Federal Register of Legislation",
        domain: "legislation.gov.au",
        endpoint: "https://www.legislation.gov.au/rss/inforce",
        pillars: "Pilar 1, Pilar 4, Pilar 5",
        framework: "Age Discrimination Act 2004, Standards for Workplace Inclusion",
        status: "Activa y Vigente"
      },
      {
        jurisdiction: "América Latina (LatAm)",
        entity: "CEPAL (Naciones Unidas) & OIT",
        domain: "repositorio.cepal.org / ilo.org",
        endpoint: "https://repositorio.cepal.org/server/api/discover/search/objects",
        pillars: "Pilar 1, Pilar 2, Pilar 4, Pilar 5",
        framework: "Convención Interamericana sobre los Derechos Humanos de las Personas Mayores (+60)",
        status: "Activa y Vigente"
      }
    ];

    officialSources.forEach((src, idx) => {
      const rowIdx = 6 + idx;
      sheet1.getRow(rowIdx).height = 24;
      sheet1.getCell(`A${rowIdx}`).value = src.jurisdiction;
      sheet1.getCell(`B${rowIdx}`).value = src.entity;
      sheet1.getCell(`C${rowIdx}`).value = src.domain;
      sheet1.getCell(`D${rowIdx}`).value = src.endpoint;
      sheet1.getCell(`E${rowIdx}`).value = src.pillars;
      sheet1.getCell(`F${rowIdx}`).value = src.framework;
      sheet1.getCell(`G${rowIdx}`).value = src.status;

      for (let c = 1; c <= 7; c++) {
        const cell = sheet1.getCell(rowIdx, c);
        cell.font = { name: FONT_NAME, size: 10 };
        cell.alignment = { vertical: "middle", wrapText: true };
        cell.border = { bottom: { style: "thin", color: { argb: "E2E8F0" } } };
      }
      sheet1.getCell(`A${rowIdx}`).alignment = { horizontal: "center", vertical: "middle" };
      sheet1.getCell(`G${rowIdx}`).alignment = { horizontal: "center", vertical: "middle" };
    });

    sheet1.getColumn(1).width = 22;
    sheet1.getColumn(2).width = 30;
    sheet1.getColumn(3).width = 32;
    sheet1.getColumn(4).width = 50;
    sheet1.getColumn(5).width = 25;
    sheet1.getColumn(6).width = 45;
    sheet1.getColumn(7).width = 18;

    // -------------------------------------------------------------
    // PESTAÑA 2: FEEDS DE NOTICIAS Y NOVEDADES POR IDIOMA (8 FUENTES)
    // -------------------------------------------------------------
    const sheet2 = workbook.addWorksheet(lang === "en" ? "Live News Feeds" : lang === "pt" ? "Feeds de Notícias" : "Feeds de Noticias en Vivo");
    sheet2.views = [{ showGridLines: true }];

    sheet2.mergeCells("A2:E3");
    const t2 = sheet2.getCell("A2");
    t2.value = "AGE FRIEND SEAL - RADAR DE NOTICIAS Y FEEDS RSS EN VIVO";
    t2.font = { name: FONT_NAME, size: 14, bold: true, color: { argb: "FFFFFF" } };
    t2.fill = HEADER_FILL;
    t2.alignment = { horizontal: "center", vertical: "middle" };

    const headers2 = ["Idioma", "Medio / Fuente", "Categoría", "URL del Feed RSS / API", "Términos de Búsqueda / Ámbito"];
    sheet2.getRow(5).height = 25;
    headers2.forEach((h, colIdx) => {
      const cell = sheet2.getCell(5, colIdx + 1);
      cell.value = h;
      cell.font = HEADER_FONT;
      cell.fill = SUBHEADER_FILL;
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { top: { style: "thin", color: { argb: "94A3B8" } }, bottom: { style: "medium", color: { argb: "94A3B8" } } };
    });

    const newsFeeds = [
      { lang: "Español (ES)", name: "Google News ES", category: "Mercado", url: "https://news.google.com/rss/search?q=%22economia+plateada%22+OR+edadismo", query: "Economía Plateada, Edadismo, Longevidad" },
      { lang: "Español (ES)", name: "Geriatricarea", category: "Mercado", url: "https://geriatricarea.com/feed/", query: "Sector sociosanitario, longevidad corporativa" },
      { lang: "Español (ES)", name: "Qmayor", category: "Innovación", url: "https://www.qmayor.com/feed/", query: "Cultura, innovación social, Silver Economy" },
      { lang: "Español (ES)", name: "SilverEco ES", category: "Innovación", url: "https://www.silvereco.org/en/feed/", query: "Silver Economy global, productos y servicios" },
      { lang: "Inglés (EN)", name: "Google News EN", category: "Market", url: "https://news.google.com/rss/search?q=%22silver+economy%22+OR+ageism", query: "Silver Economy, Ageism, Senior Workforce" },
      { lang: "Inglés (EN)", name: "Next Avenue", category: "Society", url: "https://www.nextavenue.org/feed/", query: "Aging, work & purpose for 50+" },
      { lang: "Portugués (PT)", name: "Google News PT", category: "Mercado", url: "https://news.google.com/rss/search?q=%22economia+prateada%22+OR+idadismo", query: "Economia Prateada, Idadismo, Envelhecimento" },
      { lang: "Portugués (PT)", name: "Portal do Envelhecimento", category: "Sociedade", url: "https://www.portaldoenvelhecimento.com.br/feed/", query: "Gerontologia, impacto social e diversidade" }
    ];

    newsFeeds.forEach((f, idx) => {
      const rowIdx = 6 + idx;
      sheet2.getRow(rowIdx).height = 22;
      sheet2.getCell(`A${rowIdx}`).value = f.lang;
      sheet2.getCell(`B${rowIdx}`).value = f.name;
      sheet2.getCell(`C${rowIdx}`).value = f.category;
      sheet2.getCell(`D${rowIdx}`).value = f.url;
      sheet2.getCell(`E${rowIdx}`).value = f.query;

      for (let c = 1; c <= 5; c++) {
        const cell = sheet2.getCell(rowIdx, c);
        cell.font = { name: FONT_NAME, size: 10 };
        cell.alignment = { vertical: "middle", wrapText: true };
        cell.border = { bottom: { style: "thin", color: { argb: "E2E8F0" } } };
      }
      sheet2.getCell(`A${rowIdx}`).alignment = { horizontal: "center", vertical: "middle" };
      sheet2.getCell(`C${rowIdx}`).alignment = { horizontal: "center", vertical: "middle" };
    });

    sheet2.getColumn(1).width = 18;
    sheet2.getColumn(2).width = 25;
    sheet2.getColumn(3).width = 18;
    sheet2.getColumn(4).width = 55;
    sheet2.getColumn(5).width = 45;

    // -------------------------------------------------------------
    // PESTAÑA 3: HISTORIAL DE ALERTAS LEGALES EVALUADAS
    // -------------------------------------------------------------
    const sheet3 = workbook.addWorksheet(lang === "en" ? "Evaluated Legal Alerts" : lang === "pt" ? "Alertas Legais Avaliados" : "Alertas Legales Evaluadas");
    sheet3.views = [{ showGridLines: true }];

    sheet3.mergeCells("A2:G3");
    const t3 = sheet3.getCell("A2");
    t3.value = "AGE FRIEND SEAL - ALERTAS LEGALES EVALUADAS POR IA (SHADOW MODE)";
    t3.font = { name: FONT_NAME, size: 14, bold: true, color: { argb: "FFFFFF" } };
    t3.fill = HEADER_FILL;
    t3.alignment = { horizontal: "center", vertical: "middle" };

    const headers3 = ["ID Alerta", "Jurisdicción", "Título de la Norma", "Resumen Legal (LLM)", "Pilar Impactado", "Score Relevancia", "Recomendación de Ajuste"];
    sheet3.getRow(5).height = 25;
    headers3.forEach((h, colIdx) => {
      const cell = sheet3.getCell(5, colIdx + 1);
      cell.value = h;
      cell.font = HEADER_FONT;
      cell.fill = SUBHEADER_FILL;
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { top: { style: "thin", color: { argb: "94A3B8" } }, bottom: { style: "medium", color: { argb: "94A3B8" } } };
    });

    const pillarsMap = {
      1: "Pilar 1: Accesibilidad física",
      2: "Pilar 2: Trato respetuoso / Atención",
      3: "Pilar 3: Inclusión digital / Accesibilidad web",
      4: "Pilar 4: Salud laboral / Prevención desgaste",
      5: "Pilar 5: Empleabilidad / Transición retiro"
    };

    let r3 = 6;
    alerts.forEach((alert) => {
      sheet3.getRow(r3).height = 22;
      sheet3.getCell(`A${r3}`).value = alert.id || "";
      sheet3.getCell(`B${r3}`).value = alert.source || "";
      sheet3.getCell(`C${r3}`).value = alert.title || "";
      sheet3.getCell(`D${r3}`).value = alert.summary || alert.description || "";
      sheet3.getCell(`E${r3}`).value = pillarsMap[alert.pilarImpacted] || `Pilar ${alert.pilarImpacted}`;

      const scoreCell = sheet3.getCell(`F${r3}`);
      scoreCell.value = alert.relevanceScore !== undefined ? parseFloat((alert.relevanceScore * 100).toFixed(1)) : 0;
      scoreCell.numFmt = '0.0"%"';

      sheet3.getCell(`G${r3}`).value = alert.recommendedChange || "";

      for (let c = 1; c <= 7; c++) {
        const cell = sheet3.getCell(r3, c);
        cell.font = { name: FONT_NAME, size: 10 };
        cell.alignment = { vertical: "middle", wrapText: true };
        cell.border = { bottom: { style: "thin", color: { argb: "E2E8F0" } } };
      }
      sheet3.getCell(`A${r3}`).alignment = { horizontal: "center", vertical: "middle" };
      sheet3.getCell(`B${r3}`).alignment = { horizontal: "center", vertical: "middle" };
      sheet3.getCell(`F${r3}`).alignment = { horizontal: "right", vertical: "middle" };
      r3++;
    });

    sheet3.getColumn(1).width = 18;
    sheet3.getColumn(2).width = 16;
    sheet3.getColumn(3).width = 30;
    sheet3.getColumn(4).width = 45;
    sheet3.getColumn(5).width = 28;
    sheet3.getColumn(6).width = 16;
    sheet3.getColumn(7).width = 45;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=fuentes_y_normativas_age_friendly.xlsx");

    const buffer = await workbook.xlsx.writeBuffer();
    return res.send(buffer);

  } catch (error) {
    console.error("Error generating Sources Excel report:", error);
    return res.status(500).json({
      status: "error",
      message: "Could not generate Sources Excel report",
      error: error.message
    });
  }
}
