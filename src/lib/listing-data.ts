// Types for listing data
export interface ListingImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ListingFeature {
  icon: string;
  label: string;
  value: string;
}

export interface ListingData {
  id: string;
  address: string;
  title: string;
  description: string;
  price: number;
  priceFormatted: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  lotSize?: number;
  yearBuilt?: number;
  propertyType: string;
  city: string;
  province: string;
  postalCode: string;
  images: ListingImage[];
  features: ListingFeature[];
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  mlsNumber?: string;
  status: 'active' | 'sold' | 'pending';
  dateListed: string;
  lastUpdated: string;
}

// Sample listing data - in a real app, this would come from a database
const sampleListings: Record<string, ListingData> = {
  '123-main-street-toronto': {
    id: '123-main-street-toronto',
    address: '123 Main Street, Toronto, ON',
    title: 'Stunning Modern Home in Prime Location',
    description: 'This beautifully renovated home features an open-concept design with premium finishes throughout. The gourmet kitchen boasts quartz countertops and stainless steel appliances, while the master suite offers a spa-like ensuite bathroom. Located in a quiet neighborhood with excellent schools and amenities nearby.',
    price: 1250000,
    priceFormatted: '$1,250,000',
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 2800,
    lotSize: 0.25,
    yearBuilt: 2015,
    propertyType: 'Single Family Home',
    city: 'Toronto',
    province: 'Ontario',
    postalCode: 'M5V 3A8',
    images: [
      { src: '/portfolio-1.jpg', alt: 'Modern living room with large windows', caption: 'Bright and spacious living room' },
      { src: '/portfolio-2.jpg', alt: 'Gourmet kitchen with island', caption: 'Chef-inspired kitchen' },
      { src: '/portfolio-3.jpg', alt: 'Master bedroom with ensuite', caption: 'Luxurious master suite' },
      { src: '/portfolio-4.jpg', alt: 'Backyard with deck', caption: 'Private outdoor space' },
      { src: '/portfolio-5.jpg', alt: 'Front exterior view', caption: 'Beautiful curb appeal' },
    ],
    features: [
      { icon: '🏠', label: 'Property Type', value: 'Single Family Home' },
      { icon: '🛏️', label: 'Bedrooms', value: '4' },
      { icon: '🚿', label: 'Bathrooms', value: '3' },
      { icon: '📐', label: 'Square Footage', value: '2,800 sq ft' },
      { icon: '🌳', label: 'Lot Size', value: '0.25 acres' },
      { icon: '📅', label: 'Year Built', value: '2015' },
      { icon: '🚗', label: 'Parking', value: '2-car garage' },
      { icon: '🌡️', label: 'Heating', value: 'Central Air' },
    ],
    virtualTourUrl: 'https://example.com/virtual-tour',
    floorPlanUrl: '/floor-plan.png',
    agentName: 'Sarah Johnson',
    agentPhone: '(416) 555-0123',
    agentEmail: 'sarah.johnson@brightone.ca',
    mlsNumber: 'W1234567',
    status: 'active',
    dateListed: '2024-01-15',
    lastUpdated: '2024-01-20',
  },
  '456-oak-avenue-mississauga': {
    id: '456-oak-avenue-mississauga',
    address: '456 Oak Avenue, Mississauga, ON',
    title: 'Luxury Condo with City Views',
    description: 'Experience urban living at its finest in this stunning 2-bedroom condo. Floor-to-ceiling windows offer breathtaking city views, while the modern kitchen and spa-like bathroom provide the perfect retreat. Building amenities include a fitness center, rooftop terrace, and concierge service.',
    price: 850000,
    priceFormatted: '$850,000',
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1200,
    yearBuilt: 2020,
    propertyType: 'Condo',
    city: 'Mississauga',
    province: 'Ontario',
    postalCode: 'L5B 3C7',
    images: [
      { src: '/portfolio-6.jpg', alt: 'Modern condo living room', caption: 'Contemporary living space' },
      { src: '/portfolio-7.jpg', alt: 'Kitchen with city view', caption: 'Gourmet kitchen with views' },
      { src: '/portfolio-8.jpg', alt: 'Master bedroom', caption: 'Spacious master bedroom' },
      { src: '/portfolio-9.jpg', alt: 'Building exterior', caption: 'Modern building facade' },
    ],
    features: [
      { icon: '🏢', label: 'Property Type', value: 'Condo' },
      { icon: '🛏️', label: 'Bedrooms', value: '2' },
      { icon: '🚿', label: 'Bathrooms', value: '2' },
      { icon: '📐', label: 'Square Footage', value: '1,200 sq ft' },
      { icon: '📅', label: 'Year Built', value: '2020' },
      { icon: '🏋️', label: 'Amenities', value: 'Gym, Rooftop, Concierge' },
      { icon: '🅿️', label: 'Parking', value: '1 space included' },
      { icon: '🌡️', label: 'Heating', value: 'Central Air' },
    ],
    virtualTourUrl: 'https://example.com/virtual-tour-2',
    agentName: 'Michael Chen',
    agentPhone: '(905) 555-0456',
    agentEmail: 'michael.chen@brightone.ca',
    mlsNumber: 'W2345678',
    status: 'active',
    dateListed: '2024-01-10',
    lastUpdated: '2024-01-18',
  },
};

// Function to get listing data by address slug
export async function getListingData(addressSlug: string): Promise<ListingData | null> {
  // In a real application, this would fetch from a database
  // For now, we'll use the sample data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const listing = sampleListings[addressSlug];
  return listing || null;
}

// Function to get all listings (for sitemap, etc.)
export async function getAllListings(): Promise<ListingData[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return Object.values(sampleListings);
}

// Function to search listings
export async function searchListings(query: string): Promise<ListingData[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const searchTerm = query.toLowerCase();
  return Object.values(sampleListings).filter(listing => 
    listing.address.toLowerCase().includes(searchTerm) ||
    listing.city.toLowerCase().includes(searchTerm) ||
    listing.title.toLowerCase().includes(searchTerm) ||
    listing.description.toLowerCase().includes(searchTerm)
  );
}
