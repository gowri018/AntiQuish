import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, Info, Github, Link2, Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="cyber-header">
      <div className="header-content">
        <Link to="/" className="cyber-logo">
          <Shield size={32} className="logo-icon" />
          <span className="logo-text">
            <span className="logo-main">THREAT</span>
            <span className="logo-sub">DECODE</span>
          </span>
        </Link>
        
        <nav className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link 
            to="/" 
            className={`cyber-nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home size={18} />
            <span>SCANNER</span>
          </Link>
          <Link 
            to="/url-expander" 
            className={`cyber-nav-link ${location.pathname === '/url-expander' ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Link2 size={18} />
            <span>EXPANDER</span>
          </Link>
          <Link 
            to="/about" 
            className={`cyber-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Info size={18} />
            <span>ABOUT</span>
          </Link>
        </nav>

        <div className="header-actions">
          <a 
            href="https://github.com/gowri018/AntiQuish" 
            target="_blank" 
            rel="noopener noreferrer"
            className="cyber-github-link"
            aria-label="View on GitHub"
          >
            <Github size={20} />
          </a>
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <div className="header-glow"></div>
    </header>
  );
};

export default Header;
