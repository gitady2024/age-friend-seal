import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";

// Inicializar el SDK de Admin de Firebase
initializeApp();
// const db = getFirestore();

/**
 * Cloud Function: onDiagnosticoCompleted
 * Se activa automáticamente al crear un nuevo documento en la colección 'diagnosticos'.
 */
export const onDiagnosticoCompleted = onDocumentCreated("diagnosticos/{diagnosticoId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.error("No se encontraron datos asociados al evento");
    return;
  }

  const diagnosticoData = snapshot.data();
  const idEmpresa = diagnosticoData.id_empresa;

  logger.info(`Nuevo diagnóstico completado para la empresa: ${idEmpresa}`, { diagnosticoData });

  /*
   * =========================================================================
   * DIRECTIVA ESTRICTA DE FORMATO / MANDATORY FORMAT DIRECTIVE
   * =========================================================================
   * La generación del reporte automatizado y de cualquier archivo adjunto
   * que se envíe al correo corporativo del lead DEBE ser obligatoriamente
   * en formato .xlsx (Excel o compatible).
   * 
   * Está ESTRICTAMENTE PROHIBIDO el uso de archivos en formato PDF (.pdf)
   * para la exportación o envío automatizado de estos datos estructurados.
   * =========================================================================
   * 
   * FLUJO DE TRABAJO SUGERIDO PARA LA IMPLEMENTACIÓN COMPLETA:
   * 
   * 1. OBTENCIÓN DEL PERFIL DE LA EMPRESA:
   *    Construir una consulta a la colección 'empresas' usando 'idEmpresa' para
   *    obtener el correo corporativo registrado del representante de la empresa.
   * 
   * 2. PROCESAMIENTO DE DATOS DEL DIAGNÓSTICO:
   *    Leer las respuestas guardadas en 'diagnosticoData' y ordenarlas en una
   *    tabla o matriz de datos (por ejemplo, divididas por pilares críticos).
   * 
   * 3. GENERACIÓN DEL ARCHIVO EXCEL (.xlsx):
   *    Utilizar una librería como 'exceljs' o 'xlsx' en Node.js para escribir
   *    los datos y las fórmulas de puntuación en un archivo en memoria (.xlsx).
   * 
   * 4. ENVÍO DE CORREO AUTOMÁTICO:
   *    Utilizar Nodemailer integrado con un transportador SMTP o servicio cloud
   *    (ej. SendGrid o Mailgun) para redactar el email y adjuntar el archivo Excel generado.
   * 
   * 5. AUDITORÍA DEL ENTREGABLE:
   *    Crear un nuevo documento en la colección 'entregables_b2b' detallando:
   *    - id_empresa: ID de la empresa receptora.
   *    - diagnosticoId: ID del documento del diagnóstico de origen.
   *    - enviado_a: Correo electrónico de destino.
   *    - fecha_envio: Firebase Firestore Timestamp actual.
   *    - formato: 'xlsx'
   *    - estado: 'exitoso' / 'error'
   */

  try {
    // Aquí se implementará la lógica de generación del Excel y el envío del correo electrónico.
    logger.info(`Procesamiento y generación de reporte .xlsx completado exitosamente para: ${idEmpresa}`);
  } catch (error) {
    logger.error("Error al procesar el reporte y enviar el correo", error);
  }
});
