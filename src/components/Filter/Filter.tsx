import React, { useState, useEffect, useRef } from 'react';
import styles from './Filter.module.scss';

const TIME_OPTIONS = Array.from({ length: 19 * 2 }, (_, i) => {
  const totalMinutes = (5 * 60) + (i * 30); 
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const suffix = h < 12 ? 'a.m.' : 'p.m.';
  const displayH = h > 12 ? h - 12 : h;
  return `${displayH}:${m === 0 ? '00' : m} ${suffix}`;
});

interface TimeSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const TimeSelect: React.FC<TimeSelectProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.timeInput} ref={wrapperRef}>
      <label>{label}</label>
      <div 
        className={`${styles.customSelect} ${isOpen ? styles.open : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src="/img/icons/clock.svg" alt="" className={styles.clockIcon} />
        <span className={styles.selectedValue}>{value}</span>
        <img 
           src={isOpen ? "/img/icons/Up.svg" : "/img/icons/Bottom.svg"} 
           alt="" 
           className={styles.chevronIcon} 
        />
        {isOpen && (
          <div className={styles.optionsList}>
            {TIME_OPTIONS.map((time) => (
              <div 
                key={time} 
                className={`${styles.optionItem} ${time === value ? styles.selected : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(time);
                  setIsOpen(false);
                }}
              >
                {time}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export interface FilterState {
  popular: string[];
  rating: number[];
  prices: number[];
  timeTo: string;
  timeFrom: string;
  coffeeStyle: string[];
  foodMenu: string[];
  workStudy: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export const FilterModal: React.FC<Props> = ({ isOpen, onClose, onApply }) => {
  
  // Стани
  const [popular, setPopular] = useState<string[]>([]);
  const [rating, setRating] = useState<number[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [timeTo, setTimeTo] = useState('9:00 a.m.');
  const [timeFrom, setTimeFrom] = useState('9:00 a.m.');
  const [coffeeStyle, setCoffeeStyle] = useState<string[]>([]);
  const [foodMenu, setFoodMenu] = useState<string[]>([]);
  const [workStudy, setWorkStudy] = useState<string[]>([]);

  const [isWorkStudyExpanded, setIsWorkStudyExpanded] = useState(false);

  const workStudyOptions = [
    'Wi-Fi', 'Coworking', 'Long stay allowed', 'Quiet zone', 'Power outlets', 'Large tables'
  ];
  const visibleWorkStudy = isWorkStudyExpanded ? workStudyOptions : workStudyOptions.slice(0, 3);

  // Логіка перемикання
  const toggleItem = <T,>(list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>, item: T) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleClearAll = () => {
    setPopular([]);
    setRating([]);
    setPrices([]);
    setCoffeeStyle([]);
    setFoodMenu([]);
    setWorkStudy([]);
    setTimeTo('9:00 a.m.');
    setTimeFrom('9:00 a.m.');
  };

  const handleApply = () => {
    onApply({ popular, rating, prices, timeTo, timeFrom, coffeeStyle, foodMenu, workStudy });
    onClose();
  };

  const totalSelected = popular.length + rating.length + prices.length + coffeeStyle.length + foodMenu.length + workStudy.length;

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <h2>Filters</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <img src="/img/icons/Close.svg" alt="Close" />
          </button>
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          
          {/* === 0. SELECTED FILTERS === */}
          {totalSelected > 0 && (
            <div className={styles.section}>
              <div className={styles.selectedHeader}>
                <h3>Selected filters <span>({totalSelected})</span></h3>
                <button className={styles.clearTextBtn} onClick={handleClearAll}>Clear all</button>
              </div>
              
              <div className={styles.selectedTags}>
                {popular.map(item => (
                  <button key={item} className={styles.selectedChip} onClick={() => toggleItem(popular, setPopular, item)}>
                    {item} <img src="/img/icons/Small icon close.svg" alt="x" className={styles.removeIcon}/>
                  </button>
                ))}
                {rating.map(item => (
                  <button key={item} className={styles.selectedChip} onClick={() => toggleItem(rating, setRating, item)}>
                    <div className={styles.starsRowSmall}>
                       {[...Array(5)].map((_, i) => (
                         <img key={i} src={i < item ? "/img/icons/Star_filled.svg" : "/img/icons/Star.svg"} alt="" />
                       ))}
                    </div>
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
                {coffeeStyle.map(item => (
                  <button key={item} className={styles.selectedChip} onClick={() => toggleItem(coffeeStyle, setCoffeeStyle, item)}>
                    {item} <img src="/img/icons/Small icon close.svg" alt="x" className={styles.removeIcon}/>
                  </button>
                ))}
                {foodMenu.map(item => (
                  <button key={item} className={styles.selectedChip} onClick={() => toggleItem(foodMenu, setFoodMenu, item)}>
                    {item} <img src="/img/icons/Small icon close.svg" alt="x" className={styles.removeIcon}/>
                  </button>
                ))}
                {workStudy.map(item => (
                  <button key={item} className={styles.selectedChip} onClick={() => toggleItem(workStudy, setWorkStudy, item)}>
                    {item} <img src="/img/icons/Small icon close.svg" alt="x" className={styles.removeIcon}/>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 1. POPULAR */}
          <div className={styles.section}>
            <h3>Popular</h3>
            <div className={styles.tags}>
              {['Pet-Friendly', '5 stars', 'Wi-Fi', 'Vegan'].map(tag => (
                <button 
                  key={tag}
                  className={`${styles.tag} ${popular.includes(tag) ? styles.active : ''}`}
                  onClick={() => toggleItem(popular, setPopular, tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 2. RATING */}
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

          {/* 3. PRICES */}
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

          {/* 4. OPENING HOURS (ОНОВЛЕНО) */}
          <div className={styles.section}>
            <h3>Opening hours</h3>
            <div className={styles.timeRow}>
               <TimeSelect label="To" value={timeTo} onChange={setTimeTo} />
               <TimeSelect label="From" value={timeFrom} onChange={setTimeFrom} />
            </div>
          </div>

          {/* 5. COFFEE QUALITY */}
          <div className={styles.section}>
            <h3>Coffee Quality & Style</h3>
            <div className={styles.tags}>
              {['Pet-Friendly', 'Alternative milk', 'Caffeine-free'].map(tag => (
                <button key={tag} className={`${styles.tag} ${coffeeStyle.includes(tag) ? styles.active : ''}`} onClick={() => toggleItem(coffeeStyle, setCoffeeStyle, tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 6. FOOD & MENU */}
          <div className={styles.section}>
            <h3>Food & Menu</h3>
            <div className={styles.tags}>
              {['Pet-Friendly', 'Gluten-free', 'Lactose-free'].map(tag => (
                <button key={tag} className={`${styles.tag} ${foodMenu.includes(tag) ? styles.active : ''}`} onClick={() => toggleItem(foodMenu, setFoodMenu, tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 7. WORK & STUDY */}
          <div className={styles.section}>
            <h3>Work & Study Friendly</h3>
            <div className={styles.tags}>
              {visibleWorkStudy.map(tag => (
                <button key={tag} className={`${styles.tag} ${workStudy.includes(tag) ? styles.active : ''}`} onClick={() => toggleItem(workStudy, setWorkStudy, tag)}>
                  {tag}
                </button>
              ))}
            </div>
            {workStudyOptions.length > 3 && (
              <button className={styles.showMore} onClick={() => setIsWorkStudyExpanded(!isWorkStudyExpanded)}>
                {isWorkStudyExpanded ? 'Show less' : 'Show more'}
                <img src={isWorkStudyExpanded ? "/img/icons/Up.svg" : "/img/icons/Bottom.svg"} alt="" className={styles.chevronIcon} />
              </button>
            )}
          </div>

        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button className={styles.clearBtn} onClick={handleClearAll}>Clear All</button>
          <button className={styles.applyBtn} onClick={handleApply}>Apply</button>
        </div>

      </div>
    </div>
  );
};