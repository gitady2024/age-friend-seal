import { useState } from "react";
import "./ComparisonSection.scss";
import { FormattedMessage, useIntl } from "react-intl";

function ComparisonSection() {
  const intl = useIntl();
  const [activeMobileTab, setActiveMobileTab] = useState("seal"); // 'seal' | 'senior' | 'local'

  const comparisonData = [
    {
      labelId: "ComparisonSection.010",
      descId: "ComparisonSection.011",
      senior: { iconId: "ComparisonSection.012", textId: "ComparisonSection.013", type: "success" },
      local: { iconId: "ComparisonSection.014", textId: "ComparisonSection.015", type: "danger" },
      seal: { iconId: "ComparisonSection.016", textId: "ComparisonSection.017", type: "success" }
    },
    {
      labelId: "ComparisonSection.018",
      descId: "ComparisonSection.019",
      senior: { iconId: "ComparisonSection.020", textId: "ComparisonSection.021", type: "danger" },
      local: { iconId: "ComparisonSection.022", textId: "ComparisonSection.023", type: "success" },
      seal: { iconId: "ComparisonSection.024", textId: "ComparisonSection.025", type: "success" }
    },
    {
      labelId: "ComparisonSection.026",
      descId: "ComparisonSection.027",
      senior: { iconId: "ComparisonSection.028", textId: "ComparisonSection.029", type: "danger" },
      local: { iconId: "ComparisonSection.030", textId: "ComparisonSection.031", type: "warning" },
      seal: { iconId: "ComparisonSection.032", textId: "ComparisonSection.033", type: "success" }
    },
    {
      labelId: "ComparisonSection.034",
      descId: "ComparisonSection.035",
      senior: { iconId: "ComparisonSection.036", textId: "ComparisonSection.037", type: "danger" },
      local: { iconId: "ComparisonSection.038", textId: "ComparisonSection.039", type: "danger" },
      seal: { iconId: "ComparisonSection.040", textId: "ComparisonSection.041", type: "success" }
    },
    {
      labelId: "ComparisonSection.042",
      descId: "ComparisonSection.043",
      senior: { iconId: "ComparisonSection.044", textId: "ComparisonSection.045", type: "warning" },
      local: { iconId: "ComparisonSection.046", textId: "ComparisonSection.047", type: "success" },
      seal: { iconId: "ComparisonSection.048", textId: "ComparisonSection.049", type: "success" }
    }
  ];

  return (
    <>
      <section id="comparativa" className="comparativa-section">
        <div className="container">
          <div className="section-title text-center">
            <h2><FormattedMessage id="ComparisonSection.001" /></h2>
            <p className="subtitle"><FormattedMessage id="ComparisonSection.002" /></p>
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="glass-card comparativa-container desktop-only-view">
            <div className="table-responsive">
              <table className="comparativa-table">
                <thead>
                  <tr>
                    <th><FormattedMessage id="ComparisonSection.003" /></th>
                    <th>
                      <FormattedMessage id="ComparisonSection.004" /> <br />
                      <small><FormattedMessage id="ComparisonSection.005" /></small>
                    </th>
                    <th>
                      <FormattedMessage id="ComparisonSection.006" /> <br />
                      <small><FormattedMessage id="ComparisonSection.007" /></small>
                    </th>
                    <th className="highlight-column">
                      <FormattedMessage id="ComparisonSection.008" /> <br />
                      <small><FormattedMessage id="ComparisonSection.009" /></small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="td-label">
                        <strong><FormattedMessage id={row.labelId} /></strong><br />
                        <small><FormattedMessage id={row.descId} /></small>
                      </td>
                      <td className={`text-center ${row.senior.type}-check`}>
                        <span className="icon-wrap"><FormattedMessage id={row.senior.iconId} /></span>
                        <span className="table-text"><FormattedMessage id={row.senior.textId} /></span>
                      </td>
                      <td className={`text-center ${row.local.type}-check`}>
                        <span className="icon-wrap"><FormattedMessage id={row.local.iconId} /></span>
                        <span className="table-text"><FormattedMessage id={row.local.textId} /></span>
                      </td>
                      <td className={`text-center ${row.seal.type}-check highlight-column`}>
                        <span className="icon-wrap"><FormattedMessage id={row.seal.iconId} /></span>
                        <span className="table-text"><FormattedMessage id={row.seal.textId} /></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE TABS & CARDS VIEW */}
          <div className="mobile-only-view">
            <div className="comparativa-mobile-tabs">
              <button 
                type="button"
                className={`mobile-tab-btn seal-tab ${activeMobileTab === 'seal' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveMobileTab('seal'); }}
              >
                <FormattedMessage id="ComparisonSection.008" />
              </button>
              <button 
                type="button"
                className={`mobile-tab-btn senior-tab ${activeMobileTab === 'senior' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveMobileTab('senior'); }}
              >
                <FormattedMessage id="ComparisonSection.004" />
              </button>
              <button 
                type="button"
                className={`mobile-tab-btn local-tab ${activeMobileTab === 'local' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveMobileTab('local'); }}
              >
                <FormattedMessage id="ComparisonSection.006" />
              </button>
            </div>

            <div className="comparativa-mobile-cards">
              {comparisonData.map((row, idx) => {
                const cell = row[activeMobileTab];
                return (
                  <div 
                    key={idx} 
                    className={`mobile-comp-card ${activeMobileTab === 'seal' ? 'highlight-card' : ''}`}
                  >
                    <div className="card-header-row">
                      <h4 className="dimension-title">
                        <FormattedMessage id={row.labelId} />
                      </h4>
                      <span className={`status-badge ${cell.type}`}>
                        <span className="badge-icon"><FormattedMessage id={cell.iconId} /></span>
                        <span className="badge-text"><FormattedMessage id={cell.textId} /></span>
                      </span>
                    </div>
                    <p className="dimension-description">
                      <FormattedMessage id={row.descId} />
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default ComparisonSection;
