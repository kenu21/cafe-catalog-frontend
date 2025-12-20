import { useEffect, useState } from 'react';
import styles from './FavouritesPage.module.scss';

import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { FilterModal } from '../../components/Filter/Filter';
import { CafeCard } from '../../components/CafeCard/CafeCard';

import { getFavorites, onFavoritesChanged } from '../../utils/favoritesService';
import type { Cafe } from '../../utils/Cafe';

const ITEMS_PER_PAGE = 8;

export const FavouritesPage = () => {
  const [favorites, setFavorites] = useState<Cafe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadFavorites = () => {
      setIsLoading(true);
      try {
        const data = getFavorites();
        setFavorites(data);
        setCurrentPage(prevPage => {
          const maxPage = Math.ceil(data.length / ITEMS_PER_PAGE);
          if (prevPage > maxPage && maxPage > 0) {
            return maxPage;
          } else if (maxPage === 0) {
            return 1;
          }
          return prevPage;
        });
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
    
    // Подписываемся на изменения избранного
    const unsubscribe = onFavoritesChanged(() => {
      loadFavorites();
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  const currentData = favorites.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenFilters = () => setIsFilterOpen(true);
  const handleCloseFilters = () => setIsFilterOpen(false);

  return (
    <div className={styles.pageWrapper}>
      <Header onFilterClick={handleOpenFilters} />
      
      <main className={styles.mainContent}>
        <div className="container">

          <div className={styles.headerRow}>
            <h2>Favourites</h2>
            {favorites.length > 0 && (
              <span className={styles.count}>({favorites.length})</span>
            )}
          </div>

          {isLoading ? (
            <div className={styles.loader}>Loading... ☕</div>
          ) : (
            <>
              {currentData.length > 0 ? (
                <>
                  <div className={styles.grid}>
                    {currentData.map(cafe => (
                      <CafeCard key={cafe.id} cafe={cafe} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => {
                          setCurrentPage(p => p - 1);
                          window.scrollTo(0, 0);
                        }}
                      >
                        &lt;
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button 
                          key={page} 
                          className={currentPage === page ? styles.active : ''}
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo(0, 0);
                          }}
                        >
                          {page}
                        </button>
                      ))}

                      <button 
                        disabled={currentPage === totalPages}
                        onClick={() => {
                          setCurrentPage(p => p + 1);
                          window.scrollTo(0, 0);
                        }}
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.emptyState}>
                  <h3>No favorites yet 😔</h3>
                  <p>Start adding cafes to your favorites by clicking the heart icon!</p>
                </div>
              )}
            </>
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

