console.info(`I'm running Bun ${Bun.version}`);

Bun.serve({
  port: 3000,
  fetch(request) {
    console.info(`[${request.method}] ${request.url}`);

    return new Response(
      `Hello World from CodeSandbox running Bun ${Bun.version}`,
    );
  },
});
