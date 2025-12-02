export interface BackendCafe {
  name: string;
  photoLink: string;
  priceRating: number;    
  openingHours: string;
  rating: number;
  votesCount: number;     
  addressEntity: {
    buildingNumber: string;
    streetEntity: {
      name: string;
      cityEntity: {
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
}