import React, { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import SiteLayout from "@/components/layouts/siteLayout";

import styles from "./scanner.module.scss";

const Scanner = () => {
  const qrCodeRegionId = "qr-reader";
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!scannedResult) {
      const width = window.innerWidth;
      const qrBoxSize = width < 500 ? width * 0.9 : 500;

      const scanner = new Html5Qrcode(qrCodeRegionId);

      scanner
        .start(
          { facingMode: "environment" }, // use back camera if available
          {
            fps: 15,
            qrbox: { width: qrBoxSize, height: qrBoxSize },
          },
          (decodedText) => {
            console.log("Scanned QR:", decodedText);
            setScannedResult(decodedText);

            // Stop scanning after success
            scanner.stop().catch((err) => console.error("Stop failed:", err));
          },
          (errorMessage) => {
            // ignore decode errors
          }
        )
        .catch((err) => console.error("Unable to start scanning:", err));

      setHtml5QrCode(scanner);

      return () => {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch((err) => console.error("Failed to stop scanner:", err));
      };
    }
  }, [scannedResult]);

  const handleScanAgain = () => {
    setScannedResult(null);
    if (html5QrCode) {
      html5QrCode
        .start(
          { facingMode: "environment" },
          { fps: 15, qrbox: { width: 400, height: 400 } },
          (decodedText) => {
            console.log("Scanned QR:", decodedText);
            setScannedResult(decodedText);
            html5QrCode
              .stop()
              .catch((err) => console.error("Stop failed:", err));
          },
          (err) => {}
        )
        .catch((err) => console.error("Restart failed:", err));
    }
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
          <>
            <div className={styles.resultBox}>
              <h2>Scan Result</h2>
              <p>{scannedResult}</p>
            </div>
            <div className={styles.actions}>
              <button className={styles.actionButton} onClick={handleScanAgain}>
                Scan Another Ticket
              </button>
            </div>
          </>
        )}
      </div>
    </SiteLayout>
  );
};

export default Scanner;
