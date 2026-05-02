import { useState } from "react";
import type { Mode } from "../hooks/useTriage";

interface HeaderProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  onClear?: () => void;
  apiKey: string;
  setApiKey: (val: string) => void;
}

export function Header({ mode, setMode, apiKey, setApiKey }: HeaderProps) {
  const [showKeyInput, setShowKeyInput] = useState(false);

  return (
    <header className="app-header">
      <div className="app-header-content">
        <div className="title-row">
          <h1 className="app-title">
            <span className="gradient-text">Symptom Triage</span> Assistant
          </h1>
          <div className="api-settings">
            <button 
              type="button" 
              className={`api-toggle ${apiKey ? 'has-key' : ''}`}
              onClick={() => setShowKeyInput(!showKeyInput)}
              title={apiKey ? "API Key Set" : "Click to set API Key"}
            >
              {apiKey ? "🔐 API Ready" : "🔑 Set API Key"}
            </button>
            {showKeyInput && (
              <div className="api-input-overlay animate-slide-down">
                <input
                  type="password"
                  placeholder="OpenRouter API Key (sk-or-...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="api-input"
                />
                <p className="api-hint">
                  Saved locally in your browser. Used to process AI triage.
                </p>
              </div>
            )}
          </div>
        </div>
        <p className="app-sub">
          Informational guidance only — not a diagnosis. Share symptoms safely;
          street address for clinics is kept off the AI chat path.
        </p>
      </div>
      <nav className="mode-tabs" aria-label="Input mode">
        <button
          type="button"
          data-active={mode === "chat"}
          onClick={() => setMode("chat")}
          className="tab-btn"
        >
          <span className="tab-icon">💬</span> Chat
        </button>
        <button
          type="button"
          data-active={mode === "form"}
          onClick={() => setMode("form")}
          className="tab-btn"
        >
          <span className="tab-icon">📝</span> Form
        </button>
      </nav>
    </header>
  );
}
