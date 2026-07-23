import ExcelJS from "exceljs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const legalDictionary = require("./legalDictionary.json");

export async function generateExcelWorkbook({ email, enterpriseName, score, respuestas, country }) {
  const workbook = new ExcelJS.Workbook();
  
  // Normalize country and resolve legal mappings
  const normalizedCountry = country || "España";
  let legalMap = legalDictionary[normalizedCountry];
  if (!legalMap) {
    const keys = Object.keys(legalDictionary);
    const matchedKey = keys.find(k => k.toLowerCase() === normalizedCountry.toLowerCase());
    legalMap = matchedKey ? legalDictionary[matchedKey] : legalDictionary["Otros"];
  }

  // ==========================================
  // SHEET 1: Dashboard Ejecutivo
  // ==========================================
  const wsDash = workbook.addWorksheet("Dashboard Ejecutivo");
  wsDash.views = [{ showGridLines: true }];
  
  const FONT_NAME = "Arial";
  
  // Title block
  wsDash.mergeCells("A2:D3");
  const titleCell = wsDash.getCell("A2");
  titleCell.value = "AGE FRIEND SEAL - DASHBOARD EJECUTIVO";
  titleCell.font = { name: FONT_NAME, size: 16, bold: true, color: { argb: "FFFFFF" } };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "0F172A" } // Dark Slate
  };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  
  // Subtitle
  wsDash.mergeCells("A4:D4");
  const subCell = wsDash.getCell("A4");
  subCell.value = "Reporte Ejecutivo de Autodiagnóstico e Impacto Regulatorio";
  subCell.font = { name: FONT_NAME, size: 10, italic: true, color: { argb: "64748B" } };
  subCell.alignment = { horizontal: "center", vertical: "middle" };

  // Metadata block
  wsDash.getCell("A6").value = "Organización:";
  wsDash.getCell("B6").value = enterpriseName || "Empresa Evaluada";
  wsDash.getCell("A7").value = "Email Corporativo:";
  wsDash.getCell("B7").value = email || "-";
  wsDash.getCell("A8").value = "Fecha de Emisión:";
  wsDash.getCell("B8").value = new Date().toLocaleDateString("es-ES");
  wsDash.getCell("A9").value = "País del Diagnóstico:";
  wsDash.getCell("B9").value = normalizedCountry;
  
  wsDash.getCell("A11").value = "Puntaje Global de Amigabilidad:";
  const globalScoreCell = wsDash.getCell("B11");
  globalScoreCell.value = `${score || 0}%`;
  
  // Style metadata labels
  for (const rowNum of [6, 7, 8, 9, 11]) {
    wsDash.getCell(`A${rowNum}`).font = { name: FONT_NAME, size: 10.5, bold: true, color: { argb: "1E293B" } };
    wsDash.getCell(`B${rowNum}`).font = { name: FONT_NAME, size: 10.5, color: { argb: "334155" } };
  }
  
  // Global score highlighting
  globalScoreCell.font = {
    name: FONT_NAME,
    size: 12,
    bold: true,
    color: { argb: (score || 0) >= 90 ? "15803D" : ((score || 0) >= 65 ? "CA8A04" : "B91C1C") }
  };
  
  // Calculate pillar percents
  const pillarScores = [0, 0, 0, 0, 0];
  const pillarCounts = [0, 0, 0, 0, 0];
  (respuestas || []).forEach((ans) => {
    let pNum = ans.pilar;
    if (typeof pNum === 'string') {
      const match = pNum.match(/\d+/);
      pNum = match ? parseInt(match[0]) : 1;
    }
    const idx = Math.min(4, Math.max(0, pNum - 1));
    pillarScores[idx] += (ans.puntuacion !== undefined ? ans.puntuacion : 0);
    pillarCounts[idx]++;
  });
  
  const pillarPercents = pillarScores.map((sVal, idx) => {
    const count = pillarCounts[idx] || 3;
    const maxScore = count * 3;
    return maxScore > 0 ? Math.round((sVal / maxScore) * 100) : 0;
  });
  
  // Pillar Summary Table headers (Row 13)
  wsDash.getRow(13).height = 25;
  const colHeaders = ["Pilar Evaluado", "Eje Temático", "Cumplimiento (%)", "Estado de Inclusión"];
  colHeaders.forEach((h, colIdx) => {
    const cell = wsDash.getCell(13, colIdx + 1);
    cell.value = h;
    cell.font = { name: FONT_NAME, size: 11, bold: true, color: { argb: "FFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1E3A8A" } // Dark Blue
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });
  
  // Pillar rows
  const pillarNamesList = [
    "Pilar 1", "Pilar 2", "Pilar 3", "Pilar 4", "Pilar 5"
  ];
  const pillarAxesList = [
    "Eje Laboral (Talento Interno)",
    "Eje Conciliación (Soporte al Empleado)",
    "Eje Consumidor (Inclusión Digital y Canales)",
    "Eje Salud y Entorno (Marcos OMS)",
    "Eje Comunitario (Tratados y Alianzas)"
  ];
  
  pillarNamesList.forEach((pName, idx) => {
    const rowNum = 14 + idx;
    const pct = pillarPercents[idx];
    const status = pct >= 90 ? "Sobresaliente (Sello Aprobado)" : (pct >= 65 ? "Medio (Certificación Condicional)" : "Crítico (Acción Requerida)");
    
    wsDash.getRow(rowNum).height = 22;
    wsDash.getCell(`A${rowNum}`).value = pName;
    wsDash.getCell(`B${rowNum}`).value = pillarAxesList[idx];
    wsDash.getCell(`C${rowNum}`).value = `${pct}%`;
    wsDash.getCell(`D${rowNum}`).value = status;
    
    for (let c = 1; c <= 4; c++) {
      const cell = wsDash.getCell(rowNum, c);
      cell.font = { name: FONT_NAME, size: 10 };
      cell.border = {
        top: { style: "thin", color: { argb: "E2E8F0" } },
        bottom: { style: "thin", color: { argb: "E2E8F0" } },
        left: { style: "thin", color: { argb: "E2E8F0" } },
        right: { style: "thin", color: { argb: "E2E8F0" } }
      };
      if (c === 1 || c === 3) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "left", vertical: "middle" };
      }
    }
    
    const pctCell = wsDash.getCell(`C${rowNum}`);
    pctCell.font = {
      name: FONT_NAME,
      size: 10,
      bold: true,
      color: { argb: pct >= 90 ? "15803D" : (pct >= 65 ? "CA8A04" : "B91C1C") }
    };
  });
  
  wsDash.getColumn(1).width = 25;
  wsDash.getColumn(2).width = 45;
  wsDash.getColumn(3).width = 20;
  wsDash.getColumn(4).width = 35;

  // ==========================================
  // SHEET 2: Matriz de Auditoría
  // ==========================================
  const wsAudit = workbook.addWorksheet("Matriz de Auditoría");
  wsAudit.views = [{ state: "frozen", ySplit: 1, showGridLines: true }];
  
  wsAudit.columns = [
    { header: "N°", key: "num", width: 6 },
    { header: "Pilar", key: "pilar", width: 25 },
    { header: "Pregunta", key: "pregunta", width: 45 },
    { header: "Opción Seleccionada", key: "respuesta", width: 45 },
    { header: "Puntaje", key: "score", width: 12 },
    { header: "Mejora Recomendada", key: "recomendacion", width: 45 },
    { header: "Marco Institucional / Legal Sugerido", key: "marcoLegal", width: 45 }
  ];
  
  const headerRow = wsAudit.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.font = { name: FONT_NAME, size: 11, bold: true, color: { argb: "FFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1E3A8A" } // Corporate Blue
    };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: "94A3B8" } },
      left: { style: "thin", color: { argb: "94A3B8" } },
      bottom: { style: "medium", color: { argb: "0F172A" } },
      right: { style: "thin", color: { argb: "94A3B8" } }
    };
  });
  
  (respuestas || []).forEach((ans, idx) => {
    const rowNum = 2 + idx;
    
    let pName = ans.pilar;
    if (typeof pName === 'number') {
      const pillarNamesList = [
        "Eje Laboral", 
        "Eje Conciliación", 
        "Eje Consumidor", 
        "Eje Salud", 
        "Eje Comunitario"
      ];
      pName = pillarNamesList[pName - 1] || `Pilar ${pName}`;
    }
    
    const scoreVal = ans.puntuacion !== undefined ? ans.puntuacion : 0;
    
    let pNum = ans.pilar;
    if (typeof pNum === 'string') {
      const match = pNum.match(/\d+/);
      pNum = match ? parseInt(match[0]) : 1;
    }
    const pilarIndexStr = String(Math.min(5, Math.max(1, pNum)));
    const suggestedLaw = legalMap[pilarIndexStr] || "N/A";
    
    wsAudit.addRow([
      idx + 1,
      pName || "N/A",
      ans.pregunta || "N/A",
      ans.opcion_seleccionada || "N/A",
      scoreVal,
      ans.recomendacion || "N/A",
      suggestedLaw
    ]);
    
    const currentRow = wsAudit.getRow(rowNum);
    currentRow.height = 42;
    
    currentRow.eachCell((cell, colIdx) => {
      cell.font = { name: FONT_NAME, size: 9.5 };
      cell.border = {
        top: { style: "thin", color: { argb: "E2E8F0" } },
        bottom: { style: "thin", color: { argb: "E2E8F0" } },
        left: { style: "thin", color: { argb: "E2E8F0" } },
        right: { style: "thin", color: { argb: "E2E8F0" } }
      };
      
      if (colIdx === 1 || colIdx === 5) {
        cell.alignment = { horizontal: "center", vertical: "top" };
      } else {
        cell.alignment = { horizontal: "left", vertical: "top", wrapText: true };
      }
      
      if (colIdx === 5) {
        if (scoreVal === 3) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D1FAE5" } // Soft Green
          };
          cell.font = { name: FONT_NAME, size: 9.5, bold: true, color: { argb: "065F46" } };
        } else if (scoreVal === 2) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FEF3C7" } // Soft Yellow
          };
          cell.font = { name: FONT_NAME, size: 9.5, bold: true, color: { argb: "92400E" } };
        } else {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FEE2E2" } // Soft Red
          };
          cell.font = { name: FONT_NAME, size: 9.5, bold: true, color: { argb: "991B1B" } };
        }
      }
    });
  });

  return workbook;
}
