import React from "react";
import { useQuery } from "@tanstack/react-query";

import SiteLayout from "@/components/layouts/siteLayout";
import { OrderType } from "@/utils/types";

import OrderAPI from "@/lib/OrderAPI";
import { useUser } from "@/context/UserContext";

import styles from "./index.module.scss";
import FullPageLoader from "@/components/FullPageLoader";

const OrderHistory = () => {
  const orderApi = new OrderAPI();
  const { user } = useUser();
  const { userId } = user || {};

  const { data, isPending } = useQuery({
    queryKey: ["userOrders", userId],
    queryFn: async () => {
      if (!userId) return null;

      const res = await orderApi.getUserOrdersById(userId);

      return res.orders;
    },
    enabled: !!userId,
  });

  if (isPending) {
    return <FullPageLoader />;
  }

  return (
    <SiteLayout>
      <div className={styles.orderHistory}>
        <h2 className={styles.title}>Order History</h2>
        {data.map((order: OrderType) => {
          const { event, ticketIds, orderId } = order;
          return (
            <div key={orderId} className={styles.orderWrapper}>
              <h3>{event?.title}</h3>
              <p>
                {ticketIds.length} {ticketIds.length > 1 ? "tickets" : "ticket"}
              </p>
              <p>Order ID: {orderId}</p>
            </div>
          );
        })}
      </div>
    </SiteLayout>
  );
};

export default OrderHistory;
