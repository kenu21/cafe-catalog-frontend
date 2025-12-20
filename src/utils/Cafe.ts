export interface PhotoDto {
  photoLink: string;
}

export interface TagDto {
  name: string;
}

export interface AddressDto {
  buildingNumber: string;
  streetDtoResponse: {
    name: string;
    cityDtoResponse: {
      name: string;
    };
  };
}

export interface BackendCafe {
  id: number;
  name: string;
  description?: string;
  photoLink?: string; 
  mainPhoto?: PhotoDto;
  photos?: PhotoDto[]; 
  priceRating: number;
  rating: number;
  votesCount: number;
  openingHours: string;
  tags?: TagDto[] | string[]; 
  addressDtoResponse: AddressDto;
}

export interface BackendResponse {
  content: BackendCafe[];
  totalPages: number;
  totalElements: number;
}

export interface Cafe {
  id: number;
  name: string;
  description: string;
  image: string;    
  images: string[]; 
  address: string;    
  rating: number;
  reviews: number;    
  price: number;      
  tags: string[];     
  openingHours: string;
  isOpen: boolean;
  closingTime: string;
}