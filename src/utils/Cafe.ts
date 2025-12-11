export interface BackendCafe {
  name: string;
  photoLink: string;
  priceRating: number;    
  openingHours: string;
  rating: number;
  votesCount: number;     
  addressDtoResponse: {
    buildingNumber: string;
    streetDtoResponse: {
      name: string;
      cityDtoResponse: {
        name: string;
      }
    }
  };
}

export interface BackendResponse {
  content: BackendCafe[];
  totalPages: number;
  totalElements: number;
}

export interface Cafe {
  id: number;
  name: string;
  image: string;
  address: string;
  rating: number;
  reviews: number;
  price: number;
  isOpen: boolean;
  closingTime: string;
  tags: string[];
}
