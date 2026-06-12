import "./Modals.scss";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { buildDossierHtml, downloadTextFile, generateDecalSvg } from "../../utils/downloads.js";

function Modals({ language, activeModal, contactLevel, currentUser, onClose, onOpenAuth, onOpenAccount, onUserChange }) {
  const intl = useIntl();
  const [authView, setAuthView] = useState('login');
  const [registerType, setRegisterType] = useState('personal');
  const [upgradeSector, setUpgradeSector] = useState('');

  const isOpen = (name) => activeModal === name;

  const handlePitchSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const format = form.get('format');
    const html = buildDossierHtml(language);
    if (format === 'pdf') {
      let printHost;
      try {
        const { default: html2pdf } = await import('html2pdf.js');
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        printHost = document.createElement('div');
        printHost.setAttribute('aria-hidden', 'true');
        printHost.style.position = 'fixed';
        printHost.style.left = '-10000px';
        printHost.style.top = '0';
        printHost.style.width = '794px';
        printHost.style.background = '#ffffff';
        printHost.style.color = '#111827';
        printHost.innerHTML = `${parsed.head.innerHTML}${parsed.body.innerHTML}`;
        document.body.appendChild(printHost);
        
        const container = printHost.querySelector('.dossier-page');
        await html2pdf()
          .from(container)
          .set({
            filename: language === 'es' || language === 'pt' ? 'Dossier_AgeFriendSeal.pdf' : 'Dossier_AgeFriendSeal_EN.pdf',
            margin: 0,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,
              backgroundColor: '#ffffff',
              useCORS: true
            },
            jsPDF: {
              unit: 'pt',
              format: 'a4',
              orientation: 'portrait'
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          })
          .save();
      } catch {
        downloadTextFile(html, language === 'es' || language === 'pt' ? 'Dossier_AgeFriendSeal.html' : 'Dossier_AgeFriendSeal_EN.html', 'text/html;charset=utf-8');
      } finally {
        printHost?.remove();
      }
    } else {
      downloadTextFile(html, language === 'es' || language === 'pt' ? 'Dossier_AgeFriendSeal.html' : 'Dossier_AgeFriendSeal_EN.html', 'text/html;charset=utf-8');
    }
    onClose();
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    alert(language === 'es' ? 'Solicitud enviada con exito para la demo.' : (language === 'pt' ? 'Solicitação enviada com sucesso para a demonstração.' : 'Request sent successfully for the demo.'));
    onClose();
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (authView === 'login') {
      onUserChange({
        type: 'personal',
        name: form.get('email') || 'Demo User',
        email: form.get('email') || 'demo@example.com',
        country: '',
        sector: '',
        subsector: '',
        role: ''
      });
    } else {
      const type = form.get('type');
      onUserChange({
        type,
        name: form.get('name'),
        email: form.get('email'),
        username: form.get('username'),
        country: form.get('country') || '',
        sector: form.get('sector') || '',
        subsector: form.get('subsector') || '',
        role: form.get('role') || ''
      });
    }
    onClose();
    onOpenAccount();
  };

  const handleUpgrade = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onUserChange({
      ...currentUser,
      type: 'empresa',
      sector: form.get('sector'),
      subsector: form.get('subsector'),
      role: form.get('role')
    });
    alert(language === 'es' ? 'Cuenta actualizada a empresa.' : (language === 'pt' ? 'Conta atualizada para empresa.' : 'Account upgraded to company.'));
  };

  const handlePayment = () => {
    const companyName = currentUser?.name || (language === 'es' ? 'Su Empresa' : (language === 'pt' ? 'Sua Empresa' : 'Your Company'));
    const svg = generateDecalSvg(companyName, language);
    downloadTextFile(svg, `Calcomania_Vitrina_AgeFriendSeal_${companyName.replace(/[^a-z0-9]/gi, '_')}.svg`, 'image/svg+xml;charset=utf-8');
    onClose();
  };

  return (
    <div>
      <div className={`modal-overlay ${isOpen('pitch') ? '' : 'hidden'}`} id="pitch-modal">
        <div className="glass-card modal-content text-center" style={{ maxWidth: 500 }}>
          <button className="modal-close" id="btn-pitch-modal-close" onClick={onClose}><FormattedMessage id="Modals.001" /></button>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}><FormattedMessage id="Modals.002" /></div>
          <h3><FormattedMessage id="Modals.003" /></h3>
          <p><FormattedMessage id="Modals.004" /></p>
          <form id="pitch-form" className="modal-form" style={{ textAlign: 'left', marginTop: 24 }} onSubmit={handlePitchSubmit}>
            <div className="form-group">
              <label htmlFor="pitch-name"><FormattedMessage id="Modals.005" /></label>
              <input type="text" id="pitch-name" name="name" required defaultValue={currentUser?.name || ''} placeholder={intl.formatMessage({ id: "Modals.006" })} />
            </div>
            <div className="form-group">
              <label htmlFor="pitch-phone"><FormattedMessage id="Modals.007" /></label>
              <input type="tel" id="pitch-phone" name="phone" required placeholder={intl.formatMessage({ id: "Modals.008" })} />
            </div>
            <div className="form-group">
              <label htmlFor="pitch-corp-email"><FormattedMessage id="Modals.009" /></label>
              <input type="email" id="pitch-corp-email" name="email" required defaultValue={currentUser?.email || ''} placeholder={intl.formatMessage({ id: "Modals.010" })} />
            </div>
            <div className="form-group">
              <label htmlFor="pitch-format"><FormattedMessage id="Modals.011" /></label>
              <select id="pitch-format" name="format" style={selectStyle}>
                <option value="pdf"><FormattedMessage id="Modals.012" /></option>
                <option value="html"><FormattedMessage id="Modals.013" /></option>
              </select>
            </div>
            <button type="submit" className="btn btn-gradient btn-block" style={{ marginTop: 12 }}><FormattedMessage id="Modals.014" /></button>
          </form>
        </div>
      </div>

      <div className={`modal-overlay ${isOpen('contact') ? '' : 'hidden'}`} id="contact-modal">
        <div className="glass-card modal-content">
          <button className="modal-close" id="btn-modal-close" onClick={onClose}><FormattedMessage id="Modals.015" /></button>
          <div className="modal-header">
            <h3 id="modal-title">
              {contactLevel === 'gold'
                ? (language === 'es' ? 'Solicitar auditoria Premium' : (language === 'pt' ? 'Solicitar auditoria Premium' : 'Request Premium Audit'))
                : <FormattedMessage id="Modals.016" />}
            </h3>
            <p id="modal-subtitle"><FormattedMessage id="Modals.017" /></p>
          </div>
          <form id="contact-form" className="modal-form" onSubmit={handleContactSubmit}>
            <div className="form-group">
              <label htmlFor="comp-name"><FormattedMessage id="Modals.018" /></label>
              <input type="text" id="comp-name" required placeholder={intl.formatMessage({ id: "Modals.019" })} />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email"><FormattedMessage id="Modals.020" /></label>
              <input type="email" id="contact-email" required placeholder={intl.formatMessage({ id: "Modals.021" })} />
            </div>
            <div className="form-group">
              <label htmlFor="contact-phone"><FormattedMessage id="Modals.022" /></label>
              <input type="tel" id="contact-phone" required placeholder={intl.formatMessage({ id: "Modals.023" })} />
            </div>
            <button type="submit" className="btn btn-primary btn-block"><FormattedMessage id="Modals.024" /></button>
          </form>
        </div>
      </div>

      <div className={`modal-overlay ${isOpen('payment') ? '' : 'hidden'}`} id="payment-modal">
        <div className="glass-card modal-content text-center">
          <button className="modal-close" id="btn-pay-modal-close" onClick={onClose}><FormattedMessage id="Modals.025" /></button>
          <div className="payment-icon"><FormattedMessage id="Modals.026" /></div>
          <h3><FormattedMessage id="Modals.027" /></h3>
          <p><FormattedMessage id="Modals.028" /></p>
          <div className="payment-amount"><FormattedMessage id="Modals.036" /> <strong><FormattedMessage id="Modals.037" /></strong></div>
          <button className="btn btn-gradient btn-block" id="btn-pay-submit" onClick={handlePayment}><FormattedMessage id="Modals.038" /></button>
          <p className="payment-security-text"><FormattedMessage id="Modals.039" /></p>
        </div>
      </div>

      <div className={`modal-overlay ${isOpen('auth') ? '' : 'hidden'}`} id="auth-modal">
        <div className="glass-card modal-content text-center" style={{ maxWidth: 500 }}>
          <button className="modal-close" id="btn-auth-modal-close" onClick={onClose}><FormattedMessage id="Modals.040" /></button>
          <div className="auth-tabs">
            <button className={`auth-tab-btn ${authView === 'login' ? 'active' : ''}`} id="tab-login" onClick={() => setAuthView('login')}><FormattedMessage id="Modals.041" /></button>
            <button className={`auth-tab-btn ${authView === 'register' ? 'active' : ''}`} id="tab-register" onClick={() => setAuthView('register')}><FormattedMessage id="Modals.042" /></button>
          </div>

          {authView === 'login' ? (
            <form id="form-login" className="modal-form" style={{ textAlign: 'left', marginTop: 20 }} onSubmit={handleAuthSubmit}>
              <div className="form-group">
                <label htmlFor="login-email"><FormattedMessage id="Modals.043" /></label>
                <input type="text" id="login-email" name="email" required placeholder={intl.formatMessage({ id: "Modals.044" })} />
              </div>
              <div className="form-group">
                <label htmlFor="login-password"><FormattedMessage id="Modals.045" /></label>
                <input type="password" id="login-password" required placeholder={intl.formatMessage({ id: "Modals.046" })} />
              </div>
              <button type="submit" className="btn btn-gradient btn-block" style={{ marginTop: 12 }}><FormattedMessage id="Modals.047" /></button>
            </form>
          ) : (
            <form id="form-register" className="modal-form" style={{ textAlign: 'left', marginTop: 20 }} onSubmit={handleAuthSubmit}>
              <div className="form-group">
                <label htmlFor="auth-reg-user-type"><FormattedMessage id="Modals.048" /></label>
                <select id="auth-reg-user-type" name="type" required value={registerType} onChange={(event) => setRegisterType(event.target.value)}>
                  <option value="personal"><FormattedMessage id="Modals.049" /></option>
                  <option value="empresa"><FormattedMessage id="Modals.050" /></option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="auth-reg-name"><FormattedMessage id="Modals.051" /></label>
                <input type="text" id="auth-reg-name" name="name" required placeholder={intl.formatMessage({ id: "Modals.052" })} />
              </div>
              <div className="form-group">
                <label htmlFor="auth-reg-email"><FormattedMessage id="Modals.053" /></label>
                <input type="email" id="auth-reg-email" name="email" required placeholder={intl.formatMessage({ id: "Modals.054" })} />
              </div>
              <div className="form-group">
                <label htmlFor="auth-reg-username"><FormattedMessage id="Modals.055" /></label>
                <input type="text" id="auth-reg-username" name="username" required placeholder={intl.formatMessage({ id: "Modals.056" })} />
              </div>
              <div className="form-group">
                <label htmlFor="auth-reg-password"><FormattedMessage id="Modals.057" /></label>
                <input type="password" id="auth-reg-password" required minLength={6} placeholder={intl.formatMessage({ id: "Modals.058" })} />
              </div>
              {registerType === 'personal' ? (
                <div className="form-group" id="field-personal-country">
                  <label htmlFor="auth-reg-country"><FormattedMessage id="Modals.059" /></label>
                  <input type="text" id="auth-reg-country" name="country" placeholder={intl.formatMessage({ id: "Modals.060" })} />
                </div>
              ) : (
                <CompanyFields prefix="auth-reg" intl={intl} language={language} />
              )}
              <button type="submit" className="btn btn-gradient btn-block" style={{ marginTop: 12 }}><FormattedMessage id="Modals.083" /></button>
            </form>
          )}
        </div>
      </div>

      <div className={`modal-overlay ${isOpen('account') ? '' : 'hidden'}`} id="account-modal">
        <div className="glass-card modal-content" style={{ maxWidth: 500 }}>
          <button className="modal-close" id="btn-account-modal-close" onClick={onClose}><FormattedMessage id="Modals.084" /></button>
          <div className="text-center" style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 8 }}><FormattedMessage id="Modals.085" /></div>
            <h3 id="account-title-name">{currentUser?.name || <FormattedMessage id="Modals.086" />}</h3>
            <span className="user-badge-type" id="account-user-badge">{currentUser?.type === 'empresa' ? 'Empresa' : <FormattedMessage id="Modals.087" />}</span>
          </div>
          <div className="account-details-list" style={{ textAlign: 'left', marginBottom: 24 }}>
            <div className="account-detail-item"><strong><FormattedMessage id="Modals.088" /></strong> <span id="account-detail-email">{currentUser?.email || '-'}</span></div>
            <div className="account-detail-item" id="detail-item-country"><strong><FormattedMessage id="Modals.090" /></strong> <span id="account-detail-country">{currentUser?.country || '-'}</span></div>
            <div className="account-detail-item" id="detail-item-sector"><strong><FormattedMessage id="Modals.092" /></strong> <span id="account-detail-sector">{currentUser?.sector || '-'}</span></div>
            <div className="account-detail-item" id="detail-item-subsector"><strong><FormattedMessage id="Modals.094" /></strong> <span id="account-detail-subsector">{currentUser?.subsector || '-'}</span></div>
            <div className="account-detail-item" id="detail-item-role"><strong><FormattedMessage id="Modals.096" /></strong> <span id="account-detail-role">{currentUser?.role || '-'}</span></div>
          </div>

          {currentUser?.type !== 'empresa' && (
            <div id="upgrade-section" style={{ borderTop: '1px dashed var(--border-color)', paddingTop: 20, textAlign: 'left' }}>
              <h4 style={{ color: 'var(--accent-blue)', marginBottom: 8 }}><FormattedMessage id="Modals.098" /></h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}><FormattedMessage id="Modals.099" /></p>
              <form id="form-upgrade" className="modal-form" onSubmit={handleUpgrade}>
                <div className="form-group">
                  <label htmlFor="upg-sector-type"><FormattedMessage id="Modals.100" /></label>
                  <select id="upg-sector-type" name="sector" required value={upgradeSector} onChange={(event) => setUpgradeSector(event.target.value)}>
                    <option value=""><FormattedMessage id="Modals.101" /></option>
                    <option value="privado"><FormattedMessage id="Modals.102" /></option>
                    <option value="publico"><FormattedMessage id="Modals.103" /></option>
                  </select>
                </div>
                {upgradeSector && (
                  <div className="form-group">
                    <label htmlFor="upg-subsector">{upgradeSector === 'publico' ? <FormattedMessage id="Modals.104" /> : <FormattedMessage id="Modals.109" />}</label>
                    <input id="upg-subsector" name="subsector" required />
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="upg-role"><FormattedMessage id="Modals.120" /></label>
                  <input type="text" id="upg-role" name="role" required placeholder={intl.formatMessage({ id: "Modals.121" })} />
                </div>
                <button type="submit" className="btn btn-gradient btn-block"><FormattedMessage id="Modals.122" /></button>
              </form>
            </div>
          )}

          <button className="btn btn-outline btn-block" id="btn-auth-logout" style={{ marginTop: 16 }} onClick={() => { onUserChange(null); onClose(); }}>
            <FormattedMessage id="Modals.123" />
          </button>
        </div>
      </div>

      <div className={`modal-overlay ${isOpen('auth-alert') ? '' : 'hidden'}`} id="auth-alert-modal">
        <div className="glass-card modal-content text-center" style={{ maxWidth: 480 }}>
          <button className="modal-close" id="btn-auth-alert-close" onClick={onClose}><FormattedMessage id="Modals.124" /></button>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}><FormattedMessage id="Modals.125" /></div>
          <h3><FormattedMessage id="Modals.126" /></h3>
          <p id="auth-alert-text"><FormattedMessage id="Modals.127" /></p>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="btn btn-gradient btn-block" id="btn-auth-alert-upgrade" onClick={onOpenAccount}><FormattedMessage id="Modals.128" /></button>
            <button className="btn btn-outline btn-block" id="btn-auth-alert-login" onClick={onOpenAuth}><FormattedMessage id="Modals.129" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanyFields() {
  return (
    <>
      <div className="form-group" id="field-company-sector">
        <label htmlFor="auth-reg-sector">Sector</label>
        <input id="auth-reg-sector" name="sector" required />
      </div>
      <div className="form-group" id="field-private-vertical">
        <label htmlFor="auth-reg-subsector">Detalle del sector</label>
        <input id="auth-reg-subsector" name="subsector" required />
      </div>
      <div className="form-group" id="field-company-role">
        <label htmlFor="auth-reg-role">Cargo</label>
        <input type="text" id="auth-reg-role" name="role" required />
      </div>
    </>
  );
}

const selectStyle = {
  width: '100%',
  padding: 10,
  borderRadius: 8,
  background: 'rgba(15, 23, 42, 0.8)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem'
};

export default Modals;
