import React from "react";
import Link from "next/link";

import FullPageLoader from "@/components/FullPageLoader";
import FeaturedDashEvent from "@/components/FeaturedDashEvent";
import SiteLayout from "@/components/layouts/siteLayout";

import { useUser } from "@/context/UserContext";

import styles from "./dash.module.scss";

const Dashboard = () => {
  const { user, loading } = useUser();
  const { name } = user || {};
  if (loading) return;

  return (
    <SiteLayout className={styles.dash}>
      {loading ? (
        <FullPageLoader />
      ) : (
        <div className={styles.body}>
          <div className={styles.header}>
            <h2>Welcome Back {name && name.first}</h2>
          </div>
          <div className={styles.buttonWrapper}>
            <Link href={"/dash/events"} className={styles.createBtn}>
              + Create Event
            </Link>
            <Link href={"/dash/scanner"} className={styles.scannerBtn}>
              Go to Scanner
            </Link>
          </div>
          <FeaturedDashEvent disableRedirect />
        </div>
      )}
    </SiteLayout>
  );
};

export default Dashboard;
