import { useEffect, useState } from 'react';
import styles from './HomePage.module.scss';

import { Header } from '../../components/Header/Header';
import { Hero } from '../../components/Hero/Hero';
import { Footer } from '../../components/Footer/Footer';
import { CafeSection } from '../../components/CafeSection/CafeSection';
import { FilterModal } from '../../components/Filter/Filter';

import type { Cafe } from '../../utils/Cafe';
import { getBestOffers, getChosenCafes, getNewCafes } from '../../utils/cafeService'; 

export const HomePage = () => {
  const [bestOffers, setBestOffers] = useState<Cafe[]>([]);
  const [chosenForYou, setChosenForYou] = useState<Cafe[]>([]);
  const [newAndNoteworthy, setNewAndNoteworthy] = useState<Cafe[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [bestData, chosenData, newData] = await Promise.all([
          getBestOffers(), 
          getChosenCafes(), 
          getNewCafes()      
        ]);
        setBestOffers(bestData);
        setChosenForYou(chosenData);
        setNewAndNoteworthy(newData);
      } catch (err) {
        console.error("Помилка:", err);
        setError('Не вдалося завантажити дані. Перевірте, чи запущено Docker.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleOpenFilters = () => setIsFilterOpen(true);
  const handleCloseFilters = () => setIsFilterOpen(false);
  
  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <main className={styles.loadingContainer}>
          <h2>Завантаження... ☕</h2>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <main className={styles.errorContainer}>
          <h2>{error}</h2>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Header onFilterClick={handleOpenFilters} />
      
      <main className={styles.mainContent}>
        <div className='container'>
          <Hero onFilterClick={handleOpenFilters} />

          {bestOffers.length > 0 && <CafeSection title='Our best offers' cafes={bestOffers} />}
          {chosenForYou.length > 0 && <CafeSection title='Cafés chosen for you' cafes={chosenForYou} />}
          {newAndNoteworthy.length > 0 && <CafeSection title='New and noteworthy' cafes={newAndNoteworthy} />}

          {bestOffers.length === 0 && chosenForYou.length === 0 && newAndNoteworthy.length === 0 && (
            <div className={styles.emptyState}>Кав'ярень у базі поки немає.</div>
          )}
        </div>
      </main>
      
      <Footer />

      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={handleCloseFilters} 
      />
    </div>
  );
};
