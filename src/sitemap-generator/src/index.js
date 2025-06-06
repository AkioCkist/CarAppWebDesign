// filepath: sitemap-generator/src/index.js
import { generateSitemap } from './sitemapGenerator';
import { fetchUrls } from './utils/urlFetcher';

const main = async () => {
  const urls = await fetchUrls();
  const sitemap = generateSitemap(urls);
  
  console.log(sitemap);
};

main().catch(error => {
  console.error('Error generating sitemap:', error);
});