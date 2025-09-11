import React from "react";

import Navbar from "../components/Navbar/Navbar";
import AuthForm from "@/components/AuthForm";

import UserAPI from "@/lib/UserAPI";

import styles from "./styles.module.scss";

const Home = () => {
  const userAPI = new UserAPI();
  React.useEffect(() => {
    const userAPI = new UserAPI();

    const fetchUsers = async () => {
      const users = await userAPI.getUsers();
      console.log(users);
    };
    fetchUsers();
  }, []);

  return (
    <div className={styles.home}>
      <Navbar />
      <AuthForm />
    </div>
  );
};

export default Home;
