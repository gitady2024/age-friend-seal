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

  const { users = [], lang = "es" } = { ...req.query, ...req.body };

  const textDict = {
    es: {
      sheetName: "Usuarios Registrados",
      title: "AGE FRIEND SEAL - USUARIOS Y MENTORES REGISTRADOS",
      headers: ["Nombre Completo / Empresa", "Correo Electrónico", "Sector", "Vertical de Industria", "Etapa de Certificación", "Fecha de Registro"]
    },
    en: {
      sheetName: "Registered Users",
      title: "AGE FRIEND SEAL - REGISTERED USERS & MENTORS",
      headers: ["Full Name / Company", "Email Address", "Sector", "Industry Vertical", "Certification Stage", "Registration Date"]
    },
    pt: {
      sheetName: "Usuários Registrados",
      title: "AGE FRIEND SEAL - USUÁRIOS E MENTORES REGISTRADOS",
      headers: ["Nome Completo / Empresa", "E-mail", "Setor", "Vertical de Indústria", "Etapa de Certificação", "Data de Registro"]
    }
  };

  const activeDict = textDict[lang] || textDict.es;

  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(activeDict.sheetName);
    sheet.views = [{ showGridLines: true }];

    const FONT_NAME = "Arial";

    // Bloque del Título Principal
    sheet.mergeCells("A2:F3");
    const titleCell = sheet.getCell("A2");
    titleCell.value = activeDict.title;
    titleCell.font = { name: FONT_NAME, size: 16, bold: true, color: { argb: "FFFFFF" } };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0F172A" } // Dark Slate
    };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // Fila de Encabezados (Fila 5)
    sheet.getRow(5).height = 25;
    const colHeaders = activeDict.headers;

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

    // Cargar datos de usuarios (con fondo blanco claro por defecto)
    let currentRow = 6;
    users.forEach((user) => {
      sheet.getRow(currentRow).height = 22;

      // Nombre Completo
      const fullName = user.companyName || user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || "Usuario Personal";
      sheet.getCell(`A${currentRow}`).value = fullName;
      
      // Correo
      sheet.getCell(`B${currentRow}`).value = user.email || "";
      
      // Sector
      sheet.getCell(`C${currentRow}`).value = user.economicSector || user.sector || "N/A";
      
      // Vertical
      sheet.getCell(`D${currentRow}`).value = user.verticalBusiness || user.subsector || "N/A";
      
      // Etapa
      sheet.getCell(`E${currentRow}`).value = user.certificationStage || "Compromiso Inicial";

      // Fecha
      let regDate = "";
      if (user.createdAt) {
        try {
          regDate = user.createdAt.split("T")[0]; // YYYY-MM-DD
        } catch (e) {
          regDate = user.createdAt;
        }
      }
      sheet.getCell(`F${currentRow}`).value = regDate;

      // Alineaciones (Fondo blanco por defecto, color de texto negro clásico)
      sheet.getCell(`A${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
      sheet.getCell(`C${currentRow}`).alignment = { horizontal: "center", vertical: "middle" };
      sheet.getCell(`D${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
      sheet.getCell(`E${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
      sheet.getCell(`F${currentRow}`).alignment = { horizontal: "center", vertical: "middle" };
      
      for (let col = 1; col <= 6; col++) {
        const cell = sheet.getCell(currentRow, col);
        cell.font = { name: FONT_NAME, size: 10, color: { argb: "000000" } }; // Texto oscuro tradicional
        cell.border = {
          bottom: { style: "thin", color: { argb: "E2E8F0" } }
        };
      }
      currentRow++;
    });

    // Ajustar anchos de columnas
    sheet.getColumn(1).width = 35; // Nombre
    sheet.getColumn(2).width = 30; // Correo
    sheet.getColumn(3).width = 18; // Sector
    sheet.getColumn(4).width = 30; // Vertical
    sheet.getColumn(5).width = 25; // Etapa
    sheet.getColumn(6).width = 18; // Fecha

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=usuarios_registrados.xlsx");

    const buffer = await workbook.xlsx.writeBuffer();
    return res.send(buffer);

  } catch (error) {
    console.error("Error exporting users report:", error);
    return res.status(500).json({
      status: "error",
      message: "Could not generate users Excel report",
      error: error.message
    });
  }
}
