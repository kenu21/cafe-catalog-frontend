import type { BackendResponse, Cafe } from '../utils/Cafe';
import { mapBackendToFrontend } from '../utils/mapper';
import type { FilterState } from '../components/Filter/Filter';

const normalizeBaseUrl = (baseUrl?: string): string =>
  baseUrl ? baseUrl.replace(/\/$/, '') : '';

const API_BASE_URL = normalizeBaseUrl(import.meta.env.REACT_APP_API_URL);
const CAFES_ENDPOINT = `${API_BASE_URL}/cafes`;

const getCafesRequest = async (params: Record<string, string | number>): Promise<Cafe[]> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value.toString());
  });

  const queryString = queryParams.toString();
  const url = queryString ? `${CAFES_ENDPOINT}?${queryString}` : CAFES_ENDPOINT;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching from ${url}: ${response.status}`);
  }
  
  const data: BackendResponse = await response.json();
  
  const list = Array.isArray(data) ? data : data.content;
  
  return list.map(mapBackendToFrontend);
};

export const getAllCafes = async (): Promise<Cafe[]> => {
  return await getCafesRequest({ page: 0, size: 20 });
};

export const getBestOffers = async (): Promise<Cafe[]> => {
  return await getCafesRequest({ 
    sort: 'rating,desc', 
    page: 0, 
    size: 5
  });
};

export const getChosenCafes = async (): Promise<Cafe[]> => {
  return await getCafesRequest({ 
    sort: 'votesCount,desc', 
    page: 0, 
    size: 5
  });
};

export const getNewCafes = async (): Promise<Cafe[]> => {
  return await getCafesRequest({ 
    sort: 'id,desc', 
    page: 0, 
    size: 5 
  });
};

export const searchCafes = async (query: string): Promise<Cafe[]> => {
  if (!query) return [];

  const url = `${CAFES_ENDPOINT}/search?query=${encodeURIComponent(query)}`;
  
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Search error: ${response.status}`);
    return [];
  }
  
  const data: BackendResponse = await response.json();
  const list = Array.isArray(data) ? data : data.content;
  
  return list.map(mapBackendToFrontend);
};

export const filterCafes = async (filters: FilterState): Promise<Cafe[]> => {
  const params = new URLSearchParams();

  const allTags = [
    ...filters.popular, 
    ...filters.coffeeStyle, 
    ...filters.foodMenu, 
    ...filters.workStudy
  ];
  allTags.forEach(tag => params.append('tags', tag));

  filters.prices.forEach(p => params.append('priceRating', p.toString()));

  if (filters.rating.length > 0) {
    const minRating = Math.min(...filters.rating);
    params.append('rating', minRating.toString());
  }

  if (filters.timeFrom && filters.timeFrom !== '9:00 a.m.') {
    params.append('openingHours', filters.timeFrom);
  }

  const url = `${CAFES_ENDPOINT}/filter?${params.toString()}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Filter error: ${response.status}`);
    return [];
  }

  const data: BackendResponse = await response.json();
  const list = Array.isArray(data) ? data : data.content;

  return list.map(mapBackendToFrontend);
};