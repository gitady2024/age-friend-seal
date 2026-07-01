import React from "react";
import "./SVGMatrix.scss";

function SVGMatrix({ 
  logoUrl = null, 
  hexPrimary = "#3b82f6", 
  hexSecondary = "#10b981", 
  text = "Age Friend Seal • Compromiso Inicial", 
  size = 300 
}) {
  const gradientId = `badge-grad-${hexPrimary.replace("#", "")}-${hexSecondary.replace("#", "")}`;
  const clipPathId = `logo-clip-${hexPrimary.replace("#", "")}`;

  // If no logoUrl is provided, we show AFS letters or a default icon inside the badge
  const hasLogo = !!logoUrl;

  return (
    <div className="svg-matrix-container" style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 400 400" 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
        className="svg-matrix-badge"
      >
        <defs>
          {/* Degradado principal configurable */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hexPrimary} />
            <stop offset="100%" stopColor={hexSecondary} />
          </linearGradient>

          {/* Sombra interna para el logo */}
          <radialGradient id="inner-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="75%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
          </radialGradient>

          {/* Recorte circular para el logotipo */}
          <clipPath id={clipPathId}>
            <circle cx="200" cy="200" r="75" />
          </clipPath>

          {/* Camino invisible sobre el que se dibuja el texto curvo */}
          {/* Un arco superior desde las 9 (180°) hasta las 3 (0°) en sentido horario */}
          <path 
            id="text-curve" 
            d="M 72,200 A 128,128 0 1,1 328,200" 
            fill="none" 
          />
        </defs>

        {/* Círculo de fondo premium */}
        <circle cx="200" cy="200" r="190" fill="#0b0f19" />

        {/* Anillo exterior con el degradado de colores HEX corporativos */}
        <circle cx="200" cy="200" r="185" fill="none" stroke={`url(#${gradientId})`} strokeWidth="4" />
        <circle cx="200" cy="200" r="179" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />

        {/* Banda interior oscura para el texto */}
        <circle cx="200" cy="200" r="135" fill="#111827" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />

        {/* Texto Curvo Automatizado */}
        <text className="badge-text" fill="url(#text-curve)">
          <textPath 
            href="#text-curve" 
            startOffset="50%" 
            textAnchor="middle" 
            fill="#ffffff"
            style={{ 
              fontFamily: "'Outfit', 'Inter', sans-serif", 
              fontSize: "19px", 
              fontWeight: "600",
              letterSpacing: "0.14em",
              textTransform: "uppercase"
            }}
          >
            {text}
          </textPath>
        </text>

        {/* Pequeños distintivos decorativos (estrellas) en el borde */}
        <g fill={`url(#${gradientId})`}>
          {/* Izquierda */}
          <circle cx="62" cy="200" r="3" />
          {/* Derecha */}
          <circle cx="338" cy="200" r="3" />
        </g>

        {/* Fondo del área central (Logotipo) */}
        <circle cx="200" cy="200" r="82" fill="#ffffff" stroke={`url(#${gradientId})`} strokeWidth="3" />

        {/* Imagen del Logotipo del Cliente o Logotipo por Defecto */}
        {hasLogo ? (
          <image 
            href={logoUrl} 
            x="120" 
            y="120" 
            width="160" 
            height="160" 
            clipPath={`url(#${clipPathId})`}
            preserveAspectRatio="xMidYMid meet"
          />
        ) : (
          <g transform="translate(145, 145)">
            {/* Monograma por defecto AFS en degradado elegante */}
            <circle cx="55" cy="55" r="45" fill="rgba(11, 15, 25, 0.05)" />
            <text 
              x="55" 
              y="63" 
              textAnchor="middle" 
              fill={`url(#${gradientId})`}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "36px",
                fontWeight: "900",
                letterSpacing: "-0.05em"
              }}
            >
              AFS
            </text>
          </g>
        )}

        {/* Superposición de sombra radial para integrar el logo */}
        <circle cx="200" cy="200" r="80" fill="url(#inner-shadow)" pointerEvents="none" />
      </svg>
    </div>
  );
}

export default SVGMatrix;
