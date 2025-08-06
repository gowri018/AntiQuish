import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import './Results.css';

const Results = () => {
  const location = useLocation();
  const { analysis } = location.state || {};

  if (!analysis) {
    return (
      <div className="results-container">
        <div className="no-results">
          <AlertTriangle size={48} />
          <h2>No Analysis Data</h2>
          <p>No analysis results found. Please scan a QR code first.</p>
          <Link to="/" className="back-to-scanner">
            <ArrowLeft size={16} />
            Back to Scanner
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Back to Scanner
        </Link>
        <h1>Analysis Results</h1>
      </div>

      <div className="results-content">
        {/* Analysis results will be displayed here */}
        <div className="analysis-summary">
          <h2>URL Security Analysis</h2>
          <p>Analysis completed for: <code>{analysis.url}</code></p>
        </div>
      </div>
    </div>
  );
};

export default Results;
