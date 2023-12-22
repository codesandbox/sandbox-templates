#!/usr/bin/env zx

const VITE_TEMPLATES = {
  "qwik-vite": "npm create vite@latest {key} -- --template qwik-ts",
  "react-vite-ts": "npm create vite@latest {key} -- --template react-ts",
  "solid-vite": "npm create vite@latest {key} -- --template solid-ts",
  "vite-ts": "npm create vite@latest {key} -- --template vanilla-ts",
  "vue-vite": "npm create vite@latest {key} -- --template vue-ts",
};

for (const [key, value] of Object.entries(VITE_TEMPLATES)) {
  const maxSteps = 4;

  echo(
    chalk.yellow(`[1/${maxSteps}] ${key}:`),
    chalk.green(`Deleting folder content`),
  );
  await $`find ${key} -mindepth 1 -maxdepth 1 ! -wholename '${key}/.devcontainer*' ! -wholename '${key}/.codesandbox*' -exec rm -r {} +`;

  echo(
    chalk.yellow(`[2/${maxSteps}] ${key}:`),
    chalk.green(`Running command`),
  );
  const command = value.replace("{key}", key);
  await $([command]);

  echo(
    chalk.yellow(`[3/${maxSteps}] ${key}:`),
    chalk.green(`Installing dependencies`),
  );
  cd(key);
  await $`pnpm i`;

  echo(
    chalk.yellow(`[4/${maxSteps}] ${key}:`),
    chalk.green(`Prettier`),
  );
  await $`prettier . --write`;

  cd("..");
}
