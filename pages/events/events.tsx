import React from "react";
import { useQuery } from "@tanstack/react-query";

import FullPageLoader from "@/components/FullPageLoader";
import EventAPI from "@/lib/EventAPI";
import { EventType } from "@/utils/types";
import EventCard from "@/components/EventCard";
import Navbar from "@/components/Navbar";

import styles from "./events.module.scss";
import SiteLayout from "@/components/layouts/siteLayout";

const Event = () => {
  const eventApi = new EventAPI();

  const { data: featuredEvents, isLoading } = useQuery({
    queryKey: ["featuredEvents"],
    queryFn: async () => {
      const res = await eventApi.getEvents();
      return res.items;
    },
  });

  if (isLoading) return <FullPageLoader />;

  return (
    <SiteLayout className={styles.events}>
      <div className={styles.body}>
        <div className={styles.eventHeader}>
          <h2>Events</h2>
          <p>Browse through our list of exciting upcoming events.</p>
        </div>
        <div className={styles.content}>
          {featuredEvents?.map((event: EventType, index: number) => {
            return <EventCard event={event} key={index} />;
          })}
        </div>
      </div>
    </SiteLayout>
  );
};

export default Event;
