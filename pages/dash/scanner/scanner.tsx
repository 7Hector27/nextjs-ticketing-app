import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

import SiteLayout from "@/components/layouts/siteLayout";
import TicketAPI from "@/lib/TicketAPI";

import styles from "./scanner.module.scss";

const Scanner = () => {
  const qrCodeRegionId = "qr-reader";
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]); // <-- collect logs here
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const ticketApi = new TicketAPI();

  // helper to push logs to UI
  const log = (msg: unknown) => {
    const text = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);

    console.log(text); // still output to console
    setLogs((prev) => [...prev, text]);
  };

  const startScanner = async () => {
    const width = window.innerWidth;
    const qrBoxSize = width < 500 ? width * 0.9 : 400;

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(qrCodeRegionId);
    }

    log("Starting scanner…");

    await scannerRef.current.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: qrBoxSize, height: qrBoxSize } },
      async (decodedText) => {
        try {
          log(`Decoded: ${decodedText}`);
          await scannerRef.current?.stop();
          log("Scanner stopped after decode");

          const data = await ticketApi.validateTicket(decodedText);
          log("Validation response: " + JSON.stringify(data));

          if (data.error) {
            setScannedResult(`Error: ${data.message}`);
          } else if (data.valid) {
            setScannedResult(`✅ Valid Ticket: ${data.message}`);
          } else {
            setScannedResult(`❌ Invalid Ticket: ${data.message}`);
          }
        } catch (err) {
          log("Validation failed: " + err);
        }
      },
      (errorMessage) => {
        // harmless frame decode errors
        log("Frame skipped: " + errorMessage);
      }
    );
  };

  useEffect(() => {
    if (!scannedResult) {
      startScanner();

      return () => {
        scannerRef.current
          ?.stop()
          .then(() => {
            log("Scanner stopped in cleanup");
            return scannerRef.current?.clear();
          })
          .catch((err) => log("Failed to stop scanner: " + err));
      };
    }
  }, [scannedResult]);

  const handleScanAgain = () => {
    setScannedResult(null);
    setLogs([]); // reset logs if you want
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

        {/* Debug log output */}
        <pre
          style={{
            marginTop: "1rem",
            background: "#111",
            color: "#0f0",
            padding: "1rem",
            maxHeight: "200px",
            overflowY: "auto",
            fontSize: "0.8rem",
          }}
        >
          {logs.join("\n")}
        </pre>
      </div>
    </SiteLayout>
  );
};

export default Scanner;
