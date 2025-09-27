import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import FullPageLoader from "@/components/FullPageLoader";
import OrderAPI from "@/lib/OrderAPI";

import SiteLayout from "@/components/layouts/siteLayout";

import styles from "./index.module.scss";

const OrderById = () => {
  const router = useRouter();
  const orderApi = new OrderAPI();
  const orderId = router.query.id;

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
  console.log(orderData);
  return <SiteLayout>{orderId}</SiteLayout>;
};

export default OrderById;
