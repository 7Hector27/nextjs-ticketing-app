import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

import SiteLayout from "@/components/layouts/siteLayout";
import TicketAPI from "@/lib/TicketAPI";

import styles from "./scanner.module.scss";

const Scanner = () => {
  const qrCodeRegionId = "qr-reader";
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanningRef = useRef(true); // 👈 flag to simulate pause/resume
  const ticketApi = new TicketAPI();
  const initScanner = async () => {
    const width = window.innerWidth;
    const qrBoxSize = width < 500 ? width * 0.9 : 400;

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(qrCodeRegionId);
    }

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: qrBoxSize, height: qrBoxSize } },
        async (decodedText) => {
          if (!scanningRef.current) return; // 👈 ignore if "paused"

          scanningRef.current = false; // "pause"

          const data = await ticketApi.validateTicket(decodedText);

          if (data.error) {
            setScannedResult(`Error: ${data.error}...${data.message}`);
          } else if (data.valid) {
            setScannedResult(`✅ Valid Ticket: ${data.message}`);
          } else {
            setScannedResult(`❌ Invalid Ticket: ${data.message}`);
          }
        },
        (errorMessage) => {
          // harmless frame decode errors
          console.debug("Frame skipped:", errorMessage);
        }
      );
    } catch (err) {
      console.error("Unable to start scanner:", err);
    }
  };
  useEffect(() => {
    if (!scannedResult) {
      scanningRef.current = true; // allow scanning again
      initScanner();
    }

    return () => {
      scannerRef.current
        ?.stop()
        .then(() => scannerRef.current?.clear())
        .catch((err) => console.error("Failed to stop scanner:", err));
    };
  }, [scannedResult]);

  const handleScanAgain = () => {
    scannerRef?.current?.clear();
    scanningRef.current = true; // allow scanning again
    setScannedResult(null);
    initScanner();
  };

  return (
    <SiteLayout>
      <div className={styles.scannerPage}>
        <h1 className={styles.title}>Staff Ticket Scanner</h1>

        {!scannedResult && (
          <div
            id={qrCodeRegionId}
            className={styles.scannerBox}
            style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}
          />
        )}

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
