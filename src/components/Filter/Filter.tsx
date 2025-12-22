import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Filter.module.scss';
import { TimeSelect } from '../TimeSelect/TimeSelect';
import { getAllTags } from '../../utils/cafeService';
import { saveFilters, getFilters, clearFilters as clearStoredFilters } from '../../utils/filterService';

export interface FilterState {
  tags: string[];
  rating: number[];
  prices: number[];
  timeTo: string;
  timeFrom: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const parseTime = (timeStr: string): number => {
  if (!timeStr) return 0;
  
  const [time, modifier] = timeStr.split(' ');
  const [rawHours, minutes] = time.split(':').map(Number);
  
  let hours = rawHours;

  if (hours === 12) hours = 0;
  if (modifier === 'p.m.') hours += 12;

  return hours * 60 + minutes;
};

const convertTo24Hour = (time12h: string): string => {
  if (!time12h) return '';
  
  const parts = time12h.split(' ');
  if (parts.length < 2) return time12h;

  const [time, modifier] = parts;
  
  const [rawHours, minutes] = time.split(':');
  let hours = rawHours;

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'p.m.') {
    hours = (parseInt(hours, 10) + 12).toString();
  }

  return `${hours.padStart(2, '0')}:${minutes}`;
};

export const FilterModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 
  
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [rating, setRating] = useState<number[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [timeTo, setTimeTo] = useState('9:00 p.m.');
  const [timeFrom, setTimeFrom] = useState('9:00 a.m.');

  const [timeError, setTimeError] = useState<string | null>(null);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      const tagsFromUrl = searchParams.getAll('tags');
      const ratingFromUrl = searchParams.getAll('rating').map(Number);
      const pricesFromUrl = searchParams.getAll('priceRating').map(Number);
      const openingHoursParam = searchParams.get('openingHours');

      if (tagsFromUrl.length > 0 || ratingFromUrl.length > 0 || pricesFromUrl.length > 0 || openingHoursParam) {
        setSelectedTags(tagsFromUrl);
        setRating(ratingFromUrl);
        setPrices(pricesFromUrl);
        if (openingHoursParam) {
          // Парсим диапазон формата "21:00-22:00"
          const [timeFrom24, timeTo24] = openingHoursParam.split('-');
          if (timeFrom24 && timeTo24) {
            // Конвертируем обратно в 12-часовой формат для отображения
            const convertFrom24To12 = (time24: string): string => {
              const [hours, minutes] = time24.split(':').map(Number);
              if (hours === 0) return `12:${minutes.toString().padStart(2, '0')} a.m.`;
              if (hours < 12) return `${hours}:${minutes.toString().padStart(2, '0')} a.m.`;
              if (hours === 12) return `12:${minutes.toString().padStart(2, '0')} p.m.`;
              return `${hours - 12}:${minutes.toString().padStart(2, '0')} p.m.`;
            };
            setTimeFrom(convertFrom24To12(timeFrom24.trim()));
            setTimeTo(convertFrom24To12(timeTo24.trim()));
          } else {
            setTimeFrom('9:00 a.m.');
            setTimeTo('9:00 p.m.');
          }
        } else {
          setTimeFrom('9:00 a.m.');
          setTimeTo('9:00 p.m.');
        }
      } else {
        const savedFilters = getFilters();
        if (savedFilters) {
          setSelectedTags(savedFilters.tags || []);
          setRating(savedFilters.rating || []);
          setPrices(savedFilters.prices || []);
          setTimeFrom(savedFilters.timeFrom || '9:00 a.m.');
          setTimeTo(savedFilters.timeTo || '9:00 p.m.');
        } else {
          setSelectedTags([]);
          setRating([]);
          setPrices([]);
          setTimeFrom('9:00 a.m.');
          setTimeTo('9:00 p.m.');
        }
      }
    }
  }, [isOpen, searchParams]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      const loadTags = async () => {
        setIsLoadingTags(true);
        try {
          const tags = await getAllTags();
          setAvailableTags(tags);
        } catch (error) {
          console.error("Failed to load tags", error);
        } finally {
          setIsLoadingTags(false);
        }
      };
      loadTags();

      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab' || !modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleTabKey);
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    const minutesFrom = parseTime(timeFrom);
    const minutesTo = parseTime(timeTo);

    if (minutesFrom >= minutesTo) {
      setTimeError('Time "From" must be earlier than "To"');
    } else {
      setTimeError(null);
    }
  }, [timeFrom, timeTo]);

  const visibleTags = isTagsExpanded ? availableTags : availableTags.slice(0, 4);

  const toggleItem = <T,>(list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>, item: T) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleClearAll = () => {
    setSelectedTags([]);
    setRating([]);
    setPrices([]);
    setTimeTo('9:00 p.m.');
    setTimeFrom('9:00 a.m.');
    setTimeError(null);
    clearStoredFilters();
  };

  const handleApply = () => {
    if (timeError) return;

    const filterState: FilterState = {
      tags: selectedTags,
      rating: rating,
      prices: prices,
      timeFrom: timeFrom,
      timeTo: timeTo
    };
    saveFilters(filterState);

    const params = new URLSearchParams();
    
    selectedTags.forEach(tag => params.append('tags', tag));
    prices.forEach(p => params.append('priceRating', p.toString()));
    rating.forEach(r => params.append('rating', r.toString()));
    
    if (timeFrom && timeFrom !== '9:00 a.m.' && timeTo && timeTo !== '9:00 p.m.') {
      const timeFrom24 = convertTo24Hour(timeFrom);
      const timeTo24 = convertTo24Hour(timeTo);
      params.append('openingHours', `${timeFrom24}-${timeTo24}`);
    }

    params.append('size', '100');

    navigate(`/filter?${params.toString()}`);
    onClose();
  };

  const renderStars = (count: number) => (
    <div className={styles.starsRowSmall}>
      {[...Array(5)].map((_, i) => (
        <img key={i} src={i < count ? "/img/icons/Star_filled.svg" : "/img/icons/Star.svg"} alt="" />
      ))}
    </div>
  );

  const totalSelected = selectedTags.length + rating.length + prices.length;

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} ref={modalRef} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="filter-modal-title">
        
        <div className={styles.header}>
          <h2 id="filter-modal-title">Filters</h2>
          <button 
            ref={closeButtonRef}
            className={styles.closeBtn} 
            onClick={onClose}
            aria-label="Close filters"
          >
            <img src="/img/icons/Close.svg" alt="Close" />
          </button>
        </div>

        <div className={styles.content}>
          {totalSelected > 0 && (
            <div className={styles.section}>
              <div className={styles.selectedHeader}>
                <h3>Selected filters <span style={{ color: '#999', fontWeight: 400 }}>({totalSelected})</span></h3>
                <button className={styles.clearTextBtn} onClick={handleClearAll}>Clear all</button>
              </div>
              <div className={styles.selectedTags}>
                 {selectedTags.map(item => (
                  <button key={item} className={styles.selectedChip} onClick={() => toggleItem(selectedTags, setSelectedTags, item)}>
                    {item} <img src="/img/icons/Small icon close.svg" alt="x" className={styles.removeIcon}/>
                  </button>
                ))}
                {rating.map(item => (
                  <button key={item} className={styles.selectedChip} onClick={() => toggleItem(rating, setRating, item)}>
                    {renderStars(item)}
                    <img src="/img/icons/Small icon close.svg" alt="x" className={styles.removeIcon}/>
                  </button>
                ))}
                {prices.map(item => (
                  <button key={item} className={styles.selectedChip} onClick={() => toggleItem(prices, setPrices, item)}>
                      <div className={styles.dollarRowSmall}>
                        {[...Array(item)].map((_, i) => (
                           <img key={i} src="/img/icons/Dollar.svg" alt="$"/>
                        ))}
                      </div>
                      <img src="/img/icons/Small icon close.svg" alt="x" className={styles.removeIcon}/>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h3>Tags</h3>
            {isLoadingTags ? (
              <p>Loading tags...</p>
            ) : availableTags.length > 0 ? (
              <>
                <div className={styles.tags}>
                  {visibleTags.map(tag => (
                    <button 
                      key={tag}
                      className={`${styles.tag} ${selectedTags.includes(tag) ? styles.active : ''}`}
                      onClick={() => toggleItem(selectedTags, setSelectedTags, tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {availableTags.length > 4 && (
                  <button className={styles.showMore} onClick={() => setIsTagsExpanded(!isTagsExpanded)}>
                    {isTagsExpanded ? 'Show less' : 'Show more'}
                    <img src={isTagsExpanded ? "/img/icons/Up.svg" : "/img/icons/Bottom.svg"} alt="" className={styles.chevronIcon} />
                  </button>
                )}
              </>
            ) : (
              <p className={styles.noTags}>No tags available</p>
            )}
          </div>

          <div className={styles.section}>
            <h3>Opening hours</h3>
            <div className={styles.timeRow}>
               <TimeSelect label="From" value={timeFrom} onChange={setTimeFrom} />
               <TimeSelect label="To" value={timeTo} onChange={setTimeTo} />
            </div>
            {timeError && (
              <div className={styles.errorMessage}>
                {timeError}
              </div>
            )}
          </div>

          <div className={styles.section}>
            <h3>Visitors rating</h3>
            <div className={styles.ratingGrid}>
              {[5, 4, 3, 2].map(stars => (
                <label key={stars} className={`${styles.ratingOption} ${rating.includes(stars) ? styles.active : ''}`}>
                  <input type="checkbox" checked={rating.includes(stars)} onChange={() => toggleItem(rating, setRating, stars)} />
                  <div className={styles.starsRow}>
                    {[...Array(5)].map((_, i) => (
                      <img key={i} src={i < stars ? "/img/icons/Star_filled.svg" : "/img/icons/Star.svg"} alt="star" className={styles.starIcon} />
                    ))}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3>Prices</h3>
            <div className={styles.priceToggle}>
              {[4, 3, 2, 1].map(p => (
                <button key={p} className={`${styles.priceBtn} ${prices.includes(p) ? styles.active : ''}`} onClick={() => toggleItem(prices, setPrices, p)}>
                   <div className={styles.dollarRow}>
                     {[...Array(p)].map((_, i) => (
                        <img key={i} src="/img/icons/Dollar.svg" className={styles.dollarIcon} alt="$"/>
                     ))}
                   </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className={styles.footer}>
          <button className={styles.clearBtn} onClick={handleClearAll}>Clear All</button>
          <button 
            className={styles.applyBtn} 
            onClick={handleApply}
            disabled={!!timeError}
            style={{ opacity: timeError ? 0.5 : 1, cursor: timeError ? 'not-allowed' : 'pointer' }}
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};
