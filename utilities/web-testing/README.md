# Web Testing Utilities

HTTP and browser automation tools for testing web applications.

## Files

**`http-testing.ts`** - HTTP-based testing (works immediately)
- Check page loads, structure, content
- Test API endpoints
- Measure response times
- Parse HTML with cheerio

**`browser-automation-example.ts`** - Browser automation examples
- Screenshots, JavaScript execution, form interactions
- Requires Chrome/Chromium installed
- Examples for Puppeteer, Playwright, Selenium

**`test-runner.ts`** - Test execution framework

## Quick Start

```bash
# Run HTTP tests
bun run utilities/web-testing/http-testing.ts http://localhost:3000
```

## HTTP Testing Capabilities

✅ Server-side rendered content
✅ Static page validation
✅ API endpoint testing
✅ Performance measurement
❌ Cannot execute JavaScript
❌ Cannot test dynamic interactions

## Browser Automation Capabilities

✅ Full JavaScript execution
✅ User interaction testing (clicks, forms)
✅ Screenshots and visual testing
✅ Network monitoring
❌ Requires browser installation

## Common Patterns

**Smoke test**:
```typescript
const response = await fetch('http://localhost:3000');
console.assert(response.status === 200);
```

**Structure validation**:
```typescript
import { testPageContent } from './http-testing';
await testPageContent('http://localhost:3000', ['#root', 'title']);
```

**Custom parsing**:
```typescript
import { fetchAndParseHTML } from './http-testing';
const { $ } = await fetchAndParseHTML('http://localhost:3000');
const title = $('h1').text();
```

## Libraries Installed

- `cheerio` - HTML parsing
- `puppeteer-core` - Headless Chrome
- `playwright` - Multi-browser automation
- `selenium-webdriver` - Browser automation

## Tips

- Start with HTTP tests for speed
- Use browser automation only when needed
- Focus on critical user paths
- Track performance over time
