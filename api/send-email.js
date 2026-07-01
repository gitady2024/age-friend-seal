import ExcelJS from "exceljs";
import nodemailer from "nodemailer";

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

  const { 
    email, 
    name, 
    companyName, 
    enterpriseName, 
    pilarScores, 
    criticalPillar, 
    score, 
    respuestas 
  } = req.body;

  const targetEmail = email;
  const targetCompany = companyName || enterpriseName || "Empresa B2B";
  const targetName = name || targetEmail.split("@")[0];

  if (!targetEmail) {
    return res.status(400).json({ error: "Recipient email (email) is required" });
  }

  try {
    console.log(`Iniciando generación de Excel para la empresa: ${targetCompany} (${targetEmail})`);

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
    worksheet.addRow(["Empresa:", targetCompany]);
    worksheet.addRow(["Email Corporativo:", targetEmail]);
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

    // 2. Configurar el transportador de correo con SMTP
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === "true";

    let emailSent = false;
    let messageId = "skipped";

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const safeCompanyName = targetCompany.replace(/\s+/g, "_");
      const mailOptions = {
        from: `"Age Friend Seal" <${smtpUser}>`,
        to: targetEmail,
        subject: `Reporte de Autodiagnóstico Age-Friendly - ${targetCompany}`,
        text: `Estimado/a equipo de ${targetCompany},\n\n` +
              `Agradecemos su participación en el proceso de Autodiagnóstico del Age Friend Seal.\n\n` +
              `Adjunto a este correo electrónico encontrarán el Reporte de Resultados Oficial estructurado en formato Excel (.xlsx), ` +
              `el cual incluye la evaluación cuantitativa de sus ejes de madurez corporativa y las recomendaciones de mejora basadas en el estándar ISO 25550.\n\n` +
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

      console.log(`Enviando correo a: ${targetEmail}...`);
      const info = await transporter.sendMail(mailOptions);
      console.log(`Correo enviado con éxito. MessageID: ${info.messageId}`);
      messageId = info.messageId;
      emailSent = true;
    } else {
      console.warn("Credenciales SMTP no configuradas. Omitiendo envío de correo.");
    }

    // 3. Sincronizar contacto con Brevo API v3
    const brevoApiKey = process.env.BREVO_API_KEY;
    let brevoSynced = false;

    if (brevoApiKey) {
      try {
        console.log(`Sincronizando contacto con Brevo para: ${targetEmail}`);
        const nameParts = targetName.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": brevoApiKey
          },
          body: JSON.stringify({
            email: targetEmail,
            updateEnabled: true,
            listIds: [Number(process.env.BREVO_LIST_ID || 3)],
            attributes: {
              FIRSTNAME: firstName,
              LASTNAME: lastName,
              COMPANY: targetCompany,
              SCORE_GLOBAL: Number(score || 0),
              SCORE_LABORAL: Number(pilarScores?.pilar1 || 0),
              SCORE_CONCILIACION: Number(pilarScores?.pilar2 || 0),
              SCORE_CONSUMIDOR: Number(pilarScores?.pilar3 || 0),
              SCORE_SALUD: Number(pilarScores?.pilar4 || 0),
              SCORE_COMUNITARIO: Number(pilarScores?.pilar5 || 0),
              PILAR_CRITICO: criticalPillar || "Eje Laboral"
            }
          })
        });

        if (brevoResponse.ok) {
          console.log(`Contacto sincronizado exitosamente con Brevo (Lista ID ${process.env.BREVO_LIST_ID || 3}).`);
          brevoSynced = true;
        } else {
          const errText = await brevoResponse.text();
          console.error(`Error al sincronizar con Brevo: ${errText}`);
        }
      } catch (brevoErr) {
        console.error("Error llamando a la API de Brevo:", brevoErr);
      }
    } else {
      console.warn("BREVO_API_KEY no está configurado en las variables de entorno. Omitiendo sincronización Brevo.");
    }

    return res.status(200).json({ 
      success: true, 
      emailSent, 
      messageId, 
      brevoSynced 
    });

  } catch (error) {
    console.error("Error al procesar el reporte, enviar el correo o sincronizar con Brevo:", error);
    return res.status(500).json({ error: error.message });
  }
}
