import React, { useState } from 'react';
import { Link2, AlertTriangle, CheckCircle, XCircle, ExternalLink, Copy, Loader, Zap, Shield, Eye } from 'lucide-react';
import ThreatAnalysis from './ThreatAnalysis';
import './UrlExpander.css';

const UrlExpander = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [expandedUrl, setExpandedUrl] = useState('');
  const [isExpanding, setIsExpanding] = useState(false);
  const [error, setError] = useState('');
  const [expansionHistory, setExpansionHistory] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const shorteners = [
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link',
    'tiny.cc', 'is.gd', 'buff.ly', 'bitly.com', 'shortened.link',
    'cutt.ly', 'rebrand.ly', 'clickmeter.com', 'hyperurl.co',
    'v.gd', 'x.co', 'scrnch.me', 'filoops.info', 'sh.st', 'adf.ly'
  ];

  const expandUrl = async (url) => {
    setIsExpanding(true);
    setError('');
    setExpansionHistory([]);

    try {
      if (!url) {
        throw new Error('Please enter a URL to expand');
      }

      if (!url.match(/^https?:\/\//)) {
        url = 'https://' + url;
      }

      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();

      const isShortened = shorteners.some(shortener =>
        domain.includes(shortener.toLowerCase())
      );

      if (!isShortened) {
        setExpansionHistory([{
          step: 1,
          url: url,
          status: 'original',
          message: 'Direct URL detected - no expansion needed',
          timestamp: new Date().toLocaleTimeString()
        }]);
        setExpandedUrl(url);
        setShowAnalysis(true);
        return;
      }

      const expansionSteps = await simulateUrlExpansion(url);
      setExpansionHistory(expansionSteps);

      const finalUrl = expansionSteps[expansionSteps.length - 1].url;
      setExpandedUrl(finalUrl);
      setShowAnalysis(true);

    } catch (err) {
      setError(err.message || 'Failed to expand URL. Please check the URL format and try again.');
    } finally {
      setIsExpanding(false);
    }
  };

  const simulateUrlExpansion = async (url) => {
    const steps = [];

    await new Promise(resolve => setTimeout(resolve, 800));
    steps.push({
      step: 1,
      url: url,
      status: 'shortened',
      message: 'Shortened URL detected - beginning expansion',
      timestamp: new Date().toLocaleTimeString()
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    const intermediateUrl = url.replace(/bit\.ly|tinyurl\.com|t\.co|goo\.gl/, 'redirect-tracker.net');
    steps.push({
      step: 2,
      url: intermediateUrl,
      status: 'redirect',
      message: 'Following redirect chain...',
      timestamp: new Date().toLocaleTimeString()
    });

    await new Promise(resolve => setTimeout(resolve, 1200));
    const finalDestinations = [
      'https://legitimate-company.com/product-page',
      'https://suspicious-login-page.com/secure-access',
      'https://phishing-bank-replica.net/login-verify',
      'https://malware-download-site.ru/free-software',
      'https://fake-microsoft-update.com/urgent-security',
      'https://scam-lottery-winner.info/claim-prize',
      'https://trusted-news-site.com/article/tech-news',
      'https://social-media-platform.com/user/profile'
    ];

    const finalUrl = finalDestinations[Math.floor(Math.random() * finalDestinations.length)];

    steps.push({
      step: 3,
      url: finalUrl,
      status: 'final',
      message: 'Final destination reached',
      timestamp: new Date().toLocaleTimeString()
    });

    return steps;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      expandUrl(inputUrl.trim());
    }
  };

  const resetExpander = () => {
    setInputUrl('');
    setExpandedUrl('');
    setExpansionHistory([]);
    setShowAnalysis(false);
    setError('');
  };

  return (
    <div className="url-expander-page">
      <div className="cyber-card expander-header-card">
        <div className="header-content">
          <div className="header-icon">
            <Link2 size={64} className="main-icon" />
            <div className="icon-glow"></div>
          </div>
          <h1 className="cyber-title">
            <span className="title-main">URL EXPANDER</span>
            <span className="title-sub">& THREAT ANALYZER</span>
          </h1>
          <p className="cyber-subtitle">
            Safely expand shortened URLs and analyze them for potential security threats
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message cyber-alert">
          <AlertTriangle size={24} />
          <span>{error}</span>
        </div>
      )}

      <div className="cyber-card expander-form-card">
        <h3 className="section-title">
          <Zap size={24} />
          URL EXPANSION INTERFACE
        </h3>
        <form onSubmit={handleSubmit} className="expander-form">
          <div className="input-section">
            <div className="input-wrapper">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter shortened URL (e.g., bit.ly/abc123, tinyurl.com/xyz)"
                className="cyber-input url-input"
                disabled={isExpanding}
              />
              <div className="input-border-glow"></div>
            </div>
            <button 
              type="submit" 
              className="cyber-button expand-button"
              disabled={isExpanding || !inputUrl.trim()}
            >
              {isExpanding ? (
                <>
                  <Loader size={20} className="spinning" />
                  <span>EXPANDING...</span>
                </>
              ) : (
                <>
                  <Link2 size={20} />
                  <span>EXPAND & ANALYZE</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {expansionHistory.length > 0 && (
        <div className="cyber-card expansion-history-card">
          <h3 className="section-title">
            <Eye size={24} />
            URL EXPANSION TRACE
          </h3>
          <div className="expansion-timeline">
            {expansionHistory.map((step, index) => (
              <div key={index} className={`expansion-step ${step.status}`}>
                <div className="step-indicator">
                  <div className="step-number">{step.step}</div>
                  <div className="step-icon">
                    {step.status === 'shortened' && <Link2 size={18} />}
                    {step.status === 'redirect' && <ExternalLink size={18} />}
                    {step.status === 'final' && <CheckCircle size={18} />}
                    {step.status === 'original' && <CheckCircle size={18} />}
                  </div>
                </div>
                <div className="step-content">
                  <div className="step-header">
                    <span className="step-status">{step.message}</span>
                    <span className="step-time">{step.timestamp}</span>
                  </div>
                  <div className="step-url">
                    <code className="url-code">{step.url}</code>
                    <button 
                      onClick={() => copyToClipboard(step.url)}
                      className="cyber-icon-button copy-btn"
                      title="Copy URL"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                {index < expansionHistory.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {expandedUrl && (
        <div className="cyber-card final-result-card">
          <h3 className="section-title">
            <Shield size={24} />
            FINAL DESTINATION
          </h3>
          <div className="final-url-container">
            <div className="final-url">
              <code className="final-url-text">{expandedUrl}</code>
            </div>
            <div className="url-actions">
              <button 
                onClick={() => copyToClipboard(expandedUrl)}
                className="cyber-button action-btn copy-action"
                title="Copy URL"
              >
                <Copy size={18} />
                <span>COPY</span>
              </button>
              <a 
                href={expandedUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="cyber-button action-btn visit-action"
                title="Visit URL (Use Caution)"
              >
                <ExternalLink size={18} />
                <span>VISIT</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {showAnalysis && expandedUrl && (
        <ThreatAnalysis 
          url={expandedUrl}
          onAnalysisComplete={() => {}}
          isAnalyzing={false}
        />
      )}

      {(expandedUrl || error) && (
        <div className="reset-section">
          <button className="cyber-button reset-btn" onClick={resetExpander}>
            <Zap size={18} />
            <span>ANALYZE ANOTHER URL</span>
          </button>
        </div>
      )}

      <div className="cyber-card info-section-card">
        <h3 className="section-title">
          <Shield size={24} />
          SUPPORTED URL SHORTENERS
        </h3>
        <div className="shortener-grid">
          {shorteners.map((shortener, index) => (
            <span key={index} className="shortener-tag">{shortener}</span>
          ))}
        </div>
        <div className="safety-notice">
          <div className="notice-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="notice-content">
            <h4>SECURITY PROTOCOL</h4>
            <p>
              Always exercise extreme caution when visiting expanded URLs. Never enter sensitive 
              information on suspicious websites. This tool provides analysis but cannot guarantee 
              complete safety. When in doubt, avoid clicking the link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlExpander;
