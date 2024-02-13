import * as path from "https://deno.land/std@0.196.0/path/mod.ts";

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

      // Start the VM backing the sandbox
      const editorResponse = await fetch(
        generateEditorUrl(example.name, currentBranch)
      );
      if (!editorResponse.ok) {
        throw new Error("Editor request failed: " + editorResponse.status);
      }

      const previewUrl = generateExamplePreviewUrl(sandboxId);
      console.log(
        "Generated " + example.name + ", now generating screenshot..."
      );
      screenshotPromises.push(
        waitForUrlToRespond(previewUrl, 120).then((succeeded) => {
          if (succeeded) {
            example.screenshotUrl = `https://codesandbox.io/api/v1/sandboxes/${sandboxId}/screenshot.png`;

            // Prefetch the screenshot url, so it's generated when the user accesses
            // the issue screenshot
            fetch(example.screenshotUrl, { redirect: "follow" });

            example.status = Status.SUCCEEDED;
          } else {
            example.status = Status.SCREENSHOT_FAILED;
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
  const url = generateUrl(example.name, currentBranch);
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
function generateEditorUrl(exampleName: string, branch: string) {
  return `https://codesandbox.io/p/sandbox/github/codesandbox/sandbox-templates/tree/${branch}/${exampleName}`;
}
function generateApiUrl(exampleName: string, branch: string) {
  return `https://codesandbox.io/api/v1/sandboxes/github/codesandbox/sandbox-templates/tree/${branch}/${exampleName}`;
}
function generateExamplePreviewUrl(sandboxId: string) {
  return `https://${sandboxId}-51423.csb.app`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function waitForUrlToRespond(
  url: string,
  maxTimeSeconds: number
): Promise<boolean> {
  for (let i = 0; i < maxTimeSeconds; i++) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
      });

      if (response.ok && response.status >= 200 && response.status < 400) {
        return true;
      }
    } catch (_e) {
      // Ignore if the request fails
    }

    await sleep(1000);
  }

  return false;
}

console.log(MESSAGE_TEMPLATE);
Deno.writeFileSync(
  path.join(
    path.dirname(path.fromFileUrl(Deno.mainModule)),
    "commit-message.txt"
  ),
  new TextEncoder().encode(MESSAGE_TEMPLATE)
);
