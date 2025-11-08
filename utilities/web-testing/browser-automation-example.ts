/**
 * Browser Automation Testing Examples
 *
 * This file demonstrates what you CAN do with browser automation tools like:
 * - Puppeteer (headless Chrome)
 * - Playwright (Chrome, Firefox, Safari)
 * - Selenium WebDriver
 *
 * Note: Requires a browser binary to be installed (Chrome/Chromium/Firefox)
 */

import puppeteer from 'puppeteer-core';
// Alternative: import { chromium } from 'playwright';
// Alternative: import { Builder } from 'selenium-webdriver';

/**
 * Example 1: Take a screenshot of a webpage
 */
export async function takeScreenshot(url: string, outputPath: string) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser', // or google-chrome
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: outputPath, fullPage: true });
  await browser.close();

  console.log(`Screenshot saved to ${outputPath}`);
}

/**
 * Example 2: Extract text content from a page
 */
export async function extractPageContent(url: string) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(url);

  // Get page title
  const title = await page.title();

  // Extract all text content
  const bodyText = await page.evaluate(() => document.body.innerText);

  // Get specific elements
  const headings = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h1, h2, h3')).map(el => el.textContent)
  );

  await browser.close();

  return { title, bodyText, headings };
}

/**
 * Example 3: Interact with form elements
 */
export async function fillForm(url: string) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(url);

  // Fill input fields
  await page.type('#username', 'testuser');
  await page.type('#password', 'password123');

  // Click buttons
  await page.click('button[type="submit"]');

  // Wait for navigation
  await page.waitForNavigation();

  // Get the result
  const result = await page.evaluate(() => document.body.innerText);

  await browser.close();

  return result;
}

/**
 * Example 4: Test responsive design at different viewport sizes
 */
export async function testResponsiveDesign(url: string) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
  });

  const page = await browser.newPage();

  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    await page.setViewport(viewport);
    await page.goto(url);
    await page.screenshot({ path: `screenshot-${viewport.name}.png` });
    console.log(`Screenshot taken for ${viewport.name}`);
  }

  await browser.close();
}

/**
 * Example 5: Monitor network requests
 */
export async function monitorNetworkRequests(url: string) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
  });

  const page = await browser.newPage();

  const requests: any[] = [];
  const responses: any[] = [];

  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
    });
  });

  page.on('response', response => {
    responses.push({
      url: response.url(),
      status: response.status(),
      headers: response.headers(),
    });
  });

  await page.goto(url);
  await browser.close();

  return { requests, responses };
}

/**
 * Example 6: Execute JavaScript in the browser context
 */
export async function executeCustomJS(url: string) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(url);

  // Execute custom JavaScript
  const result = await page.evaluate(() => {
    // This runs in the browser context
    return {
      userAgent: navigator.userAgent,
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      cookies: document.cookie,
      localStorage: { ...localStorage },
    };
  });

  await browser.close();

  return result;
}

/**
 * Example 7: Wait for elements and dynamic content
 */
export async function waitForDynamicContent(url: string) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(url);

  // Wait for a specific selector
  await page.waitForSelector('.dynamic-content', { timeout: 5000 });

  // Wait for a function to return true
  await page.waitForFunction(() => {
    return document.querySelectorAll('.loaded-item').length >= 10;
  });

  const content = await page.evaluate(() =>
    document.querySelector('.dynamic-content')?.textContent
  );

  await browser.close();

  return content;
}

/**
 * Example 8: Generate PDF from webpage
 */
export async function generatePDF(url: string, outputPath: string) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
  });

  await browser.close();

  console.log(`PDF saved to ${outputPath}`);
}

/**
 * Example 9: Performance testing
 */
export async function measurePerformance(url: string) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle0' });

  const metrics = await page.evaluate(() => {
    const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
      loadComplete: perf.loadEventEnd - perf.loadEventStart,
      totalTime: perf.loadEventEnd - perf.fetchStart,
    };
  });

  await browser.close();

  return metrics;
}

/**
 * Example 10: Visual regression testing
 */
export async function compareScreenshots(url: string, baselinePath: string, currentPath: string) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto(url);
  await page.screenshot({ path: currentPath });
  await browser.close();

  // You would then use an image comparison library like pixelmatch
  // to compare baselinePath with currentPath
  console.log(`Screenshot saved to ${currentPath}`);
  console.log(`Compare with baseline: ${baselinePath}`);
}

// Usage examples (commented out since we don't have a browser installed)
/*
async function runExamples() {
  const testUrl = 'http://localhost:3000';

  await takeScreenshot(testUrl, 'screenshot.png');
  const content = await extractPageContent(testUrl);
  console.log('Page content:', content);

  await testResponsiveDesign(testUrl);
  const networkData = await monitorNetworkRequests(testUrl);
  console.log('Network requests:', networkData);

  const perf = await measurePerformance(testUrl);
  console.log('Performance metrics:', perf);
}

runExamples().catch(console.error);
*/
