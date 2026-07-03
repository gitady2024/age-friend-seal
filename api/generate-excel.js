import { generateExcelWorkbook } from "./excelHelper.js";

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

  const { email, enterpriseName, score, respuestas, country } = req.body;

  try {
    console.log(`Generando descarga directa de Excel para: ${enterpriseName || "Empresa"} (${email})`);

    const workbook = await generateExcelWorkbook({ email, enterpriseName, score, respuestas, country });
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=Reporte_Age_Friend_Seal_${(enterpriseName || "Empresa").replace(/\s+/g, "_")}.xlsx`);
    res.setHeader("Content-Length", buffer.length);

    return res.status(200).send(buffer);
  } catch (error) {
    console.error("Error generating Excel binary report:", error);
    return res.status(500).json({ error: "Failed to generate Excel report", details: error.message });
  }
}
