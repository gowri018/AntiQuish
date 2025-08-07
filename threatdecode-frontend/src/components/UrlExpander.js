// src/components/UrlExpander.js
import React, { useState } from 'react';
import { Link2 } from 'lucide-react';

const UrlExpander = () => {
  const [inputUrl, setInputUrl] = useState('');

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Link2 size={48} style={{ color: '#00fff7', marginBottom: '1rem' }} />
      <h1 style={{ color: '#00fff7' }}>URL Expander & Analyzer</h1>
      <p style={{ color: '#a0fff8' }}>This is the URL Expander page - it's working!</p>
      
      <div style={{ marginTop: '2rem' }}>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter shortened URL here"
          style={{
            padding: '1rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '2px solid #00fff7',
            background: 'rgba(10, 25, 40, 0.8)',
            color: '#fff',
            marginRight: '1rem',
            minWidth: '300px'
          }}
        />
        <button
          style={{
            padding: '1rem 2rem',
            background: '#00fff7',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Expand URL
        </button>
      </div>
    </div>
  );
};

export default UrlExpander;
