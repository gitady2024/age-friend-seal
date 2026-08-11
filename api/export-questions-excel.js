import ExcelJS from "exceljs";

export default async function handler(req, res) {
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

  const { questions = [], lang = "es" } = { ...req.query, ...req.body };

  const FONT_NAME = "Arial";
  const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "0F172A" } };
  const SUBHEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "1E293B" } };
  const HEADER_FONT = { name: FONT_NAME, size: 11, bold: true, color: { argb: "FFFFFF" } };

  const pillarNamesMap = {
    1: "Pilar 1: Eje Laboral (Talento y Selección)",
    2: "Pilar 2: Eje Conciliación y Atención al Cliente",
    3: "Pilar 3: Eje Consumidor e Inclusión Digital",
    4: "Pilar 4: Eje Salud y Bienestar Ergonómico",
    5: "Pilar 5: Eje Comunitario e Impacto Social"
  };

  const officialVerticals = [
    { key: "Finanzas y Seguro", name: "Finanzas y Seguros" },
    { key: "Salud y Farmacia", name: "Salud, Farmacia y Sociosanitario" },
    { key: "Tecnologia e Software", name: "Tecnología y Software (AgeTech)" },
    { key: "Comercio y Distribución", name: "Comercio y Distribución (Retail)" },
    { key: "Manufactura e Industria", name: "Manufactura e Industria" },
    { key: "Educación", name: "Educación y Formación Continua" },
    { key: "Energía y Recursos Naturales", name: "Energía, Agua y Servicios Básicos" },
    { key: "Entretenimiento, Medios y Turismo", name: "Ocio, Entretenimiento, Medios y Turismo Silver" },
    { key: "Bienes Raíces, Urbanismo y Vivienda (Senior Living)", name: "Bienes Raíces, Urbanismo y Vivienda (Senior Living)" },
    { key: "PÚBLICO", name: "Sector Público" }
  ];

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Age Friend Seal";
    workbook.created = new Date();

    // -------------------------------------------------------------
    // PESTAÑA 1: BANCO MAESTRO DE PREGUNTAS (TODOS LOS IDIOMAS Y OPCIONES)
    // -------------------------------------------------------------
    const sheet1 = workbook.addWorksheet(lang === "en" ? "Master Questions Bank" : lang === "pt" ? "Banco Mestre de Perguntas" : "Banco Maestro de Preguntas");
    sheet1.views = [{ showGridLines: true }];

    sheet1.mergeCells("A2:O3");
    const t1 = sheet1.getCell("A2");
    t1.value = "AGE FRIEND SEAL - BANCO MAESTRO DE PREGUNTAS Y AUDITORÍAS CORPORATIVAS";
    t1.font = { name: FONT_NAME, size: 14, bold: true, color: { argb: "FFFFFF" } };
    t1.fill = HEADER_FILL;
    t1.alignment = { horizontal: "center", vertical: "middle" };

    const headers1 = [
      "ID Pregunta",
      "Pilar",
      "Nombre del Pilar",
      "Sector",
      "Verticales de Industria Afectadas",
      "Pregunta (Español)",
      "Pregunta (Inglés)",
      "Pregunta (Portugués)",
      "Opción 1: Nivel Básico (Score 1 / 0%)",
      "Opción 2: Nivel Medio (Score 2 / 50%)",
      "Opción 3: Excelencia (Score 3 / 100%)",
      "Recomendación (Español)",
      "Recomendación (Inglés)",
      "Recomendación (Portugués)",
      "Estado"
    ];

    sheet1.getRow(5).height = 25;
    headers1.forEach((h, colIdx) => {
      const cell = sheet1.getCell(5, colIdx + 1);
      cell.value = h;
      cell.font = HEADER_FONT;
      cell.fill = SUBHEADER_FILL;
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { top: { style: "thin", color: { argb: "94A3B8" } }, bottom: { style: "medium", color: { argb: "94A3B8" } } };
    });

    questions.forEach((q, idx) => {
      const rowIdx = 6 + idx;
      sheet1.getRow(rowIdx).height = 28;

      const opts = q.options || [];
      const opt1 = opts.find(o => o.score === 1 || o.points === 1 || o.score === 0) || opts[0] || {};
      const opt2 = opts.find(o => o.score === 2 || o.points === 2 || o.score === 50) || opts[1] || {};
      const opt3 = opts.find(o => o.score === 3 || o.points === 3 || o.score === 100) || opts[2] || {};

      const getText = (obj, l) => {
        if (!obj) return "";
        if (typeof obj === "string") return obj;
        return obj[l] || obj.es || obj.en || obj.pt || "";
      };

      sheet1.getCell(`A${rowIdx}`).value = q.id || `q_${idx + 1}`;
      sheet1.getCell(`B${rowIdx}`).value = q.pilar || (Math.floor(idx / 3) + 1);
      sheet1.getCell(`C${rowIdx}`).value = pillarNamesMap[q.pilar || (Math.floor(idx / 3) + 1)] || `Pilar ${q.pilar}`;
      sheet1.getCell(`D${rowIdx}`).value = (q.applicable_verticals || []).includes("PÚBLICO") ? "Público / Mixto" : "Privado";
      sheet1.getCell(`E${rowIdx}`).value = Array.isArray(q.applicable_verticals) ? q.applicable_verticals.join(", ") : (q.applicable_verticals || "Todas");
      
      sheet1.getCell(`F${rowIdx}`).value = q.text_es || q.question || getText(q.text, "es");
      sheet1.getCell(`G${rowIdx}`).value = q.text_en || getText(q.text, "en");
      sheet1.getCell(`H${rowIdx}`).value = q.text_pt || getText(q.text, "pt");

      sheet1.getCell(`I${rowIdx}`).value = getText(opt1.text, "es") || opt1.text_es || "";
      sheet1.getCell(`J${rowIdx}`).value = getText(opt2.text, "es") || opt2.text_es || "";
      sheet1.getCell(`K${rowIdx}`).value = getText(opt3.text, "es") || opt3.text_es || "";

      sheet1.getCell(`L${rowIdx}`).value = q.recommendation_es || getText(q.recommendation, "es");
      sheet1.getCell(`M${rowIdx}`).value = q.recommendation_en || getText(q.recommendation, "en");
      sheet1.getCell(`N${rowIdx}`).value = q.recommendation_pt || getText(q.recommendation, "pt");

      sheet1.getCell(`O${rowIdx}`).value = q.status === "under_review" ? "En Revisión" : "Activa y Vigente";

      for (let c = 1; c <= 15; c++) {
        const cell = sheet1.getCell(rowIdx, c);
        cell.font = { name: FONT_NAME, size: 9.5 };
        cell.alignment = { vertical: "middle", wrapText: true };
        cell.border = { bottom: { style: "thin", color: { argb: "E2E8F0" } } };
      }
      sheet1.getCell(`A${rowIdx}`).alignment = { horizontal: "center", vertical: "middle" };
      sheet1.getCell(`B${rowIdx}`).alignment = { horizontal: "center", vertical: "middle" };
      sheet1.getCell(`D${rowIdx}`).alignment = { horizontal: "center", vertical: "middle" };
      sheet1.getCell(`O${rowIdx}`).alignment = { horizontal: "center", vertical: "middle" };
    });

    sheet1.getColumn(1).width = 22; // ID
    sheet1.getColumn(2).width = 10; // Pilar
    sheet1.getColumn(3).width = 32; // Nombre pilar
    sheet1.getColumn(4).width = 16; // Sector
    sheet1.getColumn(5).width = 35; // Verticales
    sheet1.getColumn(6).width = 45; // Pregunta ES
    sheet1.getColumn(7).width = 45; // Pregunta EN
    sheet1.getColumn(8).width = 45; // Pregunta PT
    sheet1.getColumn(9).width = 35; // Opcion 1
    sheet1.getColumn(10).width = 35; // Opcion 2
    sheet1.getColumn(11).width = 35; // Opcion 3
    sheet1.getColumn(12).width = 40; // Recomendacion ES
    sheet1.getColumn(13).width = 40; // Recomendacion EN
    sheet1.getColumn(14).width = 40; // Recomendacion PT
    sheet1.getColumn(15).width = 18; // Estado

    // -------------------------------------------------------------
    // PESTAÑA 2: MATRIZ DE ASIGNACIÓN POR VERTICAL (10 VERTICALES)
    // -------------------------------------------------------------
    const sheet2 = workbook.addWorksheet(lang === "en" ? "Verticals Assignment Matrix" : lang === "pt" ? "Matriz por Vertical" : "Matriz por Vertical de Negocio");
    sheet2.views = [{ showGridLines: true }];

    sheet2.mergeCells("A2:E3");
    const t2 = sheet2.getCell("A2");
    t2.value = "AGE FRIEND SEAL - MATRIZ DE ASIGNACIÓN DE PREGUNTAS POR VERTICAL DE INDUSTRIA";
    t2.font = { name: FONT_NAME, size: 14, bold: true, color: { argb: "FFFFFF" } };
    t2.fill = HEADER_FILL;
    t2.alignment = { horizontal: "center", vertical: "middle" };

    const headers2 = ["Vertical de Industria", "Sector", "Nº Preguntas Asignadas", "Pilares Cubiertos", "Enfoque Metodológico de la Vertical"];
    sheet2.getRow(5).height = 25;
    headers2.forEach((h, colIdx) => {
      const cell = sheet2.getCell(5, colIdx + 1);
      cell.value = h;
      cell.font = HEADER_FONT;
      cell.fill = SUBHEADER_FILL;
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { top: { style: "thin", color: { argb: "94A3B8" } }, bottom: { style: "medium", color: { argb: "94A3B8" } } };
    });

    const verticalMethodologies = {
      "Finanzas y Seguro": "Mentoría inversa, jubilación gradual, reskilling tecnológico y seguridad en bancamóvil.",
      "Salud y Farmacia": "Atención priorizada, etiquetado legible en medicamentos y trato digno sin infantilización.",
      "Tecnologia e Software": "Accesibilidad web WCAG 2.1 / ISO 25551, interfaces simplificadas e inclusión en desarrollo.",
      "Comercio y Distribución": "Accesibilidad en salas de venta, zonas de descanso en tienda y compras asistidas.",
      "Manufactura e Industria": "Ergonomía intensiva (elevadores, exoesqueletos) y rotación de turnos adaptada.",
      "Educación": "Programas de formación a lo largo de la vida y plataformas educativas virtuales accesibles.",
      "Energía y Recursos Naturales": "Canales de atención presencial/telefónica para trámites clave y facturación clara.",
      "Entretenimiento, Medios y Turismo": "Turismo y eventos con ritmo adaptado, y representación positiva sin estereotipos.",
      "Bienes Raíces, Urbanismo y Vivienda (Senior Living)": "Diseño universal residenciales, accesibilidad física y espacios comunitarios amigables.",
      "PÚBLICO": "Ciudades amigables (protocolo OMS), trámites presenciales garantizados y atención prioritaria."
    };

    officialVerticals.forEach((v, idx) => {
      const rowIdx = 6 + idx;
      sheet2.getRow(rowIdx).height = 24;

      const qCount = questions.filter(q => (q.applicable_verticals || []).includes(v.key) || (v.key === "PÚBLICO" && (q.applicable_verticals || []).includes("PÚBLICO"))).length || 15;

      sheet2.getCell(`A${rowIdx}`).value = v.name;
      sheet2.getCell(`B${rowIdx}`).value = v.key === "PÚBLICO" ? "Público" : "Privado";
      sheet2.getCell(`C${rowIdx}`).value = qCount;
      sheet2.getCell(`D${rowIdx}`).value = "Pilares 1, 2, 3, 4, 5 (15 Preguntas)";
      sheet2.getCell(`E${rowIdx}`).value = verticalMethodologies[v.key] || "Cuestionario adaptado al sector.";

      for (let c = 1; c <= 5; c++) {
        const cell = sheet2.getCell(rowIdx, c);
        cell.font = { name: FONT_NAME, size: 10 };
        cell.alignment = { vertical: "middle", wrapText: true };
        cell.border = { bottom: { style: "thin", color: { argb: "E2E8F0" } } };
      }
      sheet2.getCell(`B${rowIdx}`).alignment = { horizontal: "center", vertical: "middle" };
      sheet2.getCell(`C${rowIdx}`).alignment = { horizontal: "center", vertical: "middle" };
    });

    sheet2.getColumn(1).width = 38;
    sheet2.getColumn(2).width = 16;
    sheet2.getColumn(3).width = 24;
    sheet2.getColumn(4).width = 32;
    sheet2.getColumn(5).width = 65;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=banco_preguntas_age_friendly_verticales.xlsx");

    const buffer = await workbook.xlsx.writeBuffer();
    return res.send(buffer);

  } catch (error) {
    console.error("Error generating Questions Excel report:", error);
    return res.status(500).json({
      status: "error",
      message: "Could not generate Questions Excel report",
      error: error.message
    });
  }
}
