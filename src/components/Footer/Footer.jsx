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
    return language === 'en' ? 'info/privacidad_en.html' : 'info/privacidad.html';
  };

  const getTerminosLink = () => {
    return language === 'en' ? 'info/terminos_en.html' : 'info/terminos.html';
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
            <a href="?lang=es" onClick={(e) => handleLangChange(e, 'es')} style={{
              color: language === 'es' ? 'var(--text-primary)' : 'var(--text-muted)',
              textDecoration: 'none',
              margin: '0 5px',
              transition: 'var(--transition-smooth)',
              fontWeight: 'bold'
            }} onMouseOver={(e) => { e.currentTarget.style.color='var(--text-primary)' }} onMouseOut={(e) => { e.currentTarget.style.color = language === 'es' ? 'var(--text-primary)' : 'var(--text-muted)' }}>Español (ES)</a>
            <span style={{ color: 'var(--text-muted)', margin: '0 2px' }}>|</span>
            <a href="?lang=en" onClick={(e) => handleLangChange(e, 'en')} style={{
              color: language === 'en' ? 'var(--text-primary)' : 'var(--text-muted)',
              textDecoration: 'none',
              margin: '0 5px',
              transition: 'var(--transition-smooth)',
              fontWeight: 'bold'
            }} onMouseOver={(e) => { e.currentTarget.style.color='var(--text-primary)' }} onMouseOut={(e) => { e.currentTarget.style.color = language === 'en' ? 'var(--text-primary)' : 'var(--text-muted)' }}>English (EN)</a>
            <span style={{ color: 'var(--text-muted)', margin: '0 2px' }}>|</span>
            <a href="?lang=pt" onClick={(e) => handleLangChange(e, 'pt')} style={{
              color: language === 'pt' ? 'var(--text-primary)' : 'var(--text-muted)',
              textDecoration: 'none',
              margin: '0 5px',
              transition: 'var(--transition-smooth)',
              fontWeight: 'bold'
            }} onMouseOver={(e) => { e.currentTarget.style.color='var(--text-primary)' }} onMouseOut={(e) => { e.currentTarget.style.color = language === 'pt' ? 'var(--text-primary)' : 'var(--text-muted)' }}>Português (PT)</a>
          </p>
          <p><FormattedMessage id="Footer.013" /></p>
          <p className="footer-note"><FormattedMessage id="Footer.014" /></p>
        </div>
      </footer>
    </>
  );
}
export default Footer;
