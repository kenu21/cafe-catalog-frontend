import React, { useRef, useState, useEffect } from "react";
import styles from "./CafeSection.module.scss";
import { CafeCard } from "../CafeCard/CafeCard"; // Прибрав .tsx (зазвичай не потрібно)
import type { Cafe } from "../../utils/Cafe";

interface Props {
  title: string;
  cafes: Cafe[];
}

export const CafeSection: React.FC<Props> = ({ title, cafes }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Додаємо стан для кнопок
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 2. Функція перевірки: чи можна скролити
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      setCanScrollLeft(scrollLeft > 0);
      // Math.ceil потрібен для точності на деяких екранах
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  // 3. Вішаємо слухача подій
  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      checkScroll(); // Перевірити одразу
      element.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll); // На випадок зміни розміру вікна

      return () => {
        element.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [cafes]); // Оновити, якщо змінився список кафе

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
          disabled={!canScrollLeft} // 👈 Блокуємо, якщо не можна вліво
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
          disabled={!canScrollRight} // 👈 Блокуємо, якщо не можна вправо
        >
          <img src="img/icons/Arrow-right.svg" alt="" className={styles.arrowIcon} />
        </button>
      </div>
    </section>
  );
};