import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function ProtectedRoute({ children, currentUser, loadingUser, onRedirect, onUpgrade, language }) {
  
  // Estilos premium reutilizados
  const sectionStyle = {
    padding: '100px 0',
    background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.04) 0%, transparent 60%)',
    borderTop: '1px solid var(--border-color)'
  };

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
    gap: '20px'
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

  // 1. Estado de carga asíncrono
  if (loadingUser) {
    return (
      <section id="autodiagnostico" style={sectionStyle}>
        <div className="container container-narrow">
          <div style={cardStyle} className="glass-card">
            <div className="loading-spinner-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid rgba(255, 255, 255, 0.1)',
                borderTop: '4px solid var(--accent-color, #3b82f6)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '500' }}>
                {language === 'es' 
                  ? 'Cargando perfil de usuario...' 
                  : language === 'pt' 
                    ? 'Carregando perfil de usuário...' 
                    : 'Loading user profile...'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const isAuth = currentUser && currentUser.type !== 'anonymous';
  const isB2B = isAuth && currentUser.type === 'empresa';

  // 2. Si el usuario no ha verificado su cuenta con el OTP de 6 dígitos
  if (isAuth && currentUser.isVerified === false) {
    return (
      <section id="autodiagnostico" style={sectionStyle}>
        <div className="container container-narrow">
          <div style={cardStyle} className="glass-card">
            <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 10px 20px rgba(234, 179, 8, 0.2))' }}>🔐</div>
            <h2 style={titleStyle}>
              {language === 'es' ? 'Cuenta Pendiente de Activación' : (language === 'pt' ? 'Conta Pendente de Ativação' : 'Account Activation Required')}
            </h2>
            <p style={textStyle}>
              {language === 'es'
                ? 'Hemos enviado un código de seguridad de 6 dígitos a su correo. Introdúzcalo para activar su cuenta y acceder a las funciones avanzadas.'
                : language === 'pt'
                  ? 'Enviamos um código de 6 dígitos para o seu e-mail. Insira-o para ativar sua conta e acessar as funções avançadas.'
                  : 'We sent a 6-digit security code to your email. Enter it below to activate your account and access advanced features.'}
            </p>
            <button 
              type="button" 
              className="btn btn-gradient btn-lg" 
              onClick={onRedirect}
              style={{ padding: '14px 40px', fontSize: '1.1rem', fontWeight: '600' }}
            >
              {language === 'es' ? 'Introducir Código de Activación (OTP)' : (language === 'pt' ? 'Inserir Código de Ativação (OTP)' : 'Enter Activation Code (OTP)')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 3. Si el usuario es de tipo Empresa y está verificado, renderizar el diagnóstico
  if (isB2B) {
    return children;
  }

  // 3. Si el usuario está autenticado pero es tipo Personal
  if (isAuth && !isB2B) {
    return (
      <section id="autodiagnostico" style={sectionStyle}>
        <div className="container container-narrow">
          <div style={cardStyle} className="glass-card">
            <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 10px 20px rgba(59, 130, 246, 0.2))' }}>🏢</div>
            <h2 style={titleStyle}>
              {language === 'es' 
                ? 'Cuenta Personal Detectada' 
                : language === 'pt' 
                  ? 'Conta Pessoal Detectada' 
                  : 'Personal Account Detected'}
            </h2>
            <p style={textStyle}>
              {language === 'es'
                ? 'El Autodiagnóstico requiere una cuenta de tipo Empresa. Convierta su cuenta ahora para completar el cuestionario y descargar el sello de su organización.'
                : language === 'pt'
                  ? 'O Autodiagnóstico requer uma conta de tipo Empresa. Converta sua conta agora para completar o questionário e baixar o selo de sua organização.'
                  : 'The Self-Diagnostic requires a Company account. Convert your account now to complete the questionnaire and download your organization\'s seal.'}
            </p>
            <button 
              type="button" 
              className="btn btn-gradient btn-lg" 
              onClick={onUpgrade}
              style={{ padding: '14px 40px', fontSize: '1.1rem', fontWeight: '600' }}
            >
              {language === 'es'
                ? 'Convertir en Cuenta de Empresa'
                : language === 'pt'
                  ? 'Converter para Conta de Empresa'
                  : 'Convert to Company Account'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 4. Si el usuario no está autenticado (Anónimo)
  return (
    <section id="autodiagnostico" style={sectionStyle}>
      <div className="container container-narrow">
        <div style={cardStyle} className="glass-card">
          <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 10px 20px rgba(251, 191, 36, 0.2))' }}>🔒</div>
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
