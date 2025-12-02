import React, { useRef } from "react";
import styles from "./CafeSection.module.scss";
import  { CafeCard } from "../CafeCard/CafeCard.tsx";
import type { Cafe } from "../../utils/Cafe";

interface Props {
  title: string;
  cafes: Cafe[];
}

export const CafeSection: React.FC<Props> = ({ title, cafes }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 450;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.carouselWrapper}>
        <button 
          className={`${styles.navBtn} ${styles.prev}`} 
          onClick={() => handleScroll('left')}
          aria-label="Previous"
        >
          <img src="img/icons/Arrow-left.svg" alt="" className={styles.arrowIcon} />
        </button>

        <div className={styles.track} ref={scrollRef}>
          {cafes.map((cafe) => (
            <CafeCard key={cafe.id} cafe={cafe} />
          ))}
        </div>

        <button 
          className={`${styles.navBtn} ${styles.next}`} 
          onClick={() => handleScroll('right')}
          aria-label="Next"
        >
          <img src="img/icons/Arrow-right.svg" alt="" className={styles.arrowIcon} />
        </button>
      </div>
    </section>
  );
};