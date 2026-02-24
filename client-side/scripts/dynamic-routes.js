/**
 * Dynamic Route Generator for Sitemap
 * 
 * This file can be extended to fetch dynamic routes from your API
 * and add them to the sitemap during build time.
 */

import axios from 'axios';

/**
 * Fetch all blog posts and generate routes
 * @returns {Promise<Array>} Array of route objects
 */
export async function generateBlogPostRoutes() {
  try {
    const API_URL = process.env.VITE_BACKEND_APP_BASE_URL || 'http://localhost:5000/api';
    
    // Fetch all published posts
    const response = await axios.get(`${API_URL}/post/getPosts`, {
      params: {
        limit: 1000, // Adjust based on your needs
        setDirection: -1
      }
    });

    if (response.data && response.data.posts) {
      return response.data.posts.map(post => ({
        path: `/post/${post.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: post.updatedAt || post.createdAt
      }));
    }

    return [];
  } catch (error) {
    console.warn('Could not fetch blog posts for sitemap:', error.message);
    return [];
  }
}

/**
 * Fetch all categories and generate routes
 * @returns {Promise<Array>} Array of route objects
 */
export async function generateCategoryRoutes() {
  try {
    const API_URL = process.env.VITE_BACKEND_APP_BASE_URL || 'http://localhost:5000/api';
    
    const response = await axios.get(`${API_URL}/post/getCategories`);

    if (response.data && response.data.categories) {
      return response.data.categories.map(category => ({
        path: `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`,
        priority: '0.7',
        changefreq: 'weekly'
      }));
    }

    return [];
  } catch (error) {
    console.warn('Could not fetch categories for sitemap:', error.message);
    return [];
  }
}

/**
 * Generate all dynamic routes
 * @returns {Promise<Array>} Combined array of all dynamic routes
 */
export async function generateDynamicRoutes() {
  const [blogRoutes, categoryRoutes] = await Promise.all([
    generateBlogPostRoutes(),
    generateCategoryRoutes()
  ]);

  return [...blogRoutes, ...categoryRoutes];
}

/**
 * Usage in generate-sitemap.js:
 * 
 * import { generateDynamicRoutes } from './dynamic-routes.js';
 * 
 * const dynamicRoutes = await generateDynamicRoutes();
 * generateSitemap(dynamicRoutes);
 */
