import "./ApiConfigModal.css";

interface ApiConfigModalProps {
  apiKey: string;
  setApiKey: (val: string) => void;
  onClose: () => void;
}

export function ApiConfigModal({ apiKey, setApiKey, onClose }: ApiConfigModalProps) {
  return (
    <div className="modal-overlay animate-fade-in">
      <div className="api-modal-card animate-scale-up">
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">🔑</span>
            <h3>AI Configuration</h3>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <p className="modal-desc">
            To provide accurate, non-diagnostic medical triage, this platform uses 
            <strong> OpenRouter (Gemini 2.0 Flash)</strong>.
          </p>
          
          <div className="api-input-section">
            <label htmlFor="modal-api-key">Your OpenRouter API Key</label>
            <div className="input-with-icon">
              <input
                id="modal-api-key"
                type="password"
                placeholder="sk-or-v1-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <span className="secure-badge">AES-256 Local Storage</span>
            </div>
          </div>

          <div className="key-help-box">
            <h4>Don't have a key?</h4>
            <p>
              1. Create a free account at <a href="https://openrouter.ai" target="_blank">openrouter.ai</a><br/>
              2. Generate a key in <strong>Settings &gt; Keys</strong><br/>
              3. Paste it here to unlock unlimited AI triage sessions.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary full-width" onClick={onClose}>
            {apiKey ? "Save and Continue" : "I'll do this later"}
          </button>
        </div>
      </div>
    </div>
  );
}
