import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import { toBlob } from "html-to-image";
import FullPageLoader from "@/components/FullPageLoader";
import OrderAPI from "@/lib/OrderAPI";
import SiteLayout from "@/components/layouts/siteLayout";

import styles from "./index.module.scss";
import Image from "next/image";

const OrderById = () => {
  const router = useRouter();
  const orderApi = new OrderAPI();
  const orderId = router.query.id;

  const [currentTicket, setCurrentTicket] = useState(0);

  const { data: orderData, isPending } = useQuery({
    queryKey: ["userOrderId", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const res = await orderApi.getOrderById(`${orderId}`);
      return res;
    },
    enabled: !!orderId,
  });

  const orderRef = useRef<HTMLDivElement>(null); // 👈 reference to .orderById

  if (isPending) return <FullPageLoader />;

  const { eventId, tickets } = orderData;
  const { date, title, location } = eventId || {};
  const myDate = new Date(date);
  const datePart = format(myDate, "MMM dd, yyyy");
  const timePart = format(myDate, "h:mm a");

  if (!eventId) return;

  const downloadOrderDiv = async () => {
    if (!orderRef.current) return;

    try {
      // 🔹 Convert QR canvas to data URL
      const qrCanvas = orderRef.current.querySelector("canvas");
      let tempImg: HTMLImageElement | null = null;

      if (qrCanvas) {
        const dataUrl = qrCanvas.toDataURL("image/png");
        tempImg = document.createElement("img");
        tempImg.src = dataUrl;
        tempImg.style.width = qrCanvas.style.width;
        tempImg.style.height = qrCanvas.style.height;
        qrCanvas.parentNode?.insertBefore(tempImg, qrCanvas);
        qrCanvas.style.display = "none";
      }

      // 🔹 Capture the div
      const blob = await toBlob(orderRef.current, { cacheBust: true });
      if (!blob) return;

      // 🔹 Restore original QR canvas
      if (qrCanvas && tempImg) {
        qrCanvas.style.display = "";
        tempImg.remove();
      }

      const file = new File([blob], `ticket-${orderId}-${currentTicket}.png`, {
        type: "image/png",
      });

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Ticket",
          text: "Here’s my event ticket!",
        });
      } else if (isMobile) {
        const url = URL.createObjectURL(blob);
        const newTab = window.open();
        newTab?.document.write(`<img src="${url}" style="width:100%" />`);
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ticket-${orderId}-${currentTicket}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Failed to download:", err);
    }
  };

  return (
    <SiteLayout>
      <div className={styles.orderById}>
        <div
          className={styles.prev}
          onClick={() => {
            if (currentTicket === 0) return;
            setCurrentTicket(currentTicket - 1);
          }}
        >
          <Image
            src="/images/vector-left.png"
            alt="vectorLeft"
            width={75}
            height={75}
          />
        </div>
        <div className={styles.qrCodeWrapper}>
          <div className={styles.qrCode} ref={orderRef}>
            <h2>{title}</h2>
            <QRCodeSVG
              value={tickets[currentTicket].qrCodeData}
              className={styles.qrCode}
            />
            <div className={styles.eventInfo}>
              <p>
                {datePart}, {timePart}
              </p>
              <p>{location}</p>
              <p>
                {currentTicket + 1} out of {tickets.length} • Order ID:{" "}
                {orderId}
              </p>
            </div>
          </div>
          <button onClick={downloadOrderDiv} className={styles.downloadButton}>
            Download Ticket Card
          </button>
        </div>
        <div
          className={styles.next}
          onClick={() => {
            if (currentTicket === tickets.length - 1) return;
            setCurrentTicket(currentTicket + 1);
          }}
        >
          <Image
            src="/images/vector-right.png"
            alt="vectorRight"
            width={75}
            height={75}
          />
        </div>
      </div>
    </SiteLayout>
  );
};

export default OrderById;
