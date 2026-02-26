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
  tags,
  authorImage,
  authorUrl
}) {
  const siteUrl = 'https://sudipsharma.com.np';
  const siteName = 'TechKnows';
  const fullUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/images/logo.png`;
  
  // Create comprehensive structured data
  const structuredData = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": {
      "@type": "ImageObject",
      "url": fullImage,
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Person",
      "name": author,
      "url": authorUrl || siteUrl,
      "image": authorImage || `${siteUrl}/images/author.png`
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/logo.png`,
        "width": 200,
        "height": 60
      }
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "keywords": Array.isArray(keywords) ? keywords.join(', ') : keywords,
    "articleSection": section || 'Technology',
    "inLanguage": "en-US"
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": siteUrl,
    "description": description,
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/logo.png`
      }
    }
  };

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
      <meta name="theme-color" content="#3B82F6" />
      <meta httpEquiv="content-language" content="en" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:secure_url" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {author && <meta property="article:author" content={author} />}
      {tags && Array.isArray(tags) && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:creator" content="@sudipsharma" />
      <meta name="twitter:site" content="@techknows" />
      <meta name="twitter:label1" content="Written by" />
      <meta name="twitter:data1" content={author} />
      {publishedTime && <meta name="twitter:label2" content="Published on" />}
      {publishedTime && <meta name="twitter:data2" content={new Date(publishedTime).toLocaleDateString()} />}
      
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
