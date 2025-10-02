import React from "react";
import classNames from "classnames";

import styles from "./ButtonLoader.module.scss";

type LoaderProps = {
  className?: string;
};

const Loader = ({ className }: LoaderProps) => {
  return (
    <div className={classNames(styles.loaderWrapper, className)}>
      <span className={styles.spinner} />
    </div>
  );
};

export default Loader;
