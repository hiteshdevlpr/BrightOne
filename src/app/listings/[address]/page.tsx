import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ListingPageClient from './ListingPageClient';
import EnhancedListingPageClient from './EnhancedListingPageClient';
import StructuredData from './StructuredData';
import { getListingData } from '@/lib/listing-data';

interface ListingPageProps {
  params: Promise<{ address: string }>;
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { address } = await params;
  const listing = await getListingData(address);

  if (!listing) {
    return {
      title: 'Property Not Found | BrightOne Creative',
      description: 'The requested property listing could not be found.',
    };
  }

  const firstImage = listing.images?.[0];
  const imageUrl = firstImage?.src?.startsWith('http') ? firstImage.src : `https://brightone.ca${firstImage?.src || '/meta-header.png'}`;

  return {
    title: `${listing.title} | ${listing.address} | BrightOne Creative`,
    description: `${listing.description} Located at ${listing.address}. ${listing.bedrooms} bedrooms, ${listing.bathrooms} bathrooms. ${listing.squareFootage ? listing.squareFootage + ' sq ft' : ''}.`,
    keywords: `real estate, property, ${listing.address}, ${listing.city}, ${listing.province}, ${listing.bedrooms} bedroom, ${listing.bathrooms} bathroom`,
    openGraph: {
      title: `${listing.title} | ${listing.address}`,
      description: listing.description,
      type: 'website',
      url: `https://brightone.ca/listings/${address}`,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: listing.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${listing.title} | ${listing.address}`,
      description: listing.description,
      images: [imageUrl],
    },
    alternates: { canonical: `https://brightone.ca/listings/${address}` },
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { address } = await params;
  const listing = await getListingData(address);

  if (!listing) notFound();

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const useEnhancedLayout = address === '345-park-road-s-oshawa' || address === '13151-lakeridge-road' || address === '23-385-the-east-mall';

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
