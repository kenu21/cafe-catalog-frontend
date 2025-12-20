import type { FilterState } from '../components/Filter/Filter';

const STORAGE_KEY = 'cafe_filters';

export const saveFilters = (filters: FilterState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving filters to localStorage:', error);
  }
};

export const getFilters = (): FilterState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as FilterState;
  } catch (error) {
    console.error('Error reading filters from localStorage:', error);
    return null;
  }
};

export const clearFilters = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing filters from localStorage:', error);
  }
};

