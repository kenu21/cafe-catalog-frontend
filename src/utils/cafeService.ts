import type { BackendResponse, Cafe } from '../utils/Cafe';
import { mapBackendToFrontend } from '../utils/mapper';

const API_URL = '/api/cafes'; 

const getCafesRequest = async (params: Record<string, string | number>): Promise<Cafe[]> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value.toString());
  });

  const url = `${API_URL}?${queryParams.toString()}`;
  
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
  const all = await getAllCafes();
  return all.filter(cafe => 
    cafe.name.toLowerCase().includes(query.toLowerCase()) || 
    cafe.address.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
};