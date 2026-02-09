import { ListingData } from '@/lib/listing-data';

interface StructuredDataProps {
  listing: ListingData;
}

export default function StructuredData({ listing }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": listing.title,
    "description": listing.description,
    "url": `https://brightone.ca/listings/${listing.id}`,
    "image": (listing.images ?? []).map(img => img.src.startsWith('http') ? img.src : `https://brightone.ca${img.src}`),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": listing.address.split(',')[0],
      "addressLocality": listing.city,
      "addressRegion": listing.province,
      "postalCode": listing.postalCode,
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "43.6532",
      "longitude": "-79.3832"
    },
    "offers": {
      "@type": "Offer",
      "price": listing.price,
      "priceCurrency": "CAD",
      "availability": listing.status === 'active' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "validFrom": listing.dateListed
    },
    "floorSize": listing.squareFootage ? {
      "@type": "QuantitativeValue",
      "value": listing.squareFootage,
      "unitCode": "SQF"
    } : undefined,
    "numberOfRooms": listing.bedrooms,
    "numberOfBathroomsTotal": listing.bathrooms,
    "yearBuilt": listing.yearBuilt,
    "additionalProperty": listing.features.map(feature => ({
      "@type": "PropertyValue",
      "name": feature.label,
      "value": feature.value
    })),
    "realEstateAgent": {
      "@type": "RealEstateAgent",
      "name": listing.agentName,
      "telephone": listing.agentPhone,
      "email": listing.agentEmail
    },
    "datePosted": listing.dateListed,
    "dateModified": listing.lastUpdated
  };

  const cleanData = JSON.stringify(structuredData);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: cleanData }}
    />
  );
}
