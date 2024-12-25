import { useEffect } from 'react';

// The SEO component in JavaScript without the interface
export function SEO({ title, description, keywords, author, image, type = 'article', url }) {
  useEffect(() => {
    updateMetaTags({ title, description, keywords, author, image, type, url });
  }, [title, description, keywords, author, image, type, url]);

  return null;
}

// Helper function to update meta tags (this can be put in a separate file like utils/seo.js)
export function updateMetaTags({ title, description, keywords, author, image, type, url }) {
  // Update the document's title
  document.title = title;

  // General Meta Tags
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', description);
  }

  const keywordsMeta = document.querySelector('meta[name="keywords"]');
  if (keywordsMeta) {
    keywordsMeta.setAttribute('content', keywords.join(', '));
  }

  // Open Graph Tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', title);
  }

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', description);
  }

  if (image) {
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', image);
    }
  }

  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) {
    ogType.setAttribute('content', type);
  }

  if (url) {
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', url);
    }
  }

  // Twitter Card Tags
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', title);
  }

  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) {
    twitterDescription.setAttribute('content', description);
  }

  if (image) {
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', image);
    }
  }

  const twitterCard = document.querySelector('meta[name="twitter:card"]');
  if (twitterCard) {
    twitterCard.setAttribute('content', 'summary_large_image');
  }
}
