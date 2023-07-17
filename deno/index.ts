import { Server } from "https://deno.land/std@0.140.0/http/server.ts";

const port = 8080;
const handler = (_request: Request) => {
  const body = `Hello from Deno on CodeSandbox`;

  return new Response(body, { status: 200 });
};

const server = new Server({ port, handler });

console.log("server listening on http://localhost:8080");

await server.listenAndServe();
