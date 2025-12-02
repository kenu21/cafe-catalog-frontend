import React from "react";
import styles from "./Footer.module.scss";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <a href="/" className={styles.link}>
            Help Center
          </a>
          <a href="/" className={styles.link}>
            Cookies & Interest-Based Ads
          </a>
          <a href="/" className={styles.link}>
            Terms of Use
          </a>
          <a href="/" className={styles.link}>
            Privacy Policy
          </a>
        </nav>
        <p className={styles.copyright}>
          © 2025 CoffeeRadar and non-commercial team Mate.academy
        </p>
      </div>
    </footer>
  );
};