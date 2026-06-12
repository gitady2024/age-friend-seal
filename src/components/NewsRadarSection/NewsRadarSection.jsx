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
    { name: "SilverEco", url: "https://www.silvereco.org/en/feed/", category: "Innovacion" }
  ],
  en: [
    { name: "Google News", url: "https://news.google.com/rss/search?q=%22silver+economy%22+OR+ageism&hl=en-US&gl=US&ceid=US:en", category: "Market" },
    { name: "SilverEco", url: "https://www.silvereco.org/en/feed/", category: "Innovation" }
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
    }
  ]
};

function NewsRadarSection({ language }) {
  const intl = useIntl();
  const [status, setStatus] = useState('loading');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      setStatus('loading');
      try {
        const results = await Promise.allSettled(
          feeds[language].map(async (feed) => {
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('RSS fetch failed');
            const data = await response.json();
            return (data.items || []).slice(0, 3).map((item) => ({
              title: item.title,
              description: cleanDescription(item.description),
              link: item.link,
              pubDate: item.pubDate,
              source: feed.name,
              category: feed.category
            }));
          })
        );
        const loaded = results.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
        if (!cancelled) {
          setArticles(loaded.length ? loaded.slice(0, 6) : fallback[language]);
          setStatus(loaded.length ? 'ready' : 'fallback');
        }
      } catch {
        if (!cancelled) {
          setArticles(fallback[language]);
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
                  paginationBulletMessage: language === 'es' ? 'Ir a noticia {{index}}' : 'Go to article {{index}}'
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
  return new Intl.DateTimeFormat(language === 'es' ? 'es-419' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}

export default NewsRadarSection;
