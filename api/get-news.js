export default async function handler(req, res) {
  // Configurar cabeceras CORS
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

  const { lang = "es" } = req.query;

  const feeds = {
    es: [
      { name: "Google News", url: "https://news.google.com/rss/search?q=%22economia+plateada%22+OR+edadismo&hl=es-419&gl=CL&ceid=CL:es-419", category: "Mercado" },
      { name: "Geriatricarea", url: "https://geriatricarea.com/feed/", category: "Mercado" },
      { name: "Qmayor", url: "https://www.qmayor.com/feed/", category: "Innovación" },
      { name: "SilverEco", url: "https://www.silvereco.org/en/feed/", category: "Innovación" }
    ],
    en: [
      { name: "Google News", url: "https://news.google.com/rss/search?q=%22silver+economy%22+OR+ageism&hl=en-US&gl=US&ceid=US:en", category: "Market" },
      { name: "Next Avenue", url: "https://www.nextavenue.org/feed/", category: "Society" },
      { name: "SilverEco", url: "https://www.silvereco.org/en/feed/", category: "Innovation" }
    ],
    pt: [
      { name: "Google News", url: "https://news.google.com/rss/search?q=%22economia+prateada%22+OR+idadismo&hl=pt-PT&gl=PT&ceid=PT:pt", category: "Mercado" },
      { name: "Portal do Envelhecimento", url: "https://www.portaldoenvelhecimento.com.br/feed/", category: "Sociedade" },
      { name: "SilverEco", url: "https://www.silvereco.org/en/feed/", category: "Inovação" }
    ]
  };

  const activeLanguage = feeds[lang] ? lang : "es";
  const selectedFeeds = feeds[activeLanguage];

  try {
    const results = await Promise.allSettled(
      selectedFeeds.map(async (feed) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        
        // Evitar agregar parámetro t a Google News para prevenir errores 400
        const fetchUrl = feed.name === "Google News" ? feed.url : (feed.url + (feed.url.includes("?") ? "&" : "?") + `t=${Date.now()}`);
        
        const response = await fetch(fetchUrl, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/xml, text/xml, */*"
          }
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
        const xmlText = await response.text();

        const items = [];
        let match;
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        while ((match = itemRegex.exec(xmlText)) !== null) {
          const itemXml = match[1];
          const title = extractTag(itemXml, "title");
          const link = extractTag(itemXml, "link");
          const description = extractTag(itemXml, "description");
          const pubDate = extractTag(itemXml, "pubDate");
          if (title && link) {
            items.push({
              title,
              description: cleanText(description || title),
              link,
              pubDate: pubDate || new Date().toISOString(),
              source: feed.name,
              category: feed.category
            });
          }
        }
        return items.slice(0, 5); // Tomar máximo 5 items por feed
      })
    );

    const loaded = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));

    // Deduplicación por título, enlace y similitud
    const uniqueArticles = [];
    const seenTitles = new Set();
    const seenLinks = new Set();

    for (const article of loaded) {
      const normalizedTitle = article.title.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
      
      // 1. Evitar duplicados exactos por enlace o título
      if (seenLinks.has(article.link) || seenTitles.has(normalizedTitle)) {
        continue;
      }
      
      // 2. Evitar duplicados por títulos extremadamente similares (ej. que empiecen igual)
      let isTooSimilar = false;
      for (const seen of seenTitles) {
        if (seen.length > 20 && normalizedTitle.startsWith(seen.substring(0, 20))) {
          isTooSimilar = true;
          break;
        }
      }
      if (isTooSimilar) continue;

      seenLinks.add(article.link);
      seenTitles.add(normalizedTitle);
      uniqueArticles.push(article);
    }

    // Ordenar por fecha de publicación descendente (las más nuevas primero)
    uniqueArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    return res.status(200).json(uniqueArticles.slice(0, 8));
  } catch (error) {
    console.error("Error fetching news feeds:", error);
    return res.status(500).json({ error: "Failed to fetch feeds", details: error.message });
  }
}

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))</${tag}>`));
  if (match) {
    return (match[1] || match[2] || "").trim();
  }
  return "";
}

function cleanText(text = "") {
  return text
    .replace(/<[^>]*>?/gm, "") // quitar etiquetas html
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}
