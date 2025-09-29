import React from "react";
import { format } from "date-fns";

import styles from "./MostPopularEvents.module.scss";

const TopSellers = [
  {
    id: 1,
    name: "The Strokes",
    date: "2025-12-31",
    time: "20:00",
  },
  {
    id: 2,
    name: "Aero Zepplin",
    date: "2026-07-05",
    time: "20:00",
  },
  {
    id: 3,
    name: "Sugarlang",
    date: "2026-09-10",
    time: "20:00",
  },
  {
    id: 4,
    name: "Queens of the Stone Age",
    date: "2026-02-15",
    time: "20:00",
  },
  {
    id: 5,
    name: "Cardi B",
    date: "2026-11-20",
    time: "20:00",
  },
];

const MostPopularEvents = () => {
  return (
    <div className={styles.mostPopularEvents}>
      <h2>Weekly Top Sellers</h2>
      <div className={styles.eventsGrid}>
        {TopSellers.map((event) => {
          // Combine date and time into a single Date object
          const eventDateTime = new Date(`${event.date}T${event.time}`);
          return (
            <div key={event.id}>
              <h3>{event.name}</h3>
              <p>{format(eventDateTime, "MMM dd, yyyy, hh:mm a")}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MostPopularEvents;
