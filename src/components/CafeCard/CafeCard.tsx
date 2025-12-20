import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./CafeCard.module.scss";
import type { Cafe } from '../../utils/Cafe';

interface Props {
  cafe: Cafe;
} 

export const CafeCard: React.FC<Props> = ({ cafe }) => {
  const navigate = useNavigate(); 

  const [rating, setRating] = useState(Math.round(cafe.rating));
  const [hover, setHover] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleCardClick = () => {
    navigate(`/cafe/${cafe.id}`);
  };

  const handleRate = (value: number) => {
    setRating(value);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const renderPrice = (priceLevel: number) => {
    return (
      <div className={styles.priceContainer}>
        {[1, 2, 3, 4].map((index) => (
          <span 
            key={index} 
            className={index <= priceLevel ? styles.dollarActive : styles.dollarInactive}
          >
            <img 
              src="/img/icons/Dollar.svg" 
              alt="$" 
            />
          </span>
        ))}
      </div>
    );
  };

  return (
    <article className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageWrapper}>
        <img 
          src={cafe.image}
          alt={cafe.name} 
          className={styles.mainImage} 
        />
        <button 
          className={styles.favButton} 
          type="button" 
          onClick={toggleFavorite}
        >
          <img 
            src={isFavorite ? "/img/icons/Heart_Fill.svg" : "/img/icons/Heart.svg"} 
            alt="Favorite" 
            className={styles.heartIcon} 
          />
        </button>

        <div className={styles.nameTag}>
          {cafe.name}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.row}>
          <img src="/img/icons/Geolocation.svg" alt="Location" className={styles.iconPin} />
          <span className={styles.addressText}>{cafe.address}</span>
        </div>

        <div className={styles.row}>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((index) => {
              const isActive = index <= (hover || rating);
              return (
                <button
                  key={index}
                  type="button"
                  className={styles.starButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRate(index);
                  }}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(0)}
                >
                  <img 
                    src={isActive ? "/img/icons/Star_filled.svg" : "/img/icons/Star.svg"}
                    alt={`${index} star`} 
                    className={styles.starIcon}
                  />
                </button>
              );
            })}
          </div>
          <span className={styles.ratingValue}>{rating}</span>
          <span className={styles.reviewsCount}>({cafe.reviews} reviews)</span>
        </div>

        <div className={styles.row}>
          {renderPrice(cafe.price)}
        </div>

        <div className={styles.footerRow}>
          <span className={cafe.isOpen ? styles.statusOpen : styles.statusClosed}>
            {cafe.isOpen ? 'Open' : 'Closed'}
          </span>
          <span className={styles.separator}>
            <img src="/img/icons/Arrow.svg" alt="" />
          </span>
          <span className={styles.closingTime}>until {cafe.closingTime}</span>
        </div>
      </div>
    </article>
  );
};