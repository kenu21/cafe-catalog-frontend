import type { BackendResponse, Cafe, BackendCafe } from '../utils/Cafe';
import { mapBackendToFrontend } from '../utils/mapper';
import type { FilterState } from '../components/Filter/Filter';

const normalizeBaseUrl = (baseUrl?: string): string =>
  baseUrl ? baseUrl.replace(/\/$/, '') : '';

const API_BASE_URL = normalizeBaseUrl(import.meta.env.REACT_APP_API_URL);

const CAFES_ENDPOINT = `${API_BASE_URL}/cafes`;
const TAGS_ENDPOINT = `${API_BASE_URL}/tags`;
const FILTER_ENDPOINT = `${API_BASE_URL}/filter`;
const SEARCH_ENDPOINT = `${API_BASE_URL}/search`;

interface BackendTag {
  name: string;
}

const convertTo24Hour = (time12h: string): string => {
  if (!time12h) return '';
  
  const parts = time12h.split(' ');
  if (parts.length < 2) return time12h;

  const [time, modifier] = parts;
  
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

export const getAllTags = async (): Promise<string[]> => {
  try {
    const response = await fetch(TAGS_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.status}`);
    }
    
    const data: unknown = await response.json();

    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === 'string') {
        return data as string[];
      }
      return (data as BackendTag[]).map((item) => item.name);
    }
    
    return [];
  } catch (error) {
    console.error("Error loading tags:", error);
    return [];
  }
};

export const getBestOffers = async (): Promise<Cafe[]> => {
  return await getCafesRequest(CAFES_ENDPOINT, { sort: 'rating,desc', page: 0, size: 6 });
};

export const getNewCafes = async (): Promise<Cafe[]> => {
  return await getCafesRequest(CAFES_ENDPOINT, { sort: 'id,desc', page: 0, size: 6 });
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

  if (filters.tags && filters.tags.length > 0) {
    filters.tags.forEach(tag => params.append('tags', tag));
  }

  if (filters.prices && filters.prices.length > 0) {
    filters.prices.forEach((p: number) => params.append('priceRating', p.toString()));
  }

  if (filters.rating && filters.rating.length > 0) {
    const minRating = Math.min(...filters.rating);
    params.append('rating', minRating.toString());
  }

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

// 👇 Нова функція для отримання одного кафе (потрібна для CafePage)
export const getCafeById = async (id: string | number): Promise<Cafe> => {
  const url = `${CAFES_ENDPOINT}/${id}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error fetching cafe with id ${id}: ${response.status}`);
  }
  
  const data: BackendCafe = await response.json();
  // Використовуємо 0 як індекс, бо це один елемент
  return mapBackendToFrontend(data, 0);
};