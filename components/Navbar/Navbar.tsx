import React from "react";
import styles from "./NavBar.module.scss";

const Navbar = () => {
  return (
    <div className={styles.navBarWrapper}>
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>Entrava</h1>
        <div className={styles.navLinks}>
          <a href="/events">Events</a>
          <a href="/about">About</a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
