const ExcelJS = require("exceljs");
const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
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

  if (!email) {
    return res.status(400).json({ error: "Recipient email (email) is required" });
  }

  try {
    console.log(`Iniciando generación de Excel para la empresa: ${enterpriseName || "Empresa"} (${email})`);

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
    worksheet.addRow(["Email Corporativo:", email]);
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
      worksheet.addRow([
        idx + 1,
        ans.pilar || "N/A",
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
          cell.alignment = { horizontal: "center", vertical: "middle" };
        } else {
          cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
        }
      });
      currentRow.height = 35;
    });

    // Ajuste de columnas con límites
    worksheet.columns.forEach((column) => {
      let maxLen = 0;
      column.eachCell((cell) => {
        const valStr = cell.value ? cell.value.toString() : "";
        if (valStr.length > maxLen) {
          maxLen = valStr.length;
        }
      });
      column.width = Math.max(column.width || 10, Math.min(65, maxLen + 3));
    });

    // Escribir en memoria el buffer del archivo Excel (.xlsx)
    const excelBuffer = await workbook.xlsx.writeBuffer();
    console.log("Archivo Excel (.xlsx) generado exitosamente.");

    // 2. Configurar el transportador de correo con SMTP de Google Workspace
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === "true";

    if (!smtpUser || !smtpPass) {
      console.error("Credenciales SMTP no configuradas en las variables de entorno de Vercel.");
      return res.status(500).json({ error: "SMTP credentials are not configured on Vercel" });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const safeCompanyName = (enterpriseName || "Empresa").replace(/\s+/g, "_");
    const mailOptions = {
      from: `"Age Friend Seal Certification" <${smtpUser}>`,
      to: email,
      subject: `Reporte de Autodiagnóstico Age-Friendly - ${enterpriseName || "Empresa"}`,
      text: `Estimado equipo de ${enterpriseName || "Empresa"},\n\n` +
            `Agradecemos su participación en el proceso de Autodiagnóstico del Age Friend Seal.\n\n` +
            `Adjunto a este correo electrónico encontrarán el Reporte de Resultados Oficial estructurado en formato Excel (.xlsx), ` +
            `el cual incluye la evaluación cuantitativa de sus pilares críticos (Accesibilidad Física, Atención y Servicio, e Inclusión y Comunicación) ` +
            `y las recomendaciones directas basadas en los estándares globales ISO 25550.\n\n` +
            `Atentamente,\n` +
            `Instituto Certificador Age Friend Seal`,
      attachments: [
        {
          filename: `Reporte_Age_Friend_Seal_${safeCompanyName}.xlsx`,
          content: excelBuffer,
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
      ]
    };

    console.log(`Enviando correo a: ${email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo enviado con éxito. MessageID: ${info.messageId}`);

    return res.status(200).json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error("Error al procesar el reporte o enviar el correo por SMTP:", error);
    return res.status(500).json({ error: error.message });
  }
};
