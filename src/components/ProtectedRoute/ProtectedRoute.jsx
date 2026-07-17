import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function ProtectedRoute({ children, currentUser, onRedirect, language }) {
  const isAuth = currentUser && currentUser.type !== 'anonymous';

  if (isAuth) {
    return children;
  }

  // Estilo premium de tarjeta glassmorphic para encajar con el diseño de la landing
  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.4)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '60px 40px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '40px auto',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
    background: 'linear-gradient(135deg, #94a3b8 0%, #fbbf24 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  };

  const textStyle = {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    margin: '10px 0 20px 0',
    maxWidth: '480px'
  };

  return (
    <section id="autodiagnostico" className="diagnostico-section">
      <div className="container container-narrow">
        <div style={cardStyle} className="glass-card">
          <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 10px 20px rgba(251, 191, 36, 0.2))', animation: 'pulse 2s infinite' }}>🔒</div>
          <h2 style={titleStyle}>
            {language === 'es' 
              ? 'Acceso Restringido' 
              : language === 'pt' 
                ? 'Acesso Restrito' 
                : 'Restricted Access'}
          </h2>
          <p style={textStyle}>
            {language === 'es'
              ? 'El acceso a la herramienta de Autodiagnóstico está reservado exclusivamente para empresas y usuarios registrados. Regístrese o inicie sesión para comenzar.'
              : language === 'pt'
                ? 'O acesso à ferramenta de Autodiagnóstico é reservado exclusivamente para empresas e usuários registrados. Registre-se ou faça login para começar.'
                : 'Access to the Self-Diagnostic tool is reserved exclusively for registered companies and users. Please register or log in to begin.'}
          </p>
          <button 
            type="button" 
            className="btn btn-gradient btn-lg" 
            onClick={onRedirect}
            style={{ padding: '14px 40px', fontSize: '1.1rem', fontWeight: '600' }}
          >
            {language === 'es'
              ? 'Iniciar Sesión / Registrarse'
              : language === 'pt'
                ? 'Iniciar Sessão / Registrar-se'
                : 'Log In / Register'}
          </button>
        </div>
      </div>
    </section>
  );
}
