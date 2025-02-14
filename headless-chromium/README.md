# Headless Chromium

This template starts a headless chromium browser, which you can connect to with Puppeteer/Playwright or any other tool that can control a browser.

For example, here's a snippet to show how you can connect to this using Playwright:

```js
const { chromium } = require("playwright");

// Replace with your sandbox id
const sandboxId = "zwyx95";
(async () => {
  // Get the debugger URL
  const debuggerUrl = await fetch(
    `https://${sandboxId}-9222.csb.app/json/version`,
    {
      headers: {
        "x-csb-host": "localhost:9222",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      // Chrome bases the debugger URL on the host header, so we have to change it back to the public
      // interface.
      return data.webSocketDebuggerUrl
        .replace("ws://", "wss://")
        .replace("localhost", `${sandboxId}-9222.csb.app`)
        .replace(":9222", "");
    });

  // Connect to the Chromium instance over CDP.
  // This URL corresponds to the remote debugging endpoint exposed by your Docker container.
  const browser = await chromium.connectOverCDP(debuggerUrl, {
    headers: {
      "x-csb-host": "localhost:9222",
    },
  });

  // Retrieve an existing browser context or create a new one.
  const contexts = browser.contexts();
  const context = contexts.length ? contexts[0] : await browser.newContext();

  // Open a new page and navigate to a URL.
  const page = await context.newPage();
  await page.goto("https://example.com");

  // Log the page title.
  console.log(await page.title());

  // Close the browser when done.
  await browser.close();
})();

```
