import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface FilterState {
  tags: string[];
  prices: number[];
  rating: number[];
  timeFrom: string;
  timeTo: string;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filterCount: number;
}

const defaultFilters: FilterState = {
  tags: [],
  prices: [],
  rating: [],
  timeFrom: '9:00 a.m.',
  timeTo: '9:00 p.m.', 
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filterCount =
    filters.tags.length +
    filters.prices.length +
    filters.rating.length +
    (filters.timeFrom && filters.timeFrom !== '9:00 a.m.' ? 1 : 0);

  const resetFilters = () => setFilters(defaultFilters);

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters, filterCount }}>
      {children}
    </FilterContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};