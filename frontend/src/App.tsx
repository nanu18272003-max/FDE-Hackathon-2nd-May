import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ChatInterface } from "./components/ChatInterface";
import { IntakeForm } from "./components/IntakeForm";
import { Dashboard } from "./components/Dashboard";
import { Landing } from "./components/Landing";
import { ApiConfigModal } from "./components/ApiConfigModal";
import { ProductTour } from "./components/ProductTour";
import { useTriage } from "./hooks/useTriage";
import "./App.css";

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showApiModal, setShowApiModal] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openrouter_api_key") || "");

  const handleSetApiKey = (val: string) => {
    setApiKey(val);
    localStorage.setItem("openrouter_api_key", val);
  };

  // 1. Onboarding Logic: Landing -> API Modal -> Tour
  useEffect(() => {
    if (!showLanding && !apiKey) {
      setShowApiModal(true);
    }
  }, [showLanding, apiKey]);

  // 2. Trigger tour ONLY after API modal is closed (or key is provided)
  useEffect(() => {
    if (!showLanding && apiKey && !showApiModal) {
      const hasSeenTour = localStorage.getItem("has_seen_tour_v2");
      if (!hasSeenTour) {
        setShowTour(true);
      }
    }
  }, [showLanding, apiKey, showApiModal]);

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem("has_seen_tour_v2", "true");
  };

  const {
    mode,
    setMode,
    history,
    loading,
    lastResponse,
    files,
    mergeNewFiles,
    removeFile,
    clearSession,
    submitTriage,
    error,
    locale,
    setLocale,
    pincode,
    setPincode,
    address,
    setAddress,
    conversationId,
  } = useTriage();

  const baseId = "triage-app";

  if (showLanding) {
    return <Landing onStart={() => setShowLanding(false)} />;
  }

  return (
    <div className="app-shell">
      <Header 
        mode={mode} 
        setMode={setMode} 
        onClear={clearSession} 
        apiKey={apiKey}
        onOpenSettings={() => setShowApiModal(true)}
      />

      <main id="main-content" className="layout-grid">
        <div className="panel triage-panel">
          <div className="panel-header">
            <h2 className="panel-title">
              {mode === "chat" ? "Conversation" : "Structured intake"}
            </h2>
          </div>

          <div className="field-grid context-fields">
            <div className="input-group">
              <label htmlFor={`${baseId}-locale`}>Country / locale</label>
              <input
                id={`${baseId}-locale`}
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                autoComplete="country"
                maxLength={8}
                placeholder="e.g. IN"
              />
            </div>
            <div className="input-group">
              <label htmlFor={`${baseId}-pincode`}>Postal / ZIP code</label>
              <input
                id={`${baseId}-pincode`}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                autoComplete="postal-code"
                maxLength={16}
                placeholder="Optional"
              />
            </div>
            <div className="input-group full-width">
              <label htmlFor={`${baseId}-address`}>
                Street address for clinics <span className="label-badge">Private</span>
              </label>
              <div className="address-input-wrapper">
                <input
                  id={`${baseId}-address`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="street-address"
                  maxLength={512}
                  placeholder="Search only — not sent to AI"
                />
                {lastResponse?.clinic_results && lastResponse.clinic_results.length > 0 && (
                  <span className="search-success-badge animate-fade-in">
                    ✓ Found {lastResponse.clinic_results.length} clinics
                  </span>
                )}
              </div>
              <p className="hint field-hint">
                Address is used strictly for locating nearby clinics and is excluded from the AI prompt.
              </p>
            </div>
          </div>

          <div className="divider" />

          {mode === "chat" ? (
            <ChatInterface
              history={history}
              loading={loading}
              files={files}
              mergeNewFiles={mergeNewFiles}
              removeFile={removeFile}
              clearSession={clearSession}
              submitTriage={(msg: string) => submitTriage(msg, false, apiKey)}
              error={error}
            />
          ) : (
            <IntakeForm
              loading={loading}
              files={files}
              mergeNewFiles={mergeNewFiles}
              removeFile={removeFile}
              submitTriage={(msg: string) => submitTriage(msg, true, apiKey)}
              error={error}
            />
          )}

          {lastResponse?.clinic_results && lastResponse.clinic_results.length > 0 && (
            <div className="clinic-discovery-alert animate-fade-in">
              <span className="icon">🏥</span>
              <span>Nearby clinics found! Check the dashboard results.</span>
              <button 
                className="btn-link" 
                onClick={() => document.getElementById('dashboard-view')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Results ↓
              </button>
            </div>
          )}
        </div>

        <Dashboard
          triage={lastResponse?.triage ?? null}
          clinicResults={lastResponse?.clinic_results ?? []}
          clinicSearchStatus={lastResponse?.clinic_search_status ?? "skipped"}
        />
      </main>

      {showApiModal && (
        <ApiConfigModal 
          apiKey={apiKey} 
          setApiKey={handleSetApiKey} 
          onClose={() => setShowApiModal(false)} 
        />
      )}

      {showTour && <ProductTour onComplete={handleTourComplete} />}

      <footer className="app-footer">
        <p>
          Conversation ID: <code className="id-badge">{conversationId}</code> • 
          Informational only. <strong>Always consult a professional for medical concerns.</strong>
        </p>
      </footer>
    </div>
  );
}

export default App;
