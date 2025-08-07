// src/components/Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, Info, Github, Link2 } from 'lucide-react'; // Added Link2 icon
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo">
          <Shield size={32} className="logo-icon" />
          <span className="logo-text">ThreatDecode</span>
        </Link>
        
        <nav className="nav-menu">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Home size={18} />
            Scanner
          </Link>
          {/* NEW NAVIGATION LINK */}
          <Link 
            to="/url-expander" 
            className={`nav-link ${location.pathname === '/url-expander' ? 'active' : ''}`}
          >
            <Link2 size={18} />
            URL Expander
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            <Info size={18} />
            About
          </Link>
        </nav>

        <div className="header-actions">
          <a 
            href="https://github.com/your-username/threatdecode" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
            aria-label="View on GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
