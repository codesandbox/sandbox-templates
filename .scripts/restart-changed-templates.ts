import { isDirValidTemplate } from "./utils.ts";
import { restartTemplate } from "./pitcher-manager.ts";

const cmd = new Deno.Command("git", {
  args: [
    "diff",
    "--dirstat=files",
    "--no-commit-id",
    "--name-only",
    "--diff-filter=d",
    `HEAD~`,
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

const examples: Array<{
  name: string;
}> = [];
for (const dir of directories) {
  if (!isDirValidTemplate(dir)) {
    continue;
  }

  const exampleName = dir.split("/")[0];
  if (!examples.some((ex) => ex.name === exampleName)) {
    examples.push({
      name: exampleName,
    });
  }
}

for (const example of examples) {
  await restartTemplate(example.name);
}

if (examples.length === 0) {
  console.log("No templates changed!");
} else {
  console.log(`Restarted ${examples.length} templates`);
}
