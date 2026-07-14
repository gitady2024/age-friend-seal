import ExcelJS from "exceljs";
import crypto from "crypto";

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  const { alerts = [], lang = "es" } = req.body || {};

  // 1. Generate Excel Buffer
  let buffer;
  try {
    const textDict = {
      es: {
        sheetName: "Historial Normativo",
        title: "AGE FRIEND SEAL - HISTORIAL DE ALERTAS NORMATIVAS",
        headers: ["ID Alerta", "Jurisdicción", "Título de la Normativa", "Resumen Legal (LLM)", "Pilar Impactado", "Relevancia (Score)", "Recomendación de Ajuste"],
        pillars: {
          1: "Pilar 1: Accesibilidad física",
          2: "Pilar 2: Trato respetuoso / Atención",
          3: "Pilar 3: Inclusión digital / Accesibilidad web",
          4: "Pilar 4: Salud laboral / Prevención desgaste",
          5: "Pilar 5: Empleabilidad / Transición retiro"
        }
      },
      en: {
        sheetName: "Regulatory History",
        title: "AGE FRIEND SEAL - REGULATORY ALERTS HISTORY",
        headers: ["Alert ID", "Jurisdiction", "Regulation Title", "Legal Summary (LLM)", "Pillar Impacted", "Relevance Score", "Adjust Recommendation"],
        pillars: {
          1: "Pillar 1: Physical accessibility",
          2: "Pillar 2: Respectful treatment / Service",
          3: "Pillar 3: Digital inclusion / Web accessibility",
          4: "Pillar 4: Occupational health / Wear prevention",
          5: "Pillar 5: Employability / Retirement transition"
        }
      },
      pt: {
        sheetName: "Histórico Regulatório",
        title: "AGE FRIEND SEAL - HISTÓRICO DE ALERTAS NORMATIVAS",
        headers: ["ID Alerta", "Jurisdição", "Título da Norma", "Resumo Legal (LLM)", "Pilar Impactado", "Relevância (Score)", "Recomendação de Ajuste"],
        pillars: {
          1: "Pilar 1: Acessibilidade física",
          2: "Pilar 2: Trato respetuoso / Atendimento",
          3: "Pilar 3: Inclusão digital / Acessibilidade web",
          4: "Pilar 4: Saúde ocupacional / Prevenção de desgaste",
          5: "Pilar 5: Empregabilidade / Transição aposentadoria"
        }
      }
    };

    const activeDict = textDict[lang] || textDict.es;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(activeDict.sheetName);
    sheet.views = [{ showGridLines: true }];

    const FONT_NAME = "Arial";

    sheet.mergeCells("A2:G3");
    const titleCell = sheet.getCell("A2");
    titleCell.value = activeDict.title;
    titleCell.font = { name: FONT_NAME, size: 16, bold: true, color: { argb: "FFFFFF" } };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0F172A" }
    };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    sheet.getRow(5).height = 25;
    const colHeaders = activeDict.headers;

    colHeaders.forEach((h, colIdx) => {
      const cell = sheet.getCell(5, colIdx + 1);
      cell.value = h;
      cell.font = { name: FONT_NAME, size: 11, bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E293B" }
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "94A3B8" } },
        bottom: { style: "medium", color: { argb: "94A3B8" } }
      };
    });

    let currentRow = 6;
    alerts.forEach((alert) => {
      sheet.getRow(currentRow).height = 22;

      sheet.getCell(`A${currentRow}`).value = alert.id || "";
      sheet.getCell(`B${currentRow}`).value = alert.source || "";
      sheet.getCell(`C${currentRow}`).value = alert.title || "";
      sheet.getCell(`D${currentRow}`).value = alert.summary || alert.description || "";
      sheet.getCell(`E${currentRow}`).value = activeDict.pillars[alert.pilarImpacted] || `Pilar ${alert.pilarImpacted}`;
      
      const scoreCell = sheet.getCell(`F${currentRow}`);
      scoreCell.value = alert.relevanceScore !== undefined ? parseFloat(alert.relevanceScore.toFixed(2)) : 0.0;
      scoreCell.numFmt = "0.00";

      sheet.getCell(`G${currentRow}`).value = alert.recommendedChange || "";

      sheet.getCell(`A${currentRow}`).alignment = { horizontal: "center", vertical: "middle" };
      sheet.getCell(`B${currentRow}`).alignment = { horizontal: "center", vertical: "middle" };
      sheet.getCell(`C${currentRow}`).alignment = { wrapText: true, vertical: "middle" };
      sheet.getCell(`D${currentRow}`).alignment = { wrapText: true, vertical: "middle" };
      sheet.getCell(`E${currentRow}`).alignment = { horizontal: "left", vertical: "middle" };
      sheet.getCell(`F${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
      sheet.getCell(`G${currentRow}`).alignment = { wrapText: true, vertical: "middle" };
      
      for (let col = 1; col <= 7; col++) {
        const cell = sheet.getCell(currentRow, col);
        cell.font = { name: FONT_NAME, size: 10 };
        cell.border = {
          bottom: { style: "thin", color: { argb: "E2E8F0" } }
        };
      }
      currentRow++;
    });

    sheet.getColumn(1).width = 15;
    sheet.getColumn(2).width = 15;
    sheet.getColumn(3).width = 30;
    sheet.getColumn(4).width = 45;
    sheet.getColumn(5).width = 25;
    sheet.getColumn(6).width = 18;
    sheet.getColumn(7).width = 45;

    buffer = await workbook.xlsx.writeBuffer();
  } catch (excelError) {
    console.error("Excel generation failed in sync-to-drive:", excelError);
    return res.status(500).json({ status: "error", message: "Failed to generate Excel buffer", error: excelError.message });
  }

  // 2. Google OAuth 2.0 and Drive Upload
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const targetFileId = "153zLaw79__Z4O64Tu53Eq8MVbhyrvuKe";

  if (!clientEmail || !privateKey) {
    console.error("Google Service Account credentials missing in environment variables");
    return res.status(500).json({
      status: "error",
      message: "Google Drive credentials not configured. Please define GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY."
    });
  }

  try {
    // Generate JWT
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/drive",
      aud: "https://oauth2.googleapis.com/token",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    };

    const base64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url");

    const sign = crypto.createSign("RSA-SHA256");
    sign.update(`${base64Header}.${base64Payload}`);
    
    const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");
    const signature = sign.sign(formattedPrivateKey, "base64url");
    const jwt = `${base64Header}.${base64Payload}.${signature}`;

    // Exchange JWT for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt
      })
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`Failed to obtain Google access token: ${errText}`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error("No access_token returned by Google OAuth");
    }

    // Update File in Google Drive using PATCH request (uploadType=media)
    const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${targetFileId}?uploadType=media`;
    const driveRes = await fetch(uploadUrl, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Length": buffer.length.toString()
      },
      body: buffer
    });

    if (!driveRes.ok) {
      const errText = await driveRes.text();
      throw new Error(`Google Drive API update failed: ${errText}`);
    }

    const driveData = await driveRes.json();
    return res.status(200).json({
      status: "success",
      message: "Sincronización exitosa con Google Drive",
      fileId: driveData.id
    });

  } catch (driveError) {
    console.error("Google Drive synchronization failed:", driveError);
    return res.status(500).json({
      status: "error",
      message: "Error al sincronizar con Drive. Reintente.",
      error: driveError.message
    });
  }
}
