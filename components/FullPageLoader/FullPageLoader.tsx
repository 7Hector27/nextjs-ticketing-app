import React from "react";
import styles from "./FullPageLoader.module.scss";

const FullPageLoader = () => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.spinner} />
    </div>
  );
};

export default FullPageLoader;
