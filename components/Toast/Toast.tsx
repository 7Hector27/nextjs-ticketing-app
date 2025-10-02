import React, { useEffect } from "react";

import styles from "./Toast.module.scss";

type ToastProps = {
  message: string | React.ReactNode;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number; // ms
};

const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return <div className={`${styles.toast} ${styles[type]}`}>{message}</div>;
};

export default Toast;
