import "./AlliancesSection.scss";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

const items = [
  ["AlliancesSection.003", "AlliancesSection.004", "AlliancesSection.005"],
  ["AlliancesSection.006", "AlliancesSection.007", "AlliancesSection.008"],
  ["AlliancesSection.009", "AlliancesSection.010", "AlliancesSection.011"],
  ["AlliancesSection.012", "AlliancesSection.013", "AlliancesSection.014"]
];

function AlliancesSection({ onOpenPitch }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="alianzas" className="alianzas-section">
      <div className="container alianzas-container">
        <div className="section-title text-center">
          <h2><FormattedMessage id="AlliancesSection.001" /></h2>
          <p className="subtitle"><FormattedMessage id="AlliancesSection.002" /></p>
        </div>

        <div className="accordion-container" style={{ margin: '40px auto', textAlign: 'left' }}>
          {items.map(([iconId, titleId, bodyId], index) => {
            const isOpen = openIndex === index;
            return (
              <div className={`accordion-item ${isOpen ? 'active' : ''}`} key={titleId}>
                <button className="accordion-header" aria-expanded={isOpen} onClick={() => setOpenIndex(isOpen ? null : index)}>
                  <div className="accordion-title-wrap">
                    <div className="card-icon" style={{ width: 48, height: 48, fontSize: '1.5rem' }}>
                      <FormattedMessage id={iconId} />
                    </div>
                    <div className="accordion-title-text">
                      <h3 style={{ fontSize: '1.2rem', margin: 0 }}><FormattedMessage id={titleId} /></h3>
                    </div>
                  </div>
                  <span className="accordion-icon" />
                </button>
                <div className="accordion-content">
                  <div className="accordion-inner-content">
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}><FormattedMessage id={bodyId} /></p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 40 }}>
          <button className="btn btn-gradient btn-lg" id="btn-open-pitch" onClick={onOpenPitch}>
            <FormattedMessage id="AlliancesSection.015" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default AlliancesSection;
