import { useSearchParams } from 'react-router-dom';

export const useFilterCount = () => {
  const [searchParams] = useSearchParams();

  const tagsCount = searchParams.getAll('tags').length;
  const priceCount = searchParams.getAll('priceRating').length;
  const ratingCount = searchParams.getAll('rating').length;
  const timeCount = searchParams.has('openingHours') ? 1 : 0;

  return tagsCount + priceCount + ratingCount + timeCount;
};