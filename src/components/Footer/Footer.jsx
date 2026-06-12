import "./Footer.scss";
import { FormattedMessage, useIntl } from "react-intl";
function Footer() {
  const intl = useIntl();
  return <>
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
      <a href="#oportunidad" style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            margin: '0 10px',
            transition: 'var(--transition-smooth)'
          }} onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-muted)'"><FormattedMessage id="Footer.004" /></a> <FormattedMessage id="Footer.005" /> <a href="#alianzas" style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            margin: '0 10px',
            transition: 'var(--transition-smooth)'
          }} onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-muted)'"><FormattedMessage id="Footer.006" /></a> <FormattedMessage id="Footer.007" /> <a href="info/privacidad.html" style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            margin: '0 10px',
            transition: 'var(--transition-smooth)'
          }} onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-muted)'"><FormattedMessage id="Footer.008" /></a> <FormattedMessage id="Footer.009" /> <a href="info/terminos.html" style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            margin: '0 10px',
            transition: 'var(--transition-smooth)'
          }} onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-muted)'"><FormattedMessage id="Footer.010" /></a> <FormattedMessage id="Footer.011" /> <a href="?lang=en" style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            margin: '0 10px',
            transition: 'var(--transition-smooth)',
            fontWeight: 'bold'
          }} onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-muted)'"><FormattedMessage id="Footer.012" /></a>
    </p>
    <p><FormattedMessage id="Footer.013" /></p>
    <p className="footer-note"><FormattedMessage id="Footer.014" /></p>
  </div>
</footer>
{/* Widget de Accesibilidad Nativo */}

    </>;
}
export default Footer;
