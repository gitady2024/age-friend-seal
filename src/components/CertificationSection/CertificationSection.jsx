import "./CertificationSection.scss";
import { FormattedMessage } from "react-intl";

function CertificationSection({ onRequestCertification }) {
  return (
    <section id="escalera" className="escalera-section">
      <div className="container">
        <div className="section-title text-center">
          <h2><FormattedMessage id="CertificationSection.001" /></h2>
          <p className="subtitle"><FormattedMessage id="CertificationSection.002" /></p>
        </div>
        <div className="escalera-grid">
          <div className="escalera-card level-bronze">
            <div className="level-badge"><FormattedMessage id="CertificationSection.003" /></div>
            <h3><FormattedMessage id="CertificationSection.004" /></h3>
            <a href="#autodiagnostico" className="price" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <FormattedMessage id="CertificationSection.005" />
            </a>
            <p className="card-desc"><FormattedMessage id="CertificationSection.006" /></p>
            <ul className="features-list">
              <li><FormattedMessage id="CertificationSection.007" /></li>
              <li><FormattedMessage id="CertificationSection.008" /></li>
              <li><FormattedMessage id="CertificationSection.009" /></li>
              <li><FormattedMessage id="CertificationSection.010" /></li>
            </ul>
            <a href="#autodiagnostico" className="btn btn-outline btn-block"><FormattedMessage id="CertificationSection.011" /></a>
          </div>

          <div className="escalera-card level-silver popular">
            <div className="level-badge"><FormattedMessage id="CertificationSection.012" /></div>
            <h3><FormattedMessage id="CertificationSection.013" /></h3>
            <div className="price"><FormattedMessage id="CertificationSection.014" /></div>
            <p className="card-desc"><FormattedMessage id="CertificationSection.015" /></p>
            <ul className="features-list">
              <li><FormattedMessage id="CertificationSection.016" /></li>
              <li><FormattedMessage id="CertificationSection.017" /></li>
              <li><FormattedMessage id="CertificationSection.018" /></li>
              <li><FormattedMessage id="CertificationSection.019" /></li>
            </ul>
            <button type="button" className="btn btn-primary btn-block" id="btn-request-silver" onClick={() => onRequestCertification('silver')}>
              <FormattedMessage id="CertificationSection.020" />
            </button>
          </div>

          <div className="escalera-card level-gold">
            <div className="level-badge"><FormattedMessage id="CertificationSection.021" /></div>
            <h3><FormattedMessage id="CertificationSection.022" /></h3>
            <div className="price"><FormattedMessage id="CertificationSection.023" /></div>
            <p className="card-desc"><FormattedMessage id="CertificationSection.024" /></p>
            <ul className="features-list">
              <li><FormattedMessage id="CertificationSection.025" /></li>
              <li><FormattedMessage id="CertificationSection.026" /></li>
              <li><FormattedMessage id="CertificationSection.027" /></li>
              <li><FormattedMessage id="CertificationSection.028" /></li>
            </ul>
            <button type="button" className="btn btn-outline btn-block" id="btn-request-gold" onClick={() => onRequestCertification('gold')}>
              <FormattedMessage id="CertificationSection.029" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CertificationSection;
