import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import SiteLayout from "@/components/layouts/siteLayout";

import styles from "./scanner.module.scss";

const Scanner = () => {
  const qrCodeRegionId = "qr-reader";
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  useEffect(() => {
    const width = window.innerWidth;
    const qrBoxSize = width < 350 ? width * 0.5 : 500;

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
      },
      (errorMessage) => {
        // scanning errors are frequent, ignore unless debugging
      }
    );

    return () => {
      scanner
        .clear()
        .catch((err) => console.error("Failed to clear scanner:", err));
    };
  }, []);

  return (
    <SiteLayout>
      <div className={styles.scannerPage}>
        <h1 className={styles.title}>Staff Ticket Scanner</h1>

        {/* Scanner camera box */}
        <div id={qrCodeRegionId} className={styles.scannerBox} />

        {/* Results */}
        {scannedResult && (
          <div className={styles.resultBox}>
            <h2>Scan Result</h2>
            <p>{scannedResult}</p>
          </div>
        )}
      </div>
    </SiteLayout>
  );
};

export default Scanner;
