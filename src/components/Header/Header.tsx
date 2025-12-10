import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.scss';
import { SearchHero } from '../SearchHero/SearchHero'; 

interface Props {
  onFilterClick?: () => void;
}

export const Header: React.FC<Props> = ({ onFilterClick }) => {

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        <NavLink to="/" className={styles.logoLink}>
          <img 
            src="/img/icons/Logo_service_name.svg" 
            alt="Coffee logo" 
            className={styles.logo}
          />
        </NavLink>

        <div className={`${styles.stickySearch} ${isScrolled ? styles.visible : ''}`}>

           <SearchHero isSmall={true} onFilterClick={onFilterClick} />
        </div>

        <NavLink to="/Favourites" className={styles.navLinkButton}>
          <button className={styles.header__button}>
            <img 
              className={styles.header__button_favourites} 
              src="/img/icons/Heart.svg" 
              alt="Favourites" 
            />
            Favourites
          </button>
        </NavLink>

      </div>
    </header>    
  );
};