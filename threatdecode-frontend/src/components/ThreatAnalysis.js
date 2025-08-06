import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, XCircle, ExternalLink, Clock } from 'lucide-react';
import axios from 'axios';
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
      // For now, we'll do a basic client-side analysis
      // In production, this should call your backend API
      const basicAnalysis = performBasicAnalysis(targetUrl);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAnalysis(basicAnalysis);
      onAnalysisComplete();
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const performBasicAnalysis = (targetUrl) => {
    const analysis = {
      url: targetUrl,
      timestamp: new Date().toISOString(),
      checks: [],
      riskScore: 0,
      riskLevel: 'SAFE',
      recommendations: []
    };

    try {
      const urlObj = new URL(targetUrl);
      
      // Check 1: HTTPS
      if (urlObj.protocol === 'https:') {
        analysis.checks.push({
          name: 'HTTPS Protocol',
          status: 'pass',
          description: 'URL uses secure HTTPS protocol'
        });
      } else {
        analysis.checks.push({
          name: 'HTTPS Protocol', 
          status: 'fail',
          description: 'URL uses insecure HTTP protocol'
        });
        analysis.riskScore += 3;
      }

      // Check 2: Suspicious domains
      const suspiciousDomains = ['bit.ly', 'tinyurl.com', 't.co', 'short.link'];
      if (suspiciousDomains.some(domain => urlObj.hostname.includes(domain))) {
        analysis.checks.push({
          name: 'URL Shortener',
          status: 'warning',
          description: 'URL uses a link shortening service'
        });
        analysis.riskScore += 2;
      }

      // Check 3: Domain length and complexity
      if (urlObj.hostname.length > 30 || urlObj.hostname.split('.').length > 4) {
        analysis.checks.push({
          name: 'Domain Complexity',
          status: 'warning', 
          description: 'Domain name is unusually long or complex'
        });
        analysis.riskScore += 1;
      }

      // Check 4: Suspicious keywords
      const suspiciousKeywords = ['login', 'verify', 'secure', 'update', 'confirm', 'account'];
      const urlText = targetUrl.toLowerCase();
      const foundKeywords = suspiciousKeywords.filter(keyword => urlText.includes(keyword));
      
      if (foundKeywords.length > 2) {
        analysis.checks.push({
          name: 'Suspicious Keywords',
          status: 'warning',
          description: `Contains multiple suspicious keywords: ${foundKeywords.join(', ')}`
        });
        analysis.riskScore += 2;
      }

      // Determine risk level
      if (analysis.riskScore === 0) {
        analysis.riskLevel = 'SAFE';
        analysis.recommendations.push('URL appears to be safe, but always verify the destination.');
      } else if (analysis.riskScore <= 3) {
        analysis.riskLevel = 'LOW';
        analysis.recommendations.push('Exercise caution when visiting this URL.');
        analysis.recommendations.push('Verify the URL destination before entering personal information.');
      } else if (analysis.riskScore <= 6) {
        analysis.riskLevel = 'MODERATE';
        analysis.recommendations.push('This URL shows several warning signs.');
        analysis.recommendations.push('Do not enter personal or financial information.');
        analysis.recommendations.push('Consider avoiding this link entirely.');
      } else {
        analysis.riskLevel = 'HIGH';
        analysis.recommendations.push('This URL is potentially dangerous.');
        analysis.recommendations.push('Do not visit this link.');
        analysis.recommendations.push('Report this QR code if found in suspicious locations.');
      }

    } catch (err) {
      // Invalid URL
      analysis.checks.push({
        name: 'URL Format',
        status: 'fail',
        description: 'Invalid URL format detected'
      });
      analysis.riskScore = 10;
      analysis.riskLevel = 'HIGH';
      analysis.recommendations.push('This does not appear to be a valid URL.');
    }

    return analysis;
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'SAFE': return <Shield className="risk-icon safe" />;
      case 'LOW': return <AlertTriangle className="risk-icon low" />;
      case 'MODERATE': return <AlertTriangle className="risk-icon moderate" />;
      case 'HIGH': return <XCircle className="risk-icon high" />;
      default: return <AlertTriangle className="risk-icon" />;
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
          <p>Checking for potential threats and suspicious patterns</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="threat-analysis error">
        <XCircle className="error-icon" />
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
            <p>Security Score: {10 - analysis.riskScore}/10</p>
          </div>
        </div>
      </div>

      <div className="analysis-details">
        <div className="checks-section">
          <h4>Security Checks</h4>
          <div className="checks-list">
            {analysis.checks.map((check, index) => (
              <div key={index} className={`check-item ${check.status}`}>
                <div className="check-status">
                  {check.status === 'pass' && <Shield size={16} />}
                  {check.status === 'warning' && <AlertTriangle size={16} />}
                  {check.status === 'fail' && <XCircle size={16} />}
                </div>
                <div className="check-content">
                  <strong>{check.name}</strong>
                  <p>{check.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recommendations-section">
          <h4>Recommendations</h4>
          <ul className="recommendations-list">
            {analysis.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>

        <div className="url-info">
          <h4>URL Details</h4>
          <div className="url-details">
            <p><strong>Full URL:</strong> <code>{analysis.url}</code></p>
            <p><strong>Analysis Time:</strong> {new Date(analysis.timestamp).toLocaleString()}</p>
          </div>
          <a 
            href={analysis.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="visit-url-btn"
            onClick={(e) => {
              if (analysis.riskLevel === 'HIGH') {
                e.preventDefault();
                alert('This URL is flagged as high risk. Visit at your own discretion.');
              }
            }}
          >
            <ExternalLink size={16} />
            Visit URL (Use Caution)
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThreatAnalysis;
