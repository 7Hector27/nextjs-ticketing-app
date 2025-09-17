import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

import Loader from "../ButtonLoader";
import UserAPI from "@/lib/UserAPI";

import styles from "./AuthForm.module.scss";

const AuthForm = () => {
  const [isLogIn, setIsLogIn] = useState(true);
  const userAPI = new UserAPI();
  const router = useRouter();

  // --- Sign Up Mutation ---
  const signUpMutation = useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      userAPI.createUser(data.name, data.email, data.password),
    onSuccess: async (response) => {
      if (response.ok) {
        alert("User created successfully!");
        setIsLogIn(true);
      } else {
        const data = await response.json();
        alert(`Error: ${data}`);
      }
    },
    onError: (error) => {
      alert(error.message || "An error occurred while creating the user.");
    },
  });

  // --- Log In Mutation ---
  const logInMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      userAPI.authLogin(data.email, data.password),
    onSuccess: () => {
      setIsLogIn(true);
      router.push("/dash");
    },
    onError: (error) => {
      console.error(error.message || "An error occurred while logging in.");
    },
  });

  // --- Handlers ---
  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    signUpMutation.mutate({ name, email, password });
  };

  const handleLogIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    logInMutation.mutate({ email, password });
  };

  return (
    <div className={styles.authForm}>
      <h2 className={styles.title}>Access your tickets, anytime, anywhere.</h2>
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
            <button
              type="submit"
              disabled={logInMutation.isPending}
              className={styles.button}
            >
              {logInMutation.isPending ? <Loader /> : "Sign In"}
            </button>
            <p>
              Don’t have an account?{" "}
              <button
                type="button"
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
            <button
              type="submit"
              disabled={signUpMutation.isPending}
              className={styles.button}
            >
              {signUpMutation.isPending ? <Loader /> : "Sign Up"}
            </button>
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogIn(true)}
                className={styles.formSwitchBtn}
              >
                Log In
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
