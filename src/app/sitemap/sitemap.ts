// src/app/sitemap/sitemap.tsx

import { generateSitemap } from "./generate-sitemap";
import { notFound } from "next/navigation";

export default async function Sitemap() {
  try {
    // Generate the sitemap XML
    const sitemap = await generateSitemap();

    // Return the sitemap as an XML response
    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error serving sitemap:", error);
    notFound();
  }
}