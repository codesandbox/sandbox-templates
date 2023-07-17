console.log("I'm running Bun!");

export default {
  port: 3000,
  fetch(request: Request) {
    console.log("Incoming", request);
    return new Response("Hello World from CodeSandbox");
  },
};
