import React, { useState } from 'react';

const UrlExpander = () => {
  const [inputUrl, setInputUrl] = useState('');

  return (
    <div className="url-expander-container">
      <h1>URL Expander & Analyzer</h1>
      <p>Expand and analyze shortened URLs safely</p>
      
      <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(16, 37, 72, 0.82)', borderRadius: '16px' }}>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter shortened URL (e.g., bit.ly/abc123)"
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '1rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '2px solid #00fff7',
            background: 'rgba(10, 25, 40, 0.8)',
            color: '#fff',
            marginBottom: '1rem'
          }}
        />
        <br />
        <button
          style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #00fff7, #00bcd4)',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Expand & Analyze URL
        </button>
      </div>
      
      <div style={{ marginTop: '2rem', color: '#a0fff8' }}>
        <p>✅ URL Expander is working!</p>
        <p>This feature will expand shortened URLs and analyze them for threats.</p>
      </div>
    </div>
  );
};

export default UrlExpander;
