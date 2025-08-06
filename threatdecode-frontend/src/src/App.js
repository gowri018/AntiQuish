// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import QRScanner from "./components/QRScanner";
import ThreatAnalysis from "./components/ThreatAnalysis";
import Results from "./components/Results";
import About from "./components/About";

function App() {
  // State to hold scanned URL and analysis results
  const [scannedUrl, setScannedUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  // Called when a QR code URL is scanned or uploaded
  const handleUrlScanned = (url) => {
    setScannedUrl(url);
    setAnalysisResult(null); // Reset previous results when new URL scanned
  };

  // Called when analysis result is ready
  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content" style={{ padding: "1rem" }}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <QRScanner onUrlScanned={handleUrlScanned} />
                  {scannedUrl && (
                    <ThreatAnalysis
                      url={scannedUrl}
                      onAnalysisComplete={handleAnalysisComplete}
                    />
                  )}
                </>
              }
            />

            <Route
              path="/results"
              element={
                <Results scannedUrl={scannedUrl} analysisResult={analysisResult} />
              }
            />

            <Route path="/about" element={<About />} />

            {/* Fallback route - redirect to home */}
            <Route path="*" element={<QRScanner onUrlScanned={handleUrlScanned} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
