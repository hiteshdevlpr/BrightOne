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
  floorPlans?: ListingImage[];
  walkthroughVideoUrl?: string;
  socialMediaReelUrl?: string;
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
    floorPlanUrl: '/1st_floor.jpg',
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
  '345-park-road-s-oshawa': {
    id: '345-park-road-s-oshawa',
    address: '345 PARK ROAD S, Oshawa, ON',
    title: 'Stunning Family Home in Oshawa',
    description: 'This beautiful family home features modern amenities and spacious living areas. Perfect for families looking for comfort and convenience in a great neighborhood. The property boasts a large backyard, updated kitchen, and multiple living spaces.',
    price: 750000,
    priceFormatted: '$750,000',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1800,
    lotSize: 0.2,
    yearBuilt: 2018,
    propertyType: 'Single Family Home',
    city: 'Oshawa',
    province: 'Ontario',
    postalCode: 'L1H 5K2',
    images: [
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-50.jpg', alt: '345 Park Road S Oshawa - Main Hero View', caption: 'Stunning main view of the property showcasing its best features' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-1.jpg', alt: '345 Park Road S Oshawa - Exterior Front View', caption: 'Beautiful front exterior with modern design' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-2.jpg', alt: '345 Park Road S Oshawa - Living Room', caption: 'Spacious living room with natural light' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-3.jpg', alt: '345 Park Road S Oshawa - Kitchen', caption: 'Modern kitchen with island and stainless appliances' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-4.jpg', alt: '345 Park Road S Oshawa - Master Bedroom', caption: 'Comfortable master bedroom with walk-in closet' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-5.jpg', alt: '345 Park Road S Oshawa - Dining Area', caption: 'Elegant dining space perfect for entertaining' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-6.jpg', alt: '345 Park Road S Oshawa - Second Bedroom', caption: 'Spacious second bedroom with large windows' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-7.jpg', alt: '345 Park Road S Oshawa - Bathroom', caption: 'Modern bathroom with contemporary fixtures' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-8.jpg', alt: '345 Park Road S Oshawa - Backyard', caption: 'Private backyard with deck and landscaping' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-9.jpg', alt: '345 Park Road S Oshawa - Garage', caption: 'Two-car garage with additional storage' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-10.jpg', alt: '345 Park Road S Oshawa - Basement', caption: 'Finished basement with recreation area' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-11.jpg', alt: '345 Park Road S Oshawa - Laundry Room', caption: 'Convenient main floor laundry room' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-12.jpg', alt: '345 Park Road S Oshawa - Third Bedroom', caption: 'Third bedroom perfect for home office or guest room' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-13.jpg', alt: '345 Park Road S Oshawa - Hallway', caption: 'Bright hallway with hardwood flooring' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-14.jpg', alt: '345 Park Road S Oshawa - Exterior Side View', caption: 'Side view showing architectural details' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-61.jpg', alt: '345 Park Road S Oshawa - Staircase', caption: 'Elegant staircase with hardwood railing' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-63.jpg', alt: '345 Park Road S Oshawa - Backyard Deck', caption: 'Large deck perfect for outdoor dining' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-64.jpg', alt: '345 Park Road S Oshawa - Landscaping', caption: 'Professional landscaping with mature trees' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-65.jpg', alt: '345 Park Road S Oshawa - Driveway', caption: 'Wide driveway with space for multiple vehicles' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-68.jpg', alt: '345 Park Road S Oshawa - Storage Area', caption: 'Additional storage in basement' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-69.jpg', alt: '345 Park Road S Oshawa - Utility Room', caption: 'Utility room with mechanical systems' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-70.jpg', alt: '345 Park Road S Oshawa - Exterior Back View', caption: 'Back exterior showing deck and yard' },
      { src: '/portfolio/345-park-rd/345_Park_Road_S_Oshawa-71.jpg', alt: '345 Park Road S Oshawa - Neighborhood View', caption: 'View of the surrounding neighborhood' },
    ],
    features: [
      { icon: '🏠', label: 'Property Type', value: 'Single Family Home' },
      { icon: '🛏️', label: 'Bedrooms', value: '3' },
      { icon: '🚿', label: 'Bathrooms', value: '2' },
      { icon: '📐', label: 'Square Footage', value: '1,800 sq ft' },
      { icon: '🌳', label: 'Lot Size', value: '0.2 acres' },
      { icon: '📅', label: 'Year Built', value: '2018' },
      { icon: '🚗', label: 'Parking', value: '2-car garage' },
      { icon: '🌡️', label: 'Heating', value: 'Central Air' },
    ],
    virtualTourUrl: 'https://example.com/virtual-tour-oshawa',
    floorPlanUrl: '/2nd_floor.jpg',
    floorPlans: [
      { src: '/floor-plans/1st_floor.jpg', alt: 'Main Floor Plan - Living Areas', caption: 'Main floor layout showing living room, kitchen, dining room, and bedrooms' },
      { src: '/floor-plans/2nd_floor.jpg', alt: 'Detailed Floor Plan - Multi-Level', caption: 'Detailed multi-level floor plan with all rooms and outdoor spaces' },
    ],
    walkthroughVideoUrl: 'https://www.youtube.com/embed/Qi7-UkKqTi0',
    socialMediaReelUrl: 'https://www.youtube.com/embed/Qi7-UkKqTi0',
    agentName: 'Jennifer Smith',
    agentPhone: '(905) 555-0789',
    agentEmail: 'jennifer.smith@brightone.ca',
    mlsNumber: 'W3456789',
    status: 'active',
    dateListed: '2024-01-25',
    lastUpdated: '2024-01-30',
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
