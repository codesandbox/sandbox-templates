import "./style.css";
import { Nodebox } from "@codesandbox/nodebox";

const emulator = new Nodebox({
  iframe: document.getElementById("nodebox-runtime-iframe"),
});

await emulator.connect();

await emulator.fs.init({
  "package.json": JSON.stringify({
    name: "my-app",
  }),
  "main.js": `import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('Hello from Nodebox')
});

server.listen(3000, () => {
  console.log('Server is ready!');
})`,
});

const shell = emulator.shell.create();
const serverCommand = await shell.runCommand("node", ["main.js"]);

const { url } = await emulator.preview.getByShellId(serverCommand.id);
// Preview Iframe to see output of code
const previewIframe = document.getElementById("nodebox-preview-iframe");
previewIframe.setAttribute("src", url);
