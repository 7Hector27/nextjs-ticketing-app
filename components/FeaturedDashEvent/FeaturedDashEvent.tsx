import React, { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";

import EventAPI from "@/lib/EventAPI";
import { EventType } from "@/utils/types";

import styles from "./FeaturedDashEvent.module.scss";

const FeaturedDashEvent = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);

  const eventApi = new EventAPI();

  const getEvents = async () => {
    const events = await eventApi.getEvents({ featured: true, limit: 3 });
    setFeaturedEvents(events.items);
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <div className={styles.featuredDashEvents}>
      <h2>Recent Events</h2>
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
                  {availableTickets} /{totalTickets}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedDashEvent;
