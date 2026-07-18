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
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import AlliancesSection from './components/AlliancesSection/AlliancesSection.jsx';
import Modals from './components/Modals/Modals.jsx';
import Footer from './components/Footer/Footer.jsx';
import AccessibilityWidget from './components/AccessibilityWidget/AccessibilityWidget.jsx';
import { messages } from './i18n/messages.js';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './config/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
  const [latestDiagnostic, setLatestDiagnostic] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoadingUser(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoadingUser(true);
      if (user) {
        if (user.isAnonymous) {
          setCurrentUser(curr => {
            if (!curr) {
              return { uid: user.uid, type: 'anonymous' };
            }
            return { ...curr, uid: user.uid };
          });
          setLoadingUser(false);
        } else {
          // Recuperar el perfil real desde Firestore
          try {
            const userDocRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
              setCurrentUser(docSnap.data());
            } else {
              const basicProfile = {
                uid: user.uid,
                email: user.email || "",
                name: user.displayName || user.email?.split("@")[0] || "Usuario",
                type: "personal",
                role: "user",
                createdAt: new Date().toISOString()
              };
              await setDoc(userDocRef, basicProfile);
              setCurrentUser(basicProfile);
            }
          } catch (error) {
            console.error("Error recuperando perfil de usuario de Firestore:", error);
            setCurrentUser(curr => curr || { uid: user.uid, email: user.email || "", name: user.displayName || user.email?.split("@")[0] || "Usuario" });
          } finally {
            setLoadingUser(false);
          }
        }
      } else {
        signInAnonymously(auth)
          .catch((error) => {
            console.error("Error signing in anonymously to Firebase Auth:", error);
          })
          .finally(() => {
            setLoadingUser(false);
          });
      }
    });
    return () => unsubscribe();
  }, []);

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

  // Intercept navigation/clicks to #autodiagnostico for unauthenticated or personal users
  useEffect(() => {
    if (loadingUser) return;

    const isAuth = currentUser && currentUser.type !== 'anonymous';
    const isB2B = isAuth && currentUser.type === 'empresa';

    const handleHashChange = () => {
      if (window.location.hash === '#autodiagnostico') {
        if (!isAuth) {
          // Remove hash to prevent scrolling
          window.history.pushState("", document.title, window.location.pathname + window.location.search);
          window.sessionStorage.setItem('redirectAfterAuth', '#autodiagnostico');
          setActiveModal('auth');
        } else if (!isB2B) {
          // Remove hash to prevent scrolling
          window.history.pushState("", document.title, window.location.pathname + window.location.search);
          setActiveModal('account');
        }
      }
    };

    const handleGlobalClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.getAttribute('href') === '#autodiagnostico') {
        if (!isAuth) {
          e.preventDefault();
          window.sessionStorage.setItem('redirectAfterAuth', '#autodiagnostico');
          setActiveModal('auth');
        } else if (!isB2B) {
          e.preventDefault();
          setActiveModal('account');
        }
      }
    };

    // Check on load/mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    document.addEventListener('click', handleGlobalClick, true); // Use capture phase

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [currentUser, loadingUser]);

  // Handle redirection/auto-scroll to #autodiagnostico after login/registration
  useEffect(() => {
    const isAuth = currentUser && currentUser.type !== 'anonymous';
    const isB2B = isAuth && currentUser.type === 'empresa';
    if (isB2B) {
      const pendingRedirect = window.sessionStorage.getItem('redirectAfterAuth');
      if (pendingRedirect === '#autodiagnostico') {
        window.sessionStorage.removeItem('redirectAfterAuth');
        setActiveModal(null);
        setTimeout(() => {
          const element = document.getElementById('autodiagnostico');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 200);
      }
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
      <ProtectedRoute
        currentUser={currentUser}
        loadingUser={loadingUser}
        onRedirect={() => setActiveModal('auth')}
        onUpgrade={() => setActiveModal('account')}
        language={language}
      >
        <SelfDiagnosticSection
          language={language}
          currentUser={currentUser}
          onUserChange={setCurrentUser}
          onOpenPayment={() => setActiveModal('payment')}
          onDiagnosticComplete={setLatestDiagnostic}
        />
      </ProtectedRoute>
      <AlliancesSection language={language} onOpenPitch={() => setActiveModal(currentUser ? 'pitch' : 'auth')} />
      <Modals
        language={language}
        activeModal={activeModal}
        contactLevel={contactLevel}
        currentUser={currentUser}
        latestDiagnostic={latestDiagnostic}
        onClose={() => setActiveModal(null)}
        onOpenAuth={() => setActiveModal('auth')}
        onOpenAccount={() => setActiveModal('account')}
        onUserChange={setCurrentUser}
      />
      <Footer language={language} onLanguageChange={setLanguage} />
      <AccessibilityWidget language={language} />
    </IntlProvider>
  );
}

export default App;
