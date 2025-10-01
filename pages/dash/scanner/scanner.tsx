import React, { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useMutation } from "@tanstack/react-query";

import SiteLayout from "@/components/layouts/siteLayout";
import TicketAPI from "@/lib/TicketAPI";

import styles from "./scanner.module.scss";

const Scanner = () => {
  const qrCodeRegionId = "qr-reader";
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const ticketApi = new TicketAPI();

  // React Query mutation
  const validateTicketMutation = useMutation({
    mutationFn: (code: string) => ticketApi.validateTicket(code),
    onSuccess: (data) => {
      if (data.error) {
        setScannedResult(`Error: ${data.error}`);
      } else if (data.valid) {
        setScannedResult(`Valid Ticket: ${data.message}`);
      } else {
        setScannedResult(`Invalid Ticket : ${data.message}`);
      }
    },
    onError: (err) => {
      setScannedResult(`Error: ${err.message || "Validation failed"}`);
    },
  });

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
          // stop scanning to avoid multiple triggers
          await stopScanner();

          // call the mutation
          validateTicketMutation.mutate(decodedText);
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

  useEffect(() => {
    if (scannedResult === null) {
      startScanner();
    }
  }, [scannedResult]);

  return (
    <SiteLayout>
      <div className={styles.scannerPage}>
        <h1 className={styles.title}>Staff Ticket Scanner</h1>

        {!scannedResult && (
          <div className={styles.scannerWrapper}>
            <div id={qrCodeRegionId} className={styles.resultBox} />
          </div>
        )}

        {validateTicketMutation.isPending && (
          <div className={styles.resultBox}>
            <h2>Validating Ticket...</h2>
            <div className={styles.spinner}></div> {/* add CSS spinner */}
          </div>
        )}

        {scannedResult && !validateTicketMutation.isPending && (
          <div className={styles.resultBox}>
            <h2>Scan Result</h2>
            <p>{scannedResult}</p>
          </div>
        )}

        <div className={styles.actions}>
          <button
            onClick={async () => {
              setScannedResult(null);
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
