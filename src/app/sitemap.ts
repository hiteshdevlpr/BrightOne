import { MetadataRoute } from 'next'
import { getAllListings } from '@/lib/listing-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://brightone.ca'
  const listingsBaseUrl = 'https://listings.brightone.ca'
  
  // Get all listings
  const listings = await getAllListings()
  
  // Generate sitemap entries for listings
  const listingEntries: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${listingsBaseUrl}/${listing.id}`,
    lastModified: new Date(listing.lastUpdated),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...listingEntries,
  ]
}
