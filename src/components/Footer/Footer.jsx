import "./Footer.scss";
import { FormattedMessage, useIntl } from "react-intl";
function Footer({ language, onLanguageChange }) {
  const intl = useIntl();

  const handleLangChange = (e, lang) => {
    e.preventDefault();
    if (onLanguageChange) {
      onLanguageChange(lang);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.location.href = url.toString();
    }
  };

  const getPrivacidadLink = () => {
    return language === 'en' ? '/info/privacidad_en.html' : '/info/privacidad.html';
  };

  const getTerminosLink = () => {
    return language === 'en' ? '/info/terminos_en.html' : '/info/terminos.html';
  };

  return (
    <>
      <footer className="footer">
        <div className="container footer-container text-center">
          <a href="#" className="logo" style={{
            justifyContent: 'center',
            marginBottom: 16
          }}>
            <img src="/assets/logo_age_friend_seal.png" alt={intl.formatMessage({
              id: "Footer.001"
            })} className="logo-img" />
            <span className="logo-text"><span className="logo-accent"><FormattedMessage id="Footer.002" /></span> <FormattedMessage id="Footer.003" /></span>
          </a>
          <p className="footer-links" style={{
            marginBottom: 16
          }}>
            <a href="#" style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              margin: '0 10px',
              transition: 'var(--transition-smooth)'
            }} onMouseOver={(e) => { e.currentTarget.style.color='var(--text-primary)' }} onMouseOut={(e) => { e.currentTarget.style.color='var(--text-muted)' }}><FormattedMessage id="Footer.004" /></a>
            <FormattedMessage id="Footer.005" />
            <a href="#alianzas" style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              margin: '0 10px',
              transition: 'var(--transition-smooth)'
            }} onMouseOver={(e) => { e.currentTarget.style.color='var(--text-primary)' }} onMouseOut={(e) => { e.currentTarget.style.color='var(--text-muted)' }}><FormattedMessage id="Footer.006" /></a>
            <FormattedMessage id="Footer.007" />
            <a href={getPrivacidadLink()} style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              margin: '0 10px',
              transition: 'var(--transition-smooth)'
            }} onMouseOver={(e) => { e.currentTarget.style.color='var(--text-primary)' }} onMouseOut={(e) => { e.currentTarget.style.color='var(--text-muted)' }}><FormattedMessage id="Footer.008" /></a>
            <FormattedMessage id="Footer.009" />
            <a href={getTerminosLink()} style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              margin: '0 10px',
              transition: 'var(--transition-smooth)'
            }} onMouseOver={(e) => { e.currentTarget.style.color='var(--text-primary)' }} onMouseOut={(e) => { e.currentTarget.style.color='var(--text-muted)' }}><FormattedMessage id="Footer.010" /></a>
            <FormattedMessage id="Footer.011" />
            <div className="footer-lang-dropdown" style={{ marginLeft: '10px' }}>
              <a href="#" className="nav-dropdown-toggle lang-switch-btn" onClick={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 'bold' }}>
                {language === 'es' ? (
                  <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" style={{ width: '16px', height: '11px', borderRadius: '1px', margin: 0 }} width="16" height="11">
                    <rect width="3" height="2" fill="#c60b1e" />
                    <rect width="3" height="1" y="0.5" fill="#ffc400" />
                  </svg>
                ) : language === 'pt' ? (
                  <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" style={{ width: '16px', height: '11px', borderRadius: '1px', margin: 0 }} width="16" height="11">
                    <rect width="600" height="400" fill="#006600"/>
                    <polygon points="300,50 550,200 300,350 50,200" fill="#FFCC00"/>
                    <circle cx="300" cy="200" r="100" fill="#003399"/>
                  </svg>
                ) : (
                  <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" style={{ width: '16px', height: '11px', borderRadius: '1px', margin: 0 }} width="16" height="11">
                    <rect width="60" height="30" fill="#012169" />
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
                    <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
                    <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
                  </svg>
                )}
                {intl.formatMessage({ id: `language.${language}` })}
                <span style={{ fontSize: '0.7em', marginLeft: 4 }}>▼</span>
              </a>
              <div className="footer-dropdown-menu">
                <a href="?lang=es" onClick={(e) => handleLangChange(e, 'es')} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" style={{ width: '16px', height: '11px', borderRadius: '1px', margin: 0 }} width="16" height="11">
                    <rect width="3" height="2" fill="#c60b1e" />
                    <rect width="3" height="1" y="0.5" fill="#ffc400" />
                  </svg>
                  Español
                </a>
                <a href="?lang=en" onClick={(e) => handleLangChange(e, 'en')} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" style={{ width: '16px', height: '11px', borderRadius: '1px', margin: 0 }} width="16" height="11">
                    <rect width="60" height="30" fill="#012169" />
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
                    <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
                    <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
                  </svg>
                  English
                </a>
                <a href="?lang=pt" onClick={(e) => handleLangChange(e, 'pt')} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" style={{ width: '16px', height: '11px', borderRadius: '1px', margin: 0 }} width="16" height="11">
                    <rect width="600" height="400" fill="#006600"/>
                    <polygon points="300,50 550,200 300,350 50,200" fill="#FFCC00"/>
                    <circle cx="300" cy="200" r="100" fill="#003399"/>
                  </svg>
                  Português
                </a>
              </div>
            </div>
          </p>
          <p><FormattedMessage id="Footer.013" /></p>
          <p className="footer-note"><FormattedMessage id="Footer.014" /></p>
        </div>
      </footer>
    </>
  );
}
export default Footer;
