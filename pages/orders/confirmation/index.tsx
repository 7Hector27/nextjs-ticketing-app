import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import SiteLayout from "@/components/layouts/siteLayout";

import styles from "./index.module.scss";
const Confirmation = () => {
  // if (!order) {
  //   return <div>Error</div>;
  // }
  const router = useRouter();
  const orderId = router.query.orderId;
  console.log(router.query.orderId, "orderId on confirmation page");
  return (
    <SiteLayout>
      <div className={styles.confirmation}>
        <div className={styles.confirmationWrapper}>
          <Image
            src="/images/celebration.png"
            width={65}
            height={65}
            alt="celebration-icon"
            className={styles.img}
          />
          <h2>Thank you for your purchase!</h2>
          <p>Your order has been confirmed</p>
          <div className={styles.orderId}>
            <p>Order ID: {orderId}</p>
          </div>
          <div className={styles.buttonWrapper}>
            <button
              onClick={() => {
                router.push("/orders/orderHistory");
              }}
            >
              View Order History
            </button>
            <button
              onClick={() => {
                router.push("/");
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default Confirmation;
