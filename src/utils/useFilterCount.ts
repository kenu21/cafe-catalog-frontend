import { useFilterContext } from '../utils/FilterContext';

export const useFilterCount = () => {
  const { filterCount } = useFilterContext();

  return filterCount;
};