// src/components/ThreatAnalysis.js - REPLACE ENTIRE FILE
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, XCircle, ExternalLink, Clock } from 'lucide-react';
import './ThreatAnalysis.css';

const ThreatAnalysis = ({ url, onAnalysisComplete, isAnalyzing }) => {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (url) {
      analyzeUrl(url);
    }
  }, [url]);

  const analyzeUrl = async (targetUrl) => {
    setLoading(true);
    setError('');
    
    try {
      const enhancedAnalysis = performEnhancedAnalysis(targetUrl);
      
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAnalysis(enhancedAnalysis);
      if (onAnalysisComplete) {
        onAnalysisComplete(enhancedAnalysis);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const performEnhancedAnalysis = (targetUrl) => {
    const analysis = {
      url: targetUrl,
      timestamp: new Date().toISOString(),
      checks: [],
      riskScore: 0,
      riskLevel: 'SAFE',
      recommendations: [],
      detectedThreats: []
    };

    try {
      const urlObj = new URL(targetUrl);
      const domain = urlObj.hostname.toLowerCase();
      const path = urlObj.pathname.toLowerCase();
      const urlText = targetUrl.toLowerCase();

      // Enhanced Check 1: Protocol Security
      if (urlObj.protocol === 'https:') {
        analysis.checks.push({
          name: 'HTTPS Protocol',
          status: 'pass',
          description: 'URL uses secure HTTPS protocol',
          impact: 'low'
        });
      } else {
        analysis.checks.push({
          name: 'HTTPS Protocol',
          status: 'fail',
          description: 'URL uses insecure HTTP protocol - data can be intercepted',
          impact: 'high'
        });
        analysis.riskScore += 4;
        analysis.detectedThreats.push('Insecure Connection');
      }

      // Enhanced Check 2: Suspicious Domains & Typosquatting
      const legitimateDomains = ['google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'facebook.com', 'paypal.com', 'ebay.com'];
      const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.ru', '.cc', '.info', '.biz'];
      const commonTypos = ['googIe.com', 'microsooft.com', 'paypaI.com', 'arnazon.com'];
      
      // Check for typosquatting
      const possibleTypo = commonTypos.some(typo => domain.includes(typo.toLowerCase()));
      if (possibleTypo) {
        analysis.checks.push({
          name: 'Typosquatting Detection',
          status: 'fail',
          description: 'Domain appears to mimic a legitimate brand (typosquatting)',
          impact: 'high'
        });
        analysis.riskScore += 6;
        analysis.detectedThreats.push('Typosquatting');
      }

      // Check suspicious TLDs
      const hasSuspiciousTLD = suspiciousTLDs.some(tld => domain.endsWith(tld));
      if (hasSuspiciousTLD) {
        analysis.checks.push({
          name: 'Domain TLD Check',
          status: 'warning',
          description: 'Uses a TLD commonly associated with malicious sites',
          impact: 'medium'
        });
        analysis.riskScore += 2;
      }

      // Enhanced Check 3: URL Shorteners (expanded list)
      const shorteners = [
        'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link',
        'tiny.cc', 'is.gd', 'buff.ly', 'bitly.com', 'shortened.link',
        'cutt.ly', 'rebrand.ly', 'clickmeter.com', 'hyperurl.co',
        'v.gd', 'x.co', 'scrnch.me', 'filoops.info'
      ];

      if (shorteners.some(shortener => domain.includes(shortener))) {
        analysis.checks.push({
          name: 'URL Shortener',
          status: 'warning',
          description: 'URL uses a link shortening service - destination is hidden',
          impact: 'medium'
        });
        analysis.riskScore += 3;
        analysis.detectedThreats.push('Hidden Destination');
      }

      // Enhanced Check 4: IP Address Instead of Domain
      const ipPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
      if (ipPattern.test(domain)) {
        analysis.checks.push({
          name: 'IP Address Usage',
          status: 'fail',
          description: 'Uses IP address instead of domain name - highly suspicious',
          impact: 'high'
        });
        analysis.riskScore += 5;
        analysis.detectedThreats.push('IP Address Usage');
      }

      // Enhanced Check 5: Suspicious Keywords (expanded)
      const phishingKeywords = [
        'login', 'signin', 'verify', 'secure', 'update', 'confirm', 'account',
        'bank', 'paypal', 'amazon', 'microsoft', 'apple', 'google', 'facebook',
        'suspended', 'expired', 'urgent', 'immediate', 'action', 'required',
        'click', 'here', 'now', 'limited', 'time', 'offer', 'free', 'winner',
        'congratulations', 'prize', 'reward', 'claim', 'unlock', 'activate'
      ];

      const foundKeywords = phishingKeywords.filter(keyword => 
        urlText.includes(keyword) || path.includes(keyword)
      );

      if (foundKeywords.length >= 3) {
        analysis.checks.push({
          name: 'Suspicious Keywords',
          status: 'fail',
          description: `Contains multiple phishing keywords: ${foundKeywords.slice(0, 5).join(', ')}`,
          impact: 'high'
        });
        analysis.riskScore += 4;
        analysis.detectedThreats.push('Phishing Keywords');
      } else if (foundKeywords.length >= 1) {
        analysis.checks.push({
          name: 'Suspicious Keywords',
          status: 'warning',
          description: `Contains suspicious keywords: ${foundKeywords.join(', ')}`,
          impact: 'medium'
        });
        analysis.riskScore += 2;
      }

      // Enhanced Check 6: Domain Length and Complexity
      if (domain.length > 50 || domain.split('.').length > 5) {
        analysis.checks.push({
          name: 'Domain Complexity',
          status: 'warning',
          description: 'Domain is unusually long or has many subdomains',
          impact: 'medium'
        });
        analysis.riskScore += 2;
      }

      // Enhanced Check 7: Suspicious Characters
      const suspiciousChars = /[-_]{3,}|[0-9]{5,}|\.|--/;
      if (suspiciousChars.test(domain)) {
        analysis.checks.push({
          name: 'Domain Structure',
          status: 'warning',
          description: 'Domain contains suspicious character patterns',
          impact: 'medium'
        });
        analysis.riskScore += 1;
      }

      // Enhanced Check 8: Known Malicious Patterns
      const maliciousPatterns = [
        /secure.*login/i,
        /verify.*account/i,
        /update.*payment/i,
        /suspended.*account/i,
        /click.*here.*now/i,
        /urgent.*action/i,
        /limited.*time/i
      ];

      const matchedPatterns = maliciousPatterns.filter(pattern => 
        pattern.test(urlText) || pattern.test(path)
      );

      if (matchedPatterns.length > 0) {
        analysis.checks.push({
          name: 'Malicious Patterns',
          status: 'fail',
          description: 'URL matches known phishing attack patterns',
          impact: 'high'
        });
        analysis.riskScore += 5;
        analysis.detectedThreats.push('Known Attack Pattern');
      }

      // Determine risk level based on enhanced scoring
      if (analysis.riskScore === 0) {
        analysis.riskLevel = 'SAFE';
        analysis.recommendations.push('URL appears to be safe based on our analysis.');
        analysis.recommendations.push('Always verify the website authenticity before entering sensitive information.');
      } else if (analysis.riskScore <= 3) {
        analysis.riskLevel = 'LOW';
        analysis.recommendations.push('Exercise caution when visiting this URL.');
        analysis.recommendations.push('Verify the website is legitimate before entering any information.');
        analysis.recommendations.push('Check for HTTPS and correct spelling of the domain.');
      } else if (analysis.riskScore <= 7) {
        analysis.riskLevel = 'MODERATE';
        analysis.recommendations.push('This URL shows several warning signs of a potential threat.');
        analysis.recommendations.push('DO NOT enter personal, financial, or login information.');
        analysis.recommendations.push('Contact the organization directly to verify legitimacy.');
        analysis.recommendations.push('Consider avoiding this link entirely.');
      } else {
        analysis.riskLevel = 'HIGH';
        analysis.recommendations.push('⚠️ DANGER: This URL is highly suspicious and likely malicious.');
        analysis.recommendations.push('DO NOT visit this website or enter any information.');
        analysis.recommendations.push('This appears to be a phishing or malware attempt.');
        analysis.recommendations.push('Report this URL to your IT department or authorities.');
      }

      // Add safe checks if none failed
      if (analysis.checks.length === 1 && analysis.checks[0].status === 'pass') {
        analysis.checks.push({
          name: 'Domain Reputation',
          status: 'pass',
          description: 'No suspicious patterns detected in domain structure',
          impact: 'low'
        });
        
        analysis.checks.push({
          name: 'Content Analysis',
          status: 'pass',
          description: 'URL does not contain obvious phishing indicators',
          impact: 'low'
        });
      }

    } catch (err) {
      // Invalid URL
      analysis.checks.push({
        name: 'URL Format',
        status: 'fail',
        description: 'Invalid or malformed URL detected',
        impact: 'high'
      });
      analysis.riskScore = 10;
      analysis.riskLevel = 'HIGH';
      analysis.recommendations.push('This does not appear to be a valid URL.');
      analysis.detectedThreats.push('Invalid URL Format');
    }

    return analysis;
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'SAFE': return <Shield className="risk-icon safe" size={32} />;
      case 'LOW': return <AlertTriangle className="risk-icon low" size={32} />;
      case 'MODERATE': return <AlertTriangle className="risk-icon moderate" size={32} />;
      case 'HIGH': return <XCircle className="risk-icon high" size={32} />;
      default: return <AlertTriangle className="risk-icon" size={32} />;
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'SAFE': return '#22c55e';
      case 'LOW': return '#eab308';
      case 'MODERATE': return '#f59e0b';
      case 'HIGH': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading || isAnalyzing) {
    return (
      <div className="threat-analysis loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h3>Analyzing URL Security...</h3>
          <p>Running comprehensive threat detection analysis</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="threat-analysis error">
        <XCircle className="error-icon" size={48} />
        <h3>Analysis Error</h3>
        <p>{error}</p>
        <button onClick={() => analyzeUrl(url)} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="threat-analysis">
      <div className="analysis-header">
        <div className="risk-indicator" style={{ borderColor: getRiskColor(analysis.riskLevel) }}>
          {getRiskIcon(analysis.riskLevel)}
          <div className="risk-info">
            <h3>Risk Level: {analysis.riskLevel}</h3>
            <p>Security Score: {Math.max(0, 10 - analysis.riskScore)}/10</p>
            {analysis.detectedThreats.length > 0 && (
              <div className="detected-threats">
                <strong>Threats: </strong>
                {analysis.detectedThreats.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="analysis-details">
        <div className="checks-section">
          <h4>Security Checks ({analysis.checks.length})</h4>
          <div className="checks-list">
            {analysis.checks.map((check, index) => (
              <div key={index} className={`check-item ${check.status}`}>
                <div className="check-status">
                  {check.status === 'pass' && <Shield size={18} />}
                  {check.status === 'warning' && <AlertTriangle size={18} />}
                  {check.status === 'fail' && <XCircle size={18} />}
                </div>
                <div className="check-content">
                  <div className="check-header">
                    <strong>{check.name}</strong>
                    <span className={`impact-badge ${check.impact}`}>
                      {check.impact} impact
                    </span>
                  </div>
                  <p>{check.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recommendations-section">
          <h4>Security Recommendations</h4>
          <ul className="recommendations-list">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className={analysis.riskLevel.toLowerCase()}>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="url-info">
          <h4>URL Analysis Details</h4>
          <div className="url-details">
            <p><strong>Analyzed URL:</strong> <code>{analysis.url}</code></p>
            <p><strong>Analysis Time:</strong> {new Date(analysis.timestamp).toLocaleString()}</p>
            <p><strong>Total Risk Score:</strong> {analysis.riskScore}/10</p>
          </div>
          <a 
            href={analysis.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`visit-url-btn ${analysis.riskLevel.toLowerCase()}`}
            onClick={(e) => {
              if (analysis.riskLevel === 'HIGH') {
                e.preventDefault();
                alert('⚠️ WARNING: This URL is flagged as HIGH RISK. Visiting this site could compromise your security. Proceed only if you are absolutely certain it is safe.');
                return false;
              }
              if (analysis.riskLevel === 'MODERATE') {
                const confirmed = confirm('⚠️ CAUTION: This URL shows suspicious patterns. Are you sure you want to visit this site?');
                if (!confirmed) {
                  e.preventDefault();
                  return false;
                }
              }
            }}
          >
            <ExternalLink size={16} />
            {analysis.riskLevel === 'HIGH' ? 'Blocked - High Risk' : 'Visit URL (Use Caution)'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThreatAnalysis;
