import React from "react";

import EventForm from "@/components/EventForm";
import Navbar from "@/components/Navbar";

import styles from "./index.module.scss";
const Events = () => {
  return (
    <div className={styles.events}>
      <Navbar />
      <div className={styles.body}>
        <EventForm />
        <div className={styles.eventsList}></div>
      </div>
    </div>
  );
};

export default Events;
