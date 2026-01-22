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
    "url": `https://listings.brightone.ca/${listing.id}`,
    "image": listing.images.map(img => img.src),
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
      // In a real app, you'd have actual coordinates
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
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": listing.squareFootage,
      "unitCode": "SQF"
    },
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
