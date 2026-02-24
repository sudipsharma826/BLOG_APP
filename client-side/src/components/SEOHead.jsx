import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title = 'TechKnows | Technology & Programming Blog | Sudip Sharma',
  description = 'TechKnows is your go-to platform for in-depth tech articles, programming guides, tutorials, and creative ideas. Learn, code, and grow with the community.',
  keywords = 'TechKnows, technology blog, programming, coding, tutorials, software development, tech articles, guides, JavaScript, Python, web development, Sudip Sharma',
  author = 'Sudip Sharma',
  image = '/images/logo.png',
  url = 'https://sudipsharma.com.np',
  type = 'website',
  twitterCard = 'summary_large_image',
  canonical,
  structuredData,
  noindex = false
}) => {
  const fullUrl = url.startsWith('http') ? url : `https://sudipsharma.com.np${url}`;
  const fullImage = image.startsWith('http') ? image : `https://sudipsharma.com.np${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="TechKnows" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@sudipsharma" />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#3B82F6" />
      <meta httpEquiv="content-language" content="en" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
