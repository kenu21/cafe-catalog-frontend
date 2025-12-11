import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './CatalogPage.module.scss';

import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { FilterModal } from '../../components/Filter/Filter';
import { CafeCard } from '../../components/CafeCard/CafeCard';

import { getAllCafes } from '../../utils/cafeService';
import type { Cafe } from '../../utils/Cafe';

const ITEMS_PER_PAGE = 8;

export const CatalogPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [allCafes, setAllCafes] = useState<Cafe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getAllCafes();
        setAllCafes(data);
      } catch (error) {
        console.error("Error loading cafes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCafes = useMemo(() => {
    let result = [...allCafes];

    const query = searchParams.get('query')?.toLowerCase() || '';
    const tags = searchParams.getAll('tags');
    const rating = searchParams.get('rating');
    const prices = searchParams.getAll('priceRating');

    if (query) {
      result = result.filter(cafe => 
        cafe.name.toLowerCase().includes(query) || 
        cafe.address.toLowerCase().includes(query)
      );
    }
    
    if (tags.length > 0) {
       result = result.filter(cafe => {
         const cafeTags = cafe.tags || []; 
         return tags.every(tag => cafeTags.includes(tag));
       });
    }

    if (rating) {
      result = result.filter(cafe => cafe.rating >= Number(rating));
    }

    if (prices.length > 0) {
      result = result.filter(cafe => prices.includes(cafe.price.toString()));
    }

    return result;
  }, [allCafes, searchParams]); 

  const totalPages = Math.ceil(filteredCafes.length / ITEMS_PER_PAGE);
  const currentData = filteredCafes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  const handleOpenFilters = () => setIsFilterOpen(true);
  const handleCloseFilters = () => setIsFilterOpen(false);

  const getPageTitle = () => {
    const query = searchParams.get('query');
    const locationName = query 
      ? query.charAt(0).toUpperCase() + query.slice(1) 
      : 'Ukraine';

    return `Coffee shops found in ${locationName}`;
  };

  return (
    <div className={styles.pageWrapper}>
      <Header onFilterClick={handleOpenFilters} />
      
      <main className={styles.mainContent}>
        <div className="container">

          <div className={styles.headerRow}>
            <h2>{getPageTitle()}</h2>
          </div>

          {isLoading ? (
            <div className={styles.loader}>Loading... ☕</div>
          ) : (
            <>
              {currentData.length > 0 ? (
                <div className={styles.grid}>
                  {currentData.map(cafe => (
                    <CafeCard key={cafe.id} cafe={cafe} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <h3>No results found matching your criteria 😔</h3>
                  <button onClick={() => navigate('/')}>Clear filters</button>
                </div>
              )}

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