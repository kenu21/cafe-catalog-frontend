import type { BackendResponse, Cafe } from '../utils/Cafe';
import { mapBackendToFrontend } from '../utils/mapper';

const API_URL = '/api/cafes'; 

const getCafesRequest = async (queryParams: string): Promise<Cafe[]> => {
  const url = `${API_URL}?${queryParams}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching from ${url}: ${response.status}`);
  }
  
  const data: BackendResponse = await response.json();
  
  return data.content.map(mapBackendToFrontend);
};

export const getAllCafes = async (): Promise<Cafe[]> => {
  return await getCafesRequest('page=0&size=20');
};

export const getBestOffers = async (): Promise<Cafe[]> => {
  return await getCafesRequest('sort=rating,desc&page=0&size=5');
};

export const getChosenCafes = async (): Promise<Cafe[]> => {
  return await getCafesRequest('sort=votesCount,desc&page=0&size=5');
};

export const getNewCafes = async (): Promise<Cafe[]> => {
  return await getCafesRequest('sort=id,desc&page=0&size=5');
};