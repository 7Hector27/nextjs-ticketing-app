import React, { useState } from "react";

import EventForm from "@/components/EventForm";
import Navbar from "@/components/Navbar";

import styles from "./index.module.scss";
const Events = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className={styles.events}>
      <Navbar />
      <div className={styles.body}>
        <div className={styles.header}>
          <h2>Events</h2>
          <p>Create and manage your events.</p>
        </div>
        <EventForm />
        <div className={styles.eventsList}></div>
      </div>
    </div>
  );
};

export default Events;
