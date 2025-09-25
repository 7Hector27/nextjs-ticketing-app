import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

import Loader from "../ButtonLoader";
import UserAPI from "@/lib/UserAPI";
import { useUser } from "@/context/UserContext";
import styles from "./AuthForm.module.scss";

const AuthForm = () => {
  const [isLogIn, setIsLogIn] = useState(true);
  const userAPI = new UserAPI();
  const router = useRouter();
  const { refetchUser } = useUser();

  // --- Sign Up Mutation ---
  const signUpMutation = useMutation({
    mutationFn: (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) =>
      userAPI.createUser(
        data.firstName,
        data.lastName,
        data.email,
        data.password
      ),
    onSuccess: async (response) => {
      if (response.ok) {
        console.log("User created successfully!");
        setIsLogIn(true);
        // clear form values
        const form = document.querySelector("form") as HTMLFormElement | null;
        if (form) form.reset();
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
    onSuccess: async () => {
      setIsLogIn(true);
      await refetchUser();

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
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    signUpMutation.mutate({ firstName, lastName, email, password });
  };

  const handleLogIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("login-email") as string;
    const password = formData.get("login-password") as string;
    logInMutation.mutate({ email, password });
  };

  return (
    <div className={styles.authForm}>
      <h2 className={styles.title}>Access your tickets, anytime, anywhere.</h2>
      <div className={styles.formWrapper}>
        {isLogIn ? (
          <form onSubmit={handleLogIn} className={styles.form}>
            <input
              key="login-email"
              type="email"
              id="login-email"
              name="login-email"
              placeholder="Email"
              className={styles.input}
              required
            />
            <input
              key="login-password"
              type="password"
              id="login-password"
              name="login-password"
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
              id="firstName"
              name="firstName"
              placeholder="First Name"
              className={styles.input}
              required
            />{" "}
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
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
