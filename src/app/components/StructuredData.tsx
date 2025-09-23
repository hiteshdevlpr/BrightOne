import Script from 'next/script';

interface StructuredDataProps {
  type: 'organization' | 'service' | 'breadcrumb' | 'faq' | 'localBusiness';
  data: Record<string, unknown>;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "BrightOne Inc",
          "url": "https://brightone.ca",
          "logo": "https://brightone.ca/meta-header.png",
          "description": "Professional real estate photography, videography, 3D tours, and virtual staging services for real estate agents and property owners in Canada.",
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "Ontario",
            "addressCountry": "CA"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-416-419-9689",
            "contactType": "customer service",
            "email": "contact@brightone.ca",
            "availableLanguage": "English"
          },
          "sameAs": [
            "https://brightone.ca"
          ],
          "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": 43.6532,
              "longitude": -79.3832
            },
            "geoRadius": "50000"
          }
        };

      case 'service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Real Estate Photography Services",
          "description": "Professional real estate photography, virtual staging, 3D tours, and property marketing services",
          "provider": {
            "@type": "Organization",
            "name": "BrightOne Inc",
            "url": "https://brightone.ca"
          },
          "areaServed": {
            "@type": "Place",
            "name": "Greater Toronto Area, Ontario, Canada"
          },
          "serviceType": "Real Estate Photography",
          "offers": {
            "@type": "Offer",
            "description": "Professional real estate photography packages",
            "availability": "https://schema.org/InStock"
          }
        };

      case 'localBusiness':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "BrightOne Inc",
          "description": "Professional real estate photography and virtual staging services",
          "url": "https://brightone.ca",
          "telephone": "+1-416-419-9689",
          "email": "contact@brightone.ca",
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "Ontario",
            "addressCountry": "CA"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 43.6532,
            "longitude": -79.3832
          },
          "openingHours": "Mo-Sa 09:00-18:00",
          "priceRange": "$$",
          "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": 43.6532,
              "longitude": -79.3832
            },
            "geoRadius": "50000"
          }
        };

      default:
        return data;
    }
  };

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2),
      }}
    />
  );
}
