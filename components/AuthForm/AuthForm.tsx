import React, { useState } from "react";

import UserAPI from "@/lib/UserAPI";

import styles from "./AuthForm.module.scss";

const AuthForm = () => {
  const [isLogIn, setIsLogIn] = useState(true);
  const userAPI = new UserAPI();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      const response = await userAPI.createUser(name, email, password);
      if (response.ok) {
        alert("User created successfully!");
        setIsLogIn(true);
        form.reset();
      } else {
        const data = await response.json();
        alert(`Error: ${data}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An error occurred while creating the user.");
    }
  };

  return (
    <div className={styles.authForm}>
      <h2 className={styles.title}>Access your tickets, anytime, anywhere. </h2>
      <div className={styles.formWrapper}>
        {isLogIn ? (
          <form action={() => {}} className={styles.form}>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              className={styles.input}
              required
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button}>
              Log In
            </button>
            <p>
              Don`t have an account?{" "}
              <button
                onClick={() => setIsLogIn(false)}
                className={styles.formSwitchBtn}
              >
                Sign Up
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className={styles.form}>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Full Name"
              className={styles.input}
              required
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className={styles.input}
              required
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button}>
              Sign Up
            </button>
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogIn(true)}
                className={styles.formSwitchBtn}
              >
                Log In{" "}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
