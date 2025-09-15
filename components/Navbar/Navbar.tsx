import Link from "next/link";
import { useUser } from "@/lib/hooks/useUserRole";
import styles from "./NavBar.module.scss";

const Navbar = () => {
  const { role } = useUser();

  return (
    <div className={styles.navBarWrapper}>
      <nav className={styles.navbar}>
        <Link className={styles.logo} href="/">
          Entrava
        </Link>
        <div className={styles.navLinks}>
          {!role && <Link href="/about">About</Link>}
          {role === "admin" && <Link href="/events">Events</Link>}
          {role && <Link href="/dash/scanner"> Scanner</Link>}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
