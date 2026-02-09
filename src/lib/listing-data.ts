// 13151 Lakeridge Road images are served from public/assets/img/portfolio/13151-lakeridge/
const LAKERIDGE_IMG_BASE = '/assets/img/portfolio/13151-lakeridge';
const lakeridgeImages = Array.from({ length: 34 }, (_, i) => ({
  src: `${LAKERIDGE_IMG_BASE}/13151_LAKERIDGE-${i + 1}.jpg`,
  alt: `13151 Lakeridge Road - Property View ${i + 1}`,
  caption: i === 0 ? 'Stunning view of the property showcasing its best features' : `13151 Lakeridge Road - View ${i + 1}`,
}));
// First image as hero (order: 9, 1, 2, ... 8, 10...34 per original)
const lakeridgeImagesOrdered = [
  lakeridgeImages[8],  // 9
  ...lakeridgeImages.slice(0, 8),  // 1-8
  ...lakeridgeImages.slice(9),    // 10-34
].map((img, idx) => ({
  ...img,
  caption: [
    'Two-car garage with additional storage',
    'Stunning view of the property showcasing its best features',
    'Beautiful property exterior and surroundings',
    'Exterior view with modern design elements',
    'Spacious interior with natural light',
    'Modern living spaces with contemporary finishes',
    'Elegant interior design and layout',
    'Comfortable living areas perfect for families',
    'Private outdoor space with landscaping',
    'Finished basement with recreation area',
    'Convenient main floor laundry room',
    'Spacious bedrooms perfect for home office or guest room',
    'Bright hallway with hardwood flooring',
    'Side view showing architectural details',
    'Elegant staircase with hardwood railing',
    'Large deck perfect for outdoor dining',
    'Professional landscaping with mature trees',
    'Wide driveway with space for multiple vehicles',
    'Additional storage in basement',
    'Utility room with mechanical systems',
    'Back exterior showing deck and yard',
    'View of the surrounding neighborhood',
    'Modern kitchen with island and stainless appliances',
    'Master bedroom with walk-in closet',
    'Dining space perfect for entertaining',
    'Second bedroom with large windows',
    'Modern bathroom with contemporary fixtures',
    'Backyard with deck and landscaping',
    'Additional property features and details',
    'Interior design highlights',
    'Property amenities and features',
    'Exterior and interior views',
    'Property showcasing quality finishes',
    'Comprehensive view of the property',
  ][idx] || img.caption,
}));

// 385 The East Mall Unit 23 - images from public/assets/img/portfolio/385-the-east-mall/
const EAST_MALL_IMG_BASE = '/assets/img/portfolio/385-the-east-mall';
const eastMallImageFilenames = [
  '005A3645-HDR-Edit.jpg', // primary/hero image
  '005A3529-HDR-Edit.jpg', '005A3535-HDR-Edit.jpg', '005A3554-HDR-Edit.jpg', '005A3569-HDR.jpg', '005A3580-HDR.jpg',
  '005A3585-HDR-Edit.jpg', '005A3590-HDR.jpg', '005A3620-HDR-Edit.jpg', '005A3625-HDR.jpg',
  '005A3655-HDR.jpg', '005A3660-HDR-Edit.jpg', '005A3665-HDR-Edit.jpg', '005A3670-HDR-Edit.jpg',
  '005A3679-HDR.jpg', '005A3685-HDR-Edit.jpg', '005A3689-HDR-Edit.jpg', '005A3696-HDR.jpg', '005A3705-HDR.jpg',
  '005A3710-HDR-Edit.jpg', '005A3720-HDR.jpg', '005A3725-HDR.jpg', '005A3730-HDR.jpg', '005A3735-HDR.jpg',
  '005A3740-HDR-Edit.jpg', '005A3745-HDR-Edit-Edit.jpg', '005A3749-HDR.jpg', '005A3759-HDR.jpg', '005A3776-HDR.jpg',
  '005A3791-HDR-Edit.jpg', '005A3796-HDR-Edit.jpg', '005A3801-HDR.jpg', '005A3806-HDR.jpg', '005A3825-HDR.jpg',
  '005A4026-HDR.jpg', '005A4031-HDR-Edit.jpg', '005A4036-HDR.jpg', '005A4046-HDR-Edit.jpg',
  'DJI_20260124163946_0243_D-HDR.jpg', 'DJI_20260124164633_0251_D-HDR.jpg'
];
const eastMallImages: { src: string; alt: string; caption?: string }[] = eastMallImageFilenames.map((name, i) => ({
  src: `${EAST_MALL_IMG_BASE}/${name}`,
  alt: `385 The East Mall Unit 23 - View ${i + 1}`,
  caption: i === 0 ? 'Stunning view of the property' : `385 The East Mall Unit 23 - View ${i + 1}`,
}));

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
  /** When set, location section uses this iframe src instead of API key or fallback link */
  mapEmbedUrl?: string;
  /** When set, shows a "3D Virtual Tour" section with this iframe embed URL (e.g. youriguide.com embed) */
  virtualTourEmbedUrl?: string;
  /** Bullet points for the "Highlights of the Property" box in the hero (enhanced layout) */
  highlights?: string[];
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
  '13151-lakeridge-road': {
    id: '13151-lakeridge-road',
    address: '13151 Lakeridge Road',
    title: 'Wilderness 60 acre retreat on Lakeridge road',
    description: 'This beautiful family home features modern amenities and spacious living areas. Perfect for families looking for comfort and convenience in a great neighborhood. The property boasts a large backyard, updated kitchen, and multiple living spaces.',
    price: 750000,
    priceFormatted: '$750,000',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 0,
    lotSize: 0.2,
    yearBuilt: 2018,
    propertyType: 'Single Family Home',
    city: 'Uxbridge',
    province: 'Ontario',
    postalCode: 'L1S 3J4',
    images: lakeridgeImagesOrdered,
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
    virtualTourUrl: 'https://example.com/virtual-tour-ajax',
    walkthroughVideoUrl: 'https://www.youtube.com/embed/YpQoC9xgUF4',
    socialMediaReelUrl: 'https://www.youtube.com/embed/Qi7-UkKqTi0',
    agentName: 'Jennifer Smith',
    agentPhone: '(905) 555-0789',
    agentEmail: 'jennifer.smith@brightone.ca',
    mlsNumber: 'W4567890',
    status: 'active',
    dateListed: '2024-01-25',
    lastUpdated: '2024-01-30',
  },
  '23-385-the-east-mall': {
    id: '23-385-the-east-mall',
    address: '385 The East Mall Unit 23, Etobicoke, ON M9B 6J4',
    title: 'Gorgeous Etobicoke Townhome — Rare End-Unit',
    description: 'Welcome home to this gorgeous Etobicoke townhome—where comfort, space, and convenience come together effortlessly. Lovingly maintained by the same family for over 25 years, this rare end-unit offers the kind of warmth and care you can feel the moment you walk in. The bright, spacious kitchen is the heart of the home, featuring granite countertops and brand-new appliances—perfect for busy mornings, family dinners, or hosting friends. The open main level showcases gleaming hardwood floors and a walkout to a beautiful outdoor space, ideal for summer barbecues or a quiet morning coffee. Upstairs, two generous bedrooms each offer their own complete ensuite and walk-in closet. The tastefully finished lower-level recreation room, complete with a cozy custom built gas fireplace and large, bright windows, is an inviting space for movie nights, a playroom, or a home office. A rare double garage, a one-year-old furnace, fresh paint throughout, and pride of ownership at every turn make this home truly move-in ready. Set in a highly convenient Etobicoke location close to public transit, major highways (401 & 407), shopping, restaurants, and just minutes to Pearson Airport. Pre-listing home inspection available.',
    price: 0,
    priceFormatted: 'Price on request',
    bedrooms: 2,
    bathrooms: 3,
    squareFootage: 0,
    propertyType: 'Townhouse',
    city: 'Etobicoke',
    province: 'Ontario',
    postalCode: 'M9B 6J4',
    images: eastMallImages,
    features: [
      { icon: '🏠', label: 'Property Type', value: 'Townhouse' },
      { icon: '🛏️', label: 'Bedrooms', value: '2' },
      { icon: '🚿', label: 'Bathrooms', value: '3' },
      { icon: '📍', label: 'Location', value: 'The East Mall, Etobicoke' },
      { icon: '🅿️', label: 'Parking', value: 'Double garage' },
    ],
    highlights: [
      'Rare end-unit townhome, same family 25+ years; double garage, new furnace, fresh paint—move-in ready.',
      'Bright kitchen with granite and new appliances; main level with hardwood and walkout to outdoor space.',
      'Two generous bedrooms, each with full ensuite and walk-in closet.',
      'Finished lower-level rec room with gas fireplace; upgraded laundry and abundant storage.',
      'Convenient Etobicoke: transit, 401 & 407, shopping, Pearson. Pre-listing inspection available.',
    ],
    walkthroughVideoUrl: 'https://www.youtube.com/embed/bOXYWuLXBzY',
    agentName: 'BrightOne Creative',
    agentPhone: '(416) 419-9689',
    agentEmail: 'contact@brightone.ca',
    status: 'active',
    dateListed: '2024-01-01',
    lastUpdated: '2024-01-01',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.1422228502106!2d-79.56166392342185!3d43.6452092529471!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b37111de7fce3%3A0x761d9a03b343092c!2s385%20The%20East%20Mall%20Unit%2023%2C%20Etobicoke%2C%20ON%20M9B%206J4!5e0!3m2!1sen!2sca!4v1770603348212!5m2!1sen!2sca',
    virtualTourEmbedUrl: 'https://youriguide.com/embed/23_385_the_east_mall_toronto_on?unbranded=1&bgcolor=FFFFFF',
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
