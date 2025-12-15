import React, { useRef, useState, useEffect } from "react";
import styles from "./CafeSection.module.scss";
import { CafeCard } from "../CafeCard/CafeCard";
import type { Cafe } from "../../utils/Cafe";

interface Props {
  title: string;
  cafes: Cafe[];
}

export const CafeSection: React.FC<Props> = ({ title, cafes }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      checkScroll();
      element.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);

      return () => {
        element.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [cafes]);

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
          disabled={!canScrollLeft}
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
          disabled={!canScrollRight}
        >
          <img src="img/icons/Arrow-right.svg" alt="" className={styles.arrowIcon} />
        </button>
      </div>
    </section>
  );
};