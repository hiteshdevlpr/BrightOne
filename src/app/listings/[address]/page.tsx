import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ListingPageClient from './ListingPageClient';
import EnhancedListingPageClient from './EnhancedListingPageClient';
import StructuredData from './StructuredData';
import { getListingData } from '@/lib/listing-data';

interface ListingPageProps {
  params: Promise<{
    address: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { address } = await params;
  const listing = await getListingData(address);
  
  if (!listing) {
    return {
      title: 'Property Not Found | BrightOne Inc',
      description: 'The requested property listing could not be found.',
    };
  }

  return {
    title: `${listing.title} | ${listing.address} | BrightOne Inc`,
    description: `${listing.description} Located at ${listing.address}. ${listing.bedrooms} bedrooms, ${listing.bathrooms} bathrooms. ${listing.squareFootage} sq ft.`,
    keywords: `real estate, property, ${listing.address}, ${listing.city}, ${listing.province}, ${listing.bedrooms} bedroom, ${listing.bathrooms} bathroom, ${listing.squareFootage} sq ft`,
    openGraph: {
      title: `${listing.title} | ${listing.address}`,
      description: listing.description,
      type: 'website',
      url: `https://listings.brightone.ca/${address}`,
      images: [
        {
          url: listing.images[0]?.src || '/meta-header.png',
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${listing.title} | ${listing.address}`,
      description: listing.description,
      images: [listing.images[0]?.src || '/meta-header.png'],
    },
    alternates: {
      canonical: `https://listings.brightone.ca/${address}`,
    },
  };
}

// Generate static params for known listings (optional - for static generation)
export async function generateStaticParams() {
  // This would typically fetch from your database or API
  // For now, we'll return an empty array to enable dynamic rendering
  return [];
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { address } = await params;
  const listing = await getListingData(address);
  
  if (!listing) {
    notFound();
  }

  // Get Google Maps API key from environment
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Use enhanced layout for Oshawa listing
  const useEnhancedLayout = address === '345-park-road-s-oshawa';

  return (
    <>
      <StructuredData listing={listing} />
      {useEnhancedLayout ? (
        <EnhancedListingPageClient listing={listing} googleMapsApiKey={googleMapsApiKey} />
      ) : (
        <ListingPageClient listing={listing} googleMapsApiKey={googleMapsApiKey} />
      )}
    </>
  );
}
