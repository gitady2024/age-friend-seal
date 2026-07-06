import { generateExcelWorkbook } from "./excelHelper.js";
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
    respuestas,
    country
  } = req.body;

  const targetEmail = email;
  const targetCompany = companyName || enterpriseName || "Empresa B2B";
  const targetName = name || targetEmail.split("@")[0];

  if (!targetEmail) {
    return res.status(400).json({ error: "Recipient email (email) is required" });
  }

  try {
    console.log(`Iniciando generación de Excel para la empresa: ${targetCompany} (${targetEmail})`);

    const workbook = await generateExcelWorkbook({ email: targetEmail, enterpriseName: targetCompany, score, respuestas, country });
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

        let calculatedCriticalPillar = criticalPillar || "Eje Laboral";
        if (pilarScores) {
          const p1 = Number(pilarScores.pilar1 !== undefined ? pilarScores.pilar1 : 100);
          const p2 = Number(pilarScores.pilar2 !== undefined ? pilarScores.pilar2 : 100);
          const p3 = Number(pilarScores.pilar3 !== undefined ? pilarScores.pilar3 : 100);
          const p4 = Number(pilarScores.pilar4 !== undefined ? pilarScores.pilar4 : 100);
          const p5 = Number(pilarScores.pilar5 !== undefined ? pilarScores.pilar5 : 100);
          if (p1 >= 65 && p2 >= 65 && p3 >= 65 && p4 >= 65 && p5 >= 65) {
            calculatedCriticalPillar = "Ninguno";
          }
        }

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
              PILAR_CRITICO: calculatedCriticalPillar,
              COUNTRY: country || "España",
              SCORE_GLOBAL: Number(score || 0),
              SCORE_LABORAL: Number(pilarScores?.pilar1 || 0),
              SCORE_CONCILIACION: Number(pilarScores?.pilar2 || 0),
              SCORE_CONSUMIDOR: Number(pilarScores?.pilar3 || 0),
              SCORE_SALUD: Number(pilarScores?.pilar4 || 0),
              SCORE_COMUNITARIO: Number(pilarScores?.pilar5 || 0)
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
