import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Footer.module.scss";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <NavLink to="/" className={styles.link}>
            Help Center
          </NavLink>
          <NavLink to="/" className={styles.link}>
            Cookies & Interest-Based Ads
          </NavLink>
          <NavLink to="/" className={styles.link}>
            Terms of Use
          </NavLink>
          <NavLink to="/" className={styles.link}>
            Privacy Policy
          </NavLink>
        </nav>
        <p className={styles.copyright}>
          © 2025 CoffeeRadar and non-commercial team Mate.academy
        </p>
      </div>
    </footer>
  );
};
