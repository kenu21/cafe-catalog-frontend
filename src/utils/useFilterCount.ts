import { useSearchParams } from 'react-router-dom';
import { getFilters } from './filterService';

export const useFilterCount = () => {
  const [searchParams] = useSearchParams();

  const tagsFromUrl = searchParams.getAll('tags');
  const priceFromUrl = searchParams.getAll('priceRating');
  const ratingFromUrl = searchParams.getAll('rating');
  const hasOpeningHoursParam = searchParams.has('openingHours');

  const hasUrlFilters =
    tagsFromUrl.length > 0 ||
    priceFromUrl.length > 0 ||
    ratingFromUrl.length > 0 ||
    hasOpeningHoursParam;

  if (hasUrlFilters) {
    const tagsCount = tagsFromUrl.length;
    const priceCount = priceFromUrl.length;
    const ratingCount = ratingFromUrl.length;
    const timeCount = hasOpeningHoursParam ? 1 : 0;

    return tagsCount + priceCount + ratingCount + timeCount;
  }

  const storedFilters = getFilters();

  if (!storedFilters) {
    return 0;
  }

  const tagsCount = storedFilters.tags?.length ?? 0;
  const priceCount = storedFilters.prices?.length ?? 0;
  const ratingCount = storedFilters.rating?.length ?? 0;
  const timeCount =
    storedFilters.timeFrom && storedFilters.timeFrom !== '9:00 a.m.' ? 1 : 0;

  return tagsCount + priceCount + ratingCount + timeCount;
};
