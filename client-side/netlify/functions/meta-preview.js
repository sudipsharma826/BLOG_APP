exports.handler = async (event, context) => {
  // Check if the request is from a social media crawler
  const userAgent = event.headers['user-agent'] || '';
  const isCrawler = /facebookexternalhit|facebookcatalog|Facebot|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Pinterest|Discordbot|SkypeUriPreview/i.test(userAgent);
  
  if (!isCrawler) {
    // Not a crawler, serve normal SPA
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta http-equiv="refresh" content="0;url=/">
        </head>
        <body>
          <script>window.location.href = '/';</script>
        </body>
        </html>
      `,
    };
  }

  // Extract slug from path
  const path = event.path;
  const match = path.match(/\/post\/([^\/]+)/);
  
  if (!match) {
    return {
      statusCode: 404,
      body: 'Not Found',
    };
  }

  const slug = match[1];
  const backendUrl = process.env.VITE_BACKEND_APP_BASE_URL || 'https://api.sudipsharma.com.np';

  try {
    // Fetch post data from backend
    const response = await fetch(`${backendUrl}/post/getPost/${slug}`);
    
    if (!response.ok) {
      throw new Error('Post not found');
    }

    const data = await response.json();
    const post = data.post;

    // Fetch author data
    let author = { username: 'Sudip Sharma' };
    try {
      const authorResponse = await fetch(`${backendUrl}/user/getuser/${post.authorEmail}`);
      if (authorResponse.ok) {
        author = await authorResponse.json();
      }
    } catch (err) {
      console.error('Error fetching author:', err);
    }

    // Prepare meta data
    const siteUrl = 'https://sudipsharma.com.np';
    const postUrl = `${siteUrl}/post/${post.slug}`;
    const title = post.title || 'TechKnows Blog Post';
    const description = (post.description || post.subtitle || post.content?.replace(/<[^>]+>/g, '').substring(0, 160) || 'Read this amazing article on TechKnows').replace(/"/g, '&quot;');
    const image = post.image || `${siteUrl}/images/logo.png`;
    const authorName = (author.username || 'Sudip Sharma').replace(/"/g, '&quot;');

    // Generate HTML with meta tags
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${title} | TechKnows</title>
  <meta name="title" content="${title}">
  <meta name="description" content="${description}">
  <meta name="author" content="${authorName}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${postUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="TechKnows">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  
  <!-- WhatsApp -->
  <meta property="og:image:alt" content="${title}">
  
  <meta http-equiv="refresh" content="0;url=${postUrl}">
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <script>window.location.href = '${postUrl}';</script>
</body>
</html>
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600',
      },
      body: html,
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Error generating preview',
    };
  }
};
