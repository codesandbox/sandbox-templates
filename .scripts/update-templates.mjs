#!/usr/bin/env zx

const VITE_TEMPLATES = {
  "astro":
    "npm create astro@latest {key} -- --template minimal --typescript strict --no-install --no-git --skip-houston",
  "astro-tailwind":
    "npm create astro@latest {key} -- --template with-tailwindcss --typescript strict --no-install --no-git --skip-houston",
  "qwik-vite": "npm create vite@latest {key} -- --template qwik-ts",
  "react-vite-ts": "npm create vite@latest {key} -- --template react-ts",
  "solid-vite": "npm create vite@latest {key} -- --template solid-ts",
  "vite-ts": "npm create vite@latest {key} -- --template vanilla-ts",
  "vue-vite": "npm create vite@latest {key} -- --template vue-ts",
};

for (const [key, value] of Object.entries(VITE_TEMPLATES)) {
  const maxSteps = 5;

  echo(
    chalk.yellow(`[1/${maxSteps}] ${key}:`),
    chalk.green(`Deleting folder content`),
  );
  await $`find ${key} -mindepth 1 -maxdepth 1 ! -wholename '${key}/.devcontainer*' ! -wholename '${key}/.codesandbox*' -exec rm -r {} +`;

  echo(
    chalk.yellow(`[2/${maxSteps}] ${key}:`),
    chalk.green(`Running command`),
  );
  const command = value.replace("{key}", key + "/tmp");
  await $([command]);

  echo(
    chalk.yellow(`[2/${maxSteps}] ${key}:`),
    chalk.green(`Move files`),
  );
  await $`find ${key}/tmp/ -mindepth 1 -maxdepth 1 -exec mv -t ${key}/ {} +`;
  // await $`mv ${key}/tmp/.gitignore ${key} `;
  await $`rm -rf ${key}/tmp`;

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
