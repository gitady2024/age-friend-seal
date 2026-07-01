import ExcelJS from "exceljs";

export default async function handler(req, res) {
  // Configurar cabeceras CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, enterpriseName, score, respuestas } = req.body;

  try {
    console.log(`Generando descarga directa de Excel para: ${enterpriseName || "Empresa"} (${email})`);

    // 1. Crear el libro de trabajo de Excel usando exceljs
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Resultados Autodiagnóstico");

    // Definir las columnas de la tabla
    worksheet.columns = [
      { header: "N°", key: "num", width: 5 },
      { header: "Pilar", key: "pilar", width: 25 },
      { header: "Pregunta", key: "pregunta", width: 50 },
      { header: "Opción Seleccionada", key: "respuesta", width: 40 },
      { header: "Puntaje", key: "score", width: 10 },
      { header: "Mejora Recomendada", key: "recomendacion", width: 50 }
    ];

    // Añadir cabecera del reporte
    worksheet.insertRow(1, []);
    worksheet.insertRow(2, ["REPORTE OFICIAL DE AUTODIAGNÓSTICO - AGE FRIEND SEAL"]);
    worksheet.mergeCells("A2:F2");
    
    const titleCell = worksheet.getCell("A2");
    titleCell.font = { name: "Outfit", size: 16, bold: true, color: { argb: "FFFFFF" } };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1E293B" } // Gris oscuro de fondo
    };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(2).height = 40;

    // Metadatos
    worksheet.addRow([]);
    worksheet.addRow(["Empresa:", enterpriseName || "Empresa Evaluada"]);
    worksheet.addRow(["Email Corporativo:", email || "-"]);
    worksheet.addRow(["Fecha de Emisión:", new Date().toLocaleDateString("es-ES")]);
    worksheet.addRow(["Puntaje Global de Amigabilidad:", `${score || 0}%`]);
    worksheet.addRow([]);

    // Estilizar metadatos
    const metaStart = 4;
    for (let i = 0; i < 4; i++) {
      const rowNum = metaStart + i;
      worksheet.getCell(`A${rowNum}`).font = { name: "Inter", bold: true, color: { argb: "475569" } };
      worksheet.getCell(`B${rowNum}`).font = { name: "Inter" };
    }
    // Color condicional del porcentaje global
    const scoreCell = worksheet.getCell("B7");
    scoreCell.font = {
      name: "Outfit",
      bold: true,
      color: { argb: (score || 0) >= 90 ? "15803D" : ((score || 0) >= 65 ? "CA8A04" : "B91C1C") }
    };

    // Encabezados de la tabla (Fila 9)
    const tableHeaderRow = worksheet.getRow(9);
    tableHeaderRow.values = ["N°", "Pilar", "Pregunta", "Opción Seleccionada", "Puntaje", "Mejora Recomendada"];
    tableHeaderRow.height = 25;
    tableHeaderRow.eachCell((cell) => {
      cell.font = { name: "Outfit", bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3B82F6" } // Azul de acento
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "94A3B8" } },
        left: { style: "thin", color: { argb: "94A3B8" } },
        bottom: { style: "medium", color: { argb: "1E293B" } },
        right: { style: "thin", color: { argb: "94A3B8" } }
      };
    });

    // Agregar filas de respuestas
    (respuestas || []).forEach((ans, idx) => {
      const rowNum = 10 + idx;
      
      // Map pilar number to Axis Name
      let pilarName = ans.pilar;
      if (typeof pilarName === 'number') {
        const pillarNamesList = [
          "Eje Laboral", 
          "Eje Conciliación", 
          "Eje Consumidor", 
          "Eje Salud", 
          "Eje Comunitario"
        ];
        pilarName = pillarNamesList[pilarName - 1] || `Pilar ${pilarName}`;
      }

      worksheet.addRow([
        idx + 1,
        pilarName || "N/A",
        ans.pregunta || "N/A",
        ans.opcion_seleccionada || "N/A",
        ans.puntuacion !== undefined ? ans.puntuacion : 0,
        ans.recomendacion || "N/A"
      ]);

      const currentRow = worksheet.getRow(rowNum);
      currentRow.eachCell((cell, colIdx) => {
        cell.font = { name: "Inter", size: 10 };
        cell.border = {
          top: { style: "thin", color: { argb: "E2E8F0" } },
          left: { style: "thin", color: { argb: "E2E8F0" } },
          bottom: { style: "thin", color: { argb: "E2E8F0" } },
          right: { style: "thin", color: { argb: "E2E8F0" } }
        };
        if (colIdx === 1 || colIdx === 5) {
          cell.alignment = { horizontal: "center" };
        }
      });
    });

    // Escribir el libro a un buffer en memoria
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=Reporte_Age_Friend_Seal_${(enterpriseName || "Empresa").replace(/\s+/g, "_")}.xlsx`);
    res.setHeader("Content-Length", buffer.length);

    return res.status(200).send(buffer);
  } catch (error) {
    console.error("Error generating Excel binary report:", error);
    return res.status(500).json({ error: "Failed to generate Excel report", details: error.message });
  }
}
