import type { BackendCafe, Cafe } from './Cafe';

const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const getScheduleStatus = (openingHours: string) => {
  if (!openingHours) return { isOpen: false, closingTime: 'N/A' };

  const now = new Date();
  const jsDay = now.getDay();
  const todayIdx = (jsDay + 6) % 7; 
  
  const daysShort = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const todayStr = daysShort[todayIdx];

  const rules = openingHours.split(';').map(s => s.trim());

  let todayRule = '';

  for (const rule of rules) {
    const [daysRange] = rule.split(' '); 

    if (daysRange.includes('-')) {
      const [start, end] = daysRange.split('-');
      const sIdx = daysShort.indexOf(start);
      const eIdx = daysShort.indexOf(end);
      
      if (todayIdx >= sIdx && todayIdx <= eIdx) {
        todayRule = rule;
        break;
      }
    } else if (daysRange.includes(',')) {
      if (daysRange.includes(todayStr)) {
        todayRule = rule;
        break;
      }
    } else {
      if (daysRange === todayStr) {
        todayRule = rule;
        break;
      }
    }
  }

  if (todayRule) {
    const timeRange = todayRule.split(' ')[1];
    
    if (timeRange && timeRange.includes('-')) {
      const [openStr, closeStr] = timeRange.split('-');
      
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const openMinutes = timeToMinutes(openStr);
      const closeMinutes = timeToMinutes(closeStr);

      const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
      
      return { isOpen, closingTime: closeStr };
    }
  }

  return { isOpen: false, closingTime: 'Closed' };
};

export const mapBackendToFrontend = (item: BackendCafe, index: number): Cafe => {
  const street = item.addressDtoResponse?.streetDtoResponse?.name || '';
  const building = item.addressDtoResponse?.buildingNumber || '';
  const city = item.addressDtoResponse?.streetDtoResponse?.cityDtoResponse?.name || '';
  
  const fullAddress = [city, street, building].filter(Boolean).join(', ').replace(', ' + building, ' ' + building);

  const { isOpen, closingTime } = getScheduleStatus(item.openingHours);

  const galleryPhotos: string[] = [];

  if (item.photos && Array.isArray(item.photos)) {
    item.photos.forEach(p => {
      if (p.photoLink) galleryPhotos.push(p.photoLink);
    });
  }

  if (galleryPhotos.length === 0 && item.mainPhoto?.photoLink) {
    galleryPhotos.push(item.mainPhoto.photoLink);
  }

  const mainImage = item.mainPhoto?.photoLink || (galleryPhotos.length > 0 ? galleryPhotos[0] : '');

  const tags = item.tags && Array.isArray(item.tags)
    ? item.tags.map((t) => (typeof t === 'string' ? t : t.name))
    : [];

  return {
    id: item.id ?? index,
    name: item.name,
    
    image: mainImage,
    images: galleryPhotos, 
    
    address: fullAddress,
    rating: item.rating,
    reviews: item.votesCount,
    price: item.priceRating,
    isOpen: isOpen,
    closingTime: closingTime,
    openingHours: item.openingHours,
    tags: tags,
    description: item.description || '' 
  };
};