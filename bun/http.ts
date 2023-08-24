console.log("I'm running Bun!");

export default {
  port: 3000,
  fetch(request: Request) {
    console.log(`[${request.method}] ${request.url}`);
    return new Response("Hello World from CodeSandbox");
  },
};
