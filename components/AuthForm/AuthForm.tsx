import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Loader from "../Loader";
import UserAPI from "@/lib/UserAPI";

import styles from "./AuthForm.module.scss";

const AuthForm = () => {
  const [isLogIn, setIsLogIn] = useState(true);
  const userAPI = new UserAPI();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
        setLoading(false);
        alert(`Error: ${data}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setLoading(false);
      alert("An error occurred while creating the user.");
    }
  };

  const logInMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await userAPI.authLogin(data.email, data.password);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to log in");
      }

      return response.json(); // return token payload
    },
    onSuccess: (data) => {
      setIsLogIn(true);
      router.push("/dash");
    },
    onError: (error) => {
      alert(error.message || "An error occurred while logging in.");
    },
  });

  const handleLogIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    logInMutation.mutate({ email, password });
  };

  return (
    <div className={styles.authForm}>
      <h2 className={styles.title}>Access your tickets, anytime, anywhere. </h2>
      <div className={styles.formWrapper}>
        {isLogIn ? (
          <form onSubmit={handleLogIn} className={styles.form}>
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
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? <Loader /> : "Sign In"}
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
