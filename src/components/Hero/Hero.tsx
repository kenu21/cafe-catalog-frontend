import React from "react";
import styles from "./Hero.module.scss";
import { SearchHero } from "../SearchHero/SearchHero.tsx";

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <img 
        src="img/banner.png" 
        alt="CoffeeBanner" 
        className={styles.banner}
      />

      <div className={styles.content}>
        
        <SearchHero />

        <h2 className={styles.title}>
          Find the best cafes & coffee <br />
          shops in <span>UKRAINE</span>
        </h2>

      </div>
    </section>
  );
};