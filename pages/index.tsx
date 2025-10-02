import React, { useState } from "react";

import AuthForm from "@/components/AuthForm";
import FeaturedDashEvent from "@/components/FeaturedDashEvent";
import MostPopularEvents from "@/components/MostPopularEvents";
import SiteLayout from "@/components/layouts/siteLayout";
import Toast from "@/components/Toast";

import { useUser } from "@/context/UserContext";

import styles from "./styles.module.scss";

const Home = () => {
  const { user } = useUser();
  const { role } = user || {};
  const [toast, setToast] = useState<{
    message: string | React.ReactNode;
    type: "success" | "error";
  } | null>(null);

  return (
    <SiteLayout className={styles.home}>
      {!role && <AuthForm setToast={setToast} />}
      <FeaturedDashEvent />
      <MostPopularEvents />
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </SiteLayout>
  );
};

export default Home;
