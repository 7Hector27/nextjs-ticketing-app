import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import SiteLayout from "@/components/layouts/siteLayout";

import styles from "./scanner.module.scss";

const Scanner = () => {
  const qrCodeRegionId = "qr-reader";

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      qrCodeRegionId,
      {
        fps: 60,
        qrbox: { width: 100, height: 100 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("Scanned QR:", decodedText);
        alert(`Scanned QR Code: ${decodedText}`);
        // 🔥 Call your backend validation API here
      },
      (errorMessage) => {
        // You can log scanning errors here
      }
    );

    return () => {
      scanner
        .clear()
        .catch((err) => console.error("Failed to clear scanner:", err));
    };
  }, []);

  return (
    <SiteLayout>
      <div className={styles.scannerPage}>
        <h1 className={styles.title}>Staff Ticket Scanner</h1>
        <div id={qrCodeRegionId} className={styles.scannerBox} />
      </div>
    </SiteLayout>
  );
};

export default Scanner;
