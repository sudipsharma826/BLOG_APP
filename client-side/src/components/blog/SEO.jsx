import { Helmet } from 'react-helmet-async';

// Enhanced SEO component using react-helmet-async for better pre-rendering support
export function SEO({ 
  title, 
  description, 
  keywords, 
  author = 'Sudip Sharma', 
  image, 
  type = 'article', 
  url,
  publishedTime,
  modifiedTime,
  section,
  tags
}) {
  const siteUrl = 'https://sudipsharma.com.np';
  const fullUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/images/logo.png`;
  
  // Create structured data for articles
  const structuredData = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": fullImage,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "TechKnows",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/logo.png`
      }
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    }
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && (
        <meta 
          name="keywords" 
          content={Array.isArray(keywords) ? keywords.join(', ') : keywords} 
        />
      )}
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="TechKnows" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {author && <meta property="article:author" content={author} />}
      {tags && Array.isArray(tags) && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@sudipsharma" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

// Legacy function for backward compatibility
export function updateMetaTags(params) {
  // This function is now deprecated, kept for backward compatibility
  console.warn('updateMetaTags is deprecated. Use the SEO component instead.');
}
