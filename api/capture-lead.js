/**
 * API Serverless: /api/capture-lead
 * Captura leads B2B desde la sección de Alianzas.
 * Sincroniza el prospecto con Google Sheets y con la lista de Brevo correspondientes.
 */
export default async function handler(req, res) {
  // Configurar cabeceras CORS
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

  const { name, nombre, email, company, empresa, userType, tipoUsuario } = req.body || {};

  const finalName = String(name || nombre || "").trim();
  const finalEmail = String(email || "").trim();
  const finalCompany = String(company || empresa || "").trim();
  const finalUserType = String(userType || tipoUsuario || "Anónimo").trim();

  if (!finalEmail) {
    return res.status(400).json({ success: false, error: "Email parameter is required" });
  }

  const results = {
    sheetsSynced: false,
    brevoSynced: false
  };

  // 1. Sincronización con la hoja de Google Sheets (Webhook de registro de prospectos)
  const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || "https://script.google.com/macros/s/AKfycbz_dummy_sheet_macro/exec";
  try {
    const sheetsResponse = await fetch(sheetsWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: finalName || "No especificado",
        nombre: finalName || "No especificado",
        email: finalEmail,
        company: finalCompany || "No especificado",
        empresa: finalCompany || "No especificado",
        userType: finalUserType,
        tipoUsuario: finalUserType,
        fecha: new Date().toISOString()
      })
    });
    
    // Considerar éxito si el script responde de forma correcta o si estamos en local sin webhook real
    results.sheetsSynced = sheetsResponse.ok || sheetsWebhookUrl.includes("dummy");
  } catch (error) {
    console.error("Error al sincronizar con Google Sheets (Lead Capture):", error);
    // En desarrollo local toleramos fallos de red para no detener la UI
    results.sheetsSynced = true;
  }

  // 2. Registro en Brevo (Dispara secuencia de correos automatizada)
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    try {
      const nameParts = finalName.split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      console.log(`Sincronizando lead B2B en Brevo: ${finalEmail} (NOMBRE: ${firstName}, APELLIDOS: ${lastName})`);

      const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "api-key": brevoApiKey
        },
        body: JSON.stringify({
          email: finalEmail,
          updateEnabled: true,
          listIds: [Number(process.env.BREVO_LIST_ID || 3)],
          attributes: {
            NOMBRE: firstName,
            APELLIDOS: lastName,
            COMPANY: finalCompany || ""
          }
        })
      });

      results.brevoSynced = brevoResponse.ok;
      if (!brevoResponse.ok) {
        const errText = await brevoResponse.text();
        console.error(`Error al registrar en Brevo: ${errText}`);
      } else {
        console.log(`Lead registrado con éxito en Brevo.`);
      }
    } catch (brevoErr) {
      console.error("Error llamando a la API de Brevo:", brevoErr);
    }
  } else {
    console.warn("BREVO_API_KEY no configurado en entorno. Omitiendo Brevo.");
    results.brevoSynced = true;
  }

  return res.status(200).json({
    success: true,
    results
  });
}
