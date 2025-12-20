import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchHero.module.scss';

import { searchCafes, getAllCafes, getPopularCities } from '../../utils/cafeService'; 
import type { Cafe } from '../../utils/Cafe';
import { useFilterCount } from '../../utils/useFilterCount';

const CITY_IMAGES: Record<string, string> = {
  'Kyiv': '/img/cities/Kyiv.svg',
  'Lviv': '/img/cities/Lviv.svg',
  'Dnipro': '/img/cities/Dnipro.svg',
  'Odesa': '/img/cities/Odessa.svg', 
  'Kharkiv': '/img/cities/Kharkiv.svg',
  'Vinnytsia': '/img/cities/Vinnytsia.svg',
};

interface CityView {
  name: string;
  count: number;
  img: string;
}

interface Props {
  isSmall?: boolean;
  onFilterClick?: () => void;
}

export const SearchHero: React.FC<Props> = ({ isSmall = false, onFilterClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Cafe[]>([]);
  const [recommendations, setRecommendations] = useState<Cafe[]>([]);
  
  const [popularCities, setPopularCities] = useState<CityView[]>([]);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const filterCount = useFilterCount();

  useEffect(() => {
    getAllCafes()
      .then(data => setRecommendations(data.slice(0, 3)))
      .catch(err => console.error("Failed to load recommendations", err));

    getPopularCities()
      .then((data) => {
        if (data && data.length > 0) {
          const formattedCities = data.map(city => ({
            name: city.cityName, 
            count: city.cafesCount,
            img: CITY_IMAGES[city.cityName] 
          }));
          setPopularCities(formattedCities);
        }
      })
      .catch(err => {
        console.error("Помилка завантаження міст:", err);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchCafes(query);
        
        let filteredData = data;
        const cleanQuery = query.trim().toLowerCase();

        const isCitySearch = Object.keys(CITY_IMAGES).some(
           city => city.toLowerCase() === cleanQuery
        );

        if (isCitySearch) {
             filteredData = data.filter(cafe => 
                cafe.address && cafe.address.toLowerCase().includes(cleanQuery)
             );
        }

        setResults(filteredData.slice(0, 5)); 
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = () => {
    if (query.trim()) {
      setShowDropdown(false);
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  const handleSelectCafe = (id: number) => {
    navigate(`/cafe/${id}`);
    setShowDropdown(false);
  };

  const handleSelectCity = (cityName: string) => {
    setQuery(cityName); 
    navigate(`/search?query=${encodeURIComponent(cityName)}`);
    setShowDropdown(true); 
  };

  return (
    <div className={`${styles.searchBlock} ${isSmall ? styles.small : ''}`} ref={wrapperRef}>
      
      <div className={`${styles.inputWrapper} ${showDropdown ? styles.open : ''}`}>
        <img src="/img/icons/Magnifying_glass.svg" alt="search" className={styles.inputIcon} />
        <input 
          type="text" 
          placeholder="Search by cafes name or location" 
          className={styles.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
        />

        {showDropdown && (
          <div className={styles.dropdown}>
            
            <div className={styles.columnLeft}>
              {query.trim().length === 0 ? (
                <>
                  <div className={styles.headerLink} onClick={() => navigate('/search')}>
                    <img src="/img/icons/cup.svg" alt="" style={{ width: 24 }} />
                    <span>See all coffee shops</span>
                    <img src="/img/icons/Arrow-right.svg" alt="" className={styles.arrowIcon} />
                  </div>
                  
                  <div className={styles.sectionTitle}>Must be visited</div>
                  
                  {recommendations.map(cafe => (
                    <div key={cafe.id} className={styles.resultItem} onClick={() => handleSelectCafe(cafe.id)}>
                      <img src="/img/icons/Geolocation.svg" alt="" className={styles.pinIcon} />
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>{cafe.name}</span>
                        <span className={styles.itemAddress}>{cafe.address}</span>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className={styles.sectionTitle}>Coffee shops found in "{query}"</div>
                  
                  {isLoading ? (
                    <div className={styles.message}>Searching...</div>
                  ) : results.length > 0 ? (
                    results.map(cafe => (
                      <div key={cafe.id} className={styles.resultItem} onClick={() => handleSelectCafe(cafe.id)}>
                        <img src="/img/icons/Geolocation.svg" alt="" className={styles.pinIcon} />
                        <div className={styles.itemInfo}>
                          <span className={styles.itemName}>{cafe.name}</span>
                          <span className={styles.itemAddress}>{cafe.address}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.message}>No cafes found :(</div>
                  )}
                </>
              )}
            </div>

            <div className={styles.columnRight}>
              <div className={styles.sectionTitle}>Popular cities in Ukraine</div>
              <div className={styles.citiesGrid}>
                {popularCities.length > 0 ? (
                  popularCities.map(city => (
                    <div key={city.name} className={styles.cityItem} onClick={() => handleSelectCity(city.name)}>
                      <img src={city.img} alt={city.name} className={styles.cityImg} />
                      <div className={styles.cityInfo}>
                        <span className={styles.cityName}>{city.name}</span>
                        <span className={styles.cityCount}>({city.count})</span>
                      </div>
                    </div>
                  ))
                ) : (
                   <div style={{ padding: '10px', color: '#999', fontSize: '14px' }}>Loading...</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <button className={styles.searchBtn} onClick={handleSearchSubmit}>
        Search
      </button>

      <button className={styles.filterBtn} onClick={onFilterClick}>
        <img src="/img/icons/Filter.svg" alt="filter" className={styles.filterIcon} />
        {filterCount > 0 && (
          <span className={styles.filterBadge}>{filterCount}</span>
        )}
      </button>
      
    </div>
  );
};