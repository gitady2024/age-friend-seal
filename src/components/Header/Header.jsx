import './Header.scss';
import { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';

function Header({ language, onLanguageChange, currentUser, onOpenAuth, onOpenAccount }) {
  const intl = useIntl();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [certDropdownOpen, setCertDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const nextLanguage = language === 'en' ? 'es' : 'en';
  const closeMenu = () => {
    setMenuOpen(false);
    setLangDropdownOpen(false);
    setCertDropdownOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <a href="#" className="logo header-logo-container" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', height: 'auto', padding: 0, textDecoration: 'none', background: 'transparent' }}>
          <img
            src="/assets/logo.png"
            alt={intl.formatMessage({ id: 'brand.logoAlt' })}
            className="header-logo-img"
            style={{ height: '52px', width: 'auto', backgroundColor: 'transparent', objectFit: 'contain' }}
          />
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

          <div className={`nav-dropdown ${certDropdownOpen ? 'active' : ''}`}>
            <a 
              href="#escalera" 
              className="nav-dropdown-toggle" 
              onClick={(e) => {
                if (window.innerWidth <= 992) {
                  e.preventDefault();
                  setCertDropdownOpen(!certDropdownOpen);
                } else {
                  closeMenu();
                }
              }}
            >
              {intl.formatMessage({ id: 'nav.certifications' })}{' '}
              <span className="arrow-indicator" style={{ fontSize: '0.7em', marginLeft: 4 }}>{certDropdownOpen ? '▲' : '▼'}</span>
            </a>
            <div className={`nav-dropdown-menu ${certDropdownOpen ? 'open' : ''}`}>
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
              (currentUser && currentUser.email) ? onOpenAccount() : onOpenAuth();
            }}
          >
            <span style={{ fontSize: '1.2rem', marginRight: 4 }}>👤</span>
            {currentUser && currentUser.email ? (language === 'es' ? 'Mi Cuenta' : (language === 'pt' ? 'Minha Conta' : 'My Account')) : intl.formatMessage({ id: 'nav.access' })}
          </button>

          {/* Selector de idioma para Escritorio */}
          <div className={`nav-dropdown desktop-only-lang ${langDropdownOpen ? 'active' : ''}`} ref={langDropdownRef} style={{ marginLeft: '10px' }}>
            <a href="#" className="nav-dropdown-toggle lang-switch-btn" onClick={(e) => { e.preventDefault(); setLangDropdownOpen(!langDropdownOpen); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {language === 'es' ? (
                <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">
                  <rect width="3" height="2" fill="#c60b1e" />
                  <rect width="3" height="1" y="0.5" fill="#ffc400" />
                </svg>
              ) : language === 'pt' ? (
                <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
                  <rect width="600" height="400" fill="#006600"/>
                  <polygon points="300,50 550,200 300,350 50,200" fill="#FFCC00"/>
                  <circle cx="300" cy="200" r="100" fill="#003399"/>
                </svg>
              ) : (
                <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
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
            <div className="nav-dropdown-menu" style={{ minWidth: '150px' }}>
              <button type="button" onClick={(e) => { e.preventDefault(); onLanguageChange('es'); setLangDropdownOpen(false); closeMenu(); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', background: 'none', border: 'none', padding: '10px 20px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}>
                <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" style={{ margin: 0 }}>
                  <rect width="3" height="2" fill="#c60b1e" />
                  <rect width="3" height="1" y="0.5" fill="#ffc400" />
                </svg>
                Español
              </button>
              <button type="button" onClick={(e) => { e.preventDefault(); onLanguageChange('en'); setLangDropdownOpen(false); closeMenu(); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', background: 'none', border: 'none', padding: '10px 20px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}>
                <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" style={{ margin: 0 }}>
                  <rect width="60" height="30" fill="#012169" />
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
                  <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
                  <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
                </svg>
                English
              </button>
              <button type="button" onClick={(e) => { e.preventDefault(); onLanguageChange('pt'); setLangDropdownOpen(false); closeMenu(); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', background: 'none', border: 'none', padding: '10px 20px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}>
                <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" style={{ margin: 0 }}>
                  <rect width="600" height="400" fill="#006600"/>
                  <polygon points="300,50 550,200 300,350 50,200" fill="#FFCC00"/>
                  <circle cx="300" cy="200" r="100" fill="#003399"/>
                </svg>
                Português
              </button>
            </div>
          </div>

          {/* Selector de idioma para Móvil */}
          <div className="mobile-only-lang">
            <span className="lang-label">{language === 'es' ? 'Idioma' : language === 'pt' ? 'Idioma' : 'Language'}</span>
            <div className="lang-buttons-row">
              <button 
                type="button" 
                className={`lang-btn ${language === 'es' ? 'active' : ''}`} 
                onClick={() => { onLanguageChange('es'); closeMenu(); }}
              >
                <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" style={{ margin: 0 }}>
                  <rect width="3" height="2" fill="#c60b1e" />
                  <rect width="3" height="1" y="0.5" fill="#ffc400" />
                </svg>
                <span>ES</span>
              </button>
              <button 
                type="button" 
                className={`lang-btn ${language === 'en' ? 'active' : ''}`} 
                onClick={() => { onLanguageChange('en'); closeMenu(); }}
              >
                <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" style={{ margin: 0 }}>
                  <rect width="60" height="30" fill="#012169" />
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
                  <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
                  <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
                </svg>
                <span>EN</span>
              </button>
              <button 
                type="button" 
                className={`lang-btn ${language === 'pt' ? 'active' : ''}`} 
                onClick={() => { onLanguageChange('pt'); closeMenu(); }}
              >
                <svg className="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" style={{ margin: 0 }}>
                  <rect width="600" height="400" fill="#006600"/>
                  <polygon points="300,50 550,200 300,350 50,200" fill="#FFCC00"/>
                  <circle cx="300" cy="200" r="100" fill="#003399"/>
                </svg>
                <span>PT</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
