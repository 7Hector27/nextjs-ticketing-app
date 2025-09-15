import React from "react";

import Navbar from "../components/Navbar/Navbar";
import AuthForm from "@/components/AuthForm";
import { useUser } from "@/lib/hooks/useUserRole";

import styles from "./styles.module.scss";

const Home = () => {
  const { role } = useUser();
  return (
    <div className={styles.home}>
      <Navbar />
      {!role && <AuthForm />}
    </div>
  );
};

export default Home;
