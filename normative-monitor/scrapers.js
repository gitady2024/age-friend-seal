const cheerio = require('cheerio');
const dns = require('dns');

// Solución al problema de resolución DNS IPv6 lento o fetch failed en sistemas híbridos
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

// Cabeceras simuladas para emular a un usuario real y evitar bloqueos por Cloudflare/anti-bots
const REAL_USER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Upgrade-Insecure-Requests': '1'
};

/**
 * Realiza una petición HTTP GET simulando un navegador real,
 * manejando redirecciones de manera manual para registrar y retransmitir cookies
 * (necesario para evadir bucles de sesión en sitios como NORMLEX de la OIT).
 */
async function fetchPage(url) {
    let currentUrl = url;
    let cookies = {};
    const maxRedirects = 10;
    
    for (let redirectCount = 0; redirectCount < maxRedirects; redirectCount++) {
        // Construir la cabecera Cookie
        const cookieHeader = Object.entries(cookies)
            .map(([name, value]) => `${name}=${value}`)
            .join('; ');
            
        const headers = { ...REAL_USER_HEADERS };
        if (cookieHeader) {
            headers['Cookie'] = cookieHeader;
        }
        
        const response = await fetch(currentUrl, {
            headers,
            method: 'GET',
            redirect: 'manual'
        });
        
        // Capturar cabeceras Set-Cookie (soporta Node 18+ nativo getSetCookie)
        let setCookieHeaders = [];
        if (typeof response.headers.getSetCookie === 'function') {
            setCookieHeaders = response.headers.getSetCookie();
        } else {
            const rawCookie = response.headers.get('set-cookie');
            if (rawCookie) {
                setCookieHeaders = rawCookie.split(/,(?=[^;]*=)/);
            }
        }
            
        for (const cookieStr of setCookieHeaders) {
            if (!cookieStr) continue;
            const parts = cookieStr.split(';');
            const firstPart = parts[0].trim();
            const equalIdx = firstPart.indexOf('=');
            if (equalIdx > 0) {
                const name = firstPart.substring(0, equalIdx).trim();
                const value = firstPart.substring(equalIdx + 1).trim();
                cookies[name] = value;
            }
        }
        
        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('location');
            if (!location) {
                break;
            }
            // Resolver URLs relativas respecto a la URL actual
            currentUrl = new URL(location, currentUrl).href;
        } else {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} on url ${url}`);
            }
            return await response.text();
        }
    }
    throw new Error(`Too many redirects (${maxRedirects}) for url ${url}`);
}

/**
 * Adaptadores de raspado web por institución
 */
const scrapers = {
    /**
     * Extrae información de la web oficial de ISO standard
     */
    iso: async (url) => {
        const html = await fetchPage(url);
        const $ = cheerio.load(html);
        
        let version = null;
        let status = 'Published'; // Por defecto
        
        // 1. Intentar buscar la fecha de publicación en los metadatos de la página
        // E.g., <span itemprop="releaseDate">2020-05</span> o texto con 'Publication date'
        const releaseDateEl = $('[itemprop="releaseDate"]');
        if (releaseDateEl.length > 0) {
            const dateStr = releaseDateEl.text().trim();
            const yearMatch = dateStr.match(/\b\d{4}\b/);
            if (yearMatch) version = yearMatch[0];
        }
        
        // 2. Intentar buscar en las tablas de detalles técnicos de ISO (e.g. 'Publication date')
        if (!version) {
            $('tr, td, li, span').each((i, el) => {
                const text = $(el).text();
                if (text.includes('Publication date') || text.includes('Fecha de publicación')) {
                    const yearMatch = text.match(/\b\d{4}\b/);
                    if (yearMatch) {
                        version = yearMatch[0];
                        return false; // break loop
                    }
                }
            });
        }
        
        // 3. Fallback: buscar un año de 4 dígitos en el h1 principal de la norma (e.g. "ISO 25550:2020")
        if (!version) {
            const h1Text = $('h1').text();
            const yearMatch = h1Text.match(/:\s*(\d{4})\b/) || h1Text.match(/\b(\d{4})\b/);
            if (yearMatch) version = yearMatch[1];
        }
        
        // 4. Buscar el estado de la norma (e.g. 'Status', 'Stage')
        // En ISO, el estado se muestra con badges tipo 'Published', 'Under review', etc.
        const stageEl = $('.stage, .status, [itemprop="status"]');
        if (stageEl.length > 0) {
            status = stageEl.text().trim();
        } else {
            // Buscar texto 'Status' o 'Estado'
            $('div, span, td').each((i, el) => {
                const text = $(el).text().trim();
                if (text === 'Status' || text === 'Estado') {
                    const siblingText = $(el).next().text().trim();
                    if (siblingText) {
                        status = siblingText;
                        return false;
                    }
                }
            });
        }
        
        if (!version) {
            throw new Error("No se pudo extraer la versión/año de la norma ISO.");
        }
        
        return {
            version: version.trim(),
            status: status.replace(/\s+/g, ' ').trim()
        };
    },

    /**
     * Extrae información de la biblioteca de publicaciones de la OMS
     */
    oms: async (url) => {
        const html = await fetchPage(url);
        const $ = cheerio.load(html);
        
        let version = null;
        let status = 'Published';
        
        // 1. Intentar buscar la fecha en la clase .dynamic-content__date (formato OMS estándar)
        const contentDateEl = $('.dynamic-content__date');
        if (contentDateEl.length > 0) {
            const dateStr = contentDateEl.text().trim();
            const yearMatch = dateStr.match(/\b\d{4}\b/);
            if (yearMatch) version = yearMatch[0];
        }

        // 2. Intentar buscar en scripts de tipo application/ld+json (Schema.org)
        if (!version) {
            $('script[type="application/ld+json"]').each((i, el) => {
                try {
                    const json = JSON.parse($(el).html());
                    // Buscar 'datePublished' o 'dateModified'
                    const dateStr = json.datePublished || json.dateModified || (json.about && json.about.datePublished);
                    if (dateStr) {
                        const yearMatch = String(dateStr).match(/\b\d{4}\b/);
                        if (yearMatch) {
                            version = yearMatch[0];
                            return false; // break loop
                        }
                    }
                } catch (e) {
                    // Ignorar errores de parseo de JSON-LD defectuosos
                }
            });
        }
        
        // 3. Intentar buscar en las meta etiquetas de metadatos académicos/bibliográficos
        // E.g., <meta name="citation_publication_date" content="2019/04/15">
        if (!version) {
            $('meta').each((i, el) => {
                const name = $(el).attr('name') || $(el).attr('property') || '';
                const content = $(el).attr('content') || '';
                if (name.includes('publication_date') || name.includes('issued') || name.includes('date')) {
                    const yearMatch = content.match(/\b\d{4}\b/);
                    if (yearMatch) {
                        version = yearMatch[0];
                        return false; // break loop
                    }
                }
            });
        }
        
        // 4. Buscar en la estructura visual de la OMS (e.g., fecha de publicación lateral)
        if (!version) {
            $('.publication-date, .date, .metadata').each((i, el) => {
                const text = $(el).text();
                const yearMatch = text.match(/\b\d{4}\b/);
                if (yearMatch) {
                    version = yearMatch[0];
                    return false;
                }
            });
        }
        
        // 5. Buscar en el texto general si contiene la palabra "Publicación" o "Publication" y un año
        if (!version) {
            $('body').find('div, span, p').each((i, el) => {
                const text = $(el).text();
                if (text.includes('Publication date') || text.includes('Date of publication')) {
                    const yearMatch = text.match(/\b\d{4}\b/);
                    if (yearMatch) {
                        version = yearMatch[0];
                        return false;
                    }
                }
            });
        }
        
        if (!version) {
            throw new Error("No se pudo extraer la fecha de publicación de la OMS.");
        }
        
        return {
            version: version.trim(),
            status: status
        };
    },

    /**
     * Extrae información del portal NORMLEX de la OIT
     */
    oit: async (url) => {
        const html = await fetchPage(url);
        const $ = cheerio.load(html);
        
        let version = null;
        let status = 'Active';
        
        // 1. Buscar en el título de la recomendación (ej: "R162 - Recomendación sobre los trabajadores de edad, 1980")
        const titleText = $('h1, h2, .document-title').text();
        const yearMatch = titleText.match(/\b(19\d{2}|20\d{2})\b/);
        if (yearMatch) {
            version = yearMatch[0];
        }
        
        // 2. Buscar en meta-etiquetas o cuerpo
        if (!version) {
            $('meta').each((i, el) => {
                const name = $(el).attr('name') || '';
                const content = $(el).attr('content') || '';
                if (name.includes('date') || name.includes('created')) {
                    const yMatch = content.match(/\b\d{4}\b/);
                    if (yMatch) {
                        version = yMatch[0];
                        return false;
                    }
                }
            });
        }
        
        // 3. Buscar en las celdas de tabla (fecha de adopción o estado)
        const statusEl = $('.status, .state');
        if (statusEl.length > 0) {
            status = statusEl.text().trim();
        }
        
        if (!version) {
            throw new Error("No se pudo extraer el año de la Recomendación de la OIT.");
        }
        
        return {
            version: version.trim(),
            status: status
        };
    },

    /**
     * Extractor general (Plan de contingencia para nuevas instituciones)
     * Escanea el contenido del HTML en busca del primer año de 4 dígitos coherente
     * y palabras clave de estado.
     */
    general: async (url) => {
        const html = await fetchPage(url);
        const $ = cheerio.load(html);
        
        let version = null;
        let status = 'Active';
        
        // Buscar un año de 4 dígitos (entre 1990 y 2030) en el título principal
        const titleText = $('title, h1').text();
        const yearMatch = titleText.match(/\b(199\d|20\d{2})\b/);
        if (yearMatch) {
            version = yearMatch[0];
        }
        
        // Buscar en meta etiquetas
        if (!version) {
            $('meta').each((i, el) => {
                const content = $(el).attr('content') || '';
                const yMatch = content.match(/\b(199\d|20\d{2})\b/);
                if (yMatch) {
                    version = yMatch[0];
                    return false;
                }
            });
        }
        
        if (!version) {
            throw new Error("Extractor general falló al localizar una fecha de versión en la URL.");
        }
        
        return {
            version: version.trim(),
            status: status
        };
    }
};

module.exports = scrapers;
