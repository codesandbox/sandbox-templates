import * as yaml from "https://deno.land/std@0.196.0/yaml/mod.ts";
import * as path from "https://deno.land/std@0.196.0/path/mod.ts";

const supportedPackageManagers = [
  {
    type: "npm",
    possible: (examplePath: string) =>
      exists(path.join(examplePath, "package.json")),
  },
  {
    type: "cargo",
    possible: (examplePath: string) =>
      exists(path.join(examplePath, "Cargo.toml")),
  },
  {
    type: "gomod",
    possible: (examplePath: string) => exists(path.join(examplePath, "go.mod")),
  },
  {
    type: "pip",
    possible: (examplePath: string) =>
      exists(path.join(examplePath, "requirements.txt")),
  },
  {
    type: "mix",
    possible: (examplePath: string) =>
      exists(path.join(examplePath, "mix.exs")),
  },
  {
    type: "composer",
    possible: (examplePath: string) =>
      exists(path.join(examplePath, "composer.json")),
  },
];

const dependabot: {
  version: 2;
  updates: Array<{
    "package-ecosystem": string;
    directory: string;
    schedule: {
      interval: "daily" | "weekly" | "monthly";
    };
  }>;
} = {
  version: 2,
  updates: [],
};
for (const dirEntry of Deno.readDirSync("../")) {
  if (dirEntry.name.startsWith(".")) {
    continue;
  }

  await Promise.all(supportedPackageManagers.map(async (manager) => {
    const isPossible = await manager.possible(path.join("../", dirEntry.name));

    if (isPossible) {
      dependabot.updates.push({
        "package-ecosystem": manager.type,
        directory: `/${dirEntry.name}`,
        schedule: {
          interval: "daily",
        },
      });
    }
  }));
}

dependabot.updates.sort((a, b) => {
  if (a.directory > b.directory) {
    return 1;
  }
  if (a.directory < b.directory) {
    return -1;
  }
  return 0;
});

Deno.writeFileSync(
  path.join("../", ".github", "dependabot.yml"),
  new TextEncoder().encode(yaml.stringify(dependabot)),
);

async function exists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch (e) {
    return false;
  }
}
