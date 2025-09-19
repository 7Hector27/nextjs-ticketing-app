import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import FullPageLoader from "../FullPageLoader";

import EventAPI from "@/lib/EventAPI";
import { EventType } from "@/utils/types";

import styles from "./FeaturedDashEvent.module.scss";

type FeaturedDashEventProps = {
  viewAllHref?: string;
};

const FeaturedDashEvent = ({
  viewAllHref = "/events",
}: FeaturedDashEventProps) => {
  const eventApi = new EventAPI();

  const { data: featuredEvents, isLoading } = useQuery({
    queryKey: ["featuredEvents"],
    queryFn: async () => {
      const res = await eventApi.getEvents({ featured: true, limit: 3 });
      return res.items;
    },
  });

  if (isLoading) return <FullPageLoader />;

  return (
    <div className={styles.featuredDashEvents}>
      <h2>Featured Events</h2>
      <div className={styles.content}>
        {featuredEvents?.map((event: EventType, index: number) => {
          const { title, date, imageUrl, totalTickets, availableTickets } =
            event || {};
          const myDate = new Date(date);
          const datePart = format(myDate, "MMMM dd, yyyy");
          const timePart = format(myDate, "hh:mm a");

          return (
            <div key={index} className={styles.eventCard}>
              <div className={styles.imgWrapper}>
                <Image
                  src={imageUrl ? imageUrl : ""}
                  alt="eventImg"
                  width={200}
                  height={200}
                  className={styles.img}
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.date}>
                  {datePart}, {timePart}
                </p>
                <p className={styles.tickets}>
                  {availableTickets} /{totalTickets} Tickets
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <Link href={viewAllHref} className={styles.link}>
        View All
      </Link>
    </div>
  );
};

export default FeaturedDashEvent;
