import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { format } from "date-fns";

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["userOrders", userId],
      queryFn: async ({ pageParam }) => {
        if (!userId) return null;
        // Call your API with lastKey param if it exists
        const res = await orderApi.getUserOrdersById(userId, pageParam);
        return res;
      },
      getNextPageParam: (lastPage) => {
        // backend sends { orders, lastKey }
        return lastPage?.lastKey ?? undefined;
      },
      enabled: !!userId,
      initialPageParam: null,
    });

  if (isPending) {
    return <FullPageLoader />;
  }

  const orders = data?.pages.flatMap((page) => page?.orders || []) || [];

  return (
    <SiteLayout>
      <div className={styles.orderHistory}>
        <h2 className={styles.title}>Order History</h2>
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
              <h2>{event?.title}</h2>
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
