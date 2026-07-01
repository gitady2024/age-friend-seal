import "./NewsRadarSection.scss";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

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

const fallback = {
  es: [
    {
      title: "BID Lab: la oportunidad de la economia plateada",
      description: "Las empresas que adaptan servicios fisicos y digitales mejoran competitividad frente al envejecimiento poblacional.",
      link: "https://bidlab.org/es/productos/conocimiento-y-conexiones/economia-plateada",
      source: "BID Lab",
      category: "Mercado",
      pubDate: new Date().toISOString()
    },
    {
      title: "OMS: edadismo y entornos amigables",
      description: "La reduccion del edadismo requiere diseno inclusivo, servicios accesibles y politicas sostenidas.",
      link: "https://www.who.int/es/news-room/questions-and-answers/item/ageing-ageism",
      source: "WHO",
      category: "Politicas",
      pubDate: new Date().toISOString()
    },
    {
      title: "El impacto económico del envejecimiento activo",
      description: "Fomentar el empleo sénior y adaptar los puestos de trabajo incrementa el PIB de los países de la OCDE.",
      link: "https://www.oecd.org",
      source: "OCDE",
      category: "Economía",
      pubDate: new Date().toISOString()
    },
    {
      title: "Diseño inclusivo para interfaces digitales",
      description: "El desarrollo de aplicaciones adaptadas para mayores de 60 años mejora un 40% la retención y facilidad de uso.",
      link: "https://www.w3.org/WAI/",
      source: "W3C WAI",
      category: "Innovacion",
      pubDate: new Date().toISOString()
    },
    {
      title: "Ciudades amigables: el nuevo estándar urbano",
      description: "La Red Global de la OMS promueve espacios públicos sin barreras físicas y con transporte accesible.",
      link: "https://extranet.who.int/agefriendlyworld/",
      source: "WHO",
      category: "Ecosistema",
      pubDate: new Date().toISOString()
    },
    {
      title: "Telemedicina y tecnologías asistenciales",
      description: "El uso de sensores domésticos e inteligencia artificial reduce un 30% las visitas de emergencia en la población mayor.",
      link: "https://www.who.int/es",
      source: "OMS",
      category: "Innovacion",
      pubDate: new Date().toISOString()
    }
  ],
  en: [
    {
      title: "The silver economy opportunity",
      description: "Companies adapting physical and digital services can better serve ageing populations.",
      link: "https://bidlab.org/en/products/knowledge-connections/silver-economy",
      source: "IDB Lab",
      category: "Market",
      pubDate: new Date().toISOString()
    },
    {
      title: "WHO: ageism and age-friendly environments",
      description: "Reducing ageism requires inclusive design, accessible services, and sustained policies.",
      link: "https://www.who.int/news-room/questions-and-answers/item/ageing-ageism",
      source: "WHO",
      category: "Policies",
      pubDate: new Date().toISOString()
    },
    {
      title: "The economic impact of active ageing",
      description: "Promoting senior employment and adapting workplace ergonomics boosts GDP across OECD nations.",
      link: "https://www.oecd.org",
      source: "OECD",
      category: "Economy",
      pubDate: new Date().toISOString()
    },
    {
      title: "Inclusive design for digital interfaces",
      description: "Developing software applications tailored for adults over 60 increases retention and usability by 40%.",
      link: "https://www.w3.org/WAI/",
      source: "W3C WAI",
      category: "Innovation",
      pubDate: new Date().toISOString()
    },
    {
      title: "Age-friendly cities: the new urban standard",
      description: "WHO's Global Network promotes public spaces with zero physical barriers and accessible public transit.",
      link: "https://extranet.who.int/agefriendlyworld/",
      source: "WHO",
      category: "Ecosystem",
      pubDate: new Date().toISOString()
    },
    {
      title: "Telemedicine and assistive tech growth",
      description: "Smart home sensors and AI diagnostics reduce emergency hospital visits by 30% for older populations.",
      link: "https://www.who.int",
      source: "WHO",
      category: "Innovation",
      pubDate: new Date().toISOString()
    }
  ],
  pt: [
    {
      title: "BID Lab: a oportunidade da economia prateada",
      description: "As empresas que adaptam serviços físicos e digitais melhoram a competitividade face ao envelhecimento populacional.",
      link: "https://bidlab.org/es/productos/conocimiento-y-conexiones/economia-plateada",
      source: "BID Lab",
      category: "Mercado",
      pubDate: new Date().toISOString()
    },
    {
      title: "OMS: idadismo e ambientes amigáveis",
      description: "A redução do idadismo exige um design inclusivo, serviços acessíveis e políticas sustentadas.",
      link: "https://www.who.int/es/news-room/questions-and-answers/item/ageing-ageism",
      source: "WHO",
      category: "Políticas",
      pubDate: new Date().toISOString()
    },
    {
      title: "O impacto económico do envelhecimento ativo",
      description: "Fomentar o emprego sénior e adaptar os postos de trabalho aumenta o PIB dos países da OCDE.",
      link: "https://www.oecd.org",
      source: "OCDE",
      category: "Economia",
      pubDate: new Date().toISOString()
    },
    {
      title: "Design inclusivo para interfaces digitais",
      description: "O desenvolvimento de aplicações adaptadas para idosos com mais de 60 anos melhora em 40% a retenção.",
      link: "https://www.w3.org/WAI/",
      source: "W3C WAI",
      category: "Inovação",
      pubDate: new Date().toISOString()
    },
    {
      title: "Cidades amigáveis: o novo padrão urbano",
      description: "A Rede Global da OMS promove espaços públicos sem barreiras físicas e com transporte acessível.",
      link: "https://extranet.who.int/agefriendlyworld/",
      source: "WHO",
      category: "Ecossistema",
      pubDate: new Date().toISOString()
    },
    {
      title: "Telemedicina e tecnologias assistivas",
      description: "O uso de sensores domésticos e inteligência artificial reduz em 30% as visitas de emergência para a população idosa.",
      link: "https://www.who.int",
      source: "WHO",
      category: "Inovação",
      pubDate: new Date().toISOString()
    }
  ]
};

function NewsRadarSection({ language }) {
  const intl = useIntl();
  const [status, setStatus] = useState('loading');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const activeLanguage = feeds[language] ? language : 'es';

    async function loadNews() {
      setStatus('loading');

      function processDeduplicateAndBackfill(loadedList) {
        console.log("[Radar] processDeduplicateAndBackfill called with", loadedList.length, "items.");
        const uniqueArticles = [];
        const seenTitles = new Set();
        const seenLinks = new Set();

        const addArticle = (article) => {
          if (!article || !article.title) return false;
          
          // Normalizar el título eliminando caracteres no alfanuméricos y espacios extra
          const normalizedTitle = article.title.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
          
          if (seenLinks.has(article.link)) {
            console.log(`[Radar] Link duplicado omitido: ${article.link}`);
            return false;
          }
          if (seenTitles.has(normalizedTitle)) {
            console.log(`[Radar] Título idéntico omitido: ${article.title}`);
            return false;
          }
          
          // Evitar que títulos muy similares (como nominados de SilverEco en diferentes categorías) se repitan
          let isTooSimilar = false;
          for (const seen of seenTitles) {
            const minPrefixLen = 22;
            if (seen.length >= minPrefixLen && normalizedTitle.startsWith(seen.substring(0, minPrefixLen))) {
              isTooSimilar = true;
              console.log(`[Radar] Título similar omitido (empieza igual): "${article.title}" es muy similar a un artículo ya cargado.`);
              break;
            }
          }
          if (isTooSimilar) return false;

          seenLinks.add(article.link);
          seenTitles.add(normalizedTitle);
          uniqueArticles.push(article);
          console.log(`[Radar] Artículo aceptado: "${article.title}"`);
          return true;
        };

        // 1. Agregar los artículos cargados dinámicamente
        for (const article of loadedList) {
          addArticle(article);
        }

        // Ordenar los artículos dinámicos por fecha antes del relleno
        uniqueArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        console.log("[Radar] Cantidad de artículos dinámicos únicos:", uniqueArticles.length);

        // 2. Si son menos de 6, rellenar con fallback hasta completar 6
        if (uniqueArticles.length < 6) {
          console.log(`[Radar] Faltan artículos para completar el carrusel (${uniqueArticles.length}/6). Rellenando con fallback...`);
          for (const article of fallback[activeLanguage]) {
            const added = addArticle(article);
            if (added) {
              console.log(`[Radar] Agregado de fallback: "${article.title}"`);
            }
            if (uniqueArticles.length >= 6) {
              break;
            }
          }
        }

        console.log("[Radar] Lista final de noticias en el slider:", uniqueArticles.map(a => a.title));
        return uniqueArticles.slice(0, 6);
      }
      
      // 1. Intentar obtener noticias desde nuestra función serverless (evita CORS y caché agresivo)
      try {
        const response = await fetch(`/api/get-news?lang=${activeLanguage}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length && !cancelled) {
            const processed = processDeduplicateAndBackfill(data);
            setArticles(processed);
            setStatus('ready');
            return;
          }
        }
      } catch (err) {
        console.warn("Backend news API failed or not running locally. Trying client-side fallback.", err);
      }

      // 2. Fallback de cliente: usar rss2json.com directo desde el navegador
      try {
        const results = await Promise.allSettled(
          feeds[activeLanguage].map(async (feed) => {
            // Evitar agregar parámetro t a Google News
            const feedUrl = feed.name === "Google News" ? feed.url : (feed.url + (feed.url.includes("?") ? "&" : "?") + `t=${Date.now()}`);
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('RSS fetch failed');
            const data = await response.json();
            return (data.items || []).slice(0, 3).map((item) => ({
              title: item.title,
              description: cleanDescription(item.description || item.title),
              link: item.link,
              pubDate: item.pubDate,
              source: feed.name,
              category: feed.category
            }));
          })
        );
        const loaded = results.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
        if (!cancelled) {
          const processed = processDeduplicateAndBackfill(loaded);
          setArticles(processed);
          setStatus('ready');
        }
      } catch {
        if (!cancelled) {
          setArticles(fallback[activeLanguage]);
          setStatus('fallback');
        }
      }
    }

    loadNews();
    return () => {
      cancelled = true;
    };
  }, [language]);

  return (
    <section id="radar-noticias" className="news-section">
      <div className="container">
        <div className="section-title text-center">
          <h2><FormattedMessage id="NewsRadarSection.001" /></h2>
          <p className="subtitle"><FormattedMessage id="NewsRadarSection.002" /></p>
        </div>
        <div className="news-grid-container">
          {status === 'loading' && (
            <div className="news-loading" id="news-loading">
              <div className="spinner" />
              <p><FormattedMessage id="NewsRadarSection.003" /></p>
            </div>
          )}
          {status === 'fallback' && (
            <div className="news-error" id="news-error">
              <p><FormattedMessage id="NewsRadarSection.004" /></p>
            </div>
          )}
          {status !== 'loading' && (
            <div className="news-slider-wrap" id="news-grid">
              <Swiper
                key={`news-swiper-${articles.length}-${articles.map(a => a.link).join(",")}`}
                modules={[A11y, Autoplay, Pagination]}
                className="news-slider"
                spaceBetween={24}
                slidesPerView={1}
                loop={articles.length > 3}
                speed={700}
                autoplay={{
                  delay: 4200,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true
                }}
                pagination={{
                  el: ".news-slider-pagination",
                  clickable: true
                }}
                a11y={{
                  paginationBulletMessage: language === 'es' ? 'Ir a noticia {{index}}' : (language === 'pt' ? 'Ir para a notícia {{index}}' : 'Go to article {{index}}')
                }}
                breakpoints={{
                  720: {
                    slidesPerView: 2
                  },
                  1100: {
                    slidesPerView: 3
                  }
                }}
              >
              {articles.map((article) => (
                <SwiperSlide key={`${article.source}-${article.title}`}>
                  <article className="glass-card news-card">
                    <div className="news-meta">
                      <span className="news-tag">{article.category}</span>
                      <span className="news-date">{formatDate(article.pubDate, language)}</span>
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <div className="news-footer">
                      <span className="news-source">{intl.formatMessage({ id: 'NewsRadarSection.005' }, { source: article.source })}</span>
                      <a href={article.link} target="_blank" rel="noopener noreferrer" className="news-link">
                        {intl.formatMessage({ id: 'NewsRadarSection.006' })}
                      </a>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
              </Swiper>
              <div className="news-slider-controls" aria-hidden="false">
                <div className="news-slider-pagination" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function cleanDescription(value = '') {
  const element = document.createElement('div');
  element.innerHTML = value;
  return (element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 180);
}

function formatDate(value, language) {
  const locale = language === 'es' ? 'es-419' : (language === 'pt' ? 'pt-BR' : 'en-US');
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}

export default NewsRadarSection;
