import "./Modals.scss";
import { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { buildDossierHtml, downloadTextFile, generateDecalSvg, generateSvgMatrix } from "../../utils/downloads.js";
import SVGMatrix from "../SVGMatrix/SVGMatrix.jsx";
import { db, auth } from "../../config/firebase.js";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { 
  signUpUser, 
  signInUser, 
  signOutUser, 
  updateUserProfile, 
  saveEvaluation, 
  getLatestEvaluation,
  isFirebaseEnabled,
  uploadBrandLogo,
  uploadDeliverableZip,
  getAllUsers,
  getCompanyDeliverables,
  saveCompanyDeliverable,
  recoverUserPassword,
  confirmPasswordResetUser,
  getQuestionsList,
  updateQuestionInDb,
  verifyUserOtp,
  resendUserOtp,
  sendOtpEmail
} from "../../utils/firebaseHelpers.js";

const checkPasswordPolicy = (password = '') => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@$!%*?&#\-_.,;:]/.test(password);
  const isValid = minLength && hasUpper && hasNumber && hasSpecial;
  return { minLength, hasUpper, hasNumber, hasSpecial, isValid };
};

function PasswordRequirementsBadges({ policy, language }) {
  const requirements = [
    { key: 'minLength', label: language === 'es' ? '8+ caracteres' : '8+ chars', pass: policy.minLength },
    { key: 'hasUpper', label: language === 'es' ? '1 Mayúscula (A-Z)' : '1 Uppercase', pass: policy.hasUpper },
    { key: 'hasNumber', label: language === 'es' ? '1 Número (0-9)' : '1 Number', pass: policy.hasNumber },
    { key: 'hasSpecial', label: language === 'es' ? '1 Símbolo (@,$,!,%,*,?,&)' : '1 Special char', pass: policy.hasSpecial }
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px', marginBottom: '8px' }}>
      {requirements.map(req => (
        <span 
          key={req.key}
          style={{
            fontSize: '0.72rem',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: req.pass ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
            color: req.pass ? '#10b981' : '#f87171',
            border: req.pass ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          {req.pass ? '✓' : '•'} {req.label}
        </span>
      ))}
    </div>
  );
}

function Modals({ language, activeModal, contactLevel, currentUser, latestDiagnostic, prefillEmail, resetOobCode, onClose, onOpenAuth, onOpenAccount, onOpenOtp, onUserChange, directPitchDownload, onClearDirectPitch, onOpenPitchSuccess, onOpenPitch }) {
  const intl = useIntl();
  const [authView, setAuthView] = useState('login');
  const [registerType, setRegisterType] = useState('personal');
  const [upgradeSector, setUpgradeSector] = useState('');
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [regPassword, setRegPassword] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetErrorBanner, setResetErrorBanner] = useState('');

  // 6-digit OTP states
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Switch authView depending on resetOobCode or prefillEmail
  useEffect(() => {
    if (activeModal === 'auth' && resetOobCode) {
      setAuthView('resetPassword');
    } else if (activeModal === 'auth' && prefillEmail) {
      setAuthView('login');
    }
  }, [activeModal, resetOobCode, prefillEmail]);

  // Guarantee clean 100% empty inputs whenever the OTP modal opens
  useEffect(() => {
    if (activeModal === 'otp') {
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
    }
  }, [activeModal]);
  
  // Phase 2 & 3: User Portal States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userEvaluation, setUserEvaluation] = useState(null);
  const [loadingEval, setLoadingEval] = useState(false);
  
  // Brand Assets & SVGMatrix States
  const [brandLogo, setBrandLogo] = useState(null);
  const [hexPrimary, setHexPrimary] = useState('#3b82f6');
  const [hexSecondary, setHexSecondary] = useState('#10b981');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Admin Panel States
  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingAdminUsers, setLoadingAdminUsers] = useState(false);
  const [exportingUsers, setExportingUsers] = useState(false);
  const [uploadingDeliverable, setUploadingDeliverable] = useState(false);
  const [adminActiveUser, setAdminActiveUser] = useState(null); // UID of user currently being edited by admin
  const [adminDeliverables, setAdminDeliverables] = useState([]);

  // Legal Scraper States
  const [legalAlerts, setLegalAlerts] = useState([]);
  const [loadingScraper, setLoadingScraper] = useState(false);
  const [syncingToDrive, setSyncingToDrive] = useState(false);
  const [toast, setToast] = useState(null);
  const [sourceFilter, setSourceFilter] = useState('All');
  const [automationLevel, setAutomationLevel] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState({}); // e.g. { q7: true, q3: true }

  const [adminQuestions, setAdminQuestions] = useState([]);
  const [adminSectorFilter, setAdminSectorFilter] = useState('private');
  const [adminVerticalFilter, setAdminVerticalFilter] = useState('Finanzas y Seguro');

  // Load legal alerts and admin config
  useEffect(() => {
    if (activeTab === 'admin') {
      const cachedAlerts = localStorage.getItem("ageFriendLegalAlerts_v6");
      const cachedFlagged = localStorage.getItem("ageFriendFlaggedQuestions");
      const cachedAuto = localStorage.getItem("ageFriendAutomationLevel");

      if (cachedAlerts) {
        setLegalAlerts(JSON.parse(cachedAlerts));
      } else {
        const initialAlerts = [];
        setLegalAlerts(initialAlerts);
        localStorage.setItem("ageFriendLegalAlerts_v6", JSON.stringify(initialAlerts));
      }

      if (cachedFlagged) {
        setFlaggedQuestions(JSON.parse(cachedFlagged));
      } else {
        const initialFlagged = { q3: true, q10: true };
        setFlaggedQuestions(initialFlagged);
        localStorage.setItem("ageFriendFlaggedQuestions", JSON.stringify(initialFlagged));
      }

      if (cachedAuto) {
        setAutomationLevel(parseInt(cachedAuto));
      }

      const loadQuestionsFromDb = async () => {
        const list = await getQuestionsList();
        setAdminQuestions(list);
      };
      loadQuestionsFromDb();
    }
  }, [activeTab]);

  const triggerScraperScan = async () => {
    setLoadingScraper(true);
    try {
      const res = await fetch(`/api/legal-scraper?source=${sourceFilter}`);
      const data = await res.json();
      if (data.status === "success" && data.alerts) {
        // 1. Guardar alertas en el historial local
        setLegalAlerts(prev => {
          const merged = [...prev];
          data.alerts.forEach(newAlert => {
            if (!merged.some(a => a.id === newAlert.id)) {
              merged.unshift(newAlert);
            }
          });
          localStorage.setItem("ageFriendLegalAlerts_v6", JSON.stringify(merged));
          return merged;
        });

        // 2. Procesar las preguntas afectadas en base de datos
        if (automationLevel === 100) {
          // Autonomía total: Actualizar directamente los textos e idioma
          for (const newAlert of data.alerts) {
            const pilar = newAlert.pilarImpacted;
            const targetSector = newAlert.targetSector || "both";
            const targetVerticals = newAlert.targetVerticals || ["All"];

            const matches = adminQuestions.filter(q => {
              const matchPilar = q.pilar === pilar;
              const matchSector = targetSector === 'both' || q.sector === targetSector;
              const matchVertical = targetVerticals.includes('All') || 
                q.applicable_verticals.some(v => targetVerticals.includes(v));
              return matchPilar && matchSector && matchVertical;
            });

            let updatedAny = false;
            for (const match of matches) {
              const duplicateExists = adminQuestions.some(other => 
                other.id !== match.id &&
                other.applicable_verticals.some(v => match.applicable_verticals.includes(v)) &&
                (other.text_es === newAlert.newQuestionText_es || other.text_en === newAlert.newQuestionText_en)
              );

              if (!duplicateExists && !updatedAny) {
                const updated = {
                  ...match,
                  text_es: newAlert.newQuestionText_es || match.text_es,
                  text_en: newAlert.newQuestionText_en || match.text_en,
                  text_pt: newAlert.newQuestionText_pt || match.text_pt,
                  status: 'active',
                  flaggedAlerts: []
                };
                await updateQuestionInDb(match.id, updated);
                updatedAny = true;
              }
            }
          }
          alert(language === 'es' 
            ? `Escaneo completado. Las normativas detectadas fueron inyectadas autónomamente al cuestionario (Automatización 100%).` 
            : `Scan completed. Detected regulations were autonomously injected into the questionnaire (100% Automation).`);
        } else {
          // Semi-automático / Manual: Marcar preguntas para revisión sugiriendo cambios
          for (const newAlert of data.alerts) {
            const pilar = newAlert.pilarImpacted;
            const targetSector = newAlert.targetSector || "both";
            const targetVerticals = newAlert.targetVerticals || ["All"];

            const matches = adminQuestions.filter(q => {
              const matchPilar = q.pilar === pilar;
              const matchSector = targetSector === 'both' || q.sector === targetSector;
              const matchVertical = targetVerticals.includes('All') || 
                q.applicable_verticals.some(v => targetVerticals.includes(v));
              return matchPilar && matchSector && matchVertical;
            });

            for (const match of matches) {
              const currentFlags = match.flaggedAlerts || [];
              if (!currentFlags.includes(newAlert.id)) {
                currentFlags.push(newAlert.id);
              }
              await updateQuestionInDb(match.id, {
                status: 'under_review',
                flaggedAlerts: currentFlags
              });
            }
          }
          alert(language === 'es' ? `Escaneo completado. Se encontraron ${data.alerts.length} nuevas alertas normativas.` : `Scan completed. Found ${data.alerts.length} new regulatory alerts.`);
        }

        // Recargar preguntas del estado local
        const list = await getQuestionsList();
        setAdminQuestions(list);
      } else {
        alert("Error: " + (data.message || "Failed to scan"));
      }
    } catch (e) {
      console.error(e);
      alert("Error contacting legal monitor service.");
    } finally {
      setLoadingScraper(false);
    }
  };

  const downloadLegalExcel = async () => {
    try {
      const res = await fetch(`/api/export-legal-reports?lang=${language}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ alerts: legalAlerts, lang: language })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = language === 'en' ? 'regulatory_history.xlsx' : language === 'pt' ? 'historico_regulatorio.xlsx' : 'historial_normativo.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert("Error exporting Excel report");
      }
    } catch (e) {
      console.error(e);
      alert("Error exporting report.");
    }
  };

  const showToast = (title, desc) => {
    setToast({ title, desc });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const syncExcelToDrive = async () => {
    setSyncingToDrive(true);
    try {
      const res = await fetch("/api/sync-to-drive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ alerts: legalAlerts, lang: language })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        showToast(
          language === "es" ? "Sincronización exitosa" : "Sync Successful",
          language === "es" 
            ? "El reporte de normativas en Google Drive ha sido actualizado." 
            : "The regulatory report in Google Drive has been updated."
        );
      } else {
        showToast(
          language === "es" ? "Error de Sincronización" : "Sync Error",
          data.message || (language === "es" ? "Error al sincronizar con Drive. Reintente." : "Failed to sync with Drive. Please retry.")
        );
      }
    } catch (e) {
      console.error(e);
      showToast(
        language === "es" ? "Error de Red/Sistema" : "Network/System Error",
        language === "es" ? "Error al conectar con el servidor." : "Could not connect to the server."
      );
    } finally {
      setSyncingToDrive(false);
    }
  };

  const downloadUsersExcel = async () => {
    setExportingUsers(true);
    try {
      const res = await fetch(`/api/export-users-excel?lang=${language}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ users: adminUsers, lang: language })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = language === 'en' ? 'registered_users.xlsx' : language === 'pt' ? 'usuarios_registrados.xlsx' : 'usuarios_registrados.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast(
          language === 'es' ? 'Descarga Exitosa' : 'Download Successful',
          language === 'es' ? 'El listado de usuarios se ha descargado correctamente.' : 'The list of users has been successfully downloaded.'
        );
      } else {
        showToast(
          language === 'es' ? 'Error de Descarga' : 'Download Error',
          language === 'es' ? 'Error al exportar el reporte de usuarios.' : 'Error exporting users report.'
        );
      }
    } catch (e) {
      console.error(e);
      showToast(
        language === 'es' ? 'Error de Red' : 'Network Error',
        language === 'es' ? 'Error al conectar con el servidor.' : 'Failed to connect to the server.'
      );
    } finally {
      setExportingUsers(false);
    }
  };

  const approveAlert = async (alertId, pilarImpacted) => {
    // 1. Aprobar alerta en el historial
    setLegalAlerts(prev => {
      const updated = prev.map(a => a.id === alertId ? { ...a, status: 'approved' } : a);
      localStorage.setItem("ageFriendLegalAlerts_v6", JSON.stringify(updated));
      return updated;
    });

    const alertObj = legalAlerts.find(a => a.id === alertId);
    if (alertObj) {
      const targetSector = alertObj.targetSector || "both";
      const targetVerticals = alertObj.targetVerticals || ["All"];

      const matches = adminQuestions.filter(q => {
        const matchPilar = q.pilar === pilarImpacted;
        const matchSector = targetSector === 'both' || q.sector === targetSector;
        const matchVertical = targetVerticals.includes('All') || 
          q.applicable_verticals.some(v => targetVerticals.includes(v));
        return matchPilar && matchSector && matchVertical;
      });

      let updatedAny = false;
      for (const match of matches) {
        const duplicateExists = adminQuestions.some(other => 
          other.id !== match.id &&
          other.applicable_verticals.some(v => match.applicable_verticals.includes(v)) &&
          (other.text_es === alertObj.newQuestionText_es || other.text_en === alertObj.newQuestionText_en)
        );

        if (!duplicateExists && !updatedAny) {
          const updated = {
            ...match,
            text_es: alertObj.newQuestionText_es || match.text_es,
            text_en: alertObj.newQuestionText_en || match.text_en,
            text_pt: alertObj.newQuestionText_pt || match.text_pt,
            status: 'active',
            flaggedAlerts: (match.flaggedAlerts || []).filter(id => id !== alertId)
          };
          await updateQuestionInDb(match.id, updated);
          updatedAny = true;
        } else {
          // just remove the flag without duplicating text
          await updateQuestionInDb(match.id, {
            flaggedAlerts: (match.flaggedAlerts || []).filter(id => id !== alertId),
            status: (match.flaggedAlerts || []).filter(id => id !== alertId).length > 0 ? 'under_review' : 'active'
          });
        }
      }

      // Recargar lista
      const list = await getQuestionsList();
      setAdminQuestions(list);
    }
  };

  const ignoreAlert = (alertId) => {
    setLegalAlerts(prev => {
      const updated = prev.filter(a => a.id !== alertId);
      localStorage.setItem("ageFriendLegalAlerts_v6", JSON.stringify(updated));
      return updated;
    });
  };

  const resolveQuestionFlag = async (qId) => {
    await updateQuestionInDb(qId, {
      status: 'active',
      flaggedAlerts: []
    });
    // Recargar lista
    const list = await getQuestionsList();
    setAdminQuestions(list);
  };

  const handleAutomationChange = (val) => {
    setAutomationLevel(val);
    localStorage.setItem("ageFriendAutomationLevel", val);
  };

  const [settingsForm, setSettingsForm] = useState({
    name: '',
    website: '',
    country: '',
    sector: '',
    subsector: '',
    companySize: '',
    role: ''
  });

  // Sync brand assets state with current user profile
  useEffect(() => {
    if (currentUser) {
      setBrandLogo(currentUser.brandAssets?.logoUrl || null);
      setHexPrimary(currentUser.brandAssets?.hexPrimary || '#3b82f6');
      setHexSecondary(currentUser.brandAssets?.hexSecondary || '#10b981');
    }
  }, [currentUser, activeModal]);

  // Load all users for Admin panel
  useEffect(() => {
    if (activeTab === 'admin' && (currentUser?.role === 'admin' || currentUser?.email?.toLowerCase().startsWith("admin"))) {
      setLoadingAdminUsers(true);
      getAllUsers()
        .then(res => {
          setAdminUsers(res);
        })
        .catch(err => console.error("Error loading admin users:", err))
        .finally(() => setLoadingAdminUsers(false));
    }
  }, [activeTab, currentUser]);

  // Load deliverables for selected admin user
  useEffect(() => {
    if (adminActiveUser) {
      getCompanyDeliverables(adminActiveUser)
        .then(res => setAdminDeliverables(res))
        .catch(err => console.error("Error loading deliverables:", err));
    } else {
      setAdminDeliverables([]);
    }
  }, [adminActiveUser]);

  const isOpen = (name) => activeModal === name;

  // Load latest evaluation for logged in user
  useEffect(() => {
    if (activeModal === 'account' && currentUser) {
      setLoadingEval(true);
      getLatestEvaluation(currentUser.uid || currentUser.email)
        .then(res => {
          setUserEvaluation(res);
        })
        .catch(err => console.error("Error loading user evaluation:", err))
        .finally(() => setLoadingEval(false));
    }
  }, [activeModal, currentUser]);

  // Sync settings form with user profile
  useEffect(() => {
    if (currentUser) {
      setSettingsForm({
        name: currentUser.name || '',
        website: currentUser.website || '',
        country: currentUser.country || '',
        sector: currentUser.sector || '',
        subsector: currentUser.subsector || '',
        companySize: currentUser.companySize || '',
        role: currentUser.role || ''
      });
    }
  }, [currentUser]);

  // Hook for direct pitch download when logged-in B2B/Personal user clicks download
  useEffect(() => {
    if (directPitchDownload) {
      const downloadPitchDirectly = async () => {
        const html = buildDossierHtml(language);
        try {
          const { default: html2pdf } = await import('html2pdf.js');
          const parsed = new DOMParser().parseFromString(html, 'text/html');
          const printHost = document.createElement('div');
          printHost.setAttribute('aria-hidden', 'true');
          printHost.style.position = 'fixed';
          printHost.style.left = '-10000px';
          printHost.style.top = '0';
          printHost.style.width = '794px';
          printHost.style.background = '#ffffff';
          printHost.style.color = '#111827';
          printHost.innerHTML = `${parsed.head.innerHTML}${parsed.body.innerHTML}`;
          document.body.appendChild(printHost);
          
          const container = printHost.querySelector('.dossier-page');
          await html2pdf()
            .from(container)
            .set({
              filename: language === 'es' || language === 'pt' ? 'Dossier_AgeFriendSeal.pdf' : 'Dossier_AgeFriendSeal_EN.pdf',
              margin: 0,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true
              },
              jsPDF: {
                unit: 'pt',
                format: 'a4',
                orientation: 'portrait'
              },
              pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            })
            .save();
          printHost.remove();
        } catch (err) {
          console.error("Direct HTML2PDF fallback:", err);
          downloadTextFile(html, language === 'es' || language === 'pt' ? 'Dossier_AgeFriendSeal.html' : 'Dossier_AgeFriendSeal_EN.html', 'text/html;charset=utf-8');
        }
      };
      
      downloadPitchDirectly();
      if (onClearDirectPitch) {
        onClearDirectPitch();
      }
    }
  }, [directPitchDownload, language, onClearDirectPitch]);

  const handlePitchSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const formName = String(form.get('name') || '').trim();
    const formCompany = String(form.get('company') || '').trim();
    const formEmail = String(form.get('email') || '').trim();
    const format = String(form.get('format') || 'pdf').trim();
    
    let userTypeStr = "Anónimo";
    if (currentUser && currentUser.type !== 'anonymous') {
      if (currentUser.userType === 'empresa' || currentUser.companyName || currentUser.economicSector || currentUser.sector) {
        userTypeStr = "Empresa";
      } else {
        userTypeStr = "Personal";
      }
    }

    const finalName = formName || (currentUser ? (currentUser.name || [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ")) : '') || 'Contacto Prospecto';
    const finalCompany = formCompany || (currentUser ? (currentUser.companyName || currentUser.name) : '') || 'Empresa Prospecto';
    const finalEmail = formEmail || (currentUser ? currentUser.email : '') || '';

    // Call backend API to capture the guest lead
    fetch("/api/capture-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: finalName,
        nombre: finalName,
        email: finalEmail,
        company: finalCompany,
        empresa: finalCompany,
        userType: userTypeStr,
        tipoUsuario: userTypeStr
      })
    }).catch(err => console.error("Error capturing B2B lead via form:", err));

    const html = buildDossierHtml(language);
    if (format === 'pdf') {
      let printHost;
      try {
        const { default: html2pdf } = await import('html2pdf.js');
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        printHost = document.createElement('div');
        printHost.setAttribute('aria-hidden', 'true');
        printHost.style.position = 'fixed';
        printHost.style.left = '-10000px';
        printHost.style.top = '0';
        printHost.style.width = '794px';
        printHost.style.background = '#ffffff';
        printHost.style.color = '#111827';
        printHost.innerHTML = `${parsed.head.innerHTML}${parsed.body.innerHTML}`;
        document.body.appendChild(printHost);
        
        const container = printHost.querySelector('.dossier-page');
        await html2pdf()
          .from(container)
          .set({
            filename: language === 'es' || language === 'pt' ? 'Dossier_AgeFriendSeal.pdf' : 'Dossier_AgeFriendSeal_EN.pdf',
            margin: 0,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,
              backgroundColor: '#ffffff',
              useCORS: true
            },
            jsPDF: {
              unit: 'pt',
              format: 'a4',
              orientation: 'portrait'
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          })
          .save();
      } catch {
        downloadTextFile(html, language === 'es' || language === 'pt' ? 'Dossier_AgeFriendSeal.html' : 'Dossier_AgeFriendSeal_EN.html', 'text/html;charset=utf-8');
      } finally {
        printHost?.remove();
      }
    } else {
      downloadTextFile(html, language === 'es' || language === 'pt' ? 'Dossier_AgeFriendSeal.html' : 'Dossier_AgeFriendSeal_EN.html', 'text/html;charset=utf-8');
    }
    
    onClose();
    if (onOpenPitchSuccess) {
      onOpenPitchSuccess();
    }
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    alert(language === 'es' ? 'Solicitud enviada con exito para la demo.' : (language === 'pt' ? 'Solicitação enviada com sucesso para a demonstração.' : 'Request sent successfully for the demo.'));
    onClose();
  };

  // OTP 6-Digit Navigation & Submission Handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setOtpError('');

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      setOtpError('');
      const lastInput = document.getElementById('otp-input-5');
      if (lastInput) lastInput.focus();
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setOtpError(language === 'es' ? 'Por favor ingrese el código completo de 6 dígitos.' : 'Please enter the complete 6-digit code.');
      return;
    }
    setVerifyingOtp(true);
    setOtpError('');
    try {
      const res = await verifyUserOtp(currentUser, code);
      if (res.success) {
        onUserChange(res.updatedProfile);
        showToast(
          language === 'es' ? 'Cuenta Activada' : 'Account Verified',
          language === 'es' ? '¡Tu cuenta ha sido verificada y activada con éxito!' : 'Your account has been successfully verified!'
        );
        onClose();
        if (onOpenAccount) onOpenAccount();
      } else {
        setOtpError(res.error || (language === 'es' ? 'Código incorrecto.' : 'Invalid code.'));
      }
    } catch (err) {
      setOtpError(err.message || 'Error de verificación.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendingOtp) return;
    setResendingOtp(true);
    setOtpError('');
    try {
      const res = await resendUserOtp(currentUser);
      if (res.success) {
        onUserChange(res.updatedProfile);
        showToast(
          language === 'es' ? 'Código Enviado' : 'Code Sent',
          language === 'es' ? 'Hemos enviado un nuevo código de 6 dígitos a su correo.' : 'A new 6-digit verification code has been sent to your email.'
        );
        setResendCooldown(30);
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setOtpError(res.error || 'Error al reenviar el código.');
      }
    } catch (err) {
      setOtpError(err.message || 'Error enviando el código.');
    } finally {
      setResendingOtp(false);
    }
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (authView === 'login') {
      const email = form.get('email');
      const password = form.get('password');
      try {
        const user = await signInUser(email, password);
        onUserChange(user);
        if (user && user.isVerified === false) {
          showToast(
            language === 'es' ? 'Activación Requerida' : 'Activation Required',
            language === 'es' ? 'Introduzca el código de 6 dígitos enviado a su correo.' : 'Enter the 6-digit code sent to your email.'
          );
          if (onOpenOtp) onOpenOtp();
        } else {
          showToast(
            language === 'es' ? 'Sesión Iniciada' : 'Logged In',
            language === 'es' ? 'Sesión iniciada con éxito.' : 'Logged in successfully.'
          );
          onClose();
          onOpenAccount();
        }
      } catch (err) {
        console.error("Login error:", err);
        alert(language === 'es' ? `Error al iniciar sesión: ${err.message}` : `Error logging in: ${err.message}`);
      }
    } else {
      const type = form.get('type');
      const firstName = form.get('firstName') || '';
      const lastName = form.get('lastName') || '';
      const companyNameVal = form.get('companyName') || '';
      const email = form.get('email');
      const username = email.split('@')[0];
      const password = form.get('password');
      const country = form.get('country') || '';
      const sector = form.get('sector') || '';
      const subsector = form.get('subsector') || '';
      const role = form.get('role') || '';
      const companySize = form.get('companySize') || '';
      const website = form.get('website') || '';

      try {
        const profileData = {
          type,
          firstName,
          lastName,
          companyName: companyNameVal,
          name: `${firstName} ${lastName}`.trim() || 'Usuario',
          username,
          country,
          sector,
          subsector,
          role,
          website,
          companySize
        };
        const user = await signUpUser(email, password, profileData);
        onUserChange(user);

        showToast(
          language === 'es' ? 'Registro Completado' : 'Registered Successfully',
          language === 'es' ? 'Hemos enviado un código de activación de 6 dígitos a su correo.' : 'We sent a 6-digit activation code to your email.'
        );
        if (onOpenOtp) onOpenOtp();
      } catch (err) {
        console.error("Signup error:", err);
        alert(language === 'es' ? `Error al registrarse: ${err.message}` : `Error signing up: ${err.message}`);
      }
    }
  };

  const handleUpgrade = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const existingWebsite = currentUser?.website || currentUser?.websiteUrl || '';

    try {
      const upgradeData = {
        type: 'empresa',
        userType: 'empresa',
        sector: form.get('sector') || '',
        subsector: form.get('subsector') || '',
        role: form.get('role') || '',
        website: existingWebsite,
        companySize: form.get('companySize') || ''
      };
      const updatedProfile = await updateUserProfile(currentUser.uid, upgradeData);
      onUserChange(updatedProfile);
      alert(language === 'es' ? 'Cuenta actualizada a empresa con éxito.' : (language === 'pt' ? 'Conta atualizada para empresa com sucesso.' : 'Account upgraded to company successfully.'));
    } catch (err) {
      console.error("Upgrade error:", err);
      alert(language === 'es' ? `Error al actualizar: ${err.message}` : `Error upgrading: ${err.message}`);
    }
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    if (currentUser?.type === 'empresa' && settingsForm.website && !urlPattern.test(settingsForm.website)) {
      alert(language === 'es' ? 'Por favor ingrese una web válida.' : 'Please enter a valid website.');
      return;
    }

    try {
      const updatedProfile = await updateUserProfile(currentUser.uid, settingsForm);
      onUserChange(updatedProfile);
      alert(language === 'es' ? 'Configuración guardada exitosamente.' : 'Settings saved successfully.');
    } catch (err) {
      console.error("Settings update error:", err);
      alert(language === 'es' ? `Error al guardar: ${err.message}` : `Error saving settings: ${err.message}`);
    }
  };

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = (form.get('email') || '').trim();

    // Validación Frontend mediante Regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      alert(language === 'es' 
        ? 'Por favor, ingrese una dirección de correo electrónico válida.' 
        : language === 'pt'
          ? 'Por favor, insira um endereço de e-mail válido.'
          : 'Please enter a valid email address.');
      return;
    }

    try {
      await recoverUserPassword(email);
      alert(language === 'es' 
        ? 'Se han enviado las instrucciones de restablecimiento a su correo.' 
        : language === 'pt' 
          ? 'Instruções de redefinição enviadas para o seu e-mail.' 
          : 'Reset instructions have been sent to your email.');
      setAuthView('login');
    } catch (err) {
      console.error("Password recovery error:", err);
      // Capturar error de usuario no encontrado en Firebase
      if (err.code === 'auth/user-not-found' || err.message?.includes('user-not-found') || err.message?.includes('auth/user-not-found')) {
        alert(language === 'es' 
          ? 'No encontramos ninguna cuenta registrada con este correo. Por favor, verifique si utilizó otra dirección.' 
          : language === 'pt'
            ? 'Não encontramos nenhuma conta registrada com este e-mail. Por favor, verifique se utilizou outro endereço.'
            : 'We could not find any account registered with this email. Please check if you used another address.');
      } else {
        alert(language === 'es' ? `Error al enviar correo: ${err.message}` : `Error sending email: ${err.message}`);
      }
    }
  };

  const handleConfirmPasswordResetSubmit = async (event) => {
    event.preventDefault();
    setResetErrorBanner('');

    const form = new FormData(event.currentTarget);
    const newPassword = (form.get('newPassword') || '').trim();

    const policy = checkPasswordPolicy(newPassword);
    if (!policy.isValid) {
      setResetErrorBanner(
        language === 'es'
          ? 'La nueva contraseña debe incluir 8+ caracteres, 1 mayúscula, 1 número y 1 carácter especial.'
          : 'The new password must include 8+ characters, 1 uppercase, 1 number, and 1 special character.'
      );
      return;
    }

    let cleanCode = String(resetOobCode || '').trim();
    if (cleanCode.includes('%')) {
      try { cleanCode = decodeURIComponent(cleanCode); } catch {}
    }

    if (!cleanCode) {
      setResetErrorBanner(
        language === 'es'
          ? 'El enlace de recuperación ha expirado o es inválido. Por favor, solicite uno nuevo.'
          : 'The recovery link has expired or is invalid. Please request a new one.'
      );
      return;
    }

    setResetPasswordLoading(true);
    try {
      await confirmPasswordResetUser(cleanCode, newPassword);
      showToast(
        language === 'es' ? 'Contraseña Actualizada' : 'Password Updated',
        language === 'es' ? '¡Su contraseña ha sido restablecida exitosamente! Inicie sesión con su nueva clave.' : 'Your password has been reset successfully! Log in with your new password.'
      );
      setResetErrorBanner('');
      setResetNewPassword('');
      setAuthView('login');
    } catch (err) {
      console.error("Confirm password reset error:", err);
      // UX Improvement: Catch invalid-action-code or expired error and show UI banner without alert()
      setResetErrorBanner(
        language === 'es'
          ? 'El enlace de recuperación ha expirado o es inválido. Por favor, solicite uno nuevo.'
          : 'The recovery link has expired or is invalid. Please request a new one.'
      );
    } finally {
      setResetPasswordLoading(false);
    }
  };

  // Handle Logo Upload for Brand Customization
  const handleBrandLogoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert(language === 'es' 
        ? "El logotipo debe pesar menos de 2MB." 
        : "The logo must be smaller than 2MB.");
      return;
    }

    setUploadingLogo(true);
    try {
      const downloadUrl = await uploadBrandLogo(currentUser.uid, file);
      setBrandLogo(downloadUrl);
      alert(language === 'es' 
        ? "Logotipo subido exitosamente." 
        : "Logo uploaded successfully.");
    } catch (err) {
      console.error("Logo upload error:", err);
      alert(language === 'es' 
        ? `Error al subir logotipo: ${err.message}` 
        : `Error uploading logo: ${err.message}`);
    } finally {
      setUploadingLogo(false);
    }
  };

  // Save Brand Assets Customization
  const handleSaveBrandAssets = async () => {
    try {
      const updatedProfile = await updateUserProfile(currentUser.uid, {
        brandAssets: {
          logoUrl: brandLogo,
          hexPrimary,
          hexSecondary
        }
      });
      onUserChange(updatedProfile);
      alert(language === 'es' 
        ? "Diseño y colores de marca guardados exitosamente." 
        : "Brand assets and colors saved successfully.");
    } catch (err) {
      console.error("Error saving brand assets:", err);
      alert(language === 'es' 
        ? `Error al guardar colores de marca: ${err.message}` 
        : `Error saving brand assets: ${err.message}`);
    }
  };

  // Admin Handler: Update client certification stage
  const handleUpdateUserStage = async (userId, stage) => {
    try {
      const updated = await updateUserProfile(userId, { certificationStage: stage });
      setAdminUsers(prev => prev.map(u => u.uid === userId ? { ...u, certificationStage: stage } : u));
      alert(language === 'es' 
        ? "Etapa de certificación actualizada exitosamente." 
        : "Certification stage updated successfully.");
    } catch (err) {
      console.error("Error updating user stage:", err);
      alert(`Error: ${err.message}`);
    }
  };

  // Admin Handler: Upload deliverable (.zip)
  const handleUploadDeliverableFile = async (userId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingDeliverable(true);
    try {
      const zipUrl = await uploadDeliverableZip(userId, file);
      await saveCompanyDeliverable({
        id_empresa: userId,
        title: file.name,
        zipUrl,
        pdfReportUrl: ""
      });
      
      if (adminActiveUser === userId) {
        const deliverables = await getCompanyDeliverables(userId);
        setAdminDeliverables(deliverables);
      }

      alert(language === 'es' 
        ? "Kit de distintivos (.zip) subido y vinculado con éxito." 
        : "Deliverable kit (.zip) uploaded and linked successfully.");
    } catch (err) {
      console.error("Error uploading deliverable:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setUploadingDeliverable(false);
      event.target.value = "";
    }
  };

  const downloadExcelReport = async () => {
    const evalData = userEvaluation || (latestDiagnostic ? {
      globalScore: latestDiagnostic.score,
      respuestas: latestDiagnostic.respuestas
    } : null);

    if (!evalData) {
      alert(language === 'es' ? 'No se encontraron resultados de autodiagnóstico para descargar.' : 'No diagnostic results found to download.');
      return;
    }

    try {
      let token = "";
      if (auth && auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      } else if (currentUser && currentUser.uid && currentUser.uid.startsWith("dummy_")) {
        token = currentUser.uid;
      }

      const response = await fetch("/api/generate-excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          email: currentUser?.email || "demo@example.com",
          enterpriseName: currentUser?.companyName || currentUser?.name || "Empresa",
          score: evalData.globalScore || evalData.score || 0,
          respuestas: evalData.respuestas || [],
          country: currentUser?.country || "España"
        })
      });

      if (!response.ok) {
        throw new Error("API responded with error.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Reporte_Age_Friend_Seal_${(currentUser?.name || "Empresa").replace(/\s+/g, "_")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Excel generation failed:", err);
      alert(language === 'es' ? 'No se pudo descargar el archivo Excel en esta sesión de demostración local.' : 'Failed to download Excel report in this local demo session.');
    }
  };

  const downloadSvgBadge = () => {
    const companyName = currentUser?.name || (language === 'es' ? 'Su Empresa' : 'Your Company');
    const stage = currentUser?.certificationStage || "Compromiso Inicial";
    const svgContent = generateSvgMatrix(
      companyName,
      hexPrimary,
      hexSecondary,
      stage,
      brandLogo
    );
    downloadTextFile(svgContent, `Sello_Personalizado_${companyName.replace(/[^a-z0-9]/gi, '_')}.svg`, 'image/svg+xml;charset=utf-8');
  };

  const downloadPngBadge = () => {
    const companyName = currentUser?.name || (language === 'es' ? 'Su Empresa' : 'Your Company');
    const stage = currentUser?.certificationStage || "Compromiso Inicial";
    const svgContent = generateSvgMatrix(
      companyName,
      hexPrimary,
      hexSecondary,
      stage,
      brandLogo
    );
    
    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `Sello_Personalizado_${companyName.replace(/[^a-z0-9]/gi, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const downloadZipKit = async () => {
    const companyName = currentUser?.name || (language === 'es' ? 'Su Empresa' : 'Your Company');
    const stage = currentUser?.certificationStage || "Compromiso Inicial";
    const svgContent = generateSvgMatrix(
      companyName,
      hexPrimary,
      hexSecondary,
      stage,
      brandLogo
    );

    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        let pngBase64 = null;
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          pngBase64 = canvas.toDataURL('image/png');
        }
        URL.revokeObjectURL(url);

        const response = await fetch("/api/generate-zip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            companyName,
            svgContent,
            pngBase64
          })
        });

        if (!response.ok) {
          throw new Error("Failed to compile ZIP kit on server.");
        }

        const blob = await response.blob();
        const zipUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = zipUrl;
        link.download = `Kit_Marca_Age_Friend_${companyName.replace(/[^a-z0-9]/gi, '_')}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(zipUrl);
      } catch (err) {
        console.error("ZIP kit generation failed:", err);
        alert(language === 'es' 
          ? 'No se pudo generar el Kit de Marca (.zip). Pruebe de nuevo.' 
          : 'Failed to compile B2B Brand Kit (.zip). Please try again.');
      }
    };
    img.src = url;
  };

  const handlePayment = async () => {
    const companyName = currentUser?.companyName || currentUser?.name || (language === 'es' ? 'Su Empresa' : (language === 'pt' ? 'Sua Empresa' : 'Your Company'));
    
    // Download SVG decal
    downloadSvgBadge();

    // Guardar diagnóstico en Firestore si existen resultados
    if (latestDiagnostic && currentUser) {
      const uid = currentUser.uid || (auth && auth.currentUser?.uid) || "dummy_uid";
      
      try {
        // 1. Asegurar perfil en la colección 'users' para cumplir con RLS
        await updateUserProfile(uid, {
          name: currentUser.name || companyName,
          firstName: currentUser.firstName || "",
          lastName: currentUser.lastName || "",
          companyName: currentUser.companyName || companyName,
          email: currentUser.email || "",
          username: currentUser.username || "",
          country: currentUser.country || "",
          sector: currentUser.sector || "",
          subsector: currentUser.subsector || "",
          role: currentUser.role || "",
          website: currentUser.website || "",
          companySize: currentUser.companySize || "",
          uid: uid
        });

        // 2. Guardar diagnóstico en la colección 'evaluations'
        const evalId = await saveEvaluation(
          uid,
          latestDiagnostic.scores || {
            pilar1: latestDiagnostic.score,
            pilar2: latestDiagnostic.score,
            pilar3: latestDiagnostic.score,
            pilar4: latestDiagnostic.score,
            pilar5: latestDiagnostic.score
          },
          latestDiagnostic.criticalPillar || "Eje Laboral",
          latestDiagnostic.respuestas || [],
          latestDiagnostic.score
        );

        // 3. Enviar el informe en Excel llamando a la API Serverless de Vercel (Brevo sync + SMTP)
        try {
          let token = "";
          if (auth && auth.currentUser) {
            token = await auth.currentUser.getIdToken();
          } else if (currentUser && currentUser.uid && currentUser.uid.startsWith("dummy_")) {
            token = currentUser.uid;
          }

          const response = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              email: currentUser?.email || auth?.currentUser?.email || "",
              name: currentUser?.name || auth?.currentUser?.displayName || (currentUser?.email || auth?.currentUser?.email || "").split("@")[0] || "",
              companyName: companyName,
              pilarScores: latestDiagnostic.scores || {
                pilar1: latestDiagnostic.score,
                pilar2: latestDiagnostic.score,
                pilar3: latestDiagnostic.score,
                pilar4: latestDiagnostic.score,
                pilar5: latestDiagnostic.score
              },
              criticalPillar: latestDiagnostic.criticalPillar || "Eje Laboral",
              score: latestDiagnostic.score,
              respuestas: latestDiagnostic.respuestas,
              country: currentUser?.country || "España"
            })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Error al enviar el correo.");
          }
        } catch (emailErr) {
          console.error("Error al enviar el reporte por correo:", emailErr);
          alert(language === 'es'
            ? `Se guardó el autodiagnóstico en tu cuenta, pero hubo una dificultad al despachar el correo: ${emailErr.message}`
            : `Autodiagnostic saved, but there was an issue sending the email: ${emailErr.message}`);
          onClose();
          return;
        }

        // 4. Informar al usuario
        const successMsg = language === 'es'
          ? `¡Pago Simulado! El distintivo se ha descargado y el informe Excel (.xlsx) fue enviado a: ${currentUser.email}`
          : language === 'pt'
            ? `¡Pagamento Simulado! O distintivo foi baixado e o relatório Excel (.xlsx) foi enviado para: ${currentUser.email}`
            : `Payment Simulated! The decal has been downloaded and the Excel report (.xlsx) was sent to: ${currentUser.email}`;
        
        alert(successMsg);
      } catch (error) {
        console.error("Error saving diagnostic to Firestore:", error);
        alert(language === 'es' 
          ? `Ocurrió un error al guardar o enviar el informe: ${error.message}` 
          : `An error occurred while saving or sending the report: ${error.message}`);
      }
    } else {
      alert(language === 'es' 
        ? 'No se encontraron resultados de diagnóstico activos para enviar.' 
        : 'No active diagnostic results found to send.');
    }

    onClose();
  };

  return (
    <div>
      <div className={`modal-overlay ${isOpen('pitch') ? '' : 'hidden'}`} id="pitch-modal">
        <div className="glass-card modal-content text-center" style={{ maxWidth: 500 }}>
          <button className="modal-close" id="btn-pitch-modal-close" onClick={onClose}><FormattedMessage id="Modals.001" /></button>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}><FormattedMessage id="Modals.002" /></div>
          <h3><FormattedMessage id="Modals.003" /></h3>
          <p><FormattedMessage id="Modals.004" /></p>
          <form id="pitch-form" className="modal-form" style={{ textAlign: 'left', marginTop: 24 }} onSubmit={handlePitchSubmit}>
            <div className="form-group">
              <label htmlFor="pitch-name"><FormattedMessage id="Modals.005" /></label>
              <input type="text" id="pitch-name" name="name" required placeholder={intl.formatMessage({ id: "Modals.006" })} />
            </div>
            <div className="form-group">
              <label htmlFor="pitch-company">
                {language === 'es' ? 'Nombre de la Empresa *' : (language === 'pt' ? 'Nome da Empresa *' : 'Company Name *')}
              </label>
              <input type="text" id="pitch-company" name="company" required placeholder={language === 'es' ? 'Ej. Mi Empresa' : 'e.g. My Company'} />
            </div>
            <div className="form-group">
              <label htmlFor="pitch-corp-email"><FormattedMessage id="Modals.009" /></label>
              <input type="email" id="pitch-corp-email" name="email" required placeholder={intl.formatMessage({ id: "Modals.010" })} />
            </div>
            <div className="form-group">
              <label htmlFor="pitch-format"><FormattedMessage id="Modals.011" /></label>
              <select id="pitch-format" name="format" style={selectStyle}>
                <option value="pdf"><FormattedMessage id="Modals.012" /></option>
                <option value="html"><FormattedMessage id="Modals.013" /></option>
              </select>
            </div>
            <button type="submit" className="btn btn-gradient btn-block" style={{ marginTop: 12 }}><FormattedMessage id="Modals.014" /></button>
          </form>
        </div>
      </div>

      <div className={`modal-overlay ${isOpen('pitch-success') ? '' : 'hidden'}`} id="pitch-success-modal">
        <div className="glass-card modal-content text-center" style={{ maxWidth: 500 }}>
          <button className="modal-close" id="btn-pitch-success-close" onClick={onClose}><FormattedMessage id="Modals.001" /></button>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>📩</div>
          <h3>
            {language === 'es' ? '¡Pitch en camino!' : (language === 'pt' ? '¡Pitch a caminho!' : 'Pitch on the way!')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.95rem', lineHeight: '1.5' }}>
            {language === 'es'
              ? 'El material del Pitch Corporativo se ha generado e iniciado su descarga. ¿Desea adelantar el proceso y agendar una conversación con nuestro equipo?'
              : language === 'pt'
                ? 'O material do Pitch Corporativo foi gerado e o download foi iniciado. Deseja adiantar o processo e agendar uma conversa com nossa equipe?'
                : 'The Corporate Pitch material has been generated and the download has started. Would you like to speed up the process and schedule a call with our team?'}
          </p>
          <a
            href="https://calendar.app.google/EoYVThhGqyJb2VsRA"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gradient btn-block"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <span>🗓️</span>
            <span>
              {language === 'es' 
                ? 'Agendar reunión de 15 min' 
                : (language === 'pt' ? 'Agendar reunião de 15 min' : 'Schedule a 15 min meeting')}
            </span>
          </a>
          <button 
            type="button" 
            className="btn btn-outline btn-block" 
            style={{ marginTop: 12 }} 
            onClick={onClose}
          >
            {language === 'es' ? 'Cerrar' : (language === 'pt' ? 'Fechar' : 'Close')}
          </button>
        </div>
      </div>

      {/* MODAL: OTP ACCOUNT ACTIVATION */}
      <div className={`modal-overlay ${isOpen('otp') ? '' : 'hidden'}`} id="otp-modal">
        <div className="glass-card modal-content text-center" style={{ maxWidth: 460 }}>
          <button className="modal-close" id="btn-otp-modal-close" onClick={onClose}><FormattedMessage id="Modals.001" /></button>
          <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🔐</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
            {language === 'es' ? 'Activación de Seguridad' : (language === 'pt' ? 'Ativação de Segurança' : 'Security Verification')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: 20 }}>
            {language === 'es'
              ? 'Hemos enviado un código de 6 dígitos a su correo. Introdúzcalo para activar su cuenta.'
              : language === 'pt'
                ? 'Enviamos um código de 6 dígitos para o seu e-mail. Insira-o para ativar sua conta.'
                : 'We have sent a 6-digit code to your email. Enter it below to verify your account.'}
          </p>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '8px', padding: '8px 12px', marginBottom: 20, fontSize: '0.85rem', color: '#93c5fd', fontWeight: 600 }}>
            📧 {currentUser?.email || 'su.correo@empresa.com'}
          </div>

          <form onSubmit={handleVerifyOtpSubmit}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: 20 }} onPaste={handleOtpPaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  autoComplete="off"
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  style={{
                    width: '45px',
                    height: '52px',
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: digit ? '2px solid var(--accent-color, #10b981)' : '1px solid var(--border-color)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: 'var(--text-primary)'
                  }}
                />
              ))}
            </div>

            {otpError && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 15, fontWeight: 500 }}>
                ⚠️ {otpError}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-gradient btn-block"
              disabled={verifyingOtp || otpDigits.join('').length !== 6}
              style={{ padding: '12px', fontSize: '1rem', fontWeight: 700 }}
            >
              {verifyingOtp ? (language === 'es' ? 'Verificando...' : 'Verifying...') : (language === 'es' ? 'Verificar y Activar' : 'Verify & Activate')}
            </button>

            <button
              type="button"
              className="btn btn-outline btn-block"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || resendingOtp}
              style={{ marginTop: 12, fontSize: '0.85rem' }}
            >
              {resendCooldown > 0
                ? (language === 'es' ? `Reenviar código en (${resendCooldown}s)` : `Resend code in (${resendCooldown}s)`)
                : resendingOtp
                  ? (language === 'es' ? 'Enviando...' : 'Sending...')
                  : (language === 'es' ? '🔄 Reenviar código' : '🔄 Resend code')}
            </button>
          </form>
        </div>
      </div>

      <div className={`modal-overlay ${isOpen('contact') ? '' : 'hidden'}`} id="contact-modal">
        <div className="glass-card modal-content">
          <button className="modal-close" id="btn-modal-close" onClick={onClose}><FormattedMessage id="Modals.015" /></button>
          <div className="modal-header">
            <h3 id="modal-title">
              {contactLevel === 'gold'
                ? (language === 'es' ? 'Solicitar auditoria Premium' : (language === 'pt' ? 'Solicitar auditoria Premium' : 'Request Premium Audit'))
                : <FormattedMessage id="Modals.016" />}
            </h3>
            <p id="modal-subtitle"><FormattedMessage id="Modals.017" /></p>
          </div>
          <form id="contact-form" className="modal-form" onSubmit={handleContactSubmit}>
            <div className="form-group">
              <label htmlFor="comp-name"><FormattedMessage id="Modals.018" /></label>
              <input type="text" id="comp-name" required placeholder={intl.formatMessage({ id: "Modals.019" })} />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email"><FormattedMessage id="Modals.020" /></label>
              <input type="email" id="contact-email" required placeholder={intl.formatMessage({ id: "Modals.021" })} />
            </div>
            <div className="form-group">
              <label htmlFor="contact-phone"><FormattedMessage id="Modals.022" /></label>
              <input type="tel" id="contact-phone" required placeholder={intl.formatMessage({ id: "Modals.023" })} />
            </div>
            <button type="submit" className="btn btn-primary btn-block"><FormattedMessage id="Modals.024" /></button>
          </form>
        </div>
      </div>

      <div className={`modal-overlay ${isOpen('payment') ? '' : 'hidden'}`} id="payment-modal">
        <div className="glass-card modal-content text-center">
          <button className="modal-close" id="btn-pay-modal-close" onClick={onClose}><FormattedMessage id="Modals.025" /></button>
          <div className="payment-icon"><FormattedMessage id="Modals.026" /></div>
          <h3><FormattedMessage id="Modals.027" /></h3>
          <p><FormattedMessage id="Modals.028" /></p>
          <div className="payment-amount"><FormattedMessage id="Modals.036" /> <strong><FormattedMessage id="Modals.037" /></strong></div>
          <button className="btn btn-gradient btn-block" id="btn-pay-submit" onClick={handlePayment}><FormattedMessage id="Modals.038" /></button>
          <p className="payment-security-text"><FormattedMessage id="Modals.039" /></p>
        </div>
      </div>

      <div className={`modal-overlay ${isOpen('auth') ? '' : 'hidden'}`} id="auth-modal">
        <div className="glass-card modal-content text-center" style={{ maxWidth: 500 }}>
          <button className="modal-close" id="btn-auth-modal-close" onClick={onClose}><FormattedMessage id="Modals.040" /></button>
          <div className="auth-tabs">
            <button className={`auth-tab-btn ${authView === 'login' ? 'active' : ''}`} id="tab-login" onClick={() => setAuthView('login')}><FormattedMessage id="Modals.041" /></button>
            <button className={`auth-tab-btn ${authView === 'register' ? 'active' : ''}`} id="tab-register" onClick={() => setAuthView('register')}><FormattedMessage id="Modals.042" /></button>
          </div>

          {authView === 'login' ? (
            <form id="form-login" className="modal-form" style={{ textAlign: 'left', marginTop: 20 }} onSubmit={handleAuthSubmit}>
              <div className="form-group">
                <label htmlFor="login-email"><FormattedMessage id="Modals.043" /></label>
                <input 
                  key={prefillEmail || 'login-email-key'}
                  type="email" 
                  id="login-email" 
                  name="email" 
                  required 
                  autoComplete="email"
                  defaultValue={prefillEmail || ''} 
                  placeholder={intl.formatMessage({ id: "Modals.044" })} 
                />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label htmlFor="login-password" style={{ margin: 0 }}><FormattedMessage id="Modals.045" /></label>
                  <button 
                    type="button" 
                    onClick={() => setAuthView('forgot')} 
                    style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '0.8rem', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                  >
                    {language === 'es' ? '¿Olvidó su contraseña?' : language === 'pt' ? 'Esqueceu a senha?' : 'Forgot password?'}
                  </button>
                </div>
                <input 
                  type="password" 
                  id="login-password" 
                  name="password" 
                  required 
                  autoComplete="current-password"
                  placeholder={intl.formatMessage({ id: "Modals.046" })} 
                />
              </div>
              <button type="submit" className="btn btn-gradient btn-block" style={{ marginTop: 12 }}><FormattedMessage id="Modals.047" /></button>
            </form>
          ) : authView === 'forgot' ? (
            <form id="form-forgot" className="modal-form" style={{ textAlign: 'left', marginTop: 20 }} onSubmit={handleForgotPasswordSubmit}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '15px', lineHeight: '1.4' }}>
                {language === 'es' 
                  ? 'Ingrese su correo electrónico y le enviaremos las instrucciones para restablecer su contraseña.' 
                  : language === 'pt' 
                    ? 'Insira seu e-mail e enviaremos as instruções para redefinir sua senha.' 
                    : 'Enter your email and we will send you instructions to reset your password.'}
              </p>
              <div className="form-group">
                <label htmlFor="forgot-email"><FormattedMessage id="Modals.043" /></label>
                <input type="email" id="forgot-email" name="email" required placeholder={intl.formatMessage({ id: "Modals.044" })} />
              </div>
              <button type="submit" className="btn btn-gradient btn-block" style={{ marginTop: 12 }}>
                {language === 'es' ? 'Enviar correo de recuperación' : language === 'pt' ? 'Enviar e-mail de recuperação' : 'Send recovery email'}
              </button>
              <button type="button" className="btn btn-outline btn-block" style={{ marginTop: 8 }} onClick={() => setAuthView('login')}>
                {language === 'es' ? 'Volver al inicio de sesión' : language === 'pt' ? 'Voltar ao login' : 'Back to login'}
              </button>
            </form>
          ) : authView === 'resetPassword' ? (
            <form id="form-reset-password" className="modal-form" style={{ textAlign: 'left', marginTop: 20 }} onSubmit={handleConfirmPasswordResetSubmit}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--text-primary)' }}>
                {language === 'es' ? 'Establecer Nueva Contraseña' : language === 'pt' ? 'Definir Nova Senha' : 'Set New Password'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '15px', lineHeight: '1.4' }}>
                {language === 'es' 
                  ? 'Ingrese su nueva contraseña para actualizar las credenciales de su cuenta.' 
                  : language === 'pt' 
                    ? 'Insira sua nova senha para atualizar as credenciais da sua conta.' 
                    : 'Enter your new password to update your account credentials.'}
              </p>
              {resetErrorBanner && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center', fontWeight: 600 }}>
                  ⚠️ {resetErrorBanner}
                </div>
              )}
              <div className="form-group">
                <label htmlFor="reset-new-password">
                  {language === 'es' ? 'Nueva Contraseña' : language === 'pt' ? 'Nova Senha' : 'New Password'}
                </label>
                <input 
                  type="password" 
                  id="reset-new-password" 
                  name="newPassword" 
                  required 
                  minLength={8}
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder={language === 'es' ? 'Mínimo 8 caracteres' : language === 'pt' ? 'Mínimo 8 caracteres' : 'Minimum 8 characters'} 
                />
                <PasswordRequirementsBadges policy={checkPasswordPolicy(resetNewPassword)} language={language} />
              </div>
              <button type="submit" className="btn btn-gradient btn-block" style={{ marginTop: 12 }} disabled={resetPasswordLoading || !checkPasswordPolicy(resetNewPassword).isValid}>
                {resetPasswordLoading 
                  ? (language === 'es' ? 'Guardando...' : 'Saving...') 
                  : (language === 'es' ? 'Guardar Nueva Contraseña' : language === 'pt' ? 'Salvar Nova Senha' : 'Save New Password')}
              </button>
              <button type="button" className="btn btn-outline btn-block" style={{ marginTop: 8 }} onClick={() => setAuthView('login')}>
                {language === 'es' ? 'Cancelar y volver' : language === 'pt' ? 'Cancelar e voltar' : 'Cancel & return'}
              </button>
            </form>
          ) : (
            <form id="form-register" className="modal-form" style={{ textAlign: 'left', marginTop: 20 }} onSubmit={handleAuthSubmit}>
              <div className="form-group">
                <label htmlFor="auth-reg-user-type"><FormattedMessage id="Modals.048" /></label>
                <select id="auth-reg-user-type" name="type" required value={registerType} onChange={(event) => setRegisterType(event.target.value)}>
                  <option value="personal"><FormattedMessage id="Modals.049" /></option>
                  <option value="empresa"><FormattedMessage id="Modals.050" /></option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="auth-reg-firstname"><FormattedMessage id="Modals.051" /></label>
                  <input type="text" id="auth-reg-firstname" name="firstName" required placeholder={intl.formatMessage({ id: "Modals.052" })} />
                </div>
                <div className="form-group">
                  <label htmlFor="auth-reg-lastname"><FormattedMessage id="Modals.051a" /></label>
                  <input type="text" id="auth-reg-lastname" name="lastName" required placeholder={intl.formatMessage({ id: "Modals.052a" })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="auth-reg-companyname"><FormattedMessage id="Modals.051b" /></label>
                  <input type="text" id="auth-reg-companyname" name="companyName" required placeholder={intl.formatMessage({ id: "Modals.052b" })} />
                </div>
                <div className="form-group">
                  <label htmlFor="auth-reg-website">
                    {language === 'es' ? 'Sitio Web de la Empresa *' : language === 'pt' ? 'Site da Empresa *' : 'Company Website *'}
                  </label>
                  <input
                    type="text"
                    id="auth-reg-website"
                    name="website"
                    required
                    placeholder={language === 'es' ? 'Ej. https://miempresa.com' : language === 'pt' ? 'Ex. https://minhaempresa.com' : 'e.g. https://mycompany.com'}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="auth-reg-country"><FormattedMessage id="Modals.059" /></label>
                  <select id="auth-reg-country" name="country" required defaultValue="">
                    <option value="" disabled>{intl.formatMessage({ id: "Modals.060" })}</option>
                    <option value="España">España</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Colombia">Colombia</option>
                    <option value="México">México</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Australia">Australia</option>
                    <option value="Resto de Europa">Resto de Europa</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="auth-reg-email"><FormattedMessage id="Modals.053" /></label>
                  <input type="email" id="auth-reg-email" name="email" required placeholder={intl.formatMessage({ id: "Modals.054" })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="auth-reg-password"><FormattedMessage id="Modals.057" /></label>
                  <input 
                    type="password" 
                    id="auth-reg-password" 
                    name="password" 
                    required 
                    minLength={8} 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder={intl.formatMessage({ id: "Modals.058" })} 
                  />
                  <PasswordRequirementsBadges policy={checkPasswordPolicy(regPassword)} language={language} />
                </div>
              </div>
              {registerType === 'empresa' && (
                <CompanyFields prefix="auth-reg" intl={intl} language={language} />
              )}
              <button type="submit" className="btn btn-gradient btn-block" style={{ marginTop: 12 }}><FormattedMessage id="Modals.083" /></button>
            </form>
          )}
        </div>
      </div>

      <div className={`modal-overlay ${isOpen('account') ? '' : 'hidden'}`} id="account-modal">
        <div className="glass-card modal-content portal-modal" style={{ maxWidth: 650, width: '90%' }}>
          <button className="modal-close" id="btn-account-modal-close" onClick={onClose}><FormattedMessage id="Modals.084" /></button>
          
          <div className="portal-header" style={{ marginBottom: '15px' }}>
            <h3 id="account-title-name" style={{ margin: 0 }}>{currentUser?.name || <FormattedMessage id="Modals.086" />}</h3>
            <span className="user-badge-type" style={{ display: 'inline-block', marginTop: '5px', padding: '3px 10px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontSize: '0.85rem', fontWeight: 600 }}>
              {currentUser?.type === 'empresa' ? (language === 'es' ? 'Empresa B2B' : 'B2B Enterprise') : <FormattedMessage id="Modals.087" />}
            </span>
          </div>

          {/* TAB NAVIGATION */}
          <div className="portal-tabs" style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px', paddingBottom: '5px', flexWrap: 'wrap' }}>
            <button className={`portal-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')} style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#10B981' : 'var(--text-secondary)', fontWeight: 600, padding: '8px 12px', borderBottom: activeTab === 'dashboard' ? '2px solid #10B981' : 'none', cursor: 'pointer' }}>
              {language === 'es' ? 'Dashboard' : 'Dashboard'}
            </button>
            {currentUser?.type === 'empresa' && (
              <>
                <button className={`portal-tab-btn ${activeTab === 'downloads' ? 'active' : ''}`} onClick={() => setActiveTab('downloads')} style={{ background: 'none', border: 'none', color: activeTab === 'downloads' ? '#10B981' : 'var(--text-secondary)', fontWeight: 600, padding: '8px 12px', borderBottom: activeTab === 'downloads' ? '2px solid #10B981' : 'none', cursor: 'pointer' }}>
                  {language === 'es' ? 'Descargas' : 'Downloads'}
                </button>
                <button className={`portal-tab-btn ${activeTab === 'brand' ? 'active' : ''}`} onClick={() => setActiveTab('brand')} style={{ background: 'none', border: 'none', color: activeTab === 'brand' ? '#10B981' : 'var(--text-secondary)', fontWeight: 600, padding: '8px 12px', borderBottom: activeTab === 'brand' ? '2px solid #10B981' : 'none', cursor: 'pointer' }}>
                  {language === 'es' ? 'Personalizar Sello' : 'Customize Seal'}
                </button>
              </>
            )}
            {(currentUser?.role === 'admin' || currentUser?.email?.toLowerCase().startsWith("admin")) && (
              <button className={`portal-tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')} style={{ background: 'none', border: 'none', color: activeTab === 'admin' ? '#10B981' : 'var(--text-secondary)', fontWeight: 600, padding: '8px 12px', borderBottom: activeTab === 'admin' ? '2px solid #10B981' : 'none', cursor: 'pointer' }}>
                {language === 'es' ? 'Administración' : 'Administration'}
              </button>
            )}
            <button className={`portal-tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} style={{ background: 'none', border: 'none', color: activeTab === 'settings' ? '#10B981' : 'var(--text-secondary)', fontWeight: 600, padding: '8px 12px', borderBottom: activeTab === 'settings' ? '2px solid #10B981' : 'none', cursor: 'pointer' }}>
              {language === 'es' ? 'Configuración' : 'Settings'}
            </button>
          </div>

          <div className="portal-body" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '5px' }}>
            {/* TAB 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="portal-tab-content">
                <div className="dashboard-summary" style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                  <h4 style={{ marginTop: 0, marginBottom: '12px', color: 'var(--text-primary)' }}>{language === 'es' ? 'Información General' : 'General Info'}</h4>
                  <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.9rem' }}>
                    <div><strong>Email:</strong> {currentUser?.email || '-'}</div>
                    {currentUser?.type === 'empresa' && (
                      <>
                        <div><strong>{language === 'es' ? 'Web:' : 'Web:'}</strong> {currentUser?.website || '-'}</div>
                        <div><strong>{language === 'es' ? 'Tamaño de Empresa:' : 'Company Size:'}</strong> {currentUser?.companySize || '-'}</div>
                        <div><strong>{language === 'es' ? 'Sector de la Economía:' : 'Economic Sector:'}</strong> {currentUser?.sector === 'privado' ? (language === 'es' ? 'Privado' : 'Private') : (language === 'es' ? 'Público' : 'Public')}</div>
                        <div><strong>{language === 'es' ? 'Vertical de negocio:' : 'Business Vertical:'}</strong> {currentUser?.subsector || '-'}</div>
                        <div><strong>{language === 'es' ? 'Cargo:' : 'Role:'}</strong> {currentUser?.role || '-'}</div>
                      </>
                    )}
                    <div><strong>{language === 'es' ? 'País:' : 'Country:'}</strong> {currentUser?.country || '-'}</div>
                  </div>
                </div>

                {currentUser?.type === 'empresa' ? (
                  <div className="maturity-section">
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '15px' }}>{language === 'es' ? 'Madurez del Autodiagnóstico B2B' : 'B2B Maturity Assessment'}</h4>
                    {loadingEval ? (
                      <p>{language === 'es' ? 'Cargando evaluación...' : 'Loading assessment...'}</p>
                    ) : (userEvaluation || latestDiagnostic) ? (
                      (() => {
                        const evalData = userEvaluation || {
                          globalScore: latestDiagnostic?.score || 0,
                          scores: latestDiagnostic?.scores || { pilar1: 0, pilar2: 0, pilar3: 0, pilar4: 0, pilar5: 0 }
                        };
                        const globalScore = evalData.globalScore ?? evalData.score ?? 0;
                        const pScores = evalData.scores || { pilar1: 0, pilar2: 0, pilar3: 0, pilar4: 0, pilar5: 0 };
                        
                        return (
                          <div className="evaluation-maturity-display">
                            <div className="maturity-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '1rem', fontWeight: 600 }}>
                              <span className="maturity-score-label">{language === 'es' ? 'Puntuación Global:' : 'Global Score:'}</span>
                              <span className="maturity-score-value" style={{ color: '#10B981' }}>{globalScore}%</span>
                            </div>
                            <div className="maturity-progress-track" style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                              <div className="maturity-progress-fill" style={{ height: '100%', width: `${globalScore}%`, backgroundColor: '#10B981', borderRadius: '4px', transition: 'width 0.5s' }} />
                            </div>

                            <div className="portal-pillar-scores" style={{ background: 'rgba(30, 41, 59, 0.3)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                              <h5 style={{ marginTop: 0, marginBottom: '15px', fontSize: '0.95rem' }}>{language === 'es' ? 'Puntuaciones por Eje (Pilar)' : 'Axis Scores (Pillars)'}</h5>
                              
                              <div className="portal-pilar-row" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
                                <span className="pilar-lbl" style={{ minWidth: '120px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{language === 'es' ? 'Eje Laboral:' : 'Labor Axis:'}</span>
                                <div className="pilar-bar-track" style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}><div className="pilar-bar-fill" style={{ height: '100%', width: `${pScores.pilar1}%`, backgroundColor: '#10B981' }} /></div>
                                <span className="pilar-pct" style={{ minWidth: '35px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600 }}>{pScores.pilar1}%</span>
                              </div>
                              <div className="portal-pilar-row" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
                                <span className="pilar-lbl" style={{ minWidth: '120px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{language === 'es' ? 'Eje Conciliación:' : 'Work-Life Balance:'}</span>
                                <div className="pilar-bar-track" style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}><div className="pilar-bar-fill" style={{ height: '100%', width: `${pScores.pilar2}%`, backgroundColor: '#10B981' }} /></div>
                                <span className="pilar-pct" style={{ minWidth: '35px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600 }}>{pScores.pilar2}%</span>
                              </div>
                              <div className="portal-pilar-row" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
                                <span className="pilar-lbl" style={{ minWidth: '120px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{language === 'es' ? 'Eje Consumidor:' : 'Consumer Axis:'}</span>
                                <div className="pilar-bar-track" style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}><div className="pilar-bar-fill" style={{ height: '100%', width: `${pScores.pilar3}%`, backgroundColor: '#10B981' }} /></div>
                                <span className="pilar-pct" style={{ minWidth: '35px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600 }}>{pScores.pilar3}%</span>
                              </div>
                              <div className="portal-pilar-row" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
                                <span className="pilar-lbl" style={{ minWidth: '120px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{language === 'es' ? 'Eje Salud:' : 'Health Axis:'}</span>
                                <div className="pilar-bar-track" style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}><div className="pilar-bar-fill" style={{ height: '100%', width: `${pScores.pilar4}%`, backgroundColor: '#10B981' }} /></div>
                                <span className="pilar-pct" style={{ minWidth: '35px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600 }}>{pScores.pilar4}%</span>
                              </div>
                              <div className="portal-pilar-row" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span className="pilar-lbl" style={{ minWidth: '120px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{language === 'es' ? 'Eje Comunitario:' : 'Community Axis:'}</span>
                                <div className="pilar-bar-track" style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}><div className="pilar-bar-fill" style={{ height: '100%', width: `${pScores.pilar5}%`, backgroundColor: '#10B981' }} /></div>
                                <span className="pilar-pct" style={{ minWidth: '35px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600 }}>{pScores.pilar5}%</span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '15px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start' }}>
                              <a href="#autodiagnostico" onClick={onClose} style={{ color: '#10B981', textDecoration: 'underline', fontWeight: 600, fontSize: '0.9rem' }}>
                                {language === 'es' ? 'Ir al Autodiagnóstico' : language === 'pt' ? 'Ir para o Autodiagnóstico' : 'Go to Self-Assessment'}
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  if (onOpenPitch) onOpenPitch();
                                }}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  padding: 0,
                                  color: '#3b82f6',
                                  textDecoration: 'underline',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  fontSize: '0.9rem'
                                }}
                              >
                                📄 {language === 'es' ? 'Descargar Pitch Corporativo' : language === 'pt' ? 'Baixar Pitch Corporativo' : 'Download Corporate Pitch'}
                              </button>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="no-evaluation-box" style={{ background: 'rgba(251, 191, 36, 0.05)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          {language === 'es' 
                            ? 'Aún no has completado un autodiagnóstico. Completa el cuestionario en la página principal para ver tus métricas.'
                            : language === 'pt'
                              ? 'Você ainda não concluiu um autodiagnóstico. Preencha o questionário na página principal para ver suas métricas.'
                              : 'You have not completed a self-assessment yet. Run the diagnostic on the home page to view metrics.'}
                        </p>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <a href="#autodiagnostico" onClick={onClose} style={{ color: '#10B981', textDecoration: 'underline', fontWeight: 600, fontSize: '0.9rem' }}>
                            {language === 'es' ? 'Ir al Autodiagnóstico' : language === 'pt' ? 'Ir para o Autodiagnóstico' : 'Go to Self-Assessment'}
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (onOpenPitch) onOpenPitch();
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: 0,
                              color: '#3b82f6',
                              textDecoration: 'underline',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                          >
                            📄 {language === 'es' ? 'Descargar Pitch Corporativo' : language === 'pt' ? 'Baixar Pitch Corporativo' : 'Download Corporate Pitch'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div id="upgrade-section" style={{ borderTop: '1px dashed var(--border-color)', paddingTop: 20 }}>
                    <h4 style={{ color: 'var(--accent-blue)', marginBottom: 8 }}><FormattedMessage id="Modals.098" /></h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}><FormattedMessage id="Modals.099" /></p>
                    
                    <div className="info-callout" style={{
                      background: 'rgba(59, 130, 246, 0.08)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      marginBottom: '20px',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      textAlign: 'left'
                    }}>
                      <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>ℹ️</span>
                      <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: '1.5', color: '#93c5fd' }}>
                        {language === 'es'
                          ? 'Estimado Usuario: para acceder al Autodiagnóstico de Certificación o descargar el Pitch Corporativo, es necesario ingresar los datos de su organización. Por favor complete los siguientes datos.'
                          : language === 'pt'
                            ? 'Prezado Usuário: para acessar o Autodiagnóstico de Certificação ou baixar o Pitch Corporativo, é necessário inserir os dados da sua organização. Por favor, preencha os seguintes dados.'
                            : 'Dear User: to access the Certification Self-Diagnostic or download the Corporate Pitch, it is necessary to enter your organization\'s information. Please complete the following details.'}
                      </p>
                    </div>

                    <form id="form-upgrade" className="modal-form" onSubmit={handleUpgrade}>
                      <div className="form-group">
                        <label htmlFor="upg-company-size-select">{language === 'es' ? 'Tamaño de la Empresa *' : 'Company Size *'}</label>
                        <select id="upg-company-size-select" name="companySize" required>
                          <option value="">{language === 'es' ? 'Seleccionar tamaño...' : 'Select size...'}</option>
                          <option value="Micro (1-9 empleados)">Micro (1-9 empleados)</option>
                          <option value="Pequeña (10-49 empleados)">Pequeña (10-49 empleados)</option>
                          <option value="Mediana (50-249 empleados)">Mediana (50-249 empleados)</option>
                          <option value="Grande (250+ empleados)">Grande (250+ empleados)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="upg-sector-type"><FormattedMessage id="Modals.100" /></label>
                        <select id="upg-sector-type" name="sector" required value={upgradeSector} onChange={(event) => setUpgradeSector(event.target.value)}>
                          <option value=""><FormattedMessage id="Modals.101" /></option>
                          <option value="privado"><FormattedMessage id="Modals.102" /></option>
                          <option value="publico"><FormattedMessage id="Modals.103" /></option>
                        </select>
                      </div>
                      {upgradeSector === 'publico' && (
                        <div className="form-group">
                          <label htmlFor="upg-subsector">{language === 'es' ? 'Vertical de negocio' : 'Business Vertical'}</label>
                          <select id="upg-subsector" name="subsector" required>
                            <option value="PÚBLICO">
                              {language === 'es' || language === 'pt'
                                ? "Relacionado con el desarrollo de 'Ciudades Amigables con las Personas Mayores', la creación de Sistemas Nacionales de Cuidados y la inclusión digital ciudadana (e-Government)"
                                : "Related to the development of 'Age-Friendly Cities', the creation of National Care Systems, and citizen digital inclusion (e-Government)"}
                            </option>
                          </select>
                        </div>
                      )}
                      {upgradeSector === 'privado' && (
                        <div className="form-group">
                          <label htmlFor="upg-subsector">{language === 'es' ? 'Vertical de negocio' : 'Business Vertical'}</label>
                          <select id="upg-subsector" name="subsector" required>
                            <option value="">{language === 'es' ? 'Seleccionar vertical...' : 'Select vertical...'}</option>
                            <option value="Finanzas y Seguro">{language === 'es' ? 'Finanzas y Seguros' : 'Finance and Insurance'}</option>
                            <option value="Salud y Farmacia">{language === 'es' ? 'Salud, Farmacia y Sociosanitario' : 'Health, Pharmacy, and Social Care'}</option>
                            <option value="Tecnologia e Software">{language === 'es' ? 'Tecnología y Software (AgeTech)' : 'Technology and Software (AgeTech)'}</option>
                            <option value="Comercio y Distribución">{language === 'es' ? 'Comercio y Distribución (Retail)' : 'Retail and Distribution'}</option>
                            <option value="Manufactura e Industria">{language === 'es' ? 'Manufactura e Industria' : 'Manufacturing and Industry'}</option>
                            <option value="Educación">{language === 'es' ? 'Educación y Formación Continua' : 'Education and Continuing Education'}</option>
                            <option value="Bienes Raíces, Urbanismo y Vivienda (Senior Living)">{language === 'es' ? 'Bienes Raíces, Urbanismo y Vivienda (Senior Living)' : 'Real Estate, Urbanism, and Housing (Senior Living)'}</option>
                            <option value="Energía y Recursos Naturales">{language === 'es' ? 'Energía, Agua y Servicios Básicos' : 'Energy, Water, and Basic Services'}</option>
                            <option value="Entretenimiento, Medios y Turismo">{language === 'es' ? 'Ocio, Entretenimiento, Medios y Turismo Silver' : 'Leisure, Entertainment, Media, and Silver Tourism'}</option>
                          </select>
                        </div>
                      )}
                      <div className="form-group">
                        <label htmlFor="upg-role"><FormattedMessage id="Modals.120" /></label>
                        <input type="text" id="upg-role" name="role" required placeholder={intl.formatMessage({ id: "Modals.121" })} />
                      </div>
                      <button type="submit" className="btn btn-gradient btn-block"><FormattedMessage id="Modals.122" /></button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DOWNLOADS */}
            {activeTab === 'downloads' && currentUser?.type === 'empresa' && (
              <div className="portal-tab-content">
                <div className="downloads-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div className="download-card" style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
                    <div>
                      <div className="download-card-icon" style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{language === 'es' ? 'Reporte Completo Excel (.xlsx)' : 'Complete Excel Report (.xlsx)'}</h5>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{language === 'es' ? 'Descarga la matriz histórica completa de tus respuestas y puntuaciones para auditorías internas y consultoría.' : 'Download your full answers matrix and scorecard for internal audits and consulting.'}</p>
                    </div>
                    <button className="btn btn-primary btn-block" onClick={downloadExcelReport} style={{ marginTop: '15px' }}>
                      {language === 'es' ? 'Descargar Excel' : 'Download Excel'}
                    </button>
                  </div>

                  <div className="download-card" style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
                    <div>
                      <div className="download-card-icon" style={{ fontSize: '2rem', marginBottom: '10px' }}>🏅</div>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{language === 'es' ? 'Sello de Compromiso (SVG)' : 'Commitment Seal (SVG)'}</h5>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{language === 'es' ? 'Gráfico vectorial escalable transparente del Sello con el nombre de tu empresa, ideal para firmas de correo y sitios web.' : 'Vector scalable transparent graphic of the Seal with your company name, ideal for email signatures and websites.'}</p>
                    </div>
                    <button className="btn btn-outline btn-block" onClick={downloadSvgBadge} style={{ marginTop: '15px' }}>
                      {language === 'es' ? 'Descargar SVG' : 'Download SVG'}
                    </button>
                  </div>

                  <div className="download-card" style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
                    <div>
                      <div className="download-card-icon" style={{ fontSize: '2rem', marginBottom: '10px' }}>🖼️</div>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{language === 'es' ? 'Sello de Compromiso (PNG)' : 'Commitment Seal (PNG)'}</h5>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{language === 'es' ? 'Imagen de alta resolución lista para publicar en tu perfil de LinkedIn corporativo o reportes ESG trimestrales.' : 'High-resolution image ready to publish on your corporate LinkedIn profile or quarterly ESG reports.'}</p>
                    </div>
                    <button className="btn btn-outline btn-block" onClick={downloadPngBadge} style={{ marginTop: '15px' }}>
                      {language === 'es' ? 'Descargar PNG' : 'Download PNG'}
                    </button>
                  </div>

                  <div className="download-card" style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
                    <div>
                      <div className="download-card-icon" style={{ fontSize: '2rem', marginBottom: '10px' }}>📦</div>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{language === 'es' ? 'Kit de Marca Completo (.zip)' : 'Full Brand Kit (.zip)'}</h5>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{language === 'es' ? 'Archivo comprimido con las versiones SVG y PNG transparentes de tu Sello personalizado e instrucciones de uso oficiales.' : 'Compressed archive with transparent SVG and PNG versions of your custom Seal, and official usage instructions.'}</p>
                    </div>
                    <button className="btn btn-gradient btn-block" onClick={downloadZipKit} style={{ marginTop: '15px' }}>
                      {language === 'es' ? 'Descargar Kit .zip' : 'Download Kit .zip'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BRAND CUSTOMIZATION */}
            {activeTab === 'brand' && currentUser?.type === 'empresa' && (
              <div className="portal-tab-content brand-custom-tab" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>
                  {language === 'es' ? 'Diseño del Sello Personalizado' : 'Custom Badge Design'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {language === 'es' 
                    ? 'Personaliza el distintivo oficial con tu logotipo y colores corporativos. Se inyectarán automáticamente al descargar tu Sello y al emitir tus kits de marca.' 
                    : 'Personalize your official seal with your corporate logo and brand colors. They will be automatically embedded in downloads and brand kits.'}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start', marginTop: '10px' }}>
                  {/* Left Column: Controls */}
                  <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {/* Logo upload */}
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
                        {language === 'es' ? 'Logotipo de la Empresa' : 'Company Logo'}
                      </label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <label className="btn btn-outline" style={{ margin: 0, cursor: 'pointer', display: 'inline-flex', padding: '8px 12px', fontSize: '0.85rem' }}>
                          {uploadingLogo ? (language === 'es' ? 'Subiendo...' : 'Uploading...') : (language === 'es' ? 'Subir Imagen' : 'Upload Image')}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleBrandLogoChange} 
                            disabled={uploadingLogo}
                            style={{ display: 'none' }} 
                          />
                        </label>
                        {brandLogo && (
                          <button 
                            type="button" 
                            className="btn" 
                            onClick={() => setBrandLogo(null)} 
                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '8px 12px', fontSize: '0.85rem' }}
                          >
                            {language === 'es' ? 'Remover' : 'Remove'}
                          </button>
                        )}
                      </div>
                      <small style={{ display: 'block', marginTop: '4px', color: 'var(--text-muted)' }}>
                        {language === 'es' ? 'PNG, JPG o SVG. Máx. 2MB. Se recortará en forma circular.' : 'PNG, JPG or SVG. Max 2MB. Will be clipped into a circle.'}
                      </small>
                    </div>

                    {/* Color selection */}
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label htmlFor="color-primary" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>
                          {language === 'es' ? 'Color Primario' : 'Primary Color'}
                        </label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input 
                            type="color" 
                            id="color-primary" 
                            value={hexPrimary} 
                            onChange={(e) => setHexPrimary(e.target.value)} 
                            style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                          />
                          <input 
                            type="text" 
                            value={hexPrimary} 
                            onChange={(e) => setHexPrimary(e.target.value)} 
                            maxLength={7}
                            style={{ width: '80px', padding: '6px', textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase' }} 
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ flex: 1 }}>
                        <label htmlFor="color-secondary" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>
                          {language === 'es' ? 'Color Secundario' : 'Secondary Color'}
                        </label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input 
                            type="color" 
                            id="color-secondary" 
                            value={hexSecondary} 
                            onChange={(e) => setHexSecondary(e.target.value)} 
                            style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                          />
                          <input 
                            type="text" 
                            value={hexSecondary} 
                            onChange={(e) => setHexSecondary(e.target.value)} 
                            maxLength={7}
                            style={{ width: '80px', padding: '6px', textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase' }} 
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      className="btn btn-gradient btn-block" 
                      onClick={handleSaveBrandAssets}
                      style={{ marginTop: '10px' }}
                    >
                      {language === 'es' ? 'Guardar Diseño de Marca' : 'Save Brand Identity'}
                    </button>
                  </div>

                  {/* Right Column: Dynamic Live Preview */}
                  <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'rgba(30, 41, 59, 0.2)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {language === 'es' ? 'VISTA PREVIA EN VIVO' : 'LIVE PREVIEW'}
                    </span>
                    <SVGMatrix 
                      logoUrl={brandLogo}
                      hexPrimary={hexPrimary}
                      hexSecondary={hexSecondary}
                      text={currentUser?.name ? `${currentUser.name} • ${currentUser.certificationStage || "Compromiso Inicial"}` : "Age Friend Seal • Compromiso Inicial"}
                      size={200}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ADMINISTRATION (Admin only) */}
            {activeTab === 'admin' && (currentUser?.role === 'admin' || currentUser?.email?.toLowerCase().startsWith("admin")) && (
              <div className="portal-tab-content admin-tab" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>
                  {language === 'es' ? 'Panel de Control de Certificaciones' : 'Certifications Master Control'}
                </h4>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '5px' }}>
                  <button 
                    className="btn btn-outline" 
                    disabled={exportingUsers || loadingAdminUsers} 
                    onClick={downloadUsersExcel}
                    style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {exportingUsers ? (
                      <>
                        <span style={{ 
                          width: '12px', 
                          height: '12px', 
                          border: '2px solid currentColor', 
                          borderTopColor: 'transparent', 
                          borderRadius: '50%', 
                          display: 'inline-block', 
                          animation: 'spin 1s linear infinite' 
                        }} />
                        <span>{language === 'es' ? 'Descargando...' : 'Downloading...'}</span>
                      </>
                    ) : (
                      <>
                        👥 {language === 'es' ? 'Exportar Usuarios' : 'Export Users'}
                      </>
                    )}
                  </button>
                </div>
                
                {loadingAdminUsers ? (
                  <p>{language === 'es' ? 'Cargando empresas...' : 'Loading companies...'}</p>
                ) : (
                  <div className="admin-users-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                    {adminUsers.map(user => {
                      const isCurrentUserActive = adminActiveUser === user.uid;
                      
                      return (
                        <div 
                          key={user.uid} 
                          style={{ 
                            background: isCurrentUserActive ? 'rgba(16, 185, 129, 0.05)' : 'rgba(30, 41, 59, 0.4)', 
                            border: isCurrentUserActive ? '1px solid #10B981' : '1px solid var(--border-color)',
                            borderRadius: '8px', 
                            padding: '12px' 
                          }}
                        >
                          {/* Header row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <h5 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                {user.companyName || user.name || "Usuario Personal"}
                              </h5>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {user.email} | Sector: {user.economicSector || user.sector || 'N/A'} | Vertical: {user.verticalBusiness || user.subsector || 'N/A'}
                              </span>
                            </div>
                            <span 
                              style={{ 
                                padding: '2px 8px', 
                                borderRadius: '4px', 
                                fontSize: '0.75rem', 
                                fontWeight: 700, 
                                background: 'rgba(245, 158, 11, 0.1)', 
                                color: '#f59e0b' 
                              }}
                            >
                              {user.certificationStage || "Compromiso Inicial"}
                            </span>
                          </div>

                          {/* Action controls toggled on click */}
                          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between' }}>
                            {/* Stage Update */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {language === 'es' ? 'Etapa:' : 'Stage:'}
                              </label>
                              <select 
                                defaultValue={user.certificationStage || "Compromiso Inicial"}
                                onChange={(e) => handleUpdateUserStage(user.uid, e.target.value)}
                                style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', background: '#0b0f19', color: '#fff', border: '1px solid var(--border-color)' }}
                              >
                                <option value="Compromiso Inicial">Compromiso Inicial</option>
                                <option value="En Auditoría">En Auditoría</option>
                                <option value="Certificado Nivel Medio">Certificado Nivel Medio</option>
                                <option value="Certificado Nivel Premium">Certificado Nivel Premium</option>
                                <option value="Suspendido">Suspendido</option>
                              </select>
                            </div>

                            {/* Logo view */}
                            {user.brandAssets?.logoUrl && (
                              <a 
                                href={user.brandAssets.logoUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={{ fontSize: '0.8rem', color: '#10B981', textDecoration: 'underline' }}
                              >
                                {language === 'es' ? 'Ver Logo Cliente' : 'View Client Logo'}
                              </a>
                            )}

                            {/* Upload deliverable zip */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <label className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem', margin: 0, cursor: 'pointer' }}>
                                {uploadingDeliverable && adminActiveUser === user.uid 
                                  ? (language === 'es' ? 'Subiendo...' : 'Uploading...') 
                                  : (language === 'es' ? 'Vincular Kit .zip' : 'Link Kit .zip')}
                                <input 
                                  type="file" 
                                  accept=".zip" 
                                  onChange={(e) => { 
                                    setAdminActiveUser(user.uid); 
                                    handleUploadDeliverableFile(user.uid, e); 
                                  }} 
                                  style={{ display: 'none' }} 
                                />
                              </label>
                            </div>
                          </div>

                          {/* Show deliverables associated to company if active */}
                          {isCurrentUserActive && adminDeliverables.length > 0 && (
                            <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                              <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                                {language === 'es' ? 'Kits Vinculados:' : 'Linked Kits:'}
                              </strong>
                              {adminDeliverables.map(del => (
                                <div key={del.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                                  <span>📦 {del.title}</span>
                                  <a href={del.zipUrl} style={{ color: '#10B981' }} download>{language === 'es' ? 'Descargar' : 'Download'}</a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* BANDEJA DE ENTRADA NORMATIVA (LEGAL SCRAPER MONITOR) */}
                <hr style={{ borderColor: 'var(--border-color)', margin: '20px 0' }} />
                
                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⚖️ {language === 'es' ? 'Bandeja de Entrada Normativa (Legal Scraper)' : 'Regulatory Inbox (Legal Scraper)'}
                </h4>
                
                {/* Stats & Route Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {language === 'es' ? 'Fuentes Activas' : 'Active Sources'}
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-color)', marginTop: '4px' }}>4</div>
                  </div>
                  <div style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {language === 'es' ? 'Ruta de Actualización' : 'Update Route'}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24', marginTop: '8px' }}>
                      {automationLevel === 100 ? (language === 'es' ? 'Automática' : 'Automatic') : (language === 'es' ? 'Revisión Manual' : 'Manual Review')}
                    </div>
                  </div>
                </div>

                {/* Filters & Actions Control Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', background: 'rgba(15, 23, 42, 0.3)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                  {/* Dropdown Filter */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {language === 'es' ? 'Filtrar Jurisdicción' : 'Filter Jurisdiction'}
                    </label>
                    <select 
                      value={sourceFilter} 
                      onChange={(e) => setSourceFilter(e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                    >
                      <option value="All">{language === 'es' ? 'Todas' : 'All'}</option>
                      <option value="EU">EU (EUR-Lex)</option>
                      <option value="USA">USA (LegiScan)</option>
                      <option value="Australia">Australia (Federal Register)</option>
                      <option value="LatAm">LatAm (CEPAL/OIT)</option>
                    </select>
                  </div>

                  {/* Slider Control */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1', maxWidth: '250px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>{language === 'es' ? 'Automatización' : 'Automation Level'}</span>
                      <strong style={{ color: 'var(--accent-color)' }}>{automationLevel}%</strong>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="50"
                      value={automationLevel} 
                      onChange={(e) => handleAutomationChange(parseInt(e.target.value))}
                      style={{ accentColor: 'var(--accent-color)', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {automationLevel === 0 ? (language === 'es' ? 'Revisión manual estricta' : 'Strict manual review') : automationLevel === 50 ? (language === 'es' ? 'Semi-automático con sugerencias' : 'Semi-automatic with suggestions') : (language === 'es' ? 'Actualización directa del scoring' : 'Direct scoring auto-update')}
                    </span>
                  </div>

                  {/* Trigger & Export Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn btn-primary" 
                      disabled={loadingScraper} 
                      onClick={triggerScraperScan}
                      style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    >
                      {loadingScraper ? '...' : (language === 'es' ? 'Escanear Fuentes' : 'Scan Sources')}
                    </button>
                    <button 
                      className="btn btn-outline" 
                      onClick={downloadLegalExcel}
                      style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    >
                      📊 {language === 'es' ? 'Exportar Excel' : 'Export Excel'}
                    </button>
                    <button 
                      className="btn btn-outline" 
                      disabled={syncingToDrive} 
                      onClick={syncExcelToDrive}
                      style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      {syncingToDrive ? (
                        <>
                          <span style={{ 
                            width: '12px', 
                            height: '12px', 
                            border: '2px solid currentColor', 
                            borderTopColor: 'transparent', 
                            borderRadius: '50%', 
                            display: 'inline-block', 
                            animation: 'spin 1s linear infinite' 
                          }} />
                          <span>{language === 'es' ? 'Sincronizando...' : 'Syncing...'}</span>
                        </>
                      ) : (
                        <>
                          💾 {language === 'es' ? 'Sincronizar con Drive' : 'Sync with Drive'}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Alerts List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {language === 'es' ? 'Alertas Recientes Detectadas' : 'Recent Alerts Detected'}
                  </h5>
                  
                  {legalAlerts.filter(a => sourceFilter === 'All' || a.source === sourceFilter).length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '15px' }}>
                      {language === 'es' ? 'No se encontraron alertas para este filtro.' : 'No alerts found for this filter.'}
                    </p>
                  ) : (
                    legalAlerts
                      .filter(a => sourceFilter === 'All' || a.source === sourceFilter)
                      .map(alert => {
                        const isApproved = alert.status === 'approved';
                        return (
                          <div 
                            key={alert.id}
                            style={{ 
                              background: 'rgba(30, 41, 59, 0.3)', 
                              border: isApproved ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                              borderRadius: '8px', 
                              padding: '12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', fontWeight: 600 }}>
                                {alert.source}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.8rem', color: alert.relevanceScore >= 0.8 ? '#f59e0b' : '#10B981', fontWeight: 'bold' }}>
                                  LLM: {Math.round(alert.relevanceScore * 100)}% {language === 'es' ? 'Relevancia' : 'Relevance'}
                                </span>
                                {isApproved && (
                                  <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                                    ✓ {language === 'es' ? 'Aprobado y Vinculado' : 'Approved & Linked'}
                                  </span>
                                )}
                              </div>
                            </div>

                            <h6 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{alert.title}</h6>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                              {alert.summary || alert.description}
                            </p>

                            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '8px', borderRadius: '4px', fontSize: '0.75rem', borderLeft: '3px solid var(--accent-color)' }}>
                              <strong style={{ color: 'var(--text-secondary)' }}>{language === 'es' ? 'Recomendación de Ajuste:' : 'Suggested Adjust:'}</strong> {alert.recommendedChange}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                              <a href={alert.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#3b82f6', textDecoration: 'underline' }}>
                                {language === 'es' ? 'Ver Publicación Oficial ↗' : 'View Official Publication ↗'}
                              </a>
                              {!isApproved && (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button 
                                    className="btn btn-outline" 
                                    onClick={() => approveAlert(alert.id, alert.pilarImpacted)}
                                    style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: '#10B981', color: '#10B981' }}
                                  >
                                    {language === 'es' ? 'Aprobar e Vincular' : 'Approve & Link'}
                                  </button>
                                  <button 
                                    className="btn btn-outline" 
                                    onClick={() => ignoreAlert(alert.id)}
                                    style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                                  >
                                    {language === 'es' ? 'Ignorar' : 'Ignore'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>

                {/* Audit Checklist for 15 Questions */}
                <div style={{ marginTop: '20px', background: 'rgba(15, 23, 42, 0.2)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <h5 style={{ margin: '0 0 15px 0', fontSize: '0.95rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>⚙️ {language === 'es' ? 'Status del Cuestionario de Autodiagnóstico' : 'Self-Diagnostic Questionnaire Status'}</span>
                  </h5>

                  {/* Tabs Selector for Sector */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <button 
                      type="button" 
                      onClick={() => setAdminSectorFilter('private')}
                      className={`btn ${adminSectorFilter === 'private' ? 'btn-gradient' : 'btn-outline'}`}
                      style={{ padding: '6px 12px', fontSize: '0.8rem', margin: 0 }}
                    >
                      🏢 {language === 'es' ? 'Sector Privado' : 'Private Sector'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setAdminSectorFilter('public')}
                      className={`btn ${adminSectorFilter === 'public' ? 'btn-gradient' : 'btn-outline'}`}
                      style={{ padding: '6px 12px', fontSize: '0.8rem', margin: 0 }}
                    >
                      🏛️ {language === 'es' ? 'Sector Público' : 'Public Sector'}
                    </button>
                  </div>

                  {/* Vertical Dropdown Selector (Private Only) */}
                  {adminSectorFilter === 'private' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {language === 'es' ? 'Vertical de Industria (9 oficiales):' : 'Industry Vertical (9 official):'}
                      </label>
                      <select
                        value={adminVerticalFilter}
                        onChange={(e) => setAdminVerticalFilter(e.target.value)}
                        style={{ padding: '8px', borderRadius: '6px', background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', maxWidth: '300px' }}
                      >
                        <option value="Finanzas y Seguro">Finanzas y Seguros</option>
                        <option value="Salud y Farmacia">Salud, Farmacia y Sociosanitario</option>
                        <option value="Tecnologia e Software">Tecnología y Software (AgeTech)</option>
                        <option value="Comercio y Distribución">Comercio y Distribución (Retail)</option>
                        <option value="Manufactura e Industria">Manufactura e Industria</option>
                        <option value="Educación">Educación y Formación Continua</option>
                        <option value="Energía y Recursos Naturales">Energía, Agua y Servicios Básicos</option>
                        <option value="Entretenimiento, Medios y Turismo">Ocio, Entretenimiento, Medios y Turismo Silver</option>
                        <option value="Bienes Raíces, Urbanismo y Vivienda (Senior Living)">Bienes Raíces, Urbanismo y Vivienda (Senior Living)</option>
                      </select>
                    </div>
                  )}

                  {/* Questions Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(() => {
                      const filtered = adminQuestions.filter(q => {
                        if (adminSectorFilter === 'public') {
                          return q.applicable_verticals.includes('PÚBLICO');
                        } else {
                          return q.applicable_verticals.includes(adminVerticalFilter);
                        }
                      });

                      if (filtered.length === 0) {
                        return (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>
                            {language === 'es' ? 'No se encontraron preguntas en la base de datos para esta combinación. Ejecute un escaneo o inicialice.' : 'No questions found in the database. Run a scan or initialize.'}
                          </p>
                        );
                      }

                      return filtered.map((q, idx) => {
                        const isFlagged = q.status === 'under_review';
                        const questionText = language === 'es' ? q.text_es : language === 'pt' ? q.text_pt : q.text_en;
                        
                        return (
                          <div 
                            key={q.id} 
                            style={{ 
                              background: 'rgba(0,0,0,0.15)', 
                              padding: '12px', 
                              borderRadius: '6px', 
                              fontSize: '0.8rem',
                              borderLeft: isFlagged ? '3px solid #fbbf24' : '3px solid #10b981'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                              <div style={{ flex: 1 }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Q{idx + 1}:</span> {questionText}
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                  Pilar: {q.pilar} | ID: {q.id}
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                {isFlagged ? (
                                  <>
                                    <span style={{ color: '#fbbf24', fontWeight: 600, fontSize: '0.75rem', background: 'rgba(251, 191, 36, 0.1)', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                                      ⚠️ {language === 'es' ? 'Revisión Sugerida' : 'Review Suggested'}
                                    </span>
                                    <button 
                                      className="btn btn-outline" 
                                      onClick={() => resolveQuestionFlag(q.id)}
                                      style={{ padding: '2px 8px', fontSize: '0.7rem', margin: 0, whiteSpace: 'nowrap' }}
                                    >
                                      {language === 'es' ? 'Aprobar' : 'Approve'}
                                    </button>
                                  </>
                                ) : (
                                  <span style={{ color: '#10B981', fontWeight: 600, fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                                    🟢 {language === 'es' ? 'Activa y Vigente' : 'Active & Compliant'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="portal-tab-content">
                <form id="portal-settings-form" className="modal-form" onSubmit={handleSettingsSubmit}>
                  <div className="form-group">
                    <label htmlFor="settings-name">{language === 'es' ? 'Nombre / Empresa *' : 'Name / Company *'}</label>
                    <input
                      type="text"
                      id="settings-name"
                      required
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="settings-country">{language === 'es' ? 'País *' : 'Country *'}</label>
                    <input
                      type="text"
                      id="settings-country"
                      required
                      value={settingsForm.country}
                      onChange={(e) => setSettingsForm({ ...settingsForm, country: e.target.value })}
                    />
                  </div>

                  {currentUser?.type === 'empresa' && (
                    <>
                      <div className="form-group">
                        <label htmlFor="settings-website">{language === 'es' ? 'Web corporativa *' : 'Corporate website *'}</label>
                        <input
                          type="text"
                          id="settings-website"
                          required
                          value={settingsForm.website}
                          onChange={(e) => setSettingsForm({ ...settingsForm, website: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="settings-company-size">{language === 'es' ? 'Tamaño de la Empresa *' : 'Company Size *'}</label>
                        <select
                          id="settings-company-size"
                          required
                          value={settingsForm.companySize}
                          onChange={(e) => setSettingsForm({ ...settingsForm, companySize: e.target.value })}
                          style={selectStyle}
                        >
                          <option value="Micro (1-9 empleados)">Micro (1-9 empleados)</option>
                          <option value="Pequeña (10-49 empleados)">Pequeña (10-49 empleados)</option>
                          <option value="Mediana (50-249 empleados)">Mediana (50-249 empleados)</option>
                          <option value="Grande (250+ empleados)">Grande (250+ empleados)</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ marginTop: '15px' }}>
                        <label htmlFor="settings-sector">{language === 'es' ? 'Sector de la Economía *' : 'Economic Sector *'}</label>
                        <select
                          id="settings-sector"
                          required
                          value={settingsForm.sector}
                          onChange={(e) => setSettingsForm({ ...settingsForm, sector: e.target.value })}
                          style={selectStyle}
                        >
                          <option value="privado">{language === 'es' ? 'Privado' : 'Private'}</option>
                          <option value="publico">{language === 'es' ? 'Público' : 'Public'}</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ marginTop: '15px' }}>
                        <label htmlFor="settings-role">{language === 'es' ? 'Cargo *' : 'Role *'}</label>
                        <input
                          type="text"
                          id="settings-role"
                          required
                          value={settingsForm.role}
                          onChange={(e) => setSettingsForm({ ...settingsForm, role: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                  
                  <button type="submit" className="btn btn-gradient btn-block" style={{ marginTop: '20px' }}>
                    {language === 'es' ? 'Guardar Cambios' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}
          </div>

          <button className="btn btn-outline btn-block" id="btn-auth-logout" style={{ marginTop: 24 }} onClick={async () => { await signOutUser(); onUserChange(null); onClose(); }}>
            <FormattedMessage id="Modals.123" />
          </button>
        </div>
      </div>

      <div className={`modal-overlay ${isOpen('auth-alert') ? '' : 'hidden'}`} id="auth-alert-modal">
        <div className="glass-card modal-content text-center" style={{ maxWidth: 480 }}>
          <button className="modal-close" id="btn-auth-alert-close" onClick={onClose}><FormattedMessage id="Modals.124" /></button>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}><FormattedMessage id="Modals.125" /></div>
          <h3><FormattedMessage id="Modals.126" /></h3>
          <p id="auth-alert-text"><FormattedMessage id="Modals.127" /></p>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="btn btn-gradient btn-block" id="btn-auth-alert-upgrade" onClick={onOpenAccount}><FormattedMessage id="Modals.128" /></button>
            <button className="btn btn-outline btn-block" id="btn-auth-alert-login" onClick={onOpenAuth}><FormattedMessage id="Modals.129" /></button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast-notification">
          <div className="toast-title">{toast.title}</div>
          <div className="toast-desc">{toast.desc}</div>
        </div>
      )}
    </div>
  );
}

function CompanyFields({ prefix = 'auth-reg', intl, language }) {
  const [sectorType, setSectorType] = useState('');
  const [privateVertical, setPrivateVertical] = useState('');

  return (
    <>
      <div className="form-group" id={`${prefix}-company-sector`}>
        <label htmlFor={`${prefix}-sector`}>
          {language === 'es' ? 'Sector de la Economía' : language === 'pt' ? 'Setor da Economia' : 'Economic Sector'}
        </label>
        <select
          id={`${prefix}-sector`}
          name="sector"
          required
          value={sectorType}
          onChange={(event) => setSectorType(event.target.value)}
        >
          <option value="">
            {language === 'es' ? 'Seleccionar sector...' : language === 'pt' ? 'Selecionar setor...' : 'Select sector...'}
          </option>
          <option value="privado">
            {language === 'es' ? 'Sector Privado' : language === 'pt' ? 'Setor Privado' : 'Private Sector'}
          </option>
          <option value="publico">
            {language === 'es' ? 'Sector Público' : language === 'pt' ? 'Setor Público' : 'Public Sector'}
          </option>
        </select>
      </div>

      {sectorType === 'publico' && (
        <div className="form-group" id={`${prefix}-public-vertical`}>
          <label htmlFor={`${prefix}-subsector`}>
            {language === 'es' ? 'Vertical de negocio' : language === 'pt' ? 'Vertical de negócios' : 'Business Vertical'}
          </label>
          <select
            id={`${prefix}-subsector`}
            name="subsector"
            required
          >
            <option value="PÚBLICO">
              {language === 'es' || language === 'pt'
                ? "Relacionado con el desarrollo de 'Ciudades Amigables con las Personas Mayores', la creación de Sistemas Nacionales de Cuidados y la inclusión digital ciudadana (e-Government)"
                : "Related to the development of 'Age-Friendly Cities', the creation of National Care Systems, and citizen digital inclusion (e-Government)"}
            </option>
          </select>
        </div>
      )}

      {sectorType === 'privado' && (
        <div className="form-group" id={`${prefix}-private-vertical`}>
          <label htmlFor={`${prefix}-subsector`}>
            {language === 'es' ? 'Vertical de negocio' : language === 'pt' ? 'Vertical de negócios' : 'Business Vertical'}
          </label>
          <select
            id={`${prefix}-subsector`}
            name="subsector"
            required
            value={privateVertical}
            onChange={(event) => setPrivateVertical(event.target.value)}
          >
            <option value="">
              {language === 'es' ? 'Seleccionar vertical...' : language === 'pt' ? 'Selecionar vertical...' : 'Select vertical...'}
            </option>
            <option value="Finanzas y Seguro">
              {language === 'es' ? 'Finanzas y Seguros' : language === 'pt' ? 'Finanças e Seguros' : 'Finance and Insurance'}
            </option>
            <option value="Salud y Farmacia">
              {language === 'es' ? 'Salud, Farmacia y Sociosanitario' : language === 'pt' ? 'Saúde, Farmácia e Sociossanitário' : 'Health, Pharmacy, and Social Care'}
            </option>
            <option value="Tecnologia e Software">
              {language === 'es' ? 'Tecnología y Software (AgeTech)' : language === 'pt' ? 'Tecnologia e Software (AgeTech)' : 'Technology and Software (AgeTech)'}
            </option>
            <option value="Comercio y Distribución">
              {language === 'es' ? 'Comercio y Distribución (Retail)' : language === 'pt' ? 'Comércio e Distribuição (Retail)' : 'Retail and Distribution'}
            </option>
            <option value="Manufactura e Industria">
              {language === 'es' ? 'Manufactura e Industria' : language === 'pt' ? 'Manufatura e Indústria' : 'Manufacturing and Industry'}
            </option>
            <option value="Educación">
              {language === 'es' ? 'Educación y Formación Continua' : language === 'pt' ? 'Educação e Formação Contínua' : 'Education and Continuing Education'}
            </option>
            <option value="Bienes Raíces, Urbanismo y Vivienda (Senior Living)">
              {language === 'es' ? 'Bienes Raíces, Urbanismo y Vivienda (Senior Living)' : language === 'pt' ? 'Bens Raízes, Urbanismo e Habitação (Senior Living)' : 'Real Estate, Urbanism, and Housing (Senior Living)'}
            </option>
            <option value="Energía y Recursos Naturales">
              {language === 'es' ? 'Energía, Agua y Servicios Básicos' : language === 'pt' ? 'Energia, Água e Serviços Básicos' : 'Energy, Water, and Basic Services'}
            </option>
            <option value="Entretenimiento, Medios y Turismo">
              {language === 'es' ? 'Ocio, Entretenimiento, Medios y Turismo Silver' : language === 'pt' ? 'Lazer, Entretenimento, Mídia e Turismo Silver' : 'Leisure, Entertainment, Media, and Silver Tourism'}
            </option>
          </select>
        </div>
      )}

      <div className="form-group" id={`${prefix}-company-size`}>
        <label htmlFor={`${prefix}-company-size-select`}>
          {language === 'es' ? 'Tamaño de la Empresa *' : language === 'pt' ? 'Tamanho da Empresa *' : 'Company Size *'}
        </label>
        <select
          id={`${prefix}-company-size-select`}
          name="companySize"
          required
        >
          <option value="">{language === 'es' ? 'Seleccionar tamaño...' : language === 'pt' ? 'Selecionar tamanho...' : 'Select size...'}</option>
          <option value="Micro (1-9 empleados)">Micro (1-9 empleados)</option>
          <option value="Pequeña (10-49 empleados)">Pequeña (10-49 empleados)</option>
          <option value="Mediana (50-249 empleados)">Mediana (50-249 empleados)</option>
          <option value="Grande (250+ empleados)">Grande (250+ empleados)</option>
        </select>
      </div>

      <div className="form-group" id={`${prefix}-company-role`}>
        <label htmlFor={`${prefix}-role`}>
          {language === 'es' ? 'Cargo' : language === 'pt' ? 'Cargo' : 'Role'}
        </label>
        <input
          type="text"
          id={`${prefix}-role`}
          name="role"
          required
          placeholder={language === 'es' ? 'Ej. Director de RRHH' : language === 'pt' ? 'Ex. Diretor de RH' : 'e.g. HR Director'}
        />
      </div>
    </>
  );
}

const selectStyle = {
  width: '100%',
  padding: 10,
  borderRadius: 8,
  background: 'rgba(15, 23, 42, 0.8)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem'
};

export default Modals;
