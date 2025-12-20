import React, { useState, useEffect } from 'react';
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
          setTimeFrom(openingHoursParam);
        } else {
          setTimeFrom('9:00 a.m.');
        }
        setTimeTo('9:00 p.m.');
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
    }
  }, [isOpen]);

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
    
    if (timeFrom && timeFrom !== '9:00 a.m.') {
      params.append('openingHours', timeFrom);
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
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        
        <div className={styles.header}>
          <h2>Filters</h2>
          <button className={styles.closeBtn} onClick={onClose}>
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
