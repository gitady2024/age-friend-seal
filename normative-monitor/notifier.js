require('dotenv').config();

// Configuraciones por defecto tomadas de la app cliente, sobrescribibles mediante variables de entorno (.env o GitHub Secrets)
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "L14V6L0j7yEspc91H";
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "service_iwhulyi";
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || "template_wlejnde";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || ""; // Opcional, si EmailJS requiere token de validación
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || "qdoblea@gmail.com";

/**
 * Envía un correo electrónico de notificación utilizando la API REST de EmailJS.
 * Documentación oficial: https://www.emailjs.com/docs/rest-api/send/
 */
async function sendEmailNotification(subject, bodyContent) {
    const url = 'https://api.emailjs.com/api/v1.0/email/send';
    
    const payload = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
            to_name: "Administrador de Age Friend Seal",
            to_email: RECIPIENT_EMAIL,
            subject: subject,
            // Muchos templates estándar de EmailJS usan la variable 'message'
            message: `${subject}\n\nDetalles:\n${bodyContent}\n\n---\nEste es un correo automático generado por el Agente Normative Monitor.`
        }
    };
    
    // Si se configuró una clave privada de validación, la agregamos
    if (EMAILJS_PRIVATE_KEY) {
        payload.accessToken = EMAILJS_PRIVATE_KEY;
    }
    
    console.log(`Intentando enviar correo de alerta a ${RECIPIENT_EMAIL}...`);
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const responseText = await response.text();
        
        if (response.ok) {
            console.log(`¡Notificación enviada con éxito! Respuesta: ${responseText}`);
            return true;
        } else {
            console.error(`Fallo en EmailJS REST API. Status: ${response.status}. Detalle: ${responseText}`);
            return false;
        }
    } catch (error) {
        console.error("Error de conexión al enviar la notificación de EmailJS:", error);
        return false;
    }
}

/**
 * Notificación de cambio detectado en una norma
 */
async function notifyNormUpdate(normName, oldVer, newVer, oldStatus, newStatus, url) {
    const subject = `⚠️ ACTUALIZACIÓN: Cambio detectado en ${normName}`;
    const body = `Se ha detectado una discrepancia en la versión oficial de la norma.
    
- Norma: ${normName}
- Versión Registrada: ${oldVer} (Estado: ${oldStatus})
- Nueva Versión Detectada: ${newVer} (Estado: ${newStatus})
- URL de Referencia: ${url}

Por favor, revisa si este cambio impacta el Autodiagnóstico o la documentación oficial y procede con la actualización del sitio web.`;

    return await sendEmailNotification(subject, body);
}

/**
 * Notificación de diagnóstico por falla de extracción
 */
async function notifyScraperError(normName, url, errorMessage) {
    const subject = `🚨 DIAGNÓSTICO: Falla al verificar ${normName}`;
    const body = `El scraper del Agente de Monitoreo falló al verificar la norma.
    
- Norma: ${normName}
- URL de Referencia: ${url}
- Mensaje de Error: ${errorMessage}

Causas posibles:
1. Bloqueo de IP o Cloudflare por parte del servidor de la institución.
2. Cambio en la estructura HTML o diseño visual del portal de la norma.

Se sugiere realizar una verificación manual o revisar la lógica del scraper.`;

    return await sendEmailNotification(subject, body);
}

module.exports = {
    notifyNormUpdate,
    notifyScraperError
};
