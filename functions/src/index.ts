import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as nodemailer from "nodemailer";
import * as ExcelJS from "exceljs";

// Inicializar el SDK de Admin de Firebase
initializeApp();
const db = getFirestore();

// Helper para resolver la traducción de textos localizados
function getTranslation(obj: any, lang: string = "es"): string {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (typeof obj === "object") {
    if (obj[lang]) return obj[lang];
    if (obj["es"]) return obj["es"];
    if (obj["en"]) return obj["en"];
    const keys = Object.keys(obj);
    for (const key of keys) {
      if (typeof obj[key] === "string") return obj[key];
    }
  }
  return String(obj);
}

/**
 * Cloud Function: onDiagnosticoCompleted
 * Se activa automáticamente al crear un nuevo documento en la colección 'diagnosticos'.
 * Genera un reporte detallado en Excel (.xlsx) y lo envía al correo corporativo por SMTP.
 */
export const onDiagnosticoCompleted = onDocumentCreated("diagnosticos/{diagnosticoId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.error("No se encontraron datos asociados al evento");
    return;
  }

  const diagnosticoId = event.params.diagnosticoId;
  const diagnosticoData = snapshot.data();
  const idEmpresa = diagnosticoData.id_empresa;

  if (!idEmpresa) {
    logger.warn(`El diagnóstico ${diagnosticoId} no posee un 'id_empresa' asociado.`);
    return;
  }

  logger.info(`Nuevo diagnóstico completado para la empresa: ${idEmpresa} (ID Cuestionario: ${diagnosticoId})`);

  // 1. Obtener datos del perfil de la empresa (Nombre y Correo Electrónico)
  let enterpriseEmail = "";
  let enterpriseName = "Empresa Evaluada";
  try {
    const empresaDoc = await db.collection("empresas").doc(idEmpresa).get();
    if (empresaDoc.exists) {
      const empresaData = empresaDoc.data();
      enterpriseEmail = empresaData?.email || "";
      enterpriseName = empresaData?.name || empresaData?.username || "Empresa Evaluada";
    }
  } catch (err) {
    logger.error(`Error al consultar el perfil de la empresa ${idEmpresa} en firestore:`, err);
  }

  // Fallback al correo interno del cuestionario si no se definió en el perfil
  if (!enterpriseEmail) {
    enterpriseEmail = diagnosticoData.email || "";
  }

  if (!enterpriseEmail) {
    logger.error(`No se pudo encontrar una dirección de correo para la empresa ${idEmpresa}. Abortando envío de correo.`);
    return;
  }

  // 2. Procesar las respuestas y calcular métricas
  const answers = diagnosticoData.respuestas || diagnosticoData.answers || [];
  const globalScore = diagnosticoData.score !== undefined 
    ? diagnosticoData.score 
    : (diagnosticoData.globalPercent !== undefined ? diagnosticoData.globalPercent : 0);

  // 3. Generación del reporte en Excel utilizando 'exceljs'
  // DIRECTIVA ESTRICTA: El entregable debe ser estrictamente en formato .xlsx (Prohibido .pdf)
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Resultados Autodiagnóstico");

  // Definir las columnas de la tabla de cuestionario
  worksheet.columns = [
    { header: "N°", key: "num", width: 5 },
    { header: "Pilar", key: "pilar", width: 25 },
    { header: "Pregunta", key: "pregunta", width: 50 },
    { header: "Opción Seleccionada", key: "respuesta", width: 40 },
    { header: "Puntaje", key: "score", width: 10 },
    { header: "Mejora Recomendada", key: "recomendacion", width: 50 }
  ];

  // Añadir título y cabeceras
  worksheet.insertRow(1, []);
  worksheet.insertRow(2, ["REPORTE OFICIAL DE AUTODIAGNÓSTICO - AGE FRIEND SEAL"]);
  worksheet.mergeCells("A2:F2");
  
  const titleCell = worksheet.getCell("A2");
  titleCell.font = { name: "Outfit", size: 16, bold: true, color: { argb: "FFFFFF" } };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "1E293B" } // Slate gris oscuro
  };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(2).height = 40;

  // Bloque de metadatos de la evaluación
  worksheet.addRow([]);
  worksheet.addRow(["Empresa:", enterpriseName]);
  worksheet.addRow(["Email Corporativo:", enterpriseEmail]);
  worksheet.addRow(["Fecha de Emisión:", new Date().toLocaleDateString("es-ES")]);
  worksheet.addRow(["Puntaje Global de Amigabilidad:", `${globalScore}%`]);
  worksheet.addRow([]);

  // Estilizar bloque de metadatos
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
    color: { argb: globalScore >= 90 ? "15803D" : (globalScore >= 65 ? "CA8A04" : "B91C1C") }
  };

  // Fila de encabezado de la tabla de preguntas (Fila 9)
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

  // Agregar las respuestas a la hoja
  answers.forEach((ans: any, idx: number) => {
    const rowNum = 10 + idx;
    
    // Normalizar datos de las preguntas para tolerar diferentes formatos
    let pilarName = "N/A";
    if (ans.pilar) {
      pilarName = `Pilar ${ans.pilar}`;
    } else if (ans.pilarName) {
      pilarName = getTranslation(ans.pilarName);
    }
    
    const questionText = getTranslation(ans.pregunta || ans.text || ans.questionText || `Pregunta ${idx + 1}`);
    const selectedOption = getTranslation(ans.opcion_seleccionada || ans.respuesta || ans.selectedOption || ans.text || "N/A");
    const scoreVal = ans.puntuacion !== undefined ? ans.puntuacion : (ans.score !== undefined ? ans.score : 0);
    const recommendationText = getTranslation(ans.recomendacion || ans.recommendation || "N/A");

    worksheet.addRow([
      idx + 1,
      pilarName,
      questionText,
      selectedOption,
      scoreVal,
      recommendationText
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
      
      // Alinear datos
      if (colIdx === 1 || colIdx === 5) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
      }
    });
    currentRow.height = 35;
  });

  // Ajustar el ancho automático de las columnas con límites
  worksheet.columns.forEach((column) => {
    let maxLen = 0;
    column.eachCell!((cell) => {
      const valStr = cell.value ? cell.value.toString() : "";
      if (valStr.length > maxLen) {
        maxLen = valStr.length;
      }
    });
    column.width = Math.max(column.width || 10, Math.min(65, maxLen + 3));
  });

  // Generar el buffer del archivo Excel en memoria (.xlsx)
  const excelBuffer = await workbook.xlsx.writeBuffer();

  // 4. Automatización del Envío por Correo electrónico mediante Nodemailer
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === "true";

  if (!smtpUser || !smtpPass) {
    logger.error("Credenciales SMTP (SMTP_USER o SMTP_PASS) no configuradas en las variables de entorno de Functions. No se puede enviar el email.");
    return;
  }

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
    from: `"Age Friend Seal Certification" <${smtpUser}>`,
    to: enterpriseEmail,
    subject: `Reporte de Autodiagnóstico Age-Friendly - ${enterpriseName}`,
    text: `Estimado equipo de ${enterpriseName},\n\n` +
          `Agradecemos su participación en el proceso de Autodiagnóstico del Age Friend Seal.\n\n` +
          `Adjunto a este correo electrónico encontrarán el Reporte de Resultados Oficial estructurado en formato Excel (.xlsx), ` +
          `el cual incluye la evaluación cuantitativa de sus pilares críticos (Accesibilidad Física, Atención y Servicio, e Inclusión y Comunicación) ` +
          `y las recomendaciones directas basadas en los estándares globales ISO 25550.\n\n` +
          `Atentamente,\n` +
          `Instituto Certificador Age Friend Seal`,
    attachments: [
      {
        filename: `Reporte_Age_Friend_Seal_${enterpriseName.replace(/\s+/g, "_")}.xlsx`,
        content: Buffer.from(excelBuffer as any),
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Correo enviado exitosamente a ${enterpriseEmail}. MessageID: ${info.messageId}`);

    // 5. Registro de Auditoría de Entregable B2B en Firestore
    await db.collection("entregables_b2b").add({
      id_empresa: idEmpresa,
      fecha_emision: Timestamp.now(),
      estado: "enviado",
      diagnosticoId: diagnosticoId,
      enviado_a: enterpriseEmail,
      formato: "xlsx",
      messageId: info.messageId
    });
    
    logger.info(`Documento de entregable B2B creado en Firestore para la empresa ${idEmpresa}`);

  } catch (emailError) {
    logger.error(`Fallo en el envío del correo electrónico o registro de auditoría para la empresa ${idEmpresa}:`, emailError);
    throw emailError;
  }
});
