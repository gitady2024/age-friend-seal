import "./NormativasSection.scss";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
function NormativasSection() {
  const intl = useIntl();
  const [openIndex, setOpenIndex] = useState(null);
  const toggleItem = (index) => setOpenIndex((current) => current === index ? null : index);
  return <>
<section id="normativas" className="normativas-section">
  <div className="container">
    <div className="section-title text-center">
      <h2><FormattedMessage id="NormativasSection.001" /></h2>
      <p className="subtitle"><FormattedMessage id="NormativasSection.002" /></p>
    </div>
    <div className="accordion-container">
      {/* Ítem 1 */}
      <div className={`accordion-item ${openIndex === 0 ? 'active' : ''}`}>
        <button className="accordion-header" aria-expanded={openIndex === 0} onClick={() => toggleItem(0)}>
          <div className="accordion-title-wrap">
            <div className="card-icon" style={{
                  width: 48,
                  height: 48,
                  fontSize: '1.5rem'
                }}><FormattedMessage id="NormativasSection.003" /></div>
            <div className="accordion-title-text">
              <span className="normativa-badge badge-iso" style={{
                    marginBottom: 4
                  }}><FormattedMessage id="NormativasSection.004" /></span>
              <h3><FormattedMessage id="NormativasSection.005" /></h3>
            </div>
          </div>
          <span className="accordion-icon" />
        </button>
        <div className="accordion-content">
          <div className="accordion-inner-content">
            <p className="normativa-org"><FormattedMessage id="NormativasSection.006" /></p>
            <p className="normativa-text"><FormattedMessage id="NormativasSection.007" /></p>
            <ul className="normativa-bullet">
              <li><strong><FormattedMessage id="NormativasSection.008" /></strong> <FormattedMessage id="NormativasSection.009" /></li>
              <li><strong><FormattedMessage id="NormativasSection.010" /></strong> <FormattedMessage id="NormativasSection.011" /></li>
              <li><strong><FormattedMessage id="NormativasSection.012" /></strong> <FormattedMessage id="NormativasSection.013" /></li>
            </ul>
            <a href="https://www.iso.org/standard/76420.html" target="_blank" className="normativa-link"><FormattedMessage id="NormativasSection.014" /></a>
          </div>
        </div>
      </div>
      {/* Ítem 2 */}
      <div className={`accordion-item ${openIndex === 1 ? 'active' : ''}`}>
        <button className="accordion-header" aria-expanded={openIndex === 1} onClick={() => toggleItem(1)}>
          <div className="accordion-title-wrap">
            <div className="card-icon" style={{
                  width: 48,
                  height: 48,
                  fontSize: '1.5rem'
                }}><FormattedMessage id="NormativasSection.015" /></div>
            <div className="accordion-title-text">
              <span className="normativa-badge badge-iso" style={{
                    marginBottom: 4
                  }}><FormattedMessage id="NormativasSection.016" /></span>
              <h3><FormattedMessage id="NormativasSection.017" /></h3>
            </div>
          </div>
          <span className="accordion-icon" />
        </button>
        <div className="accordion-content">
          <div className="accordion-inner-content">
            <p className="normativa-org"><FormattedMessage id="NormativasSection.018" /></p>
            <p className="normativa-text"><FormattedMessage id="NormativasSection.019" /></p>
            <ul className="normativa-bullet">
              <li><strong><FormattedMessage id="NormativasSection.020" /></strong> <FormattedMessage id="NormativasSection.021" /></li>
              <li><strong><FormattedMessage id="NormativasSection.022" /></strong> <FormattedMessage id="NormativasSection.023" /></li>
              <li><strong><FormattedMessage id="NormativasSection.024" /></strong> <FormattedMessage id="NormativasSection.025" /></li>
            </ul>
            <a href="https://www.iso.org/standard/77288.html" target="_blank" className="normativa-link"><FormattedMessage id="NormativasSection.026" /></a>
          </div>
        </div>
      </div>
      {/* Ítem 3 */}
      <div className={`accordion-item ${openIndex === 2 ? 'active' : ''}`}>
        <button className="accordion-header" aria-expanded={openIndex === 2} onClick={() => toggleItem(2)}>
          <div className="accordion-title-wrap">
            <div className="card-icon" style={{
                  width: 48,
                  height: 48,
                  fontSize: '1.5rem'
                }}><FormattedMessage id="NormativasSection.027" /></div>
            <div className="accordion-title-text">
              <span className="normativa-badge badge-iso" style={{
                    marginBottom: 4
                  }}><FormattedMessage id="NormativasSection.028" /></span>
              <h3><FormattedMessage id="NormativasSection.029" /></h3>
            </div>
          </div>
          <span className="accordion-icon" />
        </button>
        <div className="accordion-content">
          <div className="accordion-inner-content">
            <p className="normativa-org"><FormattedMessage id="NormativasSection.030" /></p>
            <p className="normativa-text"><FormattedMessage id="NormativasSection.031" /></p>
            <ul className="normativa-bullet">
              <li><strong><FormattedMessage id="NormativasSection.032" /></strong> <FormattedMessage id="NormativasSection.033" /></li>
              <li><strong><FormattedMessage id="NormativasSection.034" /></strong> <FormattedMessage id="NormativasSection.035" /></li>
              <li><strong><FormattedMessage id="NormativasSection.036" /></strong> <FormattedMessage id="NormativasSection.037" /></li>
            </ul>
            <a href="https://www.iso.org/standard/84224.html" target="_blank" className="normativa-link"><FormattedMessage id="NormativasSection.038" /></a>
          </div>
        </div>
      </div>
      {/* Ítem 4 */}
      <div className={`accordion-item ${openIndex === 3 ? 'active' : ''}`}>
        <button className="accordion-header" aria-expanded={openIndex === 3} onClick={() => toggleItem(3)}>
          <div className="accordion-title-wrap">
            <div className="card-icon" style={{
                  width: 48,
                  height: 48,
                  fontSize: '1.5rem'
                }}><FormattedMessage id="NormativasSection.039" /></div>
            <div className="accordion-title-text">
              <span className="normativa-badge badge-oms" style={{
                    marginBottom: 4
                  }}><FormattedMessage id="NormativasSection.040" /></span>
              <h3><FormattedMessage id="NormativasSection.041" /></h3>
            </div>
          </div>
          <span className="accordion-icon" />
        </button>
        <div className="accordion-content">
          <div className="accordion-inner-content">
            <p className="normativa-org"><FormattedMessage id="NormativasSection.042" /></p>
            <p className="normativa-text"><FormattedMessage id="NormativasSection.043" /></p>
            <ul className="normativa-bullet">
              <li><FormattedMessage id="NormativasSection.044" /></li>
              <li><FormattedMessage id="NormativasSection.045" /></li>
              <li><FormattedMessage id="NormativasSection.046" /></li>
            </ul>
            <a href="https://extranet.who.int/agefriendlyworld/" target="_blank" className="normativa-link"><FormattedMessage id="NormativasSection.047" /></a>
          </div>
        </div>
      </div>
      {/* Ítem 5 */}
      <div className={`accordion-item ${openIndex === 4 ? 'active' : ''}`}>
        <button className="accordion-header" aria-expanded={openIndex === 4} onClick={() => toggleItem(4)}>
          <div className="accordion-title-wrap">
            <div className="card-icon" style={{
                  width: 48,
                  height: 48,
                  fontSize: '1.5rem'
                }}><FormattedMessage id="NormativasSection.048" /></div>
            <div className="accordion-title-text">
              <span className="normativa-badge badge-bid" style={{
                    marginBottom: 4
                  }}><FormattedMessage id="NormativasSection.049" /></span>
              <h3><FormattedMessage id="NormativasSection.050" /></h3>
            </div>
          </div>
          <span className="accordion-icon" />
        </button>
        <div className="accordion-content">
          <div className="accordion-inner-content">
            <p className="normativa-org"><FormattedMessage id="NormativasSection.051" /></p>
            <p className="normativa-text"><FormattedMessage id="NormativasSection.052" /></p>
            <ul className="normativa-bullet">
              <li><FormattedMessage id="NormativasSection.053" /></li>
              <li><FormattedMessage id="NormativasSection.054" /></li>
              <li><FormattedMessage id="NormativasSection.055" /></li>
            </ul>
            <a href="https://www.ilo.org/dyn/normlex/es/f?p=NORMLEXPUB:12100:0::NO::P12100_ILO_CODE:R162" target="_blank" className="normativa-link"><FormattedMessage id="NormativasSection.056" /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{/* Matriz de Rigor Técnico Comparativo */}

    </>;
}
export default NormativasSection;
