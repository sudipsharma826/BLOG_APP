import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { execSync } from 'child_process'

// Plugin to generate sitemap and robots.txt
function sitemapPlugin() {
  return {
    name: 'sitemap-generator',
    closeBundle() {
      try {
        console.log('Generating sitemap and robots.txt...');
        execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });
      } catch (error) {
        console.error('Error generating sitemap:', error);
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemapPlugin()
  ],
  server: {
    host: true,
    port: 3002,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'ui-vendor': ['flowbite-react', 'framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
