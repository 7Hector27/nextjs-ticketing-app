import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import SiteLayout from "@/components/layouts/siteLayout";

import styles from "./scanner.module.scss";

const Scanner = () => {
  const qrCodeRegionId = "qr-reader";
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [scannerInstance, setScannerInstance] =
    useState<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!scannedResult) {
      const width = window.innerWidth;
      const qrBoxSize = width < 500 ? width * 0.8 : 400;

      const scanner = new Html5QrcodeScanner(
        qrCodeRegionId,
        {
          fps: 15,
          qrbox: { width: qrBoxSize, height: qrBoxSize },
        },
        false
      );

      scanner.render(
        (decodedText) => {
          console.log("Scanned QR:", decodedText);
          setScannedResult(decodedText);

          // Stop scanning after a result
          scanner
            .clear()
            .catch((err) => console.error("Failed to clear scanner:", err));
        },
        (errorMessage) => {
          // ignore frequent scan errors
        }
      );

      setScannerInstance(scanner);

      return () => {
        scanner
          .clear()
          .catch((err) => console.error("Failed to clear scanner:", err));
      };
    }
  }, [scannedResult]);

  const handleScanAgain = () => {
    setScannedResult(null);
  };

  return (
    <SiteLayout>
      <div className={styles.scannerPage}>
        <h1 className={styles.title}>Staff Ticket Scanner</h1>

        {/* Scanner camera box */}
        {!scannedResult && (
          <div id={qrCodeRegionId} className={styles.scannerBox} />
        )}

        {/* Results */}
        {scannedResult && (
          <div className={styles.resultBox}>
            <h2>Scan Result</h2>
            <p>{scannedResult}</p>
            <button className={styles.actionButton} onClick={handleScanAgain}>
              Scan Another Ticket
            </button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
};

export default Scanner;
