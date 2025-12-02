import React from 'react';
import styles from './SearchHero.module.scss';

interface Props {
  isSmall?: boolean;
  onFilterClick?: () => void; 
}

export const SearchHero: React.FC<Props> = ({ isSmall = false, onFilterClick }) => {
  return (
    <div className={`${styles.searchBlock} ${isSmall ? styles.small : ''}`}>
      
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

      <button className={styles.filterBtn} onClick={onFilterClick}>
        <img src="img/icons/Filter.svg" alt="filter" className={styles.filterIcon} />
      </button>
      
    </div>
  );
};