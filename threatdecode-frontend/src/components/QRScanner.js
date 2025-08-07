import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { Camera, Upload, AlertTriangle, FileImage, Scan } from 'lucide-react';
import ThreatAnalysis from './ThreatAnalysis';
import './QRScanner.css';

const QRScanner = ({ onUrlScanned }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState('');
  const [scannerMode, setScannerMode] = useState('camera');
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const startCameraScanner = async () => {
    try {
      setError('');
      setIsScanning(true);

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      const html5QrCode = new Html5QrcodeScanner(
        "qr-scanner-container",
        config,
        false
      );

      html5QrCodeRef.current = html5QrCode;

      html5QrCode.render(
        (decodedText, decodedResult) => {
          console.log('QR Code scanned:', decodedText);
          setScannedUrl(decodedText);
          setIsScanning(false);
          html5QrCode.clear();
          if (onUrlScanned) {
            onUrlScanned(decodedText);
          }
          analyzeUrl(decodedText);
        },
        (errorMessage) => {
          console.log('Scan error:', errorMessage);
        }
      );
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please allow camera permissions and try again.');
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.clear().catch(console.error);
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (file) => {
    try {
      setError('');
      setIsAnalyzing(true);
      setSelectedFile(file);

      const html5QrCode = new Html5Qrcode("qr-file-scanner");
      
      const result = await html5QrCode.scanFile(file, true);
      console.log('File scan result:', result);
      
      setScannedUrl(result);
      if (onUrlScanned) {
        onUrlScanned(result);
      }
      analyzeUrl(result);
    } catch (err) {
      console.error('File scan error:', err);
      setError('Could not read QR code from the uploaded image. Please try another image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const analyzeUrl = async (url) => {
    setIsAnalyzing(true);
    console.log('Starting analysis for URL:', url);
  };

  const resetScanner = () => {
    setScannedUrl('');
    setError('');
    setIsAnalyzing(false);
    setScannerMode('camera');
    setSelectedFile(null);
  };

  return (
    <div className="qr-scanner-page">
      <div className="cyber-card scanner-header-card">
        <div className="scanner-header">
          <div className="header-icon">
            <Scan size={48} className="main-icon" />
          </div>
          <h1 className="scanner-title">QR Code Scanner</h1>
          <p className="scanner-subtitle">
            Scan QR codes using your camera or upload an image to detect potential security threats
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!scannedUrl && (
        <div className="cyber-card scanner-modes-card">
          <h3 className="section-title">Choose Scanning Method</h3>
          <div className="scanner-modes">
            <button
              className={`mode-button ${scannerMode === 'camera' ? 'active' : ''}`}
              onClick={() => setScannerMode('camera')}
            >
              <Camera size={24} />
              <span>Camera Scanner</span>
            </button>
            <button
              className={`mode-button ${scannerMode === 'upload' ? 'active' : ''}`}
              onClick={() => setScannerMode('upload')}
            >
              <Upload size={24} />
              <span>Upload Image</span>
            </button>
          </div>
        </div>
      )}

      {!scannedUrl && scannerMode === 'camera' && (
        <div className="cyber-card camera-scanner-card">
          <h3 className="section-title">Camera Scanner</h3>
          {!isScanning ? (
            <div className="scanner-placeholder">
              <Camera size={64} className="placeholder-icon" />
              <h4>Ready to Scan</h4>
              <p>Click the button below to start scanning QR codes with your camera</p>
              <button className="cyber-button start-scan-btn" onClick={startCameraScanner}>
                <Camera size={20} />
                <span>Start Camera Scanner</span>
              </button>
            </div>
          ) : (
            <div className="scanner-active">
              <div id="qr-scanner-container"></div>
              <button className="cyber-button cyber-button-danger stop-scan-btn" onClick={stopScanner}>
                <span>Stop Scanner</span>
              </button>
            </div>
          )}
        </div>
      )}

      {!scannedUrl && scannerMode === 'upload' && (
        <div className="cyber-card file-upload-card">
          <h3 className="section-title">Upload QR Code Image</h3>
          <div className="file-upload-section">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            {isAnalyzing ? (
              <div className="upload-analyzing">
                <div className="loading-spinner"></div>
                <h4>Analyzing QR Code...</h4>
                <p>Please wait while we process your image</p>
              </div>
            ) : (
              <div className="upload-area">
                <FileImage size={48} className="upload-icon" />
                <h4>Select QR Code Image</h4>
                <p>Upload an image file containing a QR code for analysis</p>
                
                <button className="cyber-button upload-btn" onClick={openFileDialog}>
                  <Upload size={20} />
                  <span>Choose Image File</span>
                </button>
                
                <div className="file-info">
                  <p>Supported formats: JPEG, PNG, GIF, WebP (Max 10MB)</p>
                </div>
                
                {selectedFile && (
                  <div className="selected-file">
                    <FileImage size={16} />
                    <span>Selected: {selectedFile.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div id="qr-file-scanner" style={{ display: 'none' }}></div>
        </div>
      )}

      {scannedUrl && (
        <div className="cyber-card scan-results-card">
          <h3 className="section-title">QR Code Detected</h3>
          <div className="scanned-url">
            <h4>Extracted URL:</h4>
            <div className="url-display">
              <code>{scannedUrl}</code>
            </div>
          </div>
          
          <ThreatAnalysis 
            url={scannedUrl} 
            onAnalysisComplete={() => setIsAnalyzing(false)}
            isAnalyzing={isAnalyzing}
          />
          
          <div className="reset-section">
            <button className="cyber-button cyber-button-secondary scan-again-btn" onClick={resetScanner}>
              <Scan size={18} />
              <span>Scan Another QR Code</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
