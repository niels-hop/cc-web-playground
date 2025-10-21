# Web Testing Guide

This directory contains examples and working tests for web applications. Here's what you can do with different testing approaches:

## 🚀 Quick Start

Run the HTTP-based tests (works immediately):
```bash
bun run tests/http-testing.ts http://localhost:3000
```

## 📁 Files

### 1. `http-testing.ts` ✅ (Working)
HTTP-based testing using fetch and cheerio for HTML parsing.

**What it can do:**
- ✅ Check if pages load successfully
- ✅ Verify page structure (meta tags, titles, scripts)
- ✅ Extract and validate content
- ✅ Test asset loading (CSS, JS, images)
- ✅ Measure response times
- ✅ Test API endpoints
- ✅ Parse and analyze HTML structure

**Limitations:**
- ❌ Cannot execute JavaScript
- ❌ Cannot interact with dynamic content
- ❌ Cannot take screenshots
- ❌ Cannot test user interactions (clicks, form fills)

### 2. `browser-automation-example.ts` 📚 (Examples)
Comprehensive examples of what browser automation can do with Puppeteer/Playwright/Selenium.

**What it can do (when browser is available):**
- ✅ Take screenshots (full page, specific viewports)
- ✅ Execute JavaScript in browser context
- ✅ Interact with forms (type, click, submit)
- ✅ Wait for dynamic content to load
- ✅ Monitor network requests
- ✅ Test responsive design at different screen sizes
- ✅ Generate PDFs from webpages
- ✅ Measure performance metrics
- ✅ Visual regression testing
- ✅ Access browser APIs (localStorage, cookies, etc.)

**Requirements:**
- Needs Chrome/Chromium browser installed
- Requires puppeteer-core/playwright/selenium-webdriver

## 🎯 Testing Approaches

### Approach 1: HTTP-Based Testing (Available Now)

**Best for:**
- Server-side rendered content
- Static pages
- API endpoints
- Basic structure validation
- Performance testing (response times)

**Example usage:**
```typescript
import { testPageLoads, testPageStructure } from './http-testing';

await testPageLoads('http://localhost:3000');
await testPageStructure('http://localhost:3000');
```

### Approach 2: Browser Automation (When Browser Available)

**Best for:**
- Single-page applications (React, Vue, Angular)
- Testing JavaScript functionality
- User interaction flows
- Visual testing
- Complex dynamic content

**Example usage:**
```typescript
import { takeScreenshot, fillForm } from './browser-automation-example';

await takeScreenshot('http://localhost:3000', 'screenshot.png');
await fillForm('http://localhost:3000/login');
```

### Approach 3: Hybrid Testing

Combine both approaches:
1. Use HTTP testing for initial page load validation
2. Use browser automation for testing dynamic behavior
3. Use HTTP testing for API calls
4. Use browser automation for visual verification

## 🧪 Common Testing Patterns

### Pattern 1: Smoke Test
Quick test to ensure the application is running:
```typescript
const response = await fetch('http://localhost:3000');
console.assert(response.status === 200, 'App should be running');
```

### Pattern 2: Structure Validation
Ensure required elements exist:
```typescript
import { testPageContent } from './http-testing';

await testPageContent('http://localhost:3000', [
  '#root',
  'meta[name="viewport"]',
  'title',
]);
```

### Pattern 3: Asset Loading Test
Verify all assets load correctly:
```typescript
import { testAssetsLoad } from './http-testing';

const results = await testAssetsLoad('http://localhost:3000');
console.log('All assets loaded:', results);
```

### Pattern 4: Performance Baseline
Measure and track response times:
```typescript
import { testResponseTime } from './http-testing';

const { avg, min, max } = await testResponseTime('http://localhost:3000', 10);
console.assert(avg < 100, 'Average response should be under 100ms');
```

## 🔧 Available Tools

Based on `check-tools` output, we have:

- ✅ **chromedriver** - ChromeDriver 141.0.7390.78
- ✅ **node** - v22.20.0
- ✅ **curl** - For HTTP requests
- ✅ **jq** - For JSON parsing

## 📦 Installed Testing Libraries

- ✅ `cheerio` - jQuery-like HTML parsing
- ✅ `node-fetch` - HTTP client
- ✅ `selenium-webdriver` - Browser automation (needs browser)
- ✅ `puppeteer-core` - Headless Chrome control (needs browser)
- ✅ `playwright` - Multi-browser automation (needs browser)

## 🎨 Example Test Suites

### Example 1: Full App Test
```bash
bun run tests/http-testing.ts http://localhost:3000
```

### Example 2: API Testing
```typescript
import { testAPIEndpoint } from './http-testing';

// Test GET endpoint
await testAPIEndpoint('http://localhost:3000/api/data');

// Test POST endpoint
await testAPIEndpoint('http://localhost:3000/api/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' }),
});
```

### Example 3: Custom Test
```typescript
import { fetchAndParseHTML } from './http-testing';

const { $, html } = await fetchAndParseHTML('http://localhost:3000');

// Check for specific content
const hasWelcomeMessage = $('h1').text().includes('Welcome');
console.log('Has welcome message:', hasWelcomeMessage);

// Extract data
const links = $('a')
  .map((_, el) => ({ text: $(el).text(), href: $(el).attr('href') }))
  .get();
console.log('Links:', links);
```

## 🚨 Troubleshooting

### Issue: Browser automation not working
**Solution:** Browser automation requires Chrome/Chromium to be installed. Use HTTP-based testing as an alternative.

### Issue: Network errors
**Solution:** Ensure the dev server is running on the expected port:
```bash
bun dev  # Should show "Server running at http://localhost:3000/"
```

### Issue: Timeout errors
**Solution:** Increase timeout in fetch requests:
```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);
await fetch(url, { signal: controller.signal });
```

## 📚 Further Reading

- [Puppeteer Documentation](https://pptr.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Selenium WebDriver Documentation](https://www.selenium.dev/documentation/)
- [Cheerio Documentation](https://cheerio.js.org/)

## 💡 Tips

1. **Start Simple**: Begin with HTTP-based tests before adding browser automation
2. **Test What Matters**: Focus on critical user paths and functionality
3. **Keep Tests Fast**: Use HTTP tests for structure, browser tests for interactions
4. **Automate Regression**: Add new tests when bugs are found
5. **Monitor Performance**: Track response times over time
