import "./OpportunitySection.scss";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

function formatCurrency(value) {
  return `$${new Intl.NumberFormat('en-US').format(value)}`;
}

function OpportunitySection() {
  const [employees, setEmployees] = useState(250);
  const [salary, setSalary] = useState(25000);
  const [revenue, setRevenue] = useState(5000000);

  const roi = useMemo(() => {
    const turnoverSavings = Math.round((employees * 0.04) * (salary * 0.5));
    const productivityGains = Math.round(revenue * 0.011);
    return {
      turnoverSavings,
      productivityGains,
      totalImpact: turnoverSavings + productivityGains
    };
  }, [employees, salary, revenue]);

  return (
    <section id="oportunidad" className="stats-section">
      <div className="container">
        <div className="section-title text-center">
          <h2><FormattedMessage id="OpportunitySection.001" /></h2>
          <p className="subtitle"><FormattedMessage id="OpportunitySection.002" /></p>
        </div>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-number"><FormattedMessage id="OpportunitySection.003" /></div>
            <h4><FormattedMessage id="OpportunitySection.004" /></h4>
            <p><FormattedMessage id="OpportunitySection.005" /></p>
          </div>
          <div className="stat-box">
            <div className="stat-number"><FormattedMessage id="OpportunitySection.006" /></div>
            <h4><FormattedMessage id="OpportunitySection.007" /></h4>
            <p><FormattedMessage id="OpportunitySection.008" /></p>
          </div>
          <div className="stat-box">
            <div className="stat-number"><FormattedMessage id="OpportunitySection.009" /></div>
            <h4><FormattedMessage id="OpportunitySection.010" /></h4>
            <p><FormattedMessage id="OpportunitySection.011" /></p>
          </div>
        </div>

        <div className="glass-card roi-simulator-card" style={{ marginTop: 40 }}>
          <div className="roi-header text-center">
            <span className="register-badge" style={{ marginBottom: 8 }}><FormattedMessage id="OpportunitySection.012" /></span>
            <h3 style={{ color: 'var(--text-primary)' }}><FormattedMessage id="OpportunitySection.013" /></h3>
            <p className="subtitle" style={{ marginBottom: 24, fontSize: '1rem' }}><FormattedMessage id="OpportunitySection.014" /></p>
          </div>
          <div className="roi-grid">
            <div className="roi-controls">
              <div className="form-group roi-slider-group">
                <div className="roi-slider-header">
                  <label htmlFor="roi-employees"><FormattedMessage id="OpportunitySection.015" /></label>
                  <span className="roi-value-display" id="val-employees">{new Intl.NumberFormat('en-US').format(employees)}</span>
                </div>
                <input type="range" id="roi-employees" className="custom-slider" min={10} max={5000} step={10} value={employees} onChange={(event) => setEmployees(Number(event.target.value))} />
              </div>
              <div className="form-group roi-slider-group">
                <div className="roi-slider-header">
                  <label htmlFor="roi-salary"><FormattedMessage id="OpportunitySection.017" /></label>
                  <span className="roi-value-display" id="val-salary">{formatCurrency(salary)}</span>
                </div>
                <input type="range" id="roi-salary" className="custom-slider" min={5000} max={150000} step={1000} value={salary} onChange={(event) => setSalary(Number(event.target.value))} />
              </div>
              <div className="form-group roi-slider-group">
                <div className="roi-slider-header">
                  <label htmlFor="roi-revenue"><FormattedMessage id="OpportunitySection.019" /></label>
                  <span className="roi-value-display" id="val-revenue">{formatCurrency(revenue)}</span>
                </div>
                <input type="range" id="roi-revenue" className="custom-slider" min={100000} max={50000000} step={100000} value={revenue} onChange={(event) => setRevenue(Number(event.target.value))} />
              </div>
            </div>

            <div className="roi-results-board">
              <div className="roi-result-item">
                <div className="roi-result-icon"><FormattedMessage id="OpportunitySection.021" /></div>
                <div className="roi-result-text">
                  <h5><FormattedMessage id="OpportunitySection.022" /></h5>
                  <p><FormattedMessage id="OpportunitySection.023" /></p>
                </div>
                <div className="roi-result-number text-success" id="res-turnover">+{formatCurrency(roi.turnoverSavings)}</div>
              </div>
              <div className="roi-result-item">
                <div className="roi-result-icon"><FormattedMessage id="OpportunitySection.025" /></div>
                <div className="roi-result-text">
                  <h5><FormattedMessage id="OpportunitySection.026" /></h5>
                  <p><FormattedMessage id="OpportunitySection.027" /></p>
                </div>
                <div className="roi-result-number text-success" id="res-productivity">+{formatCurrency(roi.productivityGains)}</div>
              </div>
              <div className="roi-total-divider" />
              <div className="roi-result-item total">
                <div className="roi-result-text">
                  <h4><FormattedMessage id="OpportunitySection.029" /></h4>
                </div>
                <div className="roi-result-number total-glow" id="res-total">+{formatCurrency(roi.totalImpact)}</div>
              </div>
              <a href="#escalera" className="btn btn-gradient btn-block" style={{ marginTop: 16 }}><FormattedMessage id="OpportunitySection.031" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OpportunitySection;
