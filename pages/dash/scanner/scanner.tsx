import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

import SiteLayout from "@/components/layouts/siteLayout";
import TicketAPI from "@/lib/TicketAPI";

import styles from "./scanner.module.scss";

const Scanner = () => {
  const qrCodeRegionId = "qr-reader";
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const ticketApi = new TicketAPI();

  const startScanner = async () => {
    const width = window.innerWidth;
    const qrBoxSize = width < 500 ? width * 0.9 : 400;

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(qrCodeRegionId);
    }

    await scannerRef.current.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: qrBoxSize, height: qrBoxSize } },
      async (decodedText) => {
        try {
          await scannerRef.current?.stop(); // stop after one scan

          const data = await ticketApi.validateTicket(decodedText);

          if (data.error) {
            setScannedResult(`Error: ${data.message}`);
          } else if (data.valid) {
            setScannedResult(`✅ Valid Ticket: ${data.message}`);
          } else {
            setScannedResult(`❌ Invalid Ticket: ${data.message}`);
          }
        } catch (err) {
          console.error("Validation failed:", err);
        }
      },
      () => {} // ignore frame decode errors
    );
  };

  useEffect(() => {
    if (!scannedResult) {
      startScanner();

      return () => {
        scannerRef.current
          ?.stop()
          .then(() => scannerRef.current?.clear())
          .catch((err) => console.error("Failed to stop scanner:", err));
      };
    }
  }, [scannedResult]);

  const handleScanAgain = () => {
    setScannedResult(null); // triggers useEffect → restart scanner
  };

  return (
    <SiteLayout>
      <div className={styles.scannerPage}>
        <h1 className={styles.title}>Staff Ticket Scanner</h1>

        {/* Scanner camera box */}
        {!scannedResult && (
          <div
            id={qrCodeRegionId}
            className={styles.scannerBox}
            style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}
          />
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
