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

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 300, height: 300 } },
        async (decodedText) => {
          console.log("QR Code detected:", decodedText);
          setScannedResult(decodedText);

          // Optional: auto-stop after first scan
          await stopScanner();

          // Example: call your API with the scanned code
          try {
            const response = await ticketApi.validateTicket(decodedText);
            console.log("API Response:", response);
          } catch (apiErr) {
            console.error("Ticket API error:", apiErr);
          }
        },
        (errorMessage) => {
          // you can ignore frame scan errors if you don’t want spam logs
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
      <div className={styles.scannerWrapper}>
        <div
          id={qrCodeRegionId}
          style={{ width: "100%", height: "400px" }}
          className={styles.resultBox}
        />
        <div className={styles.controls}>
          <button onClick={startScanner}>Start Scanner</button>
          <button onClick={stopScanner}>Stop Scanner</button>
        </div>
        {scannedResult && (
          <p className={styles.result}>Scanned: {scannedResult}</p>
        )}
      </div>
    </SiteLayout>
  );
};

export default Scanner;
