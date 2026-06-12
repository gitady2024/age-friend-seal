import "./Hero.scss";
import { FormattedMessage, useIntl } from "react-intl";
function Hero() {
  const intl = useIntl();
  return <>
<section className="hero">
  <div className="container hero-container">
    <div className="hero-content">
      <div className="badge-silver-economy"><FormattedMessage id="Hero.001" /></div>
      <h1><FormattedMessage id="Hero.002" /></h1>
      <p><FormattedMessage id="Hero.003" /></p>
      <div className="hero-actions">
        <a href="#autodiagnostico" className="btn btn-lg btn-gradient" id="btn-hero-start"><FormattedMessage id="Hero.004" /></a>
        <a href="#escalera" className="btn btn-lg btn-outline"><FormattedMessage id="Hero.005" /></a>
      </div>
    </div>
    <div className="hero-visual">
      <div className="glass-card hero-stats-card">
        <div className="card-icon"><FormattedMessage id="Hero.006" /></div>
        <div className="stats-info">
          <h3><FormattedMessage id="Hero.007" /></h3>
          <p><FormattedMessage id="Hero.008" /></p>
        </div>
      </div>
      <div className="glass-card hero-stats-card">
        <div className="card-icon"><FormattedMessage id="Hero.009" /></div>
        <div className="stats-info">
          <h3><FormattedMessage id="Hero.010" /></h3>
          <p><FormattedMessage id="Hero.011" /></p>
        </div>
      </div>
    </div>
  </div>
</section>
{/* Análisis Natalidad vs Longevidad */}

    </>;
}
export default Hero;
