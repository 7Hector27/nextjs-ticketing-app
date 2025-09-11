import React from "react";

import Link from "next/link";

import styles from "./NavBar.module.scss";

const Navbar = () => {
  return (
    <div className={styles.navBarWrapper}>
      <nav className={styles.navbar}>
        <Link className={styles.logo} href="/">
          Entrava
        </Link>
        <div className={styles.navLinks}>
          {/* <a href="/events">Events</a> */}
          <Link href="/about">About</Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
