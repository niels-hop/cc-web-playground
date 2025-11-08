/**
 * HTTP-Based Testing
 *
 * This demonstrates testing approaches using HTTP requests and HTML parsing
 * when full browser automation is not available or needed.
 */

import * as cheerio from 'cheerio';

/**
 * Fetch and parse HTML from a URL
 */
export async function fetchAndParseHTML(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  return {
    $,
    html,
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
  };
}

/**
 * Test 1: Check if the page loads successfully
 */
export async function testPageLoads(url: string) {
  console.log(`\n🧪 Testing: Page loads successfully`);
  console.log(`URL: ${url}`);

  const response = await fetch(url);

  console.log(`✅ Status: ${response.status} ${response.statusText}`);
  console.log(`✅ Content-Type: ${response.headers.get('content-type')}`);

  if (response.status === 200) {
    console.log(`✅ Page loaded successfully`);
    return true;
  } else {
    console.log(`❌ Page failed to load`);
    return false;
  }
}

/**
 * Test 2: Extract and verify page structure
 */
export async function testPageStructure(url: string) {
  console.log(`\n🧪 Testing: Page structure`);

  const { $, html } = await fetchAndParseHTML(url);

  // Check for root element
  const rootDiv = $('#root');
  console.log(`✅ Root div exists: ${rootDiv.length > 0}`);

  // Check for meta tags
  const viewport = $('meta[name="viewport"]');
  console.log(`✅ Viewport meta tag: ${viewport.attr('content')}`);

  // Check for title
  const title = $('title').text();
  console.log(`✅ Page title: "${title}"`);

  // Check for scripts
  const scripts = $('script').length;
  console.log(`✅ Number of scripts: ${scripts}`);

  // Check for stylesheets
  const stylesheets = $('link[rel="stylesheet"]').length;
  console.log(`✅ Number of stylesheets: ${stylesheets}`);

  return {
    hasRoot: rootDiv.length > 0,
    title,
    scripts,
    stylesheets,
  };
}

/**
 * Test 3: Check for specific content or elements
 */
export async function testPageContent(url: string, selectors: string[]) {
  console.log(`\n🧪 Testing: Page content`);

  const { $ } = await fetchAndParseHTML(url);

  const results: Record<string, any> = {};

  for (const selector of selectors) {
    const elements = $(selector);
    results[selector] = {
      found: elements.length > 0,
      count: elements.length,
      text: elements.first().text(),
    };

    if (elements.length > 0) {
      console.log(`✅ Found "${selector}": ${elements.length} element(s)`);
    } else {
      console.log(`❌ Not found: "${selector}"`);
    }
  }

  return results;
}

/**
 * Test 4: Verify assets load correctly
 */
export async function testAssetsLoad(baseUrl: string) {
  console.log(`\n🧪 Testing: Assets load correctly`);

  const { $ } = await fetchAndParseHTML(baseUrl);

  // Extract all asset URLs
  const assets = {
    scripts: $('script[src]')
      .map((_, el) => $(el).attr('src'))
      .get(),
    stylesheets: $('link[rel="stylesheet"]')
      .map((_, el) => $(el).attr('href'))
      .get(),
    images: $('img[src]')
      .map((_, el) => $(el).attr('src'))
      .get(),
  };

  // Test each asset
  const results = {
    scripts: [] as any[],
    stylesheets: [] as any[],
    images: [] as any[],
  };

  for (const src of assets.scripts) {
    const assetUrl = new URL(src!, baseUrl).toString();
    try {
      const response = await fetch(assetUrl);
      results.scripts.push({
        url: src,
        status: response.status,
        ok: response.ok,
      });
      console.log(`✅ Script: ${src} (${response.status})`);
    } catch (error) {
      console.log(`❌ Script failed: ${src}`);
      results.scripts.push({ url: src, status: 'error', ok: false });
    }
  }

  for (const href of assets.stylesheets) {
    const assetUrl = new URL(href!, baseUrl).toString();
    try {
      const response = await fetch(assetUrl);
      results.stylesheets.push({
        url: href,
        status: response.status,
        ok: response.ok,
      });
      console.log(`✅ Stylesheet: ${href} (${response.status})`);
    } catch (error) {
      console.log(`❌ Stylesheet failed: ${href}`);
      results.stylesheets.push({ url: href, status: 'error', ok: false });
    }
  }

  return results;
}

/**
 * Test 5: Measure response time
 */
export async function testResponseTime(url: string, iterations = 5) {
  console.log(`\n🧪 Testing: Response time (${iterations} iterations)`);

  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fetch(url);
    const end = performance.now();
    const duration = end - start;
    times.push(duration);
    console.log(`  Iteration ${i + 1}: ${duration.toFixed(2)}ms`);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`✅ Average: ${avg.toFixed(2)}ms`);
  console.log(`✅ Min: ${min.toFixed(2)}ms`);
  console.log(`✅ Max: ${max.toFixed(2)}ms`);

  return { avg, min, max, times };
}

/**
 * Test 6: Check for console errors (by inspecting HTML for error messages)
 */
export async function testForErrors(url: string) {
  console.log(`\n🧪 Testing: Check for errors in HTML`);

  const { html, $ } = await fetchAndParseHTML(url);

  // Check for common error indicators
  const errors = [];

  if (html.includes('Build Failed')) {
    errors.push('Build failure detected in HTML');
    console.log(`❌ Build Failed`);
  }

  if (html.includes('error') || html.includes('Error')) {
    const errorText = $('body').text();
    if (errorText.toLowerCase().includes('error')) {
      console.log(`⚠️  Error text found in body`);
    }
  }

  if ($('noscript').text().includes('Build Failed')) {
    errors.push('Build error in noscript tag');
    console.log(`❌ Build error in noscript`);
  }

  if (errors.length === 0) {
    console.log(`✅ No errors detected`);
  }

  return errors;
}

/**
 * Test 7: API endpoint testing
 */
export async function testAPIEndpoint(url: string, options: RequestInit = {}) {
  console.log(`\n🧪 Testing: API endpoint`);
  console.log(`URL: ${url}`);
  console.log(`Method: ${options.method || 'GET'}`);

  const start = performance.now();
  const response = await fetch(url, options);
  const duration = performance.now() - start;

  console.log(`✅ Status: ${response.status} ${response.statusText}`);
  console.log(`✅ Response time: ${duration.toFixed(2)}ms`);

  const contentType = response.headers.get('content-type');
  let data;

  if (contentType?.includes('application/json')) {
    data = await response.json();
    console.log(`✅ JSON response:`, JSON.stringify(data, null, 2));
  } else {
    data = await response.text();
    console.log(`✅ Text response (first 200 chars):`, data.substring(0, 200));
  }

  return {
    status: response.status,
    ok: response.ok,
    headers: Object.fromEntries(response.headers.entries()),
    data,
    duration,
  };
}

/**
 * Run all tests
 */
export async function runAllTests(url: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Running HTTP-based tests for: ${url}`);
  console.log(`${'='.repeat(60)}`);

  try {
    await testPageLoads(url);
    await testPageStructure(url);
    await testPageContent(url, ['#root', 'title', 'script', 'link']);
    await testForErrors(url);
    await testAssetsLoad(url);
    await testResponseTime(url, 3);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ All tests completed`);
    console.log(`${'='.repeat(60)}\n`);
  } catch (error) {
    console.error(`\n❌ Test suite failed:`, error);
  }
}

// Run tests if executed directly
if (import.meta.main) {
  const testUrl = process.argv[2] || 'http://localhost:3000';
  runAllTests(testUrl);
}
