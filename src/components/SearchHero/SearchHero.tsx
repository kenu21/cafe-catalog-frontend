import React from 'react';
import styles from './SearchHero.module.scss';

export const SearchHero: React.FC = () => {
  return (
    <div className={styles.searchBlock}>
      
      <div className={styles.inputWrapper}>
        <img src="img/icons/Magnifying_glass.svg" alt="search" className={styles.inputIcon} />
        <input 
          type="text" 
          placeholder="Search by cafes name or location" 
          className={styles.input} 
        />
      </div>

      <button className={styles.searchBtn}>
        Search
      </button>

      <button className={styles.filterBtn}>
        <img src="img/icons/Filter.svg" alt="filter" className={styles.filterIcon} />
      </button>
      
    </div>
  );
};