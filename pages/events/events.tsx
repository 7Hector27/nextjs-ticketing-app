import React from "react";
import { useQuery } from "@tanstack/react-query";

import FullPageLoader from "@/components/FullPageLoader";
import EventAPI from "@/lib/EventAPI";
import { EventType } from "@/utils/types";
import EventCard from "@/components/EventCard";
import Navbar from "@/components/Navbar";

import styles from "./events.module.scss";

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
    <div className={styles.events}>
      <Navbar />
      <h2>Events</h2>
      <div className={styles.content}>
        {featuredEvents?.map((event: EventType, index: number) => {
          return <EventCard event={event} key={index} />;
        })}
      </div>
    </div>
  );
};

export default Event;
