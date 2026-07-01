import JSZip from "jszip";

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

  const { companyName, svgContent, pngBase64 } = req.body;

  if (!companyName || !svgContent) {
    return res.status(400).json({ error: "Missing required fields: companyName, svgContent" });
  }

  try {
    const zip = new JSZip();

    // 1. Añadir el distintivo SVG
    zip.file("sello_age_friend.svg", svgContent);

    // 2. Añadir el distintivo PNG si se proporciona la representación base64
    if (pngBase64) {
      // Remover cabecera data URI si está presente ("data:image/png;base64,")
      const base64Data = pngBase64.replace(/^data:image\/png;base64,/, "");
      zip.file("sello_age_friend.png", base64Data, { base64: true });
    }

    // 3. Añadir el documento de instrucciones
    const readmeContent = `# Age Friend Seal - Kit de Marca de ${companyName}

¡Felicitaciones! Tu organización ha obtenido el distintivo oficial de "Age Friend Seal".

Este kit contiene los recursos visuales oficiales adaptados a tu identidad de marca:

1. sello_age_friend.svg: Formato vectorial escalable infinito. Ideal para sitios web, firmas de correo y documentos impresos de alta resolución.
2. sello_age_friend.png: Imagen de alta resolución con fondo transparente. Lista para publicar en redes sociales (ej. LinkedIn) o integrar en tus firmas.

Recomendaciones de uso:
- Mantener las proporciones originales del sello.
- Asegurar un buen contraste visual sobre el color de fondo elegido.
- Compartir el distintivo en canales corporativos como símbolo de vuestro compromiso estratégico con la Generación Plateada y las normas ISO de amigabilidad.

Generado automáticamente por el Agente de IA de Age Friend Seal.
Fecha: ${new Date().toLocaleDateString("es-ES")}
`;
    zip.file("INSTRUCCIONES_DE_MARCA.txt", readmeContent);

    // 4. Generar el archivo ZIP
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    // 5. Responder con el archivo comprimido
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Kit_Marca_Age_Friend_${companyName.replace(/[^a-z0-9]/gi, "_")}.zip`
    );
    return res.send(zipContent);
  } catch (error) {
    console.error("Error generating brand kit ZIP:", error);
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
}
