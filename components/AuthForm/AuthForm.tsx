import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

import Loader from "../ButtonLoader";

import UserAPI from "@/lib/UserAPI";
import { useUser } from "@/context/UserContext";

import styles from "./AuthForm.module.scss";

type AuthFormProps = {
  setToast: (toast: {
    message: string | React.ReactNode;
    type: "success" | "error";
  }) => void;
};

const AuthForm = ({ setToast }: AuthFormProps) => {
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
      // Show toast only
      setToast({
        message: (
          <>
            Account created successfully! <br /> Please log in.
          </>
        ),
        type: "success",
      });

      // Switch form after toast delay
      setTimeout(() => {
        setIsLogIn(true);
        // no direct form.reset() – React state handles it
      }, 3000);
    },
    onError: (error) => {
      setToast({
        message: error.message || "An error occurred while creating the user.",
        type: "error",
      });
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
            />
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
              minLength={7}
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
