import React, { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

import SiteLayout from "@/components/layouts/siteLayout";
import TicketAPI from "@/lib/TicketAPI";

import styles from "./scanner.module.scss";

const Scanner = () => {
  const qrCodeRegionId = "qr-reader";
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const ticketApi = new TicketAPI();

  const startScanner = async (scanner: Html5Qrcode) => {
    try {
      const width = window.innerWidth;
      const qrBoxSize = width < 500 ? width * 0.9 : 400;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: qrBoxSize, height: qrBoxSize },
        },
        async (decodedText) => {
          try {
            await scanner.stop(); // stop right after first result
            const data = await ticketApi.validateTicket(decodedText);

            if (data.error) {
              setScannedResult(`Error: ${data.message}`);
            } else if (data.valid) {
              setScannedResult(`✅ Valid Ticket: ${data.message}`);
            } else {
              setScannedResult(`❌ Invalid Ticket: ${data.message}`);
            }
          } catch (err) {
            console.error("Error while stopping scanner:", err);
          }
        },
        (errorMessage) => {
          // These are frequent decode errors — safe to ignore
          console.debug("Scan error:", errorMessage);
        }
      );
    } catch (err) {
      console.error("Failed to start scanner:", err);
    }
  };

  useEffect(() => {
    const scanner = new Html5Qrcode(qrCodeRegionId);
    setHtml5QrCode(scanner);

    startScanner(scanner);

    return () => {
      scanner
        .stop()
        .then(() => scanner.clear())
        .catch(() => {}); // ignore stop errors on unmount
    };
  }, []);

  const handleScanAgain = async () => {
    if (!html5QrCode) return;

    setScannedResult(null);
    // restart scanner
    await startScanner(html5QrCode);
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
