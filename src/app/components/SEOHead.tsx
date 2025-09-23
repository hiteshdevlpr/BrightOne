import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export default function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = '/meta-header.png',
  ogType = 'website',
  noindex = false,
  nofollow = false,
}: SEOHeadProps) {
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ');

  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta name="robots" content={robotsContent} />
      
      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={`https://brightone.ca${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="BrightOne Inc" />
      <meta property="og:locale" content="en_CA" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={`https://brightone.ca${ogImage}`} />
      
      {/* Additional SEO meta tags */}
      <meta name="author" content="BrightOne Inc" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Geo tags for local SEO */}
      <meta name="geo.region" content="CA-ON" />
      <meta name="geo.placename" content="Greater Toronto Area" />
      <meta name="geo.position" content="43.6532;-79.3832" />
      <meta name="ICBM" content="43.6532, -79.3832" />
      
      {/* Business information */}
      <meta name="business:contact_data:street_address" content="Greater Toronto Area" />
      <meta name="business:contact_data:locality" content="Toronto" />
      <meta name="business:contact_data:region" content="Ontario" />
      <meta name="business:contact_data:postal_code" content="M5H" />
      <meta name="business:contact_data:country_name" content="Canada" />
    </Head>
  );
}
