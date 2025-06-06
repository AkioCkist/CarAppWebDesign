// src/app/sitemap/generate-sitemap.ts

// Update the import path below to the correct relative path if "@/lib/car-listings" does not exist
import { getCarListings } from "../../../lib/car-listings"; // Adjust the path as needed

export async function generateSitemap(): Promise<string> {
  try {
    // Fetch dynamic car listings (replace with your actual API call)
    const carListings = await getCarListings();

    // Define the base URL of your website
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"; 

    // Generate sitemap entries for each car listing
    const sitemapEntries = carListings.map((car) => {
      return `
        <url>
          <loc>${baseUrl}/car/${car.id}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `;
    });

    // Construct the complete sitemap XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapEntries.join("\n")}
    </urlset>`;

    return sitemapXml;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    throw error;
  }
}