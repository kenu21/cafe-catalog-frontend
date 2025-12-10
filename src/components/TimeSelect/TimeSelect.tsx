import React, { useState, useEffect, useRef } from 'react';
import styles from '../Filter/Filter.module.scss'; 

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

export const TimeSelect: React.FC<TimeSelectProps> = ({ label, value, onChange }) => {
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