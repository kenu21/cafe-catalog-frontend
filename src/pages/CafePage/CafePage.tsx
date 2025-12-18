import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CafePage.module.scss';

import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { getCafeById } from '../../utils/cafeService';
import type { Cafe } from '../../utils/Cafe';

export const CafePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const loadCafe = async () => {
      if (!id) return;
      setIsLoading(true);
      setError('');
      try {
        const data = await getCafeById(id);
        setCafe(data);
      } catch (err) {
        console.error("Failed to load cafe", err);
        setError('Failed to load cafe data');
      } finally {
        setIsLoading(false);
      }
    };
    loadCafe();
  }, [id]);

  if (isLoading) return <div className={styles.loader}>Loading...</div>;
  if (error || !cafe) return <div className={styles.error}>{error || 'Cafe not found'}</div>;

  // --- Слайдер ---
  const sourceImages = cafe.images.length > 0 ? cafe.images : [cafe.image];
  const visibleImages = [
    sourceImages[currentSlide % sourceImages.length],
    sourceImages[(currentSlide + 1) % sourceImages.length],
    sourceImages[(currentSlide + 2) % sourceImages.length],
  ];

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  // --- Теги ---
  const displayedTags = isTagsExpanded 
    ? cafe.tags 
    : cafe.tags?.slice(0, 3) || []; 

  const renderPrice = (price: number) => (
    <div className={styles.priceContainer}>
      {[...Array(4)].map((_, i) => (
        <img 
          key={i} 
          src="/img/icons/Dollar.svg" 
          alt="$" 
          className={i < price ? styles.dollarActive : styles.dollarInactive} 
        />
      ))}
    </div>
  );

  const renderRatingStars = (rating: number) => {
    const roundedRating = Math.round(rating);
    return (
      <div className={styles.starsContainer}>
        {[...Array(5)].map((_, i) => (
          <img 
            key={i}
            src={i < roundedRating ? "/img/icons/Star_filled.svg" : "/img/icons/Star.svg"}
            alt="star"
            className={styles.starIcon}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.mainContent}>
        
        {/* --- Hero Section --- */}
        <div className={styles.heroSection}>
           <div className={styles.sliderContainer}>
              <div className={styles.imageGrid}>
                {visibleImages.map((imgSrc, idx) => (
                  <div key={idx} className={styles.gridItem}>
                    <img src={imgSrc} alt={`Slide ${idx}`} />
                  </div>
                ))}
              </div>
              
              <div className={styles.dotsContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                    onClick={() => handleDotClick(index)}
                    type="button"
                  />
                ))}
              </div>
           </div>

           <div className={styles.overlayContainer}>
             <button className={styles.backBtn} onClick={() => navigate(-1)}>
               <img src="/img/icons/Arrow-left.svg" alt="Back" /> 
               Back to Listings
             </button>

             <h1 className={styles.heroTitle}>{cafe.name}</h1>
           </div>
        </div>

        {/* --- Main Info Container --- */}
        <div className={styles.container}>
          
          <div className={styles.headerInfo}>
            <div className={styles.leftInfo}>
              <div className={styles.metaRow}>
                <div className={styles.address}>
                  <img src="/img/icons/Geolocation.svg" alt="Location" className={styles.iconSm} /> 
                  {cafe.address}
                </div>
                
                <div className={styles.dotSeparator}>•</div>
                
                {renderPrice(cafe.price)}
                
                <div className={styles.statusWrapper}>
                  <span className={cafe.isOpen ? styles.open : styles.closed}>
                    {cafe.isOpen ? 'Open' : 'Closed'}
                  </span>
                  {cafe.isOpen && (
                    <>
                       <span className={styles.arrow}><img src="/img/icons/Arrow.svg" alt="" /></span> 
                       <span className={styles.time}>until {cafe.closingTime}</span>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.ratingRow}>
                {renderRatingStars(cafe.rating)}
                <span className={styles.ratingValue}>{cafe.rating}</span>
                <span className={styles.reviewsCount}>({cafe.reviews} reviews)</span>
              </div>
            </div>

            <div className={styles.rightInfo}>
              <button className={styles.favBtn}>Add to Favourites</button>
            </div>
          </div>

          <div className={styles.contentGrid}>
            {/* Left: Offers (Tags) */}
            <div className={styles.leftCol}>
              <h3 className={styles.sectionTitle}>What this place offers</h3>
              
              <div className={styles.featuresList}>
                {displayedTags.length > 0 ? (
                  displayedTags.map((tag, idx) => (
                    <div key={idx} className={styles.featureItem}>
                      <span className={styles.iconBox}>
                        <img src="/img/icons/Frame.svg" alt="" /> 
                      </span>
                      {tag}
                    </div>
                  ))
                ) : (
                  <p className={styles.noData}>No specific features listed</p>
                )}
              </div>
              
              {cafe.tags && cafe.tags.length > 3 && (
                <button 
                  className={styles.showMore} 
                  onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                >
                  {isTagsExpanded ? 'Show less' : 'Show more'} 
                  <img 
                    src={isTagsExpanded ? "/img/icons/Up.svg" : "/img/icons/Bottom.svg"} 
                    alt="" 
                    className={styles.arrowIcon}
                  />
                </button>
              )}
            </div>

            {/* Right: About */}
            <div className={styles.rightCol}>
              <h3 className={styles.sectionTitle}>About this coffee shop</h3>
              <div className={`${styles.description} ${isDescExpanded ? styles.expanded : ''}`}>
                <p>
                  {cafe.description || `Welcome to ${cafe.name}! A cozy place located at ${cafe.address}. We serve excellent coffee and provide a great atmosphere for work and rest.`}
                </p>
              </div>
              <button 
                className={styles.showMore}
                onClick={() => setIsDescExpanded(!isDescExpanded)}
              >
                {isDescExpanded ? 'Show less' : 'Show more'} 
                <img 
                   src={isDescExpanded ? "/img/icons/Up.svg" : "/img/icons/Bottom.svg"} 
                   alt="" 
                   className={styles.arrowIcon}
                />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};