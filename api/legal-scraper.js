export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { source = "All" } = req.query;

  // Dictionary Semántico & Exclusiones
  const keywordsGlobal = ["Silver Economy", "Active Ageing", "Age Discrimination", "Senior Employability"];
  const keywordsLatam = ["Economía Plateada", "Adulto Mayor", "Trabajador Maduro", "Envejecimiento Activo", "Convención Interamericana"];
  const keywordsExclusion = ["pension fund calculations", "retirement homes real estate"];

  // Umbral Shadow Mode (0.60)
  const relevanceThreshold = parseFloat(process.env.LEGAL_RELEVANCE_THRESHOLD || "0.60");

  try {
    const fetchedAlerts = [];

    // 1. EU European Parliament RSS Fetcher (Real and active EU feed)
    if (source === "All" || source === "EU") {
      try {
        const response = await fetch("https://www.europarl.europa.eu/rss/doc/top-stories/es.xml");
        if (response.ok) {
          const xmlText = await response.text();
          parseXmlItems(xmlText, "EU", fetchedAlerts);
        } else {
          throw new Error("European Parliament RSS offline");
        }
      } catch (e) {
        console.error("EU Fetcher error:", e);
      }
    }

    // 2. USA GovInfo Congressional Bills RSS Fetcher (Real US legislative feed)
    if (source === "All" || source === "USA") {
      try {
        const response = await fetch("https://www.govinfo.gov/rss/bills.xml");
        if (response.ok) {
          const xmlText = await response.text();
          parseXmlItems(xmlText, "USA", fetchedAlerts);
        } else {
          throw new Error("GovInfo RSS offline");
        }
      } catch (e) {
        console.error("USA Fetcher error:", e);
      }
    }

    // 3. Australia Federal Register Fetcher
    if (source === "All" || source === "Australia") {
      try {
        const response = await fetch("https://www.legislation.gov.au/rss/inforce");
        if (response.ok) {
          const xmlText = await response.text();
          parseXmlItems(xmlText, "Australia", fetchedAlerts);
        } else {
          throw new Error("Australia Legislation RSS offline");
        }
      } catch (e) {
        console.error("Australia Fetcher error:", e);
      }
    }

    // 4. LatAm CEPAL REST API Discover Search Fetcher (Real LatAm research feed)
    if (source === "All" || source === "LatAm") {
      try {
        const response = await fetch("https://repositorio.cepal.org/server/api/discover/search/objects?size=15&sort=dc.date.accessioned,DESC");
        if (response.ok) {
          const json = await response.json();
          const objects = json._embedded?.searchResult?._embedded?.objects || [];
          objects.forEach(obj => {
            const item = obj._embedded?.indexableObject;
            if (item && item.name) {
              const abstract = item.metadata?.['dc.description.abstract']?.[0]?.value || item.metadata?.['dc.title']?.[0]?.value || "";
              const uri = item.metadata?.['dc.identifier.uri']?.[0]?.value || `https://repositorio.cepal.org/handle/11362/${item.id}`;
              
              fetchedAlerts.push({
                id: `alert_latam_${item.id}`,
                source: "LatAm",
                title: item.name.trim(),
                description: abstract.trim(),
                link: uri.trim(),
                matchingTags: ["LatAm-CEPAL"],
                createdAt: new Date().toISOString()
              });
            }
          });
        } else {
          throw new Error("CEPAL REST API offline");
        }
      } catch (e) {
        console.error("LatAm Fetcher error:", e);
      }
    }

    // Filtrado por palabras clave y procesamiento de relevancia LLM (Gemini o simulado)
    const evaluatedAlerts = [];
    for (const alert of fetchedAlerts) {
      // Validar exclusiones
      const textToAnalyze = `${alert.title} ${alert.description}`.toLowerCase();
      const isExcluded = keywordsExclusion.some(ex => textToAnalyze.includes(ex.toLowerCase()));
      if (isExcluded) continue;

      // Validación de Lista Blanca (Domain Whitelisting) y extracción de URL canónica
      const whitelistRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)*(eur-lex\.europa\.eu|europarl\.europa\.eu|congress\.gov|govinfo\.gov|legislation\.gov\.au|cepal\.org|legiscan\.com)\b/i;
      let validatedLink = (alert.link || "").trim();
      if (!whitelistRegex.test(validatedLink)) {
        console.warn(`Discarding non-whitelisted URL: ${validatedLink}`);
        if (alert.source === "EU") validatedLink = "https://www.europarl.europa.eu";
        else if (alert.source === "USA") validatedLink = "https://www.govinfo.gov";
        else if (alert.source === "Australia") validatedLink = "https://www.legislation.gov.au";
        else if (alert.source === "LatAm") validatedLink = "https://repositorio.cepal.org";
        else validatedLink = "";
      } else {
        // Limpiar parámetros de rastreo para obtener la URL canónica
        try {
          const urlObj = new URL(validatedLink);
          urlObj.search = ""; // Quitar parámetros query (utm, etc.)
          validatedLink = urlObj.toString();
        } catch (e) {
          // Mantener si falla el parseo
        }
      }

      // Evaluar relevancia mediante LLM o simulador de precisión
      const llmResult = await evaluateRelevanceWithLLM(alert.title, alert.description);
      
      // Aplicar umbral Shadow Mode (0.60)
      if (llmResult.relevanceScore >= relevanceThreshold) {
        evaluatedAlerts.push({
          ...alert,
          link: validatedLink,
          relevanceScore: llmResult.relevanceScore,
          pilarImpacted: llmResult.pilarImpacted,
          recommendedChange: llmResult.recommendedChange,
          summary: llmResult.summary,
          targetSector: llmResult.targetSector,
          targetVerticals: llmResult.targetVerticals,
          newQuestionText_es: llmResult.newQuestionText_es,
          newQuestionText_en: llmResult.newQuestionText_en,
          newQuestionText_pt: llmResult.newQuestionText_pt,
          status: "pending"
        });
      }
    }

    return res.status(200).json({
      status: "success",
      count: evaluatedAlerts.length,
      thresholdUsed: relevanceThreshold,
      alerts: evaluatedAlerts
    });

  } catch (error) {
    console.error("Legal Scraper Error:", error);
    return res.status(500).json({
      status: "error",
      message: "A server error occurred while scanning legal databases",
      error: error.message
    });
  }
}

// XML Helper para RSS/OAI-PMH parsing
function parseXmlItems(xmlText, source, alertsList) {
  let match;
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let count = 0;
  while ((match = itemRegex.exec(xmlText)) !== null && count < 5) {
    const itemXml = match[1];
    const title = extractTag(itemXml, "title");
    const description = extractTag(itemXml, "description");
    const link = extractTag(itemXml, "link");
    if (title && description) {
      alertsList.push({
        id: `alert_${source.toLowerCase()}_${Date.now()}_${count}`,
        source,
        title: unescapeHtml(title),
        description: unescapeHtml(cleanXmlText(description)),
        link: link ? link.trim() : "",
        matchingTags: [`${source}-generic-tag`],
        createdAt: new Date().toISOString()
      });
      count++;
    }
  }
}

function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, "i");
  const match = regex.exec(xml);
  return match ? match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() : "";
}

function cleanXmlText(text) {
  return text
    .replace(/<[^>]*>/g, "") // remove HTML tags
    .replace(/\s+/g, ' ')
    .trim();
}

function unescapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&amp;nbsp;/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Lógica de evaluación LLM (Gemini API o Analizador de Reglas Local)
async function evaluateRelevanceWithLLM(description) {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const contentToAnalyze = `Descripción a analizar: ${description}`;

  // 1. Si existe clave de Gemini, hacer la llamada real
  if (geminiApiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${getSystemPrompt()}\n\nAnaliza el siguiente texto descriptivo:\n${contentToAnalyze}`
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const json = await response.json();
        const responseText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
          const parsed = JSON.parse(responseText.trim());
          return {
            relevanceScore: parseFloat(parsed.relevanceScore || "0.0"),
            pilarImpacted: parseInt(parsed.pilarImpacted || "1"),
            recommendedChange: parsed.recommendedChange || "",
            summary: parsed.summary || "",
            targetSector: parsed.targetSector || "both",
            targetVerticals: parsed.targetVerticals || ["All"],
            newQuestionText_es: parsed.newQuestionText_es || "",
            newQuestionText_en: parsed.newQuestionText_en || "",
            newQuestionText_pt: parsed.newQuestionText_pt || ""
          };
        }
      }
    } catch (e) {
      console.warn("Gemini call failed, falling back to simulated logic:", e);
    }
  }

  // 2. Fallback a Analizador de Reglas Local
  return simulateLLMEvaluation(description);
}

function getSystemPrompt() {
  return `Eres un analista jurídico experto en la 'Silver Economy' y normativas laborales globales. Tu tarea es analizar el siguiente texto legislativo o resolución y determinar su impacto en las políticas corporativas para trabajadores mayores de 50 años.

Evalúa el texto basándote ÚNICAMENTE en estos 5 pilares de inclusión y amigabilidad:
1. Accesibilidad física y adecuación de espacios de trabajo.
2. Trato respetuoso y atención al cliente senior.
3. Inclusión y comunicación digital (accesibilidad web y móvil).
4. Salud laboral y prevención del desgaste por envejecimiento.
5. Empleabilidad, mentoría generacional y transición al retiro.

REGLA DE SEGURIDAD CRÍTICA:
La URL oficial y el título oficial del documento legislativo son metadatos externos e inmutables. No debes generar, inventar, alterar, resumir, parafrasear o incluir ningún enlace (URL) o título de ley en tu respuesta. El título de la normativa debe conservarse de forma literal y exacta.

FORMATO DE SALIDA (JSON Estricto):
{
  "relevanceScore": [Float entre 0.0 y 1.0. Asigna >0.6 SOLO si la ley exige o incentiva cambios directos en cómo una empresa trata a sus empleados o clientes mayores],
  "pilarImpacted": [Número del pilar más afectado, del 1 al 5],
  "recommendedChange": [Cadena de texto: Instrucción breve y directa de cómo debería actualizarse un cuestionario de auditoría corporativa a raíz de esta ley],
  "summary": [Breve resumen de 2 líneas de la obligación legal],
  "targetSector": ["public" | "private" | "both"],
  "targetVerticals": [Array de strings con las categorías de industria del sector privado afectadas. Usa uno o varios de: ["Finanzas y Seguro", "Salud y Farmacia", "Tecnologia e Software", "Comercio y Distribución", "Manufactura e Industria", "Educación", "Energía y Recursos Naturales", "Entretenimiento, Medios y Turismo", "Bienes Raíces, Urbanismo y Vivienda (Senior Living)"]. Si aplica a todos, colocar ["All"]],
  "newQuestionText_es": [Pregunta redactada directamente en tono de auditoría corporativa en Español],
  "newQuestionText_en": [Pregunta en Inglés],
  "newQuestionText_pt": [Pregunta en Portugués]
}`;
}

// Simulación de precisión NLP
function simulateLLMEvaluation(description) {
  const combined = (description || "").toLowerCase();
  
  let relevanceScore = 0.50;
  let pilarImpacted = 1;
  let recommendedChange = "Revisar los procesos de contratación inclusiva.";
  let summary = "Regulación general relacionada con trabajadores maduros.";
  let targetSector = "both";
  let targetVerticals = ["All"];
  let newQuestionText_es = "¿Dispone la empresa de políticas para promover el empleo sénior?";
  let newQuestionText_en = "Does the company have policies to promote senior employment?";
  let newQuestionText_pt = "A empresa possui políticas para promover o emprego sênior?";

  if (combined.includes("ergonom") || combined.includes("seguridad") || combined.includes("espacios")) {
    relevanceScore = 0.85;
    pilarImpacted = 4; // Pilar 4: Eje Salud
    recommendedChange = "Recomendar auditoría ergonómica obligatoria en puestos de trabajo para operarios mayores de 50 años.";
    summary = "Actualización ergonómica y diseño de puestos saludables para personal senior.";
    targetSector = "private";
    targetVerticals = ["Manufactura e Industria", "Salud y Farmacia"];
    newQuestionText_es = "¿Se realizan evaluaciones ergonómicas específicas para adaptar los puestos de trabajo al envejecimiento de los operarios?";
    newQuestionText_en = "Are specific ergonomic assessments conducted to adapt workstations to aging operators?";
    newQuestionText_pt = "São realizadas avaliações ergonômicas específicas para adaptar os postos de trabalho ao envelhecimento dos operadores?";
  } else if (combined.includes("discrimin") || combined.includes("adea") || combined.includes("contrata")) {
    relevanceScore = 0.90;
    pilarImpacted = 5; // Pilar 5: Empleabilidad y retiro
    recommendedChange = "Eliminar filtros automáticos de fecha de nacimiento o edad en los formularios digitales de reclutamiento.";
    summary = "Enmienda para la prohibición de filtros automáticos por edad en procesos de reclutamiento.";
    targetSector = "both";
    targetVerticals = ["All"];
    newQuestionText_es = "¿Están libres de filtros automáticos de edad los formularios digitales y procesos de reclutamiento de la organización?";
    newQuestionText_en = "Are the organization's digital forms and recruitment processes free from automatic age filters?";
    newQuestionText_pt = "Os formulários digitais e processos de recrutamento da organização estão livres de filtros automáticos de idade?";
  } else if (combined.includes("retiro") || combined.includes("jubila") || combined.includes("jornada")) {
    relevanceScore = 0.78;
    pilarImpacted = 5; // Pilar 5: Empleabilidad y retiro
    recommendedChange = "Agregar opciones de jubilación parcial flexible y reducción de jornada progresiva a partir de los 60 años.";
    summary = "Normativa de jubilación flexible y fomento de transición gradual al retiro laboral.";
    targetSector = "private";
    targetVerticals = ["Finanzas y Seguro", "Tecnologia e Software"];
    newQuestionText_es = "¿Ofrece la empresa esquemas formales de jubilación gradual y programas de mentoría inversa antes del retiro?";
    newQuestionText_en = "Does the company offer formal gradual retirement schemes and reverse mentoring programs prior to retirement?";
    newQuestionText_pt = "A empresa oferece esquemas formais de aposentadoria gradual e programas de mentoria reversa antes da aposentadoria?";
  } else if (combined.includes("silver") || combined.includes("prateada") || combined.includes("incentivo")) {
    relevanceScore = 0.80;
    pilarImpacted = 2; // Pilar 2: Trato respetuoso
    recommendedChange = "Capacitar a los equipos de ventas en trato respetuoso, evitando sesgos paternalistas o edadistas.";
    summary = "Promoción de incentivos corporativos de fomento a la Silver Economy y consumo senior.";
    targetSector = "private";
    targetVerticals = ["Comercio y Distribución", "Entretenimiento, Medios y Turismo"];
    newQuestionText_es = "¿Se capacita formalmente al personal en atención inclusiva y eliminación de sesgos edadistas hacia el cliente sénior?";
    newQuestionText_en = "Is staff formally trained in inclusive service and the elimination of ageist biases toward senior customers?";
    newQuestionText_pt = "A equipe é formalmente treinada em atendimento inclusivo e eliminação de preconceitos de idade em relação ao cliente sênior?";
  }

  return { 
    relevanceScore, 
    pilarImpacted, 
    recommendedChange, 
    summary, 
    targetSector, 
    targetVerticals, 
    newQuestionText_es, 
    newQuestionText_en, 
    newQuestionText_pt 
  };
}
