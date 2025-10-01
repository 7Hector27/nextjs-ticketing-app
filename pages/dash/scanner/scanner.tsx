import React, { useState, useRef } from "react";
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
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(qrCodeRegionId);
    }
    const width = window.innerWidth;
    const qrBoxSize = width < 500 ? width * 0.8 : 400;
    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: qrBoxSize, height: qrBoxSize } },
        async (decodedText) => {
          // Optional: auto-stop after first scan
          await stopScanner();

          const res = ticketApi.validateTicket(decodedText);
          res.then((data) => {
            if (data.error) {
              setScannedResult(`Error: ${data.error}`);
            } else if (data.valid) {
              setScannedResult(`Valid Ticket: ${data.message}`);
            } else {
              setScannedResult(`Invalid Ticket : ${data.message}`);
            }
          });
        },
        (errorMessage: string | { message?: string }) => {
          const msg =
            typeof errorMessage === "string"
              ? errorMessage
              : errorMessage?.message || "";

          if (
            msg.includes("source width is 0") ||
            msg.includes("No MultiFormat Readers were able to detect the code")
          ) {
            return; // ignore common noise
          }

          console.error("QR error:", errorMessage);
        }
      );
    } catch (err) {
      console.error("Error starting scanner:", err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };
  return (
    <SiteLayout>
      <div className={styles.scannerPage}>
        <h1 className={styles.title}>Staff Ticket Scanner{}</h1>
        {!scannedResult && (
          <div className={styles.scannerWrapper}>
            <div id={qrCodeRegionId} className={styles.resultBox} />
          </div>
        )}

        {scannedResult && (
          <div className={styles.resultBox}>
            <h2>Scan Result</h2>
            <p>{scannedResult}</p>
          </div>
        )}
        <div className={styles.actions}>
          <button
            onClick={async () => {
              setScannedResult(null);
              await startScanner();
            }}
            className={styles.actionButton}
          >
            Start Scanner
          </button>
        </div>
      </div>
    </SiteLayout>
  );
};

export default Scanner;
