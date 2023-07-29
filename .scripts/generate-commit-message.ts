import * as path from "https://deno.land/std@0.196.0/path/mod.ts";

const targetBranch = Deno.args[0];
const currentBranch = Deno.args[1];

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
    .map((line) => line.substring(0, line.lastIndexOf("/"))),
);
console.log({ directories });

let MESSAGE_TEMPLATE =
  `This is a helpful bot that generates a list of changed templates!

## New Sandboxes

`;

const examples: string[] = [];
for (let dir of directories) {
  if (
    dir.startsWith(".") || dir.trim().length === 0
  ) {
    continue;
  }

  const exampleName = dir.split("/")[0];
  if (!examples.includes(exampleName)) {
    examples.push(exampleName);
  }
}

examples.forEach((example) => {
  const url = generateUrl(example, currentBranch);
  MESSAGE_TEMPLATE += `- [${example}](${url})\n`;
});

function generateUrl(exampleName: string, branch: string) {
  return `https://codesandbox.io/s/github/codesandbox/sandbox-templates/tree/${branch}/${exampleName}`;
}

console.log(MESSAGE_TEMPLATE);
Deno.writeFileSync(
  path.join(
    path.dirname(path.fromFileUrl(Deno.mainModule)),
    "commit-message.txt",
  ),
  new TextEncoder().encode(MESSAGE_TEMPLATE),
);
