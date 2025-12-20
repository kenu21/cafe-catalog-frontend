import React from "react";
import styles from "./Footer.module.scss";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          © 2025 CoffeeRadar and non-commercial team Mate.academy
        </p>
      </div>
    </footer>
  );
};
