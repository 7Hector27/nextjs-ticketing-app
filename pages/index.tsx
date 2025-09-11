import React from "react";

import Navbar from "../components/Navbar/Navbar";
import AuthForm from "@/components/AuthForm";

import styles from "./styles.module.scss";

const Home = () => {
  return (
    <div className={styles.home}>
      <Navbar />
      <AuthForm />
    </div>
  );
};

export default Home;
