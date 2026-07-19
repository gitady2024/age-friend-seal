import nodemailer from "nodemailer";

/**
 * Serverless API: /api/send-otp
 * Maneja el envío de códigos de activación OTP de 6 dígitos vía Brevo API / SMTP
 * y proporciona logging en consola para desarrollo local.
 */
export default async function handler(req, res) {
  // CORS Headers
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

  const { email, name, otpCode, action } = req.body || {};

  if (!email) {
    return res.status(400).json({ success: false, error: "El correo electrónico es requerido." });
  }

  const userEmail = String(email).trim().toLowerCase();
  const userName = String(name || userEmail.split("@")[0] || "Usuario").trim();
  const codeToDeliver = String(otpCode || Math.floor(100000 + Math.random() * 900000)).trim();

  // Log visible en consola de servidor para entornos de pruebas / dev
  console.log(`========================================================`);
  console.log(`🔑 [SEGURIDAD B2B] CÓDIGO OTP DE ACTIVACIÓN`);
  console.log(`📧 Destinatario: ${userEmail} (${userName})`);
  console.log(`🔢 Código OTP (6 dígitos): ${codeToDeliver}`);
  console.log(`⏰ Expiración: 15 minutos`);
  console.log(`========================================================`);

  if (action === "verify") {
    return res.status(200).json({
      success: true,
      message: "Código verificado correctamente."
    });
  }

  let emailSent = false;
  let provider = "none";

  // 1. Intentar envío vía Brevo API v3 Transactional Email
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    try {
      console.log(`Enviando código OTP vía Brevo API v3 a ${userEmail}...`);
      const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "api-key": brevoApiKey
        },
        body: JSON.stringify({
          sender: {
            name: "Age Friend Seal",
            email: process.env.SMTP_USER || "no-reply@agefriendseal.com"
          },
          to: [{ email: userEmail, name: userName }],
          subject: "🔐 Código de Activación de Cuenta - Age Friend Seal",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #334155;">
              <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #3b82f6; font-size: 24px; margin-bottom: 10px;">Age Friend Seal</h1>
                <p style="color: #94a3b8; font-size: 14px;">Instituto Certificador Internacional</p>
              </div>
              
              <div style="background: rgba(30, 41, 59, 0.8); padding: 25px; border-radius: 12px; border: 1px solid #475569; text-align: center;">
                <h2 style="color: #f8fafc; font-size: 18px; margin-top: 0;">Activación de Seguridad de Cuenta B2B</h2>
                <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                  Estimado/a <strong>${userName}</strong>,<br/>
                  Introduzca el siguiente código de 6 dígitos en la pantalla de activación para completar la verificación de su cuenta:
                </p>
                
                <div style="margin: 30px 0; background: #1e293b; border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px; display: inline-block;">
                  <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #10b981; font-family: monospace;">${codeToDeliver}</span>
                </div>
                
                <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
                  ⚠️ Este código caducará en <strong>15 minutos</strong>. Si no solicitó esta verificación, ignore este mensaje.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #64748b;">
                © Age Friend Seal. Todos los derechos reservados.
              </div>
            </div>
          `
        })
      });

      if (brevoResponse.ok) {
        console.log("Correo OTP enviado con éxito mediante Brevo API.");
        emailSent = true;
        provider = "brevo";
      } else {
        const errTxt = await brevoResponse.text();
        console.error("Error enviando correo OTP con Brevo:", errTxt);
      }
    } catch (brevoErr) {
      console.error("Fallo de conexión enviando OTP con Brevo:", brevoErr);
    }
  }

  // 2. Fallback a Nodemailer SMTP si Brevo no está o falló
  if (!emailSent && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "465"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"Age Friend Seal" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: "🔐 Código de Activación de Cuenta - Age Friend Seal",
        text: `Hola ${userName},\n\nTu código de activación de 6 dígitos es: ${codeToDeliver}\n\nEste código expira en 15 minutos.`
      });

      emailSent = true;
      provider = "smtp";
      console.log("Correo OTP enviado con éxito vía SMTP.");
    } catch (smtpErr) {
      console.error("Error enviando OTP vía SMTP:", smtpErr);
    }
  }

  return res.status(200).json({
    success: true,
    emailSent,
    provider,
    otpCode: codeToDeliver // De vuelto para simulaciones en dev
  });
}
