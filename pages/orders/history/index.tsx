import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { format } from "date-fns";

import SiteLayout from "@/components/layouts/siteLayout";
import FullPageLoader from "@/components/FullPageLoader";

import OrderAPI from "@/lib/OrderAPI";
import { useUser } from "@/context/UserContext";
import { OrderType } from "@/utils/types";

import styles from "./index.module.scss";

type OrdersPage = {
  orders: OrderType[];
  lastKey?: string | null;
};

const OrderHistory = () => {
  const orderApi = new OrderAPI();
  const router = useRouter();
  const { user } = useUser();
  const { userId } = user || {};

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery<OrdersPage>({
      queryKey: ["userOrders", userId],
      queryFn: async ({ pageParam }) => {
        if (!userId) return { orders: [], lastKey: null };
        const lastKeyParam = typeof pageParam === "string" ? pageParam : null;
        const res = await orderApi.getUserOrdersById(userId, lastKeyParam);
        return res as OrdersPage;
      },
      getNextPageParam: (lastPage) => {
        const key = lastPage?.lastKey;
        if (!key) return undefined;
        return key;
      },
      enabled: !!userId,
      initialPageParam: null,
    });

  if (isPending) return <FullPageLoader />;

  const orders = data?.pages?.flatMap((p) => p.orders ?? []) ?? [];

  return (
    <SiteLayout>
      <div className={styles.orderHistory}>
        <h2 className={styles.title}>Order History</h2>

        {orders.length === 0 && (
          <p className={styles.emptyMessage}>
            You haven’t purchased any tickets yet.
          </p>
        )}

        {orders.map((order: OrderType) => {
          const { event, tickets, orderId, createdAt } = order;
          const myDate = new Date(createdAt);
          const datePart = format(myDate, "MMM dd, yyyy");

          return (
            <div
              key={orderId}
              className={styles.orderWrapper}
              onClick={() => router.push(`/orders/${orderId}`)}
            >
              <h2>{event?.title ?? "Event Unavailable"}</h2>
              <p>
                {tickets.length} {tickets.length > 1 ? "tickets" : "ticket"}
              </p>
              <p>Order ID: {orderId}</p>
              <p>Purchased: {datePart}</p>
            </div>
          );
        })}
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={styles.loadMoreBtn}
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </button>
        )}
      </div>
    </SiteLayout>
  );
};

export default OrderHistory;
