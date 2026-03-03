#!/usr/bin/env node

/**
 * Test script to verify meta tags are properly configured
 * Run: node test-meta-tags.js
 */

const https = require('https');
const http = require('http');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function makeRequest(url, userAgent) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname,
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
      },
    };

    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

function checkMetaTags(html) {
  const checks = {
    'og:title': /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i,
    'og:description': /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i,
    'og:image': /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
    'og:url': /<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i,
    'twitter:card': /<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["']/i,
    'twitter:title': /<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i,
    'twitter:image': /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i,
  };

  const results = {};
  
  for (const [tag, regex] of Object.entries(checks)) {
    const match = html.match(regex);
    results[tag] = match ? match[1] : null;
  }

  return results;
}

async function testEndpoint(name, url, userAgent) {
  log(`\n${'='.repeat(80)}`, COLORS.cyan);
  log(`Testing: ${name}`, COLORS.cyan);
  log(`URL: ${url}`, COLORS.blue);
  log(`User-Agent: ${userAgent}`, COLORS.yellow);
  log('='.repeat(80), COLORS.cyan);

  try {
    const response = await makeRequest(url, userAgent);
    
    log(`\n✓ Status Code: ${response.statusCode}`, COLORS.green);
    log(`✓ Content-Type: ${response.headers['content-type']}`, COLORS.green);

    if (response.statusCode === 200) {
      const metaTags = checkMetaTags(response.body);
      
      log('\n📊 Meta Tags Found:', COLORS.cyan);
      let allPresent = true;
      
      for (const [tag, value] of Object.entries(metaTags)) {
        if (value) {
          log(`  ✓ ${tag}: ${value.substring(0, 60)}${value.length > 60 ? '...' : ''}`, COLORS.green);
        } else {
          log(`  ✗ ${tag}: NOT FOUND`, COLORS.red);
          allPresent = false;
        }
      }

      if (allPresent) {
        log('\n🎉 SUCCESS: All required meta tags are present!', COLORS.green);
      } else {
        log('\n⚠️  WARNING: Some meta tags are missing!', COLORS.yellow);
      }

      return true;
    } else {
      log(`\n✗ Unexpected status code: ${response.statusCode}`, COLORS.red);
      return false;
    }
  } catch (error) {
    log(`\n✗ Error: ${error.message}`, COLORS.red);
    return false;
  }
}

async function runTests() {
  log('\n' + '='.repeat(80), COLORS.cyan);
  log('🚀 META TAGS TESTING TOOL', COLORS.cyan);
  log('='.repeat(80) + '\n', COLORS.cyan);

  // Replace these with your actual URLs
  const BACKEND_URL = 'https://api.sudipsharma.com.np';
  const FRONTEND_URL = 'https://sudipsharma.com.np';
  
  // Replace with an actual post slug from your blog
  const TEST_SLUG = 'test-post'; // CHANGE THIS TO A REAL POST SLUG
  
  log('⚙️  Configuration:', COLORS.yellow);
  log(`   Backend URL: ${BACKEND_URL}`, COLORS.blue);
  log(`   Frontend URL: ${FRONTEND_URL}`, COLORS.blue);
  log(`   Test Slug: ${TEST_SLUG}`, COLORS.blue);
  log('\n💡 TIP: Update TEST_SLUG in this script with an actual post slug from your blog\n', COLORS.yellow);

  const tests = [
    {
      name: 'Backend Meta Endpoint',
      url: `${BACKEND_URL}/meta/post/${TEST_SLUG}`,
      userAgent: 'Mozilla/5.0 (compatible; facebookexternalhit/1.1)',
    },
    {
      name: 'Frontend with Facebook Crawler',
      url: `${FRONTEND_URL}/post/${TEST_SLUG}`,
      userAgent: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    },
    {
      name: 'Frontend with Twitter Crawler',
      url: `${FRONTEND_URL}/post/${TEST_SLUG}`,
      userAgent: 'Twitterbot/1.0',
    },
    {
      name: 'Frontend with WhatsApp Crawler',
      url: `${FRONTEND_URL}/post/${TEST_SLUG}`,
      userAgent: 'WhatsApp/2.0',
    },
  ];

  const results = [];
  
  for (const test of tests) {
    const success = await testEndpoint(test.name, test.url, test.userAgent);
    results.push({ name: test.name, success });
  }

  // Summary
  log('\n' + '='.repeat(80), COLORS.cyan);
  log('📊 SUMMARY', COLORS.cyan);
  log('='.repeat(80), COLORS.cyan);

  const passed = results.filter(r => r.success).length;
  const total = results.length;

  results.forEach(result => {
    const icon = result.success ? '✓' : '✗';
    const color = result.success ? COLORS.green : COLORS.red;
    log(`  ${icon} ${result.name}`, color);
  });

  log(`\n${passed}/${total} tests passed`, passed === total ? COLORS.green : COLORS.yellow);

  if (passed === total) {
    log('\n🎉 All tests passed! Your meta tags are properly configured.', COLORS.green);
    log('You can now test with:', COLORS.green);
    log('  - Facebook Debugger: https://developers.facebook.com/tools/debug/', COLORS.blue);
    log('  - Twitter Card Validator: https://cards-dev.twitter.com/validator', COLORS.blue);
    log('  - LinkedIn Inspector: https://www.linkedin.com/post-inspector/', COLORS.blue);
  } else {
    log('\n⚠️  Some tests failed. Please check:', COLORS.yellow);
    log('  1. Backend server is running', COLORS.yellow);
    log('  2. Post with TEST_SLUG exists', COLORS.yellow);
    log('  3. Netlify deployment is complete', COLORS.yellow);
    log('  4. DNS is properly configured', COLORS.yellow);
  }

  log('\n' + '='.repeat(80) + '\n', COLORS.cyan);
}

// Run tests
runTests().catch(error => {
  log(`\nFatal error: ${error.message}`, COLORS.red);
  process.exit(1);
});
