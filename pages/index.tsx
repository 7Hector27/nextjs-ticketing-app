import React from "react";

import Navbar from "../components/Navbar/Navbar";
import AuthForm from "@/components/AuthForm";

import { useUser } from "@/context/UserContext";

import styles from "./styles.module.scss";

const Home = () => {
  const { user } = useUser();
  const { role } = user || {};
  return (
    <div className={styles.home}>
      <Navbar />
      {!role && <AuthForm />}
    </div>
  );
};

export default Home;
