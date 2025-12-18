export interface BackendCafe {
  id?: number;
  name: string;
  photoLink: string;
  priceRating: number;
  openingHours: string;
  rating: number;
  votesCount: number;
  description?: string;
  // 👇 Це дозволяє отримати теги як масив об'єктів (як у вашому JSON) або рядків
  tags?: { name: string }[] | string[]; 
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
  images: string[];
  address: string;
  rating: number;
  reviews: number;
  price: number;
  isOpen: boolean;
  closingTime: string;
  openingHours: string;
  tags: string[]; // На фронт піде вже чистий масив рядків ["cozy"]
  description: string;
}