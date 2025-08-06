import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { Camera, Upload, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import FileUpload from './FileUpload';
import ThreatAnalysis from './ThreatAnalysis';
import './QRScanner.css';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState('');
  const [scannerMode, setScannerMode] = useState('camera'); // 'camera' or 'upload'
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on component unmount
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
          analyzeUrl(decodedText);
        },
        (errorMessage) => {
          // Handle scan errors silently - they're usually just "no QR found"
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

      const html5QrCode = new Html5Qrcode("qr-file-scanner");
      
      const result = await html5QrCode.scanFile(file, true);
      console.log('File scan result:', result);
      
      setScannedUrl(result);
      analyzeUrl(result);
    } catch (err) {
      console.error('File scan error:', err);
      setError('Could not read QR code from the uploaded image. Please try another image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeUrl = async (url) => {
    setIsAnalyzing(true);
    // This will be handled by the ThreatAnalysis component
    console.log('Starting analysis for URL:', url);
  };

  const resetScanner = () => {
    setScannedUrl('');
    setError('');
    setIsAnalyzing(false);
    setScannerMode('camera');
  };

  return (
    <div className="qr-scanner-container">
      <div className="scanner-header">
        <h1>ThreatDecode QR Scanner</h1>
        <p>Scan QR codes to detect potential phishing threats</p>
      </div>

      {error && (
        <div className="error-message">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!scannedUrl && (
        <div className="scanner-modes">
          <button
            className={`mode-button ${scannerMode === 'camera' ? 'active' : ''}`}
            onClick={() => setScannerMode('camera')}
          >
            <Camera size={20} />
            Camera Scanner
          </button>
          <button
            className={`mode-button ${scannerMode === 'upload' ? 'active' : ''}`}
            onClick={() => setScannerMode('upload')}
          >
            <Upload size={20} />
            Upload Image
          </button>
        </div>
      )}

      {!scannedUrl && scannerMode === 'camera' && (
        <div className="camera-scanner">
          {!isScanning ? (
            <div className="scanner-placeholder">
              <Camera size={64} className="camera-icon" />
              <h3>Ready to Scan</h3>
              <p>Click start to begin scanning QR codes with your camera</p>
              <button className="start-scan-btn" onClick={startCameraScanner}>
                Start Camera Scanner
              </button>
            </div>
          ) : (
            <div className="scanner-active">
              <div id="qr-scanner-container"></div>
              <button className="stop-scan-btn" onClick={stopScanner}>
                Stop Scanner
              </button>
            </div>
          )}
        </div>
      )}

      {!scannedUrl && scannerMode === 'upload' && (
        <div className="file-upload-section">
          <FileUpload onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
          <div id="qr-file-scanner" style={{ display: 'none' }}></div>
        </div>
      )}

      {scannedUrl && (
        <div className="scan-results">
          <div className="scanned-url">
            <h3>QR Code Detected</h3>
            <div className="url-display">
              <code>{scannedUrl}</code>
            </div>
          </div>
          
          <ThreatAnalysis 
            url={scannedUrl} 
            onAnalysisComplete={() => setIsAnalyzing(false)}
            isAnalyzing={isAnalyzing}
          />
          
          <button className="scan-again-btn" onClick={resetScanner}>
            Scan Another QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
