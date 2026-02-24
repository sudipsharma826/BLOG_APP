import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://sudipsharma.com.np';

/**
 * To include dynamic routes (blog posts, categories), uncomment below:
 * 
 * import { generateDynamicRoutes } from './dynamic-routes.js';
 * 
 * Then in the main execution:
 * const dynamicRoutes = await generateDynamicRoutes();
 * generateSitemap(dynamicRoutes);
 * 
 * Note: This requires your backend API to be accessible during build time
 */

// Static routes
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/categories', priority: '0.9', changefreq: 'weekly' },
  { path: '/posts', priority: '0.9', changefreq: 'daily' },
  { path: '/search', priority: '0.6', changefreq: 'monthly' },
  { path: '/terms', priority: '0.5', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
];

function generateSitemap(dynamicRoutes = []) {
  const date = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${[...staticRoutes, ...dynamicRoutes]
    .map(
      (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${route.changefreq || 'weekly'}</changefreq>
    <priority>${route.priority || '0.7'}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log('✅ Sitemap generated successfully!');
}

// Generate robots.txt
function generateRobotsTxt() {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /dashboard/*
Disallow: /create-post
Disallow: /updatepost/*
Disallow: /signin
Disallow: /signup

Sitemap: ${BASE_URL}/sitemap.xml
`;

  const publicDir = path.join(__dirname, '..', 'public');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('✅ robots.txt generated successfully!');
}

// Run generators
generateSitemap();
generateRobotsTxt();

export { generateSitemap, generateRobotsTxt };
