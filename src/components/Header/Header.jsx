import './Header.scss';
import { useState } from 'react';
import { useIntl } from 'react-intl';

function Header({ language, onLanguageChange, currentUser, onOpenAuth, onOpenAccount }) {
  const intl = useIntl();
  const [menuOpen, setMenuOpen] = useState(false);
  const nextLanguage = language === 'en' ? 'es' : 'en';
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container nav-container">
        <a href="#" className="logo" onClick={closeMenu}>
          <img
            src="/assets/logo_age_friend_seal.png"
            alt={intl.formatMessage({ id: 'brand.logoAlt' })}
            className="logo-img"
          />
          <span className="logo-text">
            <span className="logo-accent">{intl.formatMessage({ id: 'brand.logoAccent' })}</span>{' '}
            {intl.formatMessage({ id: 'brand.logoRest' })}
          </span>
        </a>

        <button
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          id="mobile-menu-btn"
          aria-label={intl.formatMessage({ id: 'nav.openMenu' })}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <a href="#oportunidad" onClick={closeMenu}>{intl.formatMessage({ id: 'nav.opportunity' })}</a>

          <div className="nav-dropdown">
            <a href="#escalera" className="nav-dropdown-toggle" onClick={closeMenu}>
              {intl.formatMessage({ id: 'nav.certifications' })}{' '}
              <span style={{ fontSize: '0.7em', marginLeft: 4 }}>▼</span>
            </a>
            <div className="nav-dropdown-menu">
              <a href="#normativas" onClick={closeMenu}>{intl.formatMessage({ id: 'nav.regulations' })}</a>
              <a href="#alianzas" onClick={closeMenu}>{intl.formatMessage({ id: 'nav.alliances' })}</a>
            </div>
          </div>

          <a href="#radar-noticias" className="hide-on-laptop" onClick={closeMenu}>
            {intl.formatMessage({ id: 'nav.radar' })}
          </a>

          <a href="#autodiagnostico" className="btn btn-primary" id="btn-nav-start" onClick={closeMenu}>
            {intl.formatMessage({ id: 'nav.selfDiagnostic' })}
          </a>

          <button
            type="button"
            className="nav-auth-link"
            id="btn-nav-auth"
            onClick={() => {
              closeMenu();
              currentUser ? onOpenAccount() : onOpenAuth();
            }}
          >
            <span style={{ fontSize: '1.2rem', marginRight: 4 }}>👤</span>
            {currentUser ? (language === 'es' ? 'Mi Cuenta' : 'My Account') : intl.formatMessage({ id: 'nav.access' })}
          </button>

          <button
            type="button"
            className="lang-switch-btn"
            aria-label={intl.formatMessage({ id: 'language.label' })}
            onClick={() => onLanguageChange(nextLanguage)}
          >
            {nextLanguage === 'en' ? (
              <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
                <rect width="60" height="30" fill="#012169" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
                <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
                <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
              </svg>
            ) : (
              <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">
                <rect width="3" height="2" fill="#c60b1e" />
                <rect width="3" height="1" y="0.5" fill="#ffc400" />
              </svg>
            )}
            {intl.formatMessage({ id: `language.${nextLanguage}` })}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
