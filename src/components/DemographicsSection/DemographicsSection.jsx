import "./DemographicsSection.scss";
import { FormattedMessage, useIntl } from "react-intl";
function DemographicsSection() {
  const intl = useIntl();
  return <>
<section id="demografia" className="demographic-section">
  <div className="container">
    <div className="glass-card demographic-card" style={{
          marginTop: 0
        }}>
      <h3 className="text-center" style={{
            color: 'var(--text-primary)',
            marginBottom: 8
          }}><FormattedMessage id="DemographicsSection.001" /></h3>
      <p className="text-center subtitle" style={{
            maxWidth: 650,
            margin: '0 auto 24px auto'
          }}><FormattedMessage id="DemographicsSection.002" /></p>
      <div className="demographic-grid">
        <div className="demographic-col">
          <h4><FormattedMessage id="DemographicsSection.003" /></h4>
          <p><FormattedMessage id="DemographicsSection.004" /></p>
        </div>
        <div className="demographic-col">
          <h4><FormattedMessage id="DemographicsSection.005" /></h4>
          <p><FormattedMessage id="DemographicsSection.006" /></p>
        </div>
      </div>
      <p className="demographic-footer-note"><FormattedMessage id="DemographicsSection.007" /></p>
    </div>
  </div>
</section>
{/* Datos Oportunidad */}

    </>;
}
export default DemographicsSection;
