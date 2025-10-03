import React from "react";
import styles from "./FullPageLoader.module.scss";

const FullPageLoader = () => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loader}>
        <div className={styles.dot}></div>
        <p className={styles.text}>Loading...</p>
      </div>
    </div>
  );
};

export default FullPageLoader;
