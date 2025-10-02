import React, { useState } from "react";

import EventForm from "@/components/EventForm";
import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";

import styles from "./index.module.scss";

const Events = () => {
  const [toast, setToast] = useState<{
    message: string | React.ReactNode;
    type: "success" | "error";
  } | null>(null);
  return (
    <div className={styles.events}>
      <Navbar />
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <div className={styles.body}>
        <EventForm setToast={setToast} />
        <div className={styles.eventsList}></div>
      </div>
    </div>
  );
};

export default Events;
