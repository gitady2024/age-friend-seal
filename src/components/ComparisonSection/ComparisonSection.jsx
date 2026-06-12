import "./ComparisonSection.scss";
import { FormattedMessage, useIntl } from "react-intl";
function ComparisonSection() {
  const intl = useIntl();
  return <>
<section id="comparativa" className="comparativa-section">
  <div className="container">
    <div className="section-title text-center">
      <h2><FormattedMessage id="ComparisonSection.001" /></h2>
      <p className="subtitle"><FormattedMessage id="ComparisonSection.002" /></p>
    </div>
    <div className="glass-card comparativa-container">
      <div className="table-responsive">
        <table className="comparativa-table">
          <thead>
            <tr>
              <th><FormattedMessage id="ComparisonSection.003" /></th>
              <th><FormattedMessage id="ComparisonSection.004" /> <br /><small><FormattedMessage id="ComparisonSection.005" /></small></th>
              <th><FormattedMessage id="ComparisonSection.006" /> <br /><small><FormattedMessage id="ComparisonSection.007" /></small></th>
              <th className="highlight-column"><FormattedMessage id="ComparisonSection.008" /> <br /><small><FormattedMessage id="ComparisonSection.009" /></small></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="td-label"><strong><FormattedMessage id="ComparisonSection.010" /></strong><br /><small><FormattedMessage id="ComparisonSection.011" /></small></td>
              <td className="text-center success-check"><FormattedMessage id="ComparisonSection.012" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.013" /></span></td>
              <td className="text-center danger-cross"><FormattedMessage id="ComparisonSection.014" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.015" /></span></td>
              <td className="text-center success-check highlight-column"><FormattedMessage id="ComparisonSection.016" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.017" /></span></td>
            </tr>
            <tr>
              <td className="td-label"><strong><FormattedMessage id="ComparisonSection.018" /></strong><br /><small><FormattedMessage id="ComparisonSection.019" /></small></td>
              <td className="text-center danger-cross"><FormattedMessage id="ComparisonSection.020" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.021" /></span></td>
              <td className="text-center success-check"><FormattedMessage id="ComparisonSection.022" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.023" /></span></td>
              <td className="text-center success-check highlight-column"><FormattedMessage id="ComparisonSection.024" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.025" /></span></td>
            </tr>
            <tr>
              <td className="td-label"><strong><FormattedMessage id="ComparisonSection.026" /></strong><br /><small><FormattedMessage id="ComparisonSection.027" /></small></td>
              <td className="text-center danger-cross"><FormattedMessage id="ComparisonSection.028" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.029" /></span></td>
              <td className="text-center warning-circle"><FormattedMessage id="ComparisonSection.030" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.031" /></span></td>
              <td className="text-center success-check highlight-column"><FormattedMessage id="ComparisonSection.032" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.033" /></span></td>
            </tr>
            <tr>
              <td className="td-label"><strong><FormattedMessage id="ComparisonSection.034" /></strong><br /><small><FormattedMessage id="ComparisonSection.035" /></small></td>
              <td className="text-center danger-cross"><FormattedMessage id="ComparisonSection.036" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.037" /></span></td>
              <td className="text-center danger-cross"><FormattedMessage id="ComparisonSection.038" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.039" /></span></td>
              <td className="text-center success-check highlight-column"><FormattedMessage id="ComparisonSection.040" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.041" /></span></td>
            </tr>
            <tr>
              <td className="td-label"><strong><FormattedMessage id="ComparisonSection.042" /></strong><br /><small><FormattedMessage id="ComparisonSection.043" /></small></td>
              <td className="text-center warning-circle"><FormattedMessage id="ComparisonSection.044" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.045" /></span></td>
              <td className="text-center success-check"><FormattedMessage id="ComparisonSection.046" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.047" /></span></td>
              <td className="text-center success-check highlight-column"><FormattedMessage id="ComparisonSection.048" /> <br /><span className="table-text"><FormattedMessage id="ComparisonSection.049" /></span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>
{/* Radar de Noticias RSS */}

    </>;
}
export default ComparisonSection;
