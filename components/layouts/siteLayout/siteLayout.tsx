import React from "react";
import classNames from "classnames";

import Navbar from "../../Navbar/";

import styles from "./siteLayout.module.scss";

type siteLayoutProps = {
  children: React.ReactNode;
  className?: string;
};
const SiteLayout = ({ children, className }: siteLayoutProps) => {
  return (
    <div className={classNames(styles.siteLayout, className)}>
      <Navbar />
      {children}
    </div>
  );
};

export default SiteLayout;
