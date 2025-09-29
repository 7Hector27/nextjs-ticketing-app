import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";

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

  if (isPending) return <FullPageLoader />;

  const { eventId, tickets } = orderData;
  const { date, title, location } = eventId || {};
  const myDate = new Date(date);
  const datePart = format(myDate, "MMM dd, yyyy");
  const timePart = format(myDate, "h:mm a");

  if (!eventId) return;

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
          <h2>{title}</h2>
          <QRCodeCanvas
            value={tickets[currentTicket].qrCodeData}
            className={styles.qrCode}
          />
          <div className={styles.eventInfo}>
            <p>
              {datePart}, {timePart}
            </p>
            <p>{location}</p>
            <p>
              {currentTicket + 1} out of {tickets.length} • Order ID: {orderId}
            </p>
          </div>
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
