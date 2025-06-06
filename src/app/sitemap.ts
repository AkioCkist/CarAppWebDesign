// src/app/sitemap.ts (place this in your app directory root, not in a sitemap folder)

import { MetadataRoute } from 'next';

// Function to get car listings
async function getCarListings() {
  try {
    // Replace this with your actual data fetching logic
    // Example implementations:
    
    // Option 1: API call
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars`, {
    //   next: { revalidate: 3600 } // Cache for 1 hour
    // });
    // return await response.json();
    
    // Option 2: Database query
    // return await db.cars.findMany();
    
    // Option 3: Static data (for testing)
    return [
      { id: 1, updatedAt: new Date() },
      { id: 2, updatedAt: new Date() },
      // Add more as needed
    ];
  } catch (error) {
    console.error("Error fetching car listings:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://car-app-web-design-git-main-akio-ckists-projects.vercel.app';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about_us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/booking_car`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/finding_car`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/signin_registration`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/test`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/user_dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Dynamic pages (car listings)
  const carListings = await getCarListings();
  const carPages: MetadataRoute.Sitemap = carListings.map((car: any) => ({
    url: `${baseUrl}/car/${car.id}`,
    lastModified: car.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...carPages];
}