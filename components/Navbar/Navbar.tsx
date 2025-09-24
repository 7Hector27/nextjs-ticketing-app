import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";

import { useUser } from "@/context/UserContext";
import UserAPI from "@/lib/UserAPI";

import styles from "./NavBar.module.scss";

type NavItem = {
  title: string;
  href: string;
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const userAPI = new UserAPI();

  const { user, loading, refetchUser } = useUser();
  const { role } = user || {};
  const { mutate: logout } = useMutation({
    mutationFn: () => userAPI.logOut(),
    onSuccess: async () => {
      await refetchUser();
      router.push("/");
    },
    onError: (err) => {
      alert(err.message || "Error logging out");
    },
  });

  if (loading) return null;

  const navBarTypes: Record<string, NavItem[]> = {
    admin: [
      { title: "Dash", href: "/dash" },
      { title: "Events", href: "/dash/events" },
      { title: "Scanner", href: "/dash/scanner" },
    ],
    staff: [
      { title: "Dash", href: "/dash" },
      { title: "Scanner", href: "/dash/scanner" },
    ],
    user: [
      { title: "About", href: "/about" },
      { title: "Events", href: "/events" },
    ],
    guest: [
      { title: "About", href: "/about" },
      { title: "Events", href: "/events" },
    ],
  };

  const currentNav =
    role === "admin"
      ? navBarTypes.admin
      : role === "staff"
      ? navBarTypes.staff
      : role === "user"
      ? navBarTypes.user
      : navBarTypes.guest;

  return (
    <div className={styles.navBarWrapper}>
      <nav className={styles.navbar}>
        <Link className={styles.logo} href="/">
          Qritix
        </Link>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Links */}
        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          {currentNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.title}
            </Link>
          ))}
          {role && (
            <button onClick={() => logout()} className={styles.logoutBtn}>
              Log Out
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
