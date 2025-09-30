import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

import SiteLayout from "@/components/layouts/siteLayout";
import TicketAPI from "@/lib/TicketAPI";

import styles from "./scanner.module.scss";

const Scanner = () => {
  const qrCodeRegionId = "qr-reader";
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);
  const ticketApi = new TicketAPI();

  // init scanner only once on mount
  useEffect(() => {
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
            if (processingRef.current) return;
            processingRef.current = true;

            const data = await ticketApi.validateTicket(decodedText);
            if (data.error) {
              setScannedResult(`Error: ${data.error}...${data.message}`);
            } else if (data.valid) {
              setScannedResult(`Valid Ticket: ${data.message}`);
            } else {
              setScannedResult(`Invalid Ticket : ${data.message}`);
            }

            // pause after first result
            await scannerRef.current?.pause(true);
          },
          (err) => console.error("QR error:", err)
        );
      } catch (err) {
        console.error("Unable to start scanner:", err);
      }
    };

    initScanner();

    return () => {
      scannerRef.current
        ?.stop()
        .then(() => scannerRef.current?.clear())
        .catch((err) => console.error("Failed to stop scanner:", err));
    };
  }, [ticketApi]);

  // resume scanning whenever scannedResult is cleared
  useEffect(() => {
    const resumeIfCleared = async () => {
      if (scannedResult === null && scannerRef.current) {
        processingRef.current = false;
        try {
          await scannerRef.current.resume();
        } catch (err) {
          console.error("Failed to resume scanner:", err);
        }
      }
    };
    resumeIfCleared();
  }, [scannedResult]);

  const handleScanAgain = () => {
    setScannedResult(null);
  };

  return (
    <SiteLayout>
      <div className={styles.scannerPage}>
        <h1 className={styles.title}>Staff Ticket Scanner</h1>

        {/* Always in DOM so scanner can attach */}
        <div
          id={qrCodeRegionId}
          className={styles.scannerBox}
          style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}
        />

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
