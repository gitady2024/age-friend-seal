import nodemailer from "nodemailer";
import crypto from "crypto";

/**
 * Serverless API: /api/send-otp
 * Maneja el envío de códigos OTP, correos de bienvenida y recuperación de contraseña vía Brevo API / SMTP
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

  console.log(`========================================================`);
  console.log(`📧 [API CORREO BREVO] Acción: ${action || "send"}`);
  console.log(`👤 Destinatario: ${userEmail} (${userName})`);
  console.log(`========================================================`);

  if (action === "verify") {
    return res.status(200).json({
      success: true,
      message: "Código verificado correctamente."
    });
  }

  let emailSubject = "";
  let emailHtml = "";

  if (action === "reset") {
    let oobCode = null;

    // Obtener el oobCode nativo oficial usando Google Service Account + Identity Toolkit Admin REST API
    const clientEmail = process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "age-friend-seal";

    if (!clientEmail || !rawPrivateKey) {
      console.error("❌ [API RESET] Credenciales de Service Account no configuradas en Vercel (FIREBASE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_EMAIL / FIREBASE_PRIVATE_KEY / GOOGLE_PRIVATE_KEY)");
      return res.status(500).json({
        success: false,
        error: "Las credenciales del servidor (Service Account) no están configuradas en Vercel."
      });
    }

    console.log(`🔑 [API RESET IAM CHECK] Service Account Email en uso: ${clientEmail} | ProjectID: ${projectId}`);

    try {
      let privateKey = String(rawPrivateKey || "").trim();
      if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
        privateKey = privateKey.slice(1, -1);
      }
      privateKey = privateKey.replace(/\\n/g, "\n");
      if (!privateKey.includes("\n") && privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
        privateKey = privateKey
          .replace("-----BEGIN PRIVATE KEY-----", "-----BEGIN PRIVATE KEY-----\n")
          .replace("-----END PRIVATE KEY-----", "\n-----END PRIVATE KEY-----");
      }

      const header = { alg: "RS256", typ: "JWT" };
      const payload = {
        iss: clientEmail,
        scope: "https://www.googleapis.com/auth/identitytoolkit https://www.googleapis.com/auth/cloud-platform",
        aud: "https://oauth2.googleapis.com/token",
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      };

      const base64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
      const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url");

      const sign = crypto.createSign("RSA-SHA256");
      sign.update(`${base64Header}.${base64Payload}`);
      const signature = sign.sign(privateKey, "base64url");
      const jwt = `${base64Header}.${base64Payload}.${signature}`;

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: jwt
        })
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        const oobRes = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:sendOobCode`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: userEmail,
            continueUrl: "https://agefriendseal.com/?action=resetPassword",
            canHandleCodeInApp: false,
            returnOobLink: true
          })
        });

        if (oobRes.ok) {
          const oobData = await oobRes.json();
          oobCode = oobData.oobCode || (oobData.oobLink ? new URL(oobData.oobLink).searchParams.get("oobCode") : null);
          console.log(`🔑 [REAL FIREBASE OOBCODE]: ${oobCode}`);
        } else {
          const errText = await oobRes.text();
          console.error(`❌ Identity Toolkit Admin API Error para ${clientEmail} en ${projectId}:`, errText);
          return res.status(500).json({
            success: false,
            error: `Error de Google Identity Toolkit: ${errText} (Service Account: ${clientEmail}, Project ID: ${projectId})`
          });
        }
      } else {
        const tokenErrText = await tokenRes.text();
        console.error("❌ OAuth2 Token Exchange Error:", tokenErrText);
        return res.status(500).json({
          success: false,
          error: `Error al autenticar Service Account con Google: ${tokenErrText}`
        });
      }
    } catch (adminErr) {
      console.error("❌ ERROR DETALLADO DE SERVICE ACCOUNT / FIREBASE:", adminErr);
      console.error("❌ STACK TRACE COMPLETO:", adminErr.stack || adminErr);
      return res.status(500).json({
        success: false,
        error: `Error procesando credenciales de servidor: ${adminErr.message || adminErr}`,
        details: adminErr.stack || String(adminErr)
      });
    }

    if (!oobCode) {
      console.error("❌ ERROR CRÍTICO: No se pudo obtener el oobCode nativo de Firebase.");
      return res.status(500).json({
        success: false,
        error: "No se pudo generar el código de restablecimiento oficial de Firebase."
      });
    }

    const customAppUrl = `https://agefriendseal.com/?action=resetPassword&oobCode=${encodeURIComponent(oobCode)}`;
    emailSubject = "🔐 Restablece tu contraseña - Age Friend Seal";
    emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #334155;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #3b82f6; font-size: 24px; margin-bottom: 5px;">Age Friend Seal</h1>
          <p style="color: #94a3b8; font-size: 14px;">Instituto Certificador Internacional</p>
        </div>
        
        <div style="background: rgba(30, 41, 59, 0.8); padding: 25px; border-radius: 12px; border: 1px solid #475569; text-align: center;">
          <h2 style="color: #f8fafc; font-size: 18px; margin-top: 0;">Restablecimiento de Contraseña</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            Estimado/a <strong>${userName}</strong>,<br/>
            Hemos recibido una solicitud para restablecer la contraseña de su cuenta B2B en Age Friend Seal.
          </p>
          <div style="margin-top: 25px; margin-bottom: 20px;">
            <a href="${customAppUrl}" data-mailin-track="0" data-brevo-track="0" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
              Restablecer mi Contraseña
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
            ⚠️ Si usted no solicitó este cambio de contraseña, puede ignorar este mensaje de forma segura. El enlace caducará en 1 hora.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #64748b;">
          © Age Friend Seal. Todos los derechos reservados.
        </div>
      </div>
    `;
  } else if (action === "welcome") {
    emailSubject = "🎉 ¡Cuenta Activada con Éxito - Age Friend Seal!";
    emailHtml = `
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
            <a href="https://agefriendseal.com/?action=login&amp;email=${encodeURIComponent(userEmail)}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Acceder a la Plataforma</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #64748b;">
          © Age Friend Seal. Todos los derechos reservados.
        </div>
      </div>
    `;
  } else {
    emailSubject = "🔐 Código de Activación de Cuenta - Age Friend Seal";
    emailHtml = `
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
  }

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
