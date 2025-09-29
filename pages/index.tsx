import React from "react";

import AuthForm from "@/components/AuthForm";
import FeaturedDashEvent from "@/components/FeaturedDashEvent";

import { useUser } from "@/context/UserContext";

import styles from "./styles.module.scss";
import MostPopularEvents from "@/components/MostPopularEvents";
import SiteLayout from "@/components/layouts/siteLayout";

const Home = () => {
  const { user } = useUser();
  const { role } = user || {};
  return (
    <SiteLayout className={styles.home}>
      {!role && <AuthForm />}
      <FeaturedDashEvent />
      <MostPopularEvents />
    </SiteLayout>
  );
};

export default Home;
