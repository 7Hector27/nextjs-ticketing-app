import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import SiteLayout from "@/components/layouts/siteLayout";
import { OrderType } from "@/utils/types";

import OrderAPI from "@/lib/OrderAPI";
import { useUser } from "@/context/UserContext";

import FullPageLoader from "@/components/FullPageLoader";

import styles from "./index.module.scss";

const OrderHistory = () => {
  const orderApi = new OrderAPI();
  const router = useRouter();
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
          const { event, tickets, orderId } = order;
          return (
            <div
              key={orderId}
              className={styles.orderWrapper}
              onClick={() => {
                router.push(`/orders/${orderId}`);
              }}
            >
              <h2>{event?.title}</h2>
              <p>
                {tickets.length} {tickets.length > 1 ? "tickets" : "ticket"}
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
