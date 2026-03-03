import Post from '../models/postModel.js';
import User from '../models/userModel.js';

// Generate HTML with meta tags for social media crawlers
export const getPostMeta = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Fetch post data
    const post = await Post.findOne({ slug });
    
    if (!post) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Post Not Found | TechKnows</title>
          <meta http-equiv="refresh" content="0;url=https://sudipsharma.com.np/404">
        </head>
        <body>
          <script>window.location.href = 'https://sudipsharma.com.np/404';</script>
        </body>
        </html>
      `);
    }

    // Fetch author data
    let author = { username: 'Sudip Sharma', photoURL: '' };
    try {
      const authorData = await User.findOne({ email: post.authorEmail });
      if (authorData) {
        author = {
          username: authorData.username || 'Sudip Sharma',
          photoURL: authorData.photoURL || ''
        };
      }
    } catch (err) {
      console.error('Error fetching author:', err);
    }

    // Prepare meta data
    const siteUrl = 'https://sudipsharma.com.np';
    const postUrl = `${siteUrl}/post/${post.slug}`;
    const title = post.title || 'TechKnows Blog Post';
    const description = post.description || post.subtitle || post.content?.replace(/<[^>]+>/g, '').substring(0, 160) || 'Read this amazing article on TechKnows';
    const image = post.image || `${siteUrl}/images/logo.png`;
    const keywords = Array.isArray(post.tags) ? post.tags.join(', ') : (post.category || 'technology, programming');
    const publishedTime = post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString();
    const modifiedTime = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishedTime;
    const category = Array.isArray(post.category) ? post.category[0] : (post.category || 'Technology');

    // Generate HTML with meta tags
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${escapeHtml(title)} | TechKnows</title>
  <meta name="title" content="${escapeHtml(title)}">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="keywords" content="${escapeHtml(keywords)}">
  <meta name="author" content="${escapeHtml(author.username)}">
  <meta name="theme-color" content="#3B82F6">
  <link rel="canonical" href="${postUrl}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${postUrl}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(title)}">
  <meta property="og:site_name" content="TechKnows">
  <meta property="og:locale" content="en_US">
  <meta property="article:published_time" content="${publishedTime}">
  <meta property="article:modified_time" content="${modifiedTime}">
  <meta property="article:author" content="${escapeHtml(author.username)}">
  <meta property="article:section" content="${escapeHtml(category)}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${postUrl}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${escapeHtml(title)}">
  <meta name="twitter:creator" content="@sudipsharma">
  <meta name="twitter:site" content="@techknows">
  
  <!-- WhatsApp / LinkedIn -->
  <meta property="og:see_also" content="${postUrl}">
  
  <!-- Pinterest -->
  <meta name="pinterest:description" content="${escapeHtml(description)}">
  <meta property="pinterest:media" content="${image}">
  
  <!-- Structured Data for Rich Snippets -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${escapeHtml(title)}",
    "description": "${escapeHtml(description)}",
    "image": {
      "@type": "ImageObject",
      "url": "${image}",
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Person",
      "name": "${escapeHtml(author.username)}",
      "url": "${siteUrl}",
      "image": "${author.photoURL || siteUrl + '/images/author.png'}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TechKnows",
      "logo": {
        "@type": "ImageObject",
        "url": "${siteUrl}/images/logo.png",
        "width": 200,
        "height": 60
      }
    },
    "datePublished": "${publishedTime}",
    "dateModified": "${modifiedTime}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${postUrl}"
    },
    "keywords": "${escapeHtml(keywords)}",
    "articleSection": "${escapeHtml(category)}",
    "inLanguage": "en-US"
  }
  </script>
  
  <!-- Redirect to actual page after meta tags are read -->
  <meta http-equiv="refresh" content="0;url=${postUrl}">
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .loader {
      text-align: center;
    }
    .spinner {
      border: 4px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top: 4px solid white;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    h1 {
      font-size: 24px;
      margin: 0 0 10px 0;
    }
    p {
      opacity: 0.9;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <h1>Loading Article...</h1>
    <p>Redirecting you to ${escapeHtml(title)}</p>
  </div>
  
  <script>
    // Fallback redirect in case meta refresh doesn't work
    setTimeout(function() {
      window.location.href = '${postUrl}';
    }, 100);
  </script>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
    
  } catch (error) {
    console.error('Error generating meta tags:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error | TechKnows</title>
        <meta http-equiv="refresh" content="0;url=https://sudipsharma.com.np">
      </head>
      <body>
        <script>window.location.href = 'https://sudipsharma.com.np';</script>
      </body>
      </html>
    `);
  }
};

// Helper function to escape HTML special characters
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}
