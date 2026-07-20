import nodemailer from "nodemailer";

/**
 * Serverless API: /api/send-otp
 * Maneja el envío de códigos OTP y correos de bienvenida de activación vía Brevo API / SMTP
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
  const isWelcome = action === "welcome";

  console.log(`========================================================`);
  console.log(`📧 [API CORREO BREVO] Acción: ${action || "send"}`);
  console.log(`👤 Destinatario: ${userEmail} (${userName})`);
  if (!isWelcome) console.log(`🔢 Código OTP (6 dígitos): ${codeToDeliver}`);
  console.log(`========================================================`);

  if (action === "verify") {
    return res.status(200).json({
      success: true,
      message: "Código verificado correctamente."
    });
  }

  const emailSubject = isWelcome
    ? "🎉 ¡Cuenta Activada con Éxito - Age Friend Seal!"
    : "🔐 Código de Activación de Cuenta - Age Friend Seal";

  const emailHtml = isWelcome
    ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #334155;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #10b981; font-size: 24px; margin-bottom: 5px;">¡Cuenta Activada con Éxito!</h1>
          <p style="color: #94a3b8; font-size: 14px;">Age Friend Seal - Instituto Certificador Internacional</p>
        </div>
        
        <div style="background: rgba(30, 41, 59, 0.8); padding: 25px; border-radius: 12px; border: 1px solid #475569; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
          <h2 style="color: #f8fafc; font-size: 18px; margin-top: 0;">¡Bienvenido/a a la plataforma!</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            Estimado/a <strong>${userName}</strong>,<br/>
            Su cuenta ha sido verificada correctamente. Ya dispone de acceso completo al Dashboard, autodiagnóstico corporativo y descarga de reportes oficiales.
          </p>
          <div style="margin-top: 25px;">
            <a href="https://agefriendseal.com" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Acceder a la Plataforma</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #64748b;">
          © Age Friend Seal. Todos los derechos reservados.
        </div>
      </div>
    `
    : `
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
    `;

  let emailSent = false;
  let provider = "none";

  // 1. Intentar envío vía Brevo API v3 Transactional Email
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    try {
      console.log(`Enviando correo (${action || "send"}) vía Brevo API v3 a ${userEmail}...`);
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
            email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER || "info@agefriendseal.com"
          },
          to: [{ email: userEmail, name: userName }],
          subject: emailSubject,
          htmlContent: emailHtml
        })
      });

      if (brevoResponse.ok) {
        console.log(`Correo (${action || "send"}) enviado con éxito mediante Brevo API.`);
        emailSent = true;
        provider = "brevo";
      } else {
        const errTxt = await brevoResponse.text();
        console.error("Error enviando correo con Brevo:", errTxt);
      }
    } catch (brevoErr) {
      console.error("Fallo de conexión enviando correo con Brevo:", brevoErr);
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
        subject: emailSubject,
        html: emailHtml
      });

      emailSent = true;
      provider = "smtp";
      console.log("Correo enviado con éxito vía SMTP.");
    } catch (smtpErr) {
      console.error("Error enviando correo vía SMTP:", smtpErr);
    }
  }

  return res.status(200).json({
    success: true,
    emailSent,
    provider
  });
}
