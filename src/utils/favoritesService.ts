import type { Cafe } from './Cafe';

const STORAGE_KEY = 'cafe_favorites';
const FAVORITES_CHANGED_EVENT = 'favoritesChanged';

const dispatchFavoritesChanged = () => {
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
};

export const getFavorites = (): Cafe[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Cafe[];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};


export const isFavorite = (cafeId: number): boolean => {
  const favorites = getFavorites();
  return favorites.some(cafe => cafe.id === cafeId);
};


export const addToFavorites = (cafe: Cafe): void => {
  try {
    const favorites = getFavorites();
    if (!favorites.some(f => f.id === cafe.id)) {
      favorites.push(cafe);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      dispatchFavoritesChanged();
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};


export const removeFromFavorites = (cafeId: number): void => {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(cafe => cafe.id !== cafeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    dispatchFavoritesChanged();
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};


export const toggleFavorite = (cafe: Cafe): boolean => {
  const isFav = isFavorite(cafe.id);
  if (isFav) {
    removeFromFavorites(cafe.id);
    return false;
  } else {
    addToFavorites(cafe);
    return true;
  }
};

export const onFavoritesChanged = (callback: () => void): (() => void) => {
  window.addEventListener(FAVORITES_CHANGED_EVENT, callback);
  return () => {
    window.removeEventListener(FAVORITES_CHANGED_EVENT, callback);
  };
};
