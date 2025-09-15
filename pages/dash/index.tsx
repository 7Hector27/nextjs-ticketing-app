import React from "react";

import Navbar from "@/components/Navbar";
import { useUser } from "@/lib/hooks/useUserRole";

import styles from "./styles.module.scss";

const Dashboard = () => {
  const { role, name } = useUser();

  return (
    <div className={styles.dash}>
      <Navbar />

      <div className={styles.body}>
        <div className={styles.header}>
          <h2>Welcome Back, {name} </h2>
          <p> You have 3 upcoming events this month.</p>
        </div>
        <div className={styles.buttonWrapper}>
          <button className={styles.createBtn}>+ Create Event</button>
          <button className={styles.scannerBtn}>Go to Scanner</button>
        </div>
        <div className={styles.recentEvents}>
          <h2>Recent Events</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
