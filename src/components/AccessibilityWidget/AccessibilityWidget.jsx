import "./AccessibilityWidget.scss";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

function AccessibilityWidget() {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem('font-size-percent')) || 100);
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('high-contrast') === 'true');

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('font-size-percent', String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
    localStorage.setItem('high-contrast', String(highContrast));
  }, [highContrast]);

  return (
    <div className="a11y-widget" id="a11y-widget">
      <button className="a11y-toggle" id="a11y-toggle" aria-label={intl.formatMessage({ id: "AccessibilityWidget.001" })} onClick={() => setOpen((value) => !value)}>
        <svg viewBox="0 0 24 24" width={24} height={24} stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx={12} cy={12} r={10} />
          <circle cx={12} cy={10} r={3} />
          <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
        </svg>
      </button>
      <div className={`a11y-panel ${open ? '' : 'hidden'}`} id="a11y-panel">
        <div className="a11y-header">
          <h4><FormattedMessage id="AccessibilityWidget.002" /></h4>
          <button id="a11y-close" onClick={() => setOpen(false)}><FormattedMessage id="AccessibilityWidget.003" /></button>
        </div>
        <div className="a11y-options">
          <div className="a11y-option">
            <span><FormattedMessage id="AccessibilityWidget.004" /></span>
            <div className="a11y-controls">
              <button id="btn-text-decrease" onClick={() => setFontSize((value) => Math.max(80, value - 10))}><FormattedMessage id="AccessibilityWidget.005" /></button>
              <button id="btn-text-reset" onClick={() => setFontSize(100)}><FormattedMessage id="AccessibilityWidget.006" /></button>
              <button id="btn-text-increase" onClick={() => setFontSize((value) => Math.min(140, value + 10))}><FormattedMessage id="AccessibilityWidget.007" /></button>
            </div>
          </div>
          <div className="a11y-option">
            <span><FormattedMessage id="AccessibilityWidget.008" /></span>
            <label className="a11y-switch">
              <input type="checkbox" id="toggle-contrast" checked={highContrast} onChange={(event) => setHighContrast(event.target.checked)} />
              <span className="a11y-slider" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessibilityWidget;
