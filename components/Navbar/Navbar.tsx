import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";

import { useUser } from "@/lib/hooks/useUserRole";
import UserAPI from "@/lib/UserAPI";

import styles from "./NavBar.module.scss";

const Navbar = () => {
  const { role } = useUser();
  const router = useRouter();
  const currentPath = router.pathname;
  const userAPI = new UserAPI();

  const { mutate: logout } = useMutation({
    mutationFn: () => userAPI.logOut(),
    onSuccess: () => {
      router.push("/");
    },
    onError: (err) => {
      alert(err.message || "Error logging out");
    },
  });

  return (
    <div className={styles.navBarWrapper}>
      <nav className={styles.navbar}>
        <div className={styles.navLinks}>
          <Link className={styles.logo} href="/">
            Entrava
          </Link>
          {!role && <Link href="/about">About</Link>}
          {role && currentPath !== "/dash" && <Link href="/dash">Dash</Link>}
          {role === "admin" && <Link href="/events">Events</Link>}
          {role && <Link href="/dash/scanner"> Scanner</Link>}
        </div>
        <div className={styles.rightSideNav}>
          <button onClick={() => logout()}>Log Out</button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
