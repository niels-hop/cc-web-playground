#!/usr/bin/env bun
/**
 * Simple Test Runner
 *
 * A basic test framework for running and organizing tests
 */

type TestResult = {
  name: string;
  passed: boolean;
  error?: Error;
  duration: number;
};

class TestRunner {
  private tests: Array<{ name: string; fn: () => Promise<void> | void }> = [];
  private results: TestResult[] = [];
  private beforeEachFn?: () => Promise<void> | void;
  private afterEachFn?: () => Promise<void> | void;

  test(name: string, fn: () => Promise<void> | void) {
    this.tests.push({ name, fn });
  }

  beforeEach(fn: () => Promise<void> | void) {
    this.beforeEachFn = fn;
  }

  afterEach(fn: () => Promise<void> | void) {
    this.afterEachFn = fn;
  }

  async run() {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🧪 Running ${this.tests.length} test(s)`);
    console.log(`${'='.repeat(70)}\n`);

    for (const test of this.tests) {
      const start = performance.now();
      let passed = true;
      let error: Error | undefined;

      try {
        if (this.beforeEachFn) {
          await this.beforeEachFn();
        }

        await test.fn();

        if (this.afterEachFn) {
          await this.afterEachFn();
        }

        console.log(`✅ ${test.name}`);
      } catch (e) {
        passed = false;
        error = e as Error;
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}`);
      }

      const duration = performance.now() - start;
      this.results.push({ name: test.name, passed, error, duration });
    }

    this.printSummary();
  }

  private printSummary() {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`\n${'='.repeat(70)}`);
    console.log(`📊 Test Summary`);
    console.log(`${'='.repeat(70)}`);
    console.log(`Total: ${this.results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Total time: ${totalDuration.toFixed(2)}ms`);
    console.log(`${'='.repeat(70)}\n`);

    if (failed > 0) {
      process.exit(1);
    }
  }
}

// Helper assertion functions
export function assert(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(
      message || `Expected ${expected} but got ${actual}`
    );
  }
}

export function assertNotEqual<T>(actual: T, expected: T, message?: string) {
  if (actual === expected) {
    throw new Error(
      message || `Expected values to be different but both were ${actual}`
    );
  }
}

export function assertContains(haystack: string, needle: string, message?: string) {
  if (!haystack.includes(needle)) {
    throw new Error(
      message || `Expected "${haystack}" to contain "${needle}"`
    );
  }
}

export function assertThrows(fn: () => void, message?: string) {
  try {
    fn();
    throw new Error(message || 'Expected function to throw but it did not');
  } catch (error) {
    // Success - function threw as expected
  }
}

// Example usage and demo tests
if (import.meta.main) {
  const runner = new TestRunner();

  // Example: Testing the localhost app
  const APP_URL = process.env.APP_URL || 'http://localhost:3000';

  runner.test('App is running and responding', async () => {
    const response = await fetch(APP_URL);
    assert(response.status === 200, 'App should return 200 status');
  });

  runner.test('Page has correct content type', async () => {
    const response = await fetch(APP_URL);
    const contentType = response.headers.get('content-type');
    assertContains(contentType || '', 'text/html', 'Should be HTML');
  });

  runner.test('Page has root div', async () => {
    const response = await fetch(APP_URL);
    const html = await response.text();
    assertContains(html, 'id="root"', 'Should have root div');
  });

  runner.test('Page has correct title', async () => {
    const response = await fetch(APP_URL);
    const html = await response.text();
    assertContains(html, '<title>Bun + React</title>', 'Should have correct title');
  });

  runner.test('CSS assets load', async () => {
    const response = await fetch(APP_URL);
    const html = await response.text();

    // Extract CSS href
    const match = html.match(/href="([^"]*\.css)"/);
    assert(match !== null, 'Should have CSS link');

    const cssPath = match![1];
    const cssUrl = new URL(cssPath, APP_URL).toString();
    const cssResponse = await fetch(cssUrl);

    assert(cssResponse.status === 200, 'CSS should load successfully');
  });

  runner.test('JavaScript assets load', async () => {
    const response = await fetch(APP_URL);
    const html = await response.text();

    // Extract JS src
    const match = html.match(/src="([^"]*\.js)"/);
    assert(match !== null, 'Should have JS script');

    const jsPath = match![1];
    const jsUrl = new URL(jsPath, APP_URL).toString();
    const jsResponse = await fetch(jsUrl);

    assert(jsResponse.status === 200, 'JS should load successfully');
  });

  runner.test('Response time is acceptable', async () => {
    const start = performance.now();
    await fetch(APP_URL);
    const duration = performance.now() - start;

    assert(duration < 1000, `Response time ${duration}ms should be under 1000ms`);
  });

  runner.test('Page is not showing build errors', async () => {
    const response = await fetch(APP_URL);
    const html = await response.text();

    assert(
      !html.includes('Build Failed'),
      'Page should not show build errors'
    );
  });

  // Run all tests
  runner.run();
}

export { TestRunner };
