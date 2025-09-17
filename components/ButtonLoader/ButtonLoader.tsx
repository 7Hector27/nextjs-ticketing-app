import React from "react";

import styles from "./ButtonLoader.module.scss";

const Loader = () => {
  return (
    <div className={styles.loaderWrapper}>
      <span className={styles.spinner} />
    </div>
  );
};

export default Loader;
