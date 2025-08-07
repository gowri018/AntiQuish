// src/components/UrlExpander.js
import React, { useState } from 'react';
import { Link2, AlertTriangle, CheckCircle, XCircle, ExternalLink, Copy, Loader } from 'lucide-react';
import ThreatAnalysis from './ThreatAnalysis';
import './UrlExpander.css';

const UrlExpander = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [expandedUrl, setExpandedUrl] = useState('');
  const [isExpanding, setIsExpanding] = useState(false);
  const [error, setError] = useState('');
  const [expansionHistory, setExpansionHistory] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Common URL shorteners
  const shorteners = [
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link',
    'tiny.cc', 'is.gd', 'buff.ly', 'bitly.com', 'shortened.link',
    'cutt.ly', 'rebrand.ly', 'clickmeter.com', 'hyperurl.co'
  ];

  const expandUrl = async (url) => {
    setIsExpanding(true);
    setError('');
    setExpansionHistory([]);
    
    try {
      // Validate URL format
      if (!url) {
        throw new Error('Please enter a URL');
      }

      // Add protocol if missing
      if (!url.match(/^https?:\/\//)) {
        url = 'https://' + url;
      }

      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();

      // Check if it's actually a shortened URL
      const isShortened = shorteners.some(shortener => 
        domain.includes(shortener.toLowerCase())
      );

      if (!isShortened) {
        setExpansionHistory([{
          step: 1,
          url: url,
          status: 'original',
          message: 'This appears to be a direct URL (not shortened)'
        }]);
        setExpandedUrl(url);
        setShowAnalysis(true);
        return;
      }

      // Simulate URL expansion process (in real app, this would call your backend)
      const expansionSteps = await simulateUrlExpansion(url);
      setExpansionHistory(expansionSteps);
      
      const finalUrl = expansionSteps[expansionSteps.length - 1].url;
      setExpandedUrl(finalUrl);
      setShowAnalysis(true);

    } catch (err) {
      setError(err.message || 'Failed to expand URL. Please check the URL and try again.');
    } finally {
      setIsExpanding(false);
    }
  };

  // Simulate URL expansion (replace with real API call)
  const simulateUrlExpansion = async (url) => {
    const steps = [];
    
    // Simulate multiple redirects
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    steps.push({
      step: 1,
      url: url,
      status: 'shortened',
      message: 'Original shortened URL detected'
    });

    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate intermediate redirect
    const intermediateUrl = url.replace(/bit\.ly|tinyurl\.com|t\.co/, 'redirect-service.com');
    steps.push({
      step: 2,
      url: intermediateUrl,
      status: 'redirect',
      message: 'Following redirect...'
    });

    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate final destination
    const finalUrls = [
      'https://example-legitimate-site.com/page',
      'https://suspicious-phishing-site.com/login',
      'https://malicious-site.net/steal-credentials',
      'https://legit-company.com/product-page',
      'https://phishing-bank-fake.com/secure-login'
    ];
    
    const finalUrl = finalUrls[Math.floor(Math.random() * finalUrls.length)];
    
    steps.push({
      step: 3,
      url: finalUrl,
      status: 'final',
      message: 'Final destination reached'
    });

    return steps;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
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
    <div className="url-expander-container">
      <div className="expander-header">
        <Link2 size={48} className="header-icon" />
        <h1>URL Expander & Analyzer</h1>
        <p>Safely expand and analyze shortened URLs to see their real destination</p>
      </div>

      {error && (
        <div className="error-message">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="expander-form">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter shortened URL (e.g., bit.ly/abc123, tinyurl.com/xyz)"
              className="url-input"
              disabled={isExpanding}
            />
            <button 
              type="submit" 
              className="expand-btn"
              disabled={isExpanding || !inputUrl.trim()}
            >
              {isExpanding ? (
                <>
                  <Loader size={18} className="spinning" />
                  Expanding...
                </>
              ) : (
                <>
                  <Link2 size={18} />
                  Expand URL
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Expansion History */}
      {expansionHistory.length > 0 && (
        <div className="expansion-history">
          <h3>URL Expansion Trace</h3>
          <div className="expansion-steps">
            {expansionHistory.map((step, index) => (
              <div key={index} className={`expansion-step ${step.status}`}>
                <div className="step-indicator">
                  {step.status === 'shortened' && <Link2 size={16} />}
                  {step.status === 'redirect' && <ExternalLink size={16} />}
                  {step.status === 'final' && <CheckCircle size={16} />}
                  {step.status === 'original' && <CheckCircle size={16} />}
                </div>
                <div className="step-content">
                  <div className="step-header">
                    <span className="step-number">Step {step.step}</span>
                    <span className="step-status">{step.message}</span>
                  </div>
                  <div className="step-url">
                    <code>{step.url}</code>
                    <button 
                      onClick={() => copyToClipboard(step.url)}
                      className="copy-btn"
                      title="Copy URL"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final Result */}
      {expandedUrl && (
        <div className="expanded-result">
          <h3>Final Destination</h3>
          <div className="final-url">
            <code>{expandedUrl}</code>
            <div className="url-actions">
              <button 
                onClick={() => copyToClipboard(expandedUrl)}
                className="action-btn copy"
                title="Copy URL"
              >
                <Copy size={16} />
                Copy
              </button>
              <a 
                href={expandedUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="action-btn visit"
                title="Visit URL (Use Caution)"
              >
                <ExternalLink size={16} />
                Visit
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Threat Analysis */}
      {showAnalysis && expandedUrl && (
        <ThreatAnalysis 
          url={expandedUrl}
          onAnalysisComplete={() => {}}
          isAnalyzing={false}
        />
      )}

      {/* Reset Button */}
      {(expandedUrl || error) && (
        <button className="reset-btn" onClick={resetExpander}>
          Analyze Another URL
        </button>
      )}

      {/* Info Section */}
      <div className="info-section">
        <h3>Supported URL Shorteners</h3>
        <div className="shortener-list">
          {shorteners.map((shortener, index) => (
            <span key={index} className="shortener-tag">{shortener}</span>
          ))}
        </div>
        <p className="info-text">
          <strong>Safety Note:</strong> Always be cautious when visiting expanded URLs, 
          especially if they lead to login pages or request personal information.
        </p>
      </div>
    </div>
  );
};

export default UrlExpander;
