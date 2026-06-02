const fs = require('fs');
const path = require('path');
const scrapers = require('./scrapers');
const { notifyNormUpdate, notifyScraperError } = require('./notifier');

// Ruta de la base de datos local de normas
const RULES_FILE = path.join(__dirname, 'rules.json');

/**
 * Carga las reglas de la base de datos rules.json
 */
function loadRules() {
    if (!fs.existsSync(RULES_FILE)) {
        throw new Error(`Archivo de base de datos de normas no encontrado en: ${RULES_FILE}`);
    }
    const data = fs.readFileSync(RULES_FILE, 'utf8');
    return JSON.parse(data);
}

/**
 * Guarda las reglas actualizadas en rules.json
 */
function saveRules(rules) {
    fs.writeFileSync(RULES_FILE, JSON.stringify(rules, null, 2), 'utf8');
    console.log("Base de datos de normas rules.json actualizada con éxito.");
}

/**
 * Función principal del orquestador de monitoreo
 */
async function runMonitor() {
    console.log("==========================================================================");
    console.log(`Iniciando escaneo normativo en: ${new Date().toISOString()}`);
    console.log("==========================================================================");

    let rules;
    try {
        rules = loadRules();
    } catch (error) {
        console.error("Error al cargar las reglas iniciales:", error.message);
        process.exit(1);
    }

    console.log(`Se cargaron ${rules.length} normas para monitorear.`);
    let databaseModified = false;

    for (let i = 0; i < rules.length; i++) {
        const norm = rules[i];
        console.log(`\nProcesando: ${norm.name} [ID: ${norm.id}]`);
        console.log(`URL: ${norm.url}`);
        
        // Seleccionar adaptador de scraping dinámicamente según la institución
        // Si no se encuentra el adaptador, se usa el adaptador 'general' como contingencia
        const scraperFn = scrapers[norm.institution] || scrapers.general;
        
        if (!scrapers[norm.institution]) {
            console.warn(`Advertencia: No se encontró un scraper específico para la institución '${norm.institution}'. Usando adaptador 'general'.`);
        }

        try {
            // Ejecutar scraper
            const result = await scraperFn(norm.url);
            console.log(`Resultado extraído -> Versión: ${result.version} | Estado: ${result.status}`);

            // Verificar si hay discrepancias con el registro actual
            const versionChanged = result.version !== norm.current_version;
            const statusChanged = result.status !== norm.status_registered;

            if (versionChanged || statusChanged) {
                console.log(`⚠️ DISCREPANCIA DETECTADA en ${norm.name}:`);
                console.log(`  - Versión anterior: ${norm.current_version} -> Nueva: ${result.version}`);
                console.log(`  - Estado anterior: ${norm.status_registered} -> Nuevo: ${result.status}`);

                // Enviar alerta por correo
                const emailSent = await notifyNormUpdate(
                    norm.name,
                    norm.current_version,
                    result.version,
                    norm.status_registered,
                    result.status,
                    norm.url
                );

                if (emailSent) {
                    // Actualizar base de datos local para evitar repetir la notificación en la próxima ejecución
                    norm.current_version = result.version;
                    norm.status_registered = result.status;
                    databaseModified = true;
                }
            } else {
                console.log(`✅ La norma ${norm.name} está actualizada.`);
            }

        } catch (error) {
            console.error(`🚨 Error al raspar la norma ${norm.name}:`, error.message);
            
            // Enviar correo de alerta de diagnóstico para que el administrador lo inspeccione
            await notifyScraperError(norm.name, norm.url, error.message);
        }
    }

    // Guardar cambios en rules.json si hubo actualizaciones exitosas de versiones
    if (databaseModified) {
        try {
            saveRules(rules);
        } catch (error) {
            console.error("Error al guardar la base de datos de normas actualizada:", error.message);
        }
    }

    console.log("\n==========================================================================");
    console.log("Escaneo normativo completado.");
    console.log("==========================================================================");
}

// Ejecutar el orquestador si el archivo es invocado directamente
if (require.main === module) {
    runMonitor();
}
