import React from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import { useUser } from "@/lib/hooks/useUserRole";

import styles from "./dash.module.scss";

const Dashboard = () => {
  const { name } = useUser();

  return (
    <div className={styles.dash}>
      <Navbar />
      <div className={styles.body}>
        <div className={styles.header}>
          <h2>Welcome Back, {name} </h2>
          <p> You have 3 upcoming events this month.</p>
        </div>
        <div className={styles.buttonWrapper}>
          <Link href={"/dash/events"} className={styles.createBtn}>
            + Create Event
          </Link>
          <Link href={"/dash/scanner"} className={styles.scannerBtn}>
            Go to Scanner
          </Link>
        </div>
        <div className={styles.recentEvents}>
          <h2>Recent Events</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
