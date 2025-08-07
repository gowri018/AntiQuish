// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import QRScanner from "./components/QRScanner";
import ThreatAnalysis from "./components/ThreatAnalysis";
import Results from "./components/Results";
import About from "./components/About";
import UrlExpander from "./components/UrlExpander"; // NEW IMPORT

import "./App.css";

function App() {
  const [scannedUrl, setScannedUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleUrlScanned = (url) => {
    setScannedUrl(url);
    setAnalysisResult(null);
  };

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content" style={{ padding: "1rem" }}>
          <Routes>
            <Route path="/url-expander" element={<UrlExpander />} />
            <Route
              path="/results"
              element={
                <Results scannedUrl={scannedUrl} analysisResult={analysisResult} />
              }
            />
            <Route path="/about" element={<About />} />
            {/* NEW ROUTE */}
            <Route path="/url-expander" element={<UrlExpander />} />
            <Route path="*" element={<QRScanner onUrlScanned={handleUrlScanned} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
