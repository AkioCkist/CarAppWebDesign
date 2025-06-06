import Sitemap from "./sitemap";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://your-domain.com"; // Change to your real domain

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}/</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${baseUrl}/about_us</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/booking_car</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/faq</loc>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
    <url>
      <loc>${baseUrl}/finding_car</loc>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
    <url>
      <loc>${baseUrl}/signin_registration</loc>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>
    <url>
      <loc>${baseUrl}/test</loc>
      <changefreq>monthly</changefreq>
      <priority>0.5</priority>
    </url>
    <url>
      <loc>${baseUrl}/user_dashboard</loc>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

export default Sitemap;