export function downloadTextFile(content, filename, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateDecalSvg(companyName, language = "es") {
  const name = escapeXml(companyName || (language === "es" ? "Su Empresa" : "Your Company"));
  const title = language === "es" ? "SOMOS AMIGABLES" : "WE ARE AGE-FRIENDLY";
  const subtitle = language === "es" ? "CON LA GENERACION PLATEADA" : "WITH THE SILVER GENERATION";
  const badge = language === "es" ? "COMPROMISO INICIAL" : "INITIAL COMMITMENT";
  const norms = language === "es" ? "Norma ISO 25550 / ISO 25551 / ISO 25556" : "ISO 25550 / ISO 25551 / ISO 25556 Standard";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fbbf24"/><stop offset="50%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#b45309"/></linearGradient>
  </defs>
  <rect x="10" y="10" width="380" height="380" rx="30" fill="url(#bgGrad)" stroke="url(#goldGrad)" stroke-width="8"/>
  <rect x="25" y="25" width="350" height="350" rx="20" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="8,6"/>
  <text x="200" y="75" fill="#fbbf24" font-family="Arial, sans-serif" font-weight="800" font-size="16" letter-spacing="3" text-anchor="middle">${title}</text>
  <text x="200" y="100" fill="#94a3b8" font-family="Arial, sans-serif" font-weight="600" font-size="10" letter-spacing="4" text-anchor="middle">${subtitle}</text>
  <line x1="120" y1="120" x2="280" y2="120" stroke="url(#goldGrad)" stroke-width="2"/>
  <text x="200" y="165" fill="#f8fafc" font-family="Arial, sans-serif" font-weight="700" font-size="22" text-anchor="middle">${name}</text>
  <rect x="90" y="190" width="220" height="35" rx="8" fill="rgba(251,191,36,0.1)" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="200" y="213" fill="#fbbf24" font-family="Arial, sans-serif" font-weight="800" font-size="13" letter-spacing="2" text-anchor="middle">${badge}</text>
  <circle cx="200" cy="275" r="30" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
  <path d="M 200 257 L 205 268 L 217 268 L 208 276 L 211 288 L 200 280 L 189 288 L 192 276 L 183 268 L 195 268 Z" fill="#fbbf24"/>
  <text x="200" y="335" fill="#ffffff" font-family="Arial, sans-serif" font-weight="800" font-size="18" letter-spacing="1" text-anchor="middle">Age Friend Seal</text>
  <text x="200" y="360" fill="#94a3b8" font-family="Arial, sans-serif" font-weight="500" font-size="10" text-anchor="middle">${norms}</text>
  <text x="200" y="375" fill="#fbbf24" font-family="Arial, sans-serif" font-weight="700" font-size="9" letter-spacing="1" text-anchor="middle">VALIDATED INTERNATIONALLY - 2026</text>
</svg>`;
}

export function buildDossierHtml(language = "es") {
  const isEs = language === "es";
  const content = isEs
    ? {
        title: "Dossier de Alianzas y Certificacion",
        subtitle: "Propuesta estrategica corporativa e institucional",
        date: "Emision: junio 2026",
        intro: "Age Friend Seal ayuda a empresas, comercios, instituciones y proveedores a convertir la economia plateada en una ventaja competitiva medible: mejor atencion, equipos multigeneracionales, canales accesibles y confianza publica.",
        sections: [
          {
            title: "1. La oportunidad estrategica",
            body: "La poblacion mayor de 50 anos concentra una porcion creciente del consumo, del conocimiento experto y de la toma de decisiones familiares. Las organizaciones que reducen barreras fisicas, digitales y culturales capturan lealtad, reducen friccion operativa y mejoran reputacion."
          },
          {
            title: "2. Fundamentos del sello",
            list: [
              "ISO 25550: gestion del talento senior, prevencion del edadismo laboral y equipos intergeneracionales.",
              "ISO 25551: apoyo corporativo a personas trabajadoras con responsabilidades de cuidado.",
              "ISO 25556: diseno de canales digitales y servicios accesibles para personas mayores.",
              "WHO / ILO: entornos amigables, trato digno y continuidad laboral sin discriminacion por edad."
            ]
          },
          {
            title: "3. Niveles de certificacion",
            list: [
              "Compromiso Inicial: autodiagnostico, plan de accion y sello de inicio por 12 meses.",
              "Certificacion Condicional: auditoria virtual, validacion documental y hoja de ruta priorizada.",
              "Certificacion Premium: auditoria integral, evidencia operativa y acreditacion avanzada."
            ]
          },
          {
            title: "4. Modalidades de alianza",
            list: [
              "B2B y empleadores: marca empleadora, retencion senior y diversidad generacional.",
              "Retail y servicios: experiencia de cliente senior, accesibilidad fisica y canales humanos.",
              "AgeTech y proveedores: integracion de soluciones al ecosistema de recomendacion.",
              "Sector publico: ciudades amigables, capacitacion y validacion de programas."
            ]
          }
        ],
        cta: "Para iniciar una alianza o coordinar una auditoria virtual, contactar a qdoblea@gmail.com."
      }
    : {
        title: "Corporate Alliance Dossier",
        subtitle: "Strategic corporate and institutional proposal",
        date: "Issued: June 2026",
        intro: "Age Friend Seal helps companies, retailers, institutions, and suppliers turn the silver economy into a measurable competitive advantage: better service, multigenerational teams, accessible channels, and public trust.",
        sections: [
          {
            title: "1. The Strategic Opportunity",
            body: "The 50+ population concentrates a growing share of consumption, expert knowledge, and household decision-making. Organizations that reduce physical, digital, and cultural barriers capture loyalty, reduce operational friction, and improve reputation."
          },
          {
            title: "2. Seal Foundations",
            list: [
              "ISO 25550: senior talent management, workplace ageism prevention, and intergenerational teams.",
              "ISO 25551: corporate support for workers with caregiving responsibilities.",
              "ISO 25556: digital channels and accessible service design for older persons.",
              "WHO / ILO: age-friendly environments, dignified treatment, and work continuity without age discrimination."
            ]
          },
          {
            title: "3. Certification Levels",
            list: [
              "Initial Commitment: self-diagnostic, action plan, and 12-month starter seal.",
              "Conditional Certification: virtual audit, document validation, and prioritized roadmap.",
              "Premium Certification: full audit, operational evidence, and advanced accreditation."
            ]
          },
          {
            title: "4. Partnership Tracks",
            list: [
              "B2B and employers: employer brand, senior retention, and generational diversity.",
              "Retail and services: senior customer experience, physical accessibility, and human support channels.",
              "AgeTech and suppliers: solution integration into the recommendation ecosystem.",
              "Public sector: age-friendly cities, training, and program validation."
            ]
          }
        ],
        cta: "To start a partnership or coordinate a virtual audit, contact qdoblea@gmail.com."
      };

  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="utf-8" />
  <title>${content.title}</title>
  <style>
    .dossier-page, .dossier-page * { box-sizing: border-box; }
    .dossier-page { width: 794px; min-height: 1123px; background: #ffffff !important; color: #111827 !important; padding: 56px 64px; font-family: Arial, Helvetica, sans-serif; line-height: 1.55; }
    .dossier-page .brand-row { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
    .dossier-page .brand-mark { width: 42px; height: 42px; border-radius: 50%; border: 2px solid #d4af37; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; font-weight: 800; }
    .dossier-page .brand-name { font-size: 18px; font-weight: 800; color: #111827 !important; }
    .dossier-page .eyebrow { color: #2563eb !important; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 10px; }
    .dossier-page h1 { color: #111827 !important; font-size: 34px; line-height: 1.12; margin: 0 0 12px; font-weight: 800; }
    .dossier-page .subtitle { color: #374151 !important; font-size: 17px; margin: 0 0 8px; font-weight: 600; }
    .dossier-page .date { color: #6b7280 !important; font-size: 13px; margin: 0 0 28px; }
    .dossier-page .intro { color: #1f2937 !important; background: #eef4ff !important; border-left: 5px solid #2563eb; padding: 18px 20px; border-radius: 8px; font-size: 15px; margin: 0 0 30px; }
    .dossier-page h2 { color: #1d4ed8 !important; font-size: 22px; margin: 28px 0 10px; font-weight: 800; }
    .dossier-page p { color: #1f2937 !important; font-size: 14.5px; margin: 0 0 12px; }
    .dossier-page ul { margin: 8px 0 0; padding-left: 20px; }
    .dossier-page li { color: #1f2937 !important; font-size: 14px; margin: 0 0 8px; }
    .dossier-page .section { break-inside: avoid; page-break-inside: avoid; }
    .dossier-page .cta { color: #111827 !important; background: #f8fafc !important; border: 1px solid #dbeafe; border-left: 5px solid #d4af37; padding: 14px 18px; border-radius: 8px; margin-top: 24px; font-weight: 700; }
    .dossier-page .footer { color: #6b7280 !important; background: #ffffff !important; border-top: 1px solid #e5e7eb; margin-top: 22px; padding-top: 10px; font-size: 11px; min-height: 0; height: auto; }
  </style>
</head>
<body>
  <main class="dossier-page">
    <div class="brand-row">
      <div class="brand-mark">AF</div>
      <div class="brand-name">Age Friend Seal</div>
    </div>
    <div class="eyebrow">${isEs ? "Economia Plateada Global" : "Global Silver Economy"}</div>
    <h1>${content.title}</h1>
    <p class="subtitle">${content.subtitle}</p>
    <p class="date">${content.date}</p>
    <p class="intro">${content.intro}</p>
    ${content.sections.map((section) => `
      <section class="section">
        <h2>${section.title}</h2>
        ${section.body ? `<p>${section.body}</p>` : ""}
        ${section.list ? `<ul>${section.list.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
      </section>
    `).join("")}
    <div class="cta">${content.cta}</div>
    <div class="footer">Age Friend Seal - ${isEs ? "Documento corporativo de referencia" : "Corporate reference document"}</div>
  </main>
</body>
</html>`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
