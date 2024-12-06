import * as path from "https://deno.land/std@0.196.0/path/mod.ts";
import { CodeSandbox } from "npm:@codesandbox/sdk@0.0.0-alpha.27";

// Hack to make Deno work. It does not want a different client type.
globalThis.Request = class R extends Request {
  constructor(args, arg2) {
    super(args, { ...arg2, client: undefined });
  }
};

const targetBranch = Deno.args[0];
const currentBranch = Deno.args[1];
const testSandbox = Deno.args[2] === "true";

const cmd = new Deno.Command("git", {
  args: [
    "diff",
    "--dirstat=files",
    "--no-commit-id",
    "--name-only",
    "--diff-filter=d",
    `origin/${targetBranch}..`,
  ],
});

const output = (await cmd.output()).stdout;

const directories = new Set(
  new TextDecoder()
    .decode(output)
    .split("\n")
    .map((line) => line.substring(0, line.lastIndexOf("/")))
);
console.log({ directories });

let MESSAGE_TEMPLATE = `This is a helpful bot that generates a list of changed templates!

## Updated Examples

`;

enum Status {
  IN_PROGRESS,
  FAILED,
  SCREENSHOT_FAILED,
  SUCCEEDED,
}

const examples: Array<{
  name: string;
  status: Status;
  id?: string;
  screenshotUrl?: string;
}> = [];
for (const dir of directories) {
  if (dir.startsWith(".") || dir.trim().length === 0) {
    continue;
  }

  const exampleName = dir.split("/")[0];
  if (!examples.some((ex) => ex.name === exampleName)) {
    examples.push({
      name: exampleName,
      status: Status.IN_PROGRESS,
    });
  }
}

const CSB_API_KEY = Deno.env.get("CSB_API_KEY");
if (!CSB_API_KEY) {
  throw new Error("CSB_API_KEY is not set");
}

const sdk = new CodeSandbox(CSB_API_KEY);
const screenshotPromises: Array<Promise<void>> = [];

if (testSandbox) {
  console.log("Testing examples...");
  for (const example of examples) {
    const apiUrl = generateApiUrl(example.name, currentBranch);
    try {
      // Generate sandbox
      const result = await fetch(apiUrl).then((x) => {
        if (!x.ok) {
          throw new Error("API request failed: " + x.status);
        }

        return x.json();
      });

      const sandboxId: string = result.data.id;

      console.log("Starting sandbox " + sandboxId);
      // Start the VM backing the sandbox
      const sandbox = await sdk.sandbox.create({ template: sandboxId });
      console.log("Started sandbox " + sandboxId);
      example.id = sandbox.id;

      const openedPorts = sandbox.ports
        .getOpenedPorts()
        .filter((port) => port.port !== 2222);

      let promise;
      if (openedPorts.length > 0) {
        promise = Promise.resolve(openedPorts[0]);
      } else {
        let resolve: () => void | undefined;
        promise = new Promise<void>((r) => {
          resolve = r;
        });

        const disposable = sandbox.ports.onDidPortOpen((ports) => {
          const port = ports.find((port) => port.port !== 2222);
          if (port && resolve) {
            resolve();
            disposable.dispose();
          }
        });
      }

      const portResponseWithTimeout = Promise.race([
        promise,
        new Promise((resolve) =>
          setTimeout(() => resolve(null), 120000)
        ) as Promise<null>,
      ]);

      console.log(
        "Generated " + example.name + ", now generating screenshot..."
      );
      screenshotPromises.push(
        portResponseWithTimeout.then((portInfo) => {
          if (portInfo) {
            console.log("Opened port, ", portInfo);
            example.screenshotUrl = `https://codesandbox.io/api/v1/sandboxes/${sandbox.id}/screenshot.png`;

            // Prefetch the screenshot url, so it's generated when the user accesses
            // the issue screenshot
            fetch(example.screenshotUrl, { redirect: "follow" }).then(() => {
              sandbox.shutdown();
            });

            example.status = Status.SUCCEEDED;
          } else {
            console.log("Timed out while generating screenshot");
            example.status = Status.SCREENSHOT_FAILED;

            sandbox.shutdown();
          }
        })
      );
    } catch (e) {
      console.error(e);
      example.status = Status.FAILED;
    }
  }
}

await Promise.all(screenshotPromises);

examples.forEach((example) => {
  const url = example.id
    ? `https://codesandbox.io/p/devbox/${example.id}`
    : generateUrl(example.name, currentBranch);
  MESSAGE_TEMPLATE += `<details>
  <summary><a href="${url}"><code>/${example.name}</code></a> ${getStatusEmoji(
    example.status
  )}</summary>

`;

  if (example.screenshotUrl) {
    MESSAGE_TEMPLATE += `![${example.name}](${example.screenshotUrl})
`;
  } else if (example.status === Status.SCREENSHOT_FAILED) {
    MESSAGE_TEMPLATE += "Screenshot generation failed\n";
  }

  MESSAGE_TEMPLATE += "</details>";

  MESSAGE_TEMPLATE += "\n";
});

if (examples.length === 0) {
  MESSAGE_TEMPLATE += "None!";
}

function getStatusEmoji(status: Status) {
  if (status === Status.IN_PROGRESS) {
    return "🚧";
  } else if (status === Status.SUCCEEDED) {
    return "✅";
  } else if (status === Status.SCREENSHOT_FAILED) {
    return "❓";
  } else {
    return "❌";
  }
}

function generateUrl(exampleName: string, branch: string) {
  return `https://codesandbox.io/s/github/codesandbox/sandbox-templates/tree/${branch}/${exampleName}`;
}
function generateApiUrl(exampleName: string, branch: string) {
  return `https://codesandbox.io/api/v1/sandboxes/github/codesandbox/sandbox-templates/tree/${branch}/${exampleName}`;
}

console.log(MESSAGE_TEMPLATE);
Deno.writeFileSync(
  path.join(
    path.dirname(path.fromFileUrl(Deno.mainModule)),
    "commit-message.txt"
  ),
  new TextEncoder().encode(MESSAGE_TEMPLATE)
);
