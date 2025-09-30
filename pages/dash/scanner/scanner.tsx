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

  useEffect(() => {
    if (!scannedResult) {
      // Wait for the DOM to render the div
      const initScanner = async () => {
        const width = window.innerWidth;
        const qrBoxSize = width < 500 ? width * 0.9 : 400;

        const scanner = new Html5Qrcode(qrCodeRegionId);

        try {
          await scanner.start(
            { facingMode: "environment" }, // back camera
            {
              fps: 10,
              qrbox: { width: qrBoxSize, height: qrBoxSize },
            },
            (decodedText) => {
              console.log("Scanned QR:", decodedText);
              const res = ticketApi.validateTicket(decodedText);
              res.then((data) => {
                if (data.error) {
                  setScannedResult(`Error: ${data.error}`);
                } else if (data.valid) {
                  setScannedResult(
                    `Valid Ticket: ${data.ticketInfo} ... ${data.message}`
                  );
                } else {
                  setScannedResult("Invalid Ticket");
                }
              });
              // stop after success
              scanner.stop().catch((err) => console.error("Stop failed:", err));
            },
            (errorMessage) => {
              console.error(errorMessage);
            }
          );
          setHtml5QrCode(scanner);
        } catch (err) {
          console.error("Unable to start scanner:", err);
        }
      };

      initScanner();

      return () => {
        if (html5QrCode) {
          html5QrCode
            .stop()
            .then(() => html5QrCode.clear())
            .catch((err) => console.error("Failed to stop scanner:", err));
        }
      };
    }
  }, [scannedResult]);

  const handleScanAgain = async () => {
    setScannedResult(null);
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
