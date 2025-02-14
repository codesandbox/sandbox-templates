# Headless Chromium

This template starts a headless chromium browser, which you can connect to with Puppeteer/Playwright or any other tool that can control a browser.

For example, here's a snippet to show how you can connect to this using Playwright:

```js
const { chromium } = require('playwright');

(async () => {
  // Connect to the Chromium instance over CDP.
  // This URL corresponds to the remote debugging endpoint exposed by your Docker container.
  const browser = await chromium.connectOverCDP('https://$SANDBOX_ID-9222.csb.app');

  // Retrieve an existing browser context or create a new one.
  const contexts = browser.contexts();
  const context = contexts.length ? contexts[0] : await browser.newContext();

  // Open a new page and navigate to a URL.
  const page = await context.newPage();
  await page.goto('https://example.com');

  // Log the page title.
  console.log(await page.title());

  // Close the browser when done.
  await browser.close();
})();
```
