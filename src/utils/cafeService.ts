import type { BackendResponse, Cafe } from '../utils/Cafe';
import { mapBackendToFrontend } from '../utils/mapper';
import type { FilterState } from '../components/Filter/Filter';

// 👇 ЦЮ ЧАСТИНУ Я НЕ ЧІПАВ
const normalizeBaseUrl = (baseUrl?: string): string =>
  baseUrl ? baseUrl.replace(/\/$/, '') : '';

const API_BASE_URL = normalizeBaseUrl(import.meta.env.REACT_APP_API_URL);
// -----------------------------------------------------------

const CAFES_ENDPOINT = `${API_BASE_URL}/cafes`;
const TAGS_ENDPOINT = `${API_BASE_URL}/tags`; // Перевірте, чи тут має бути /api/v1/tags чи просто /tags як у вас було
const FILTER_ENDPOINT = `${API_BASE_URL}/filter`;
const SEARCH_ENDPOINT = `${API_BASE_URL}/search`;

// Інтерфейс для об'єкта тегу з бекенду
interface BackendTag {
  name: string;
}

// 👇 ВИПРАВЛЕНО: Розділили оголошення, щоб minutes був const (вимога лінтера)
const convertTo24Hour = (time12h: string): string => {
  if (!time12h) return '';
  
  const parts = time12h.split(' ');
  if (parts.length < 2) return time12h;

  const [time, modifier] = parts;
  
  // Тут була помилка "prefer-const", бо minutes не змінювався
  const [rawHours, minutes] = time.split(':');
  let hours = rawHours;

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'p.m.') {
    hours = (parseInt(hours, 10) + 12).toString();
  }

  return `${hours.padStart(2, '0')}:${minutes}`;
};

const getCafesRequest = async (url: string, params?: Record<string, string | number>): Promise<Cafe[]> => {
  let fetchUrl = url;

  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    fetchUrl = queryString ? `${url}?${queryString}` : url;
  }
  
  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`Error fetching from ${fetchUrl}: ${response.status}`);
  }
  
  const data: BackendResponse = await response.json();
  const list = Array.isArray(data) ? data : data.content;
  
  return list.map(mapBackendToFrontend);
};

export const getAllCafes = async (): Promise<Cafe[]> => {
  return await getCafesRequest(CAFES_ENDPOINT, { page: 0, size: 20 });
};

// 👇 ВИПРАВЛЕНО: Типізація для уникнення "Unexpected any"
export const getAllTags = async (): Promise<string[]> => {
  try {
    const response = await fetch(TAGS_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.status}`);
    }
    
    // Явно вказуємо unknown, щоб TS змусив нас перевірити тип
    const data: unknown = await response.json();

    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === 'string') {
        return data as string[];
      }
      // Приводимо до типу BackendTag[], щоб map знав структуру
      return (data as BackendTag[]).map((item) => item.name);
    }
    
    return [];
  } catch (error) {
    console.error("Error loading tags:", error);
    return [];
  }
};

export const getBestOffers = async (): Promise<Cafe[]> => {
  return await getCafesRequest(CAFES_ENDPOINT, { sort: 'rating,desc', page: 0, size: 5 });
};

export const getChosenCafes = async (): Promise<Cafe[]> => {
  return await getCafesRequest(CAFES_ENDPOINT, { sort: 'votesCount,desc', page: 0, size: 5 });
};

export const getNewCafes = async (): Promise<Cafe[]> => {
  return await getCafesRequest(CAFES_ENDPOINT, { sort: 'id,desc', page: 0, size: 5 });
};

export const searchCafes = async (query: string): Promise<Cafe[]> => {
  if (!query) return [];
  try {
    return await getCafesRequest(SEARCH_ENDPOINT, { query: query });
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

export const filterCafes = async (filters: FilterState): Promise<Cafe[]> => {
  const params = new URLSearchParams();

  // 1. Tags
  if (filters.tags && filters.tags.length > 0) {
    filters.tags.forEach(tag => params.append('tags', tag));
  }

  // 2. Prices
  if (filters.prices && filters.prices.length > 0) {
    filters.prices.forEach((p: number) => params.append('priceRating', p.toString()));
  }

  // 3. Rating
  if (filters.rating && filters.rating.length > 0) {
    const minRating = Math.min(...filters.rating);
    params.append('rating', minRating.toString());
  }

  // 4. Time
  if (filters.timeFrom && filters.timeFrom !== '9:00 a.m.') {
    const time24h = convertTo24Hour(filters.timeFrom);
    params.append('openingHours', time24h);
  }

  const url = `${FILTER_ENDPOINT}?${params.toString()}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Filter error: ${response.status}`);
      return [];
    }
    const data: BackendResponse = await response.json();
    const list = Array.isArray(data) ? data : data.content;
    return list.map(mapBackendToFrontend);
  } catch (error) {
    console.error("Filter request failed:", error);
    return [];
  }
};