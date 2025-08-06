import React from 'react';
import { Shield, Zap, Eye, Brain } from 'lucide-react';
import './About.css';

const About = () => {
  const features = [
    {
      icon: <Eye size={32} />,
      title: 'QR Code Scanning',
      description: 'Scan QR codes using your camera or upload images for analysis.'
    },
    {
      icon: <Brain size={32} />,
      title: 'Threat Detection',
      description: 'Advanced analysis to identify potential phishing and malicious URLs.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Real-time Analysis',
      description: 'Instant security assessment with detailed explanations.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Privacy Focused',
      description: 'No data stored on servers. All analysis happens locally when possible.'
    }
  ];

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About ThreatDecode</h1>
        <p className="about-subtitle">
          Protecting users from QR code phishing attacks through intelligent threat detection
        </p>
      </div>

      <div className="about-content">
        <section className="intro-section">
          <h2>What is ThreatDecode?</h2>
          <p>
            ThreatDecode is a web application designed to help users identify potential 
            security threats hidden within QR codes. With the increasing use of QR codes 
            in daily life, malicious actors have found new ways to exploit these seemingly 
            innocent squares of dots.
          </p>
          <p>
            Our tool analyzes QR codes and their embedded URLs to detect suspicious patterns, 
            phishing attempts, and other security risks, helping you stay safe in the digital world.
          </p>
        </section>

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Scan or Upload</h3>
                <p>Use your camera to scan a QR code or upload an image containing a QR code.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Extract & Analyze</h3>
                <p>The app extracts the URL and performs multiple security checks.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Results</h3>
                <p>Receive a detailed analysis with risk level and safety recommendations.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="safety-tips">
          <h2>QR Code Safety Tips</h2>
          <ul>
            <li>Always verify QR codes from unknown sources before scanning</li>
            <li>Be cautious of QR codes in public places that could be malicious stickers</li>
            <li>Never enter personal information on websites accessed through suspicious QR codes</li>
            <li>Use ThreatDecode to analyze QR codes when in doubt</li>
            <li>Keep your devices updated with the latest security patches</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
