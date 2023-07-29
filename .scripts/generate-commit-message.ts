const targetBranch = Deno.args[0];
const currentBranch = Deno.args[1];

const cmd = new Deno.Command("git", {
  args: [
    "diff",
    "--dirstat=files",
    "--no-commit-id",
    "--name-only",
    "--diff-filter=d",
    `${targetBranch}..${currentBranch}`,
  ],
});

const output = (await cmd.output()).stdout;

const directories = new Set(
  new TextDecoder()
    .decode(output)
    .split("\n")
    .map((line) => line.substring(0, line.lastIndexOf("/"))),
);

for (let dir of directories) {
  if (dir.startsWith(".") || dir.split("/").length > 2) {
    continue;
  }
  console.log(dir);
}
