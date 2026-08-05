import nodemailer from "nodemailer";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const { category, name, email, message, language } = req.body || {};

  const finalCategory = String(category || "Otro").trim();
  const finalName = String(name || "").trim();
  const finalEmail = String(email || "").trim();
  const finalMessage = String(message || "").trim();
  const finalLang = String(language || "es").trim();

  if (!finalEmail || !finalMessage) {
    return res.status(400).json({ success: false, error: "Email and message are required" });
  }

  const supportEmail = "soporte@agefriendseal.com";
  let emailSent = false;

  // 1. Send notification email via SMTP if credentials are available
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "465");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === "true";

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const mailOptions = {
        from: `"Centro de Ayuda - Age Friend Seal" <${smtpUser}>`,
        to: supportEmail,
        replyTo: `"${finalName}" <${finalEmail}>`,
        subject: `[SOPORTE] ${finalCategory} - ${finalName || finalEmail}`,
        text: `Nueva consulta de soporte recibida desde la web:\n\n` +
              `Motivo: ${finalCategory}\n` +
              `Nombre: ${finalName || 'No especificado'}\n` +
              `Email: ${finalEmail}\n` +
              `Idioma: ${finalLang.toUpperCase()}\n` +
              `Fecha: ${new Date().toLocaleString()}\n\n` +
              `Mensaje:\n${finalMessage}\n`
      };

      await transporter.sendMail(mailOptions);
      emailSent = true;
      console.log(`Correo de soporte enviado a ${supportEmail} desde ${finalEmail}`);
    } catch (err) {
      console.error("Error al enviar correo de soporte via SMTP:", err);
    }
  }

  // 2. Sync lead / contact in Brevo if configured
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    try {
      const nameParts = finalName.split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "api-key": brevoApiKey
        },
        body: JSON.stringify({
          email: finalEmail,
          updateEnabled: true,
          listIds: [Number(process.env.BREVO_NURTURING_LIST_ID || 6)],
          attributes: {
            NOMBRE: firstName,
            APELLIDOS: lastName,
            IDIOMA_PREFERIDO: finalLang.toUpperCase()
          }
        })
      });
    } catch (brevoErr) {
      console.error("Error al registrar soporte en Brevo:", brevoErr);
    }
  }

  return res.status(200).json({
    success: true,
    emailSent,
    message: "Consulta de soporte recibida con éxito"
  });
}
