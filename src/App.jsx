import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import Header from './components/Header/Header.jsx';
import Hero from './components/Hero/Hero.jsx';
import DemographicsSection from './components/DemographicsSection/DemographicsSection.jsx';
import OpportunitySection from './components/OpportunitySection/OpportunitySection.jsx';
import CertificationSection from './components/CertificationSection/CertificationSection.jsx';
import NormativasSection from './components/NormativasSection/NormativasSection.jsx';
import ComparisonSection from './components/ComparisonSection/ComparisonSection.jsx';
import NewsRadarSection from './components/NewsRadarSection/NewsRadarSection.jsx';
import SelfDiagnosticSection from './components/SelfDiagnosticSection/SelfDiagnosticSection.jsx';
import AlliancesSection from './components/AlliancesSection/AlliancesSection.jsx';
import Modals from './components/Modals/Modals.jsx';
import Footer from './components/Footer/Footer.jsx';
import AccessibilityWidget from './components/AccessibilityWidget/AccessibilityWidget.jsx';
import { messages } from './i18n/messages.js';

function getInitialLanguage() {
  const params = new URLSearchParams(window.location.search);
  const queryLanguage = params.get('lang');
  if (queryLanguage === 'en' || queryLanguage === 'es' || queryLanguage === 'pt') return queryLanguage;

  const savedLanguage = window.localStorage.getItem('ageFriendLanguage');
  if (savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'pt') return savedLanguage;

  const path = window.location.pathname.toLowerCase();
  if (path.endsWith('/en') || path.endsWith('/en.html')) return 'en';
  if (path.endsWith('/pt') || path.endsWith('/pt.html')) return 'pt';
  return 'es';
}

function getSavedUser() {
  try {
    return JSON.parse(window.localStorage.getItem('ageFriendUser')) || null;
  } catch {
    return null;
  }
}

function App() {
  const [language, setLanguage] = useState(getInitialLanguage);
  const [activeModal, setActiveModal] = useState(null);
  const [contactLevel, setContactLevel] = useState('silver');
  const [currentUser, setCurrentUser] = useState(getSavedUser);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem('ageFriendLanguage', language);

    const url = new URL(window.location.href);
    url.searchParams.set('lang', language);
    window.history.replaceState({}, '', url);
  }, [language]);

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem('ageFriendUser', JSON.stringify(currentUser));
    } else {
      window.localStorage.removeItem('ageFriendUser');
    }
  }, [currentUser]);

  const openContactModal = (level) => {
    setContactLevel(level);
    setActiveModal('contact');
  };

  return (
    <IntlProvider locale={language} messages={messages[language]}>
      <Header
        language={language}
        onLanguageChange={setLanguage}
        currentUser={currentUser}
        onOpenAuth={() => setActiveModal('auth')}
        onOpenAccount={() => setActiveModal('account')}
      />
      <Hero language={language} />
      <DemographicsSection language={language} />
      <OpportunitySection language={language} />
      <CertificationSection language={language} onRequestCertification={openContactModal} />
      <NormativasSection language={language} />
      <ComparisonSection language={language} />
      <NewsRadarSection language={language} />
      <SelfDiagnosticSection
        language={language}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        onOpenPayment={() => setActiveModal('payment')}
      />
      <AlliancesSection language={language} onOpenPitch={() => setActiveModal(currentUser ? 'pitch' : 'auth')} />
      <Modals
        language={language}
        activeModal={activeModal}
        contactLevel={contactLevel}
        currentUser={currentUser}
        onClose={() => setActiveModal(null)}
        onOpenAuth={() => setActiveModal('auth')}
        onOpenAccount={() => setActiveModal('account')}
        onUserChange={setCurrentUser}
      />
      <Footer language={language} />
      <AccessibilityWidget language={language} />
    </IntlProvider>
  );
}

export default App;
