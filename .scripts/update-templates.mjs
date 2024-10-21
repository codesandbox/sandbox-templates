#!/usr/bin/env zx

const VITE_TEMPLATES = {
  // Astro
  astro:
    "npm create astro@latest {key} -- --template minimal --typescript strict --no-install --no-git --skip-houston",
  "astro-starlight":
    "npm create astro@latest {key} -- --template starlight --typescript strict --no-install --no-git --skip-houston",
  "astro-tailwind":
    "npm create astro@latest {key} -- --template with-tailwindcss --typescript strict --no-install --no-git --skip-houston",

  // Vite
  "qwik-vite": "npm create vite@latest {key} -- --template qwik-ts",
  "react-vite-ts": "npm create vite@latest {key} -- --template react-ts",
  "solid-vite": "npm create vite@latest {key} -- --template solid-ts",
  "vite-ts": "npm create vite@latest {key} -- --template vanilla-ts",
  "vue-vite": "npm create vite@latest {key} -- --template vue-ts",

  // Next.js
  nextjs: `npx --yes create-next-app {key} --ts --eslint --tailwind --no-src-dir --app --import-alias "@/*" --use-pnpm`,
  "nextjs-app-router": `npx --yes create-next-app {key} --ts --eslint --no-tailwind --no-src-dir --app --import-alias "@/*" --use-pnpm`,

  // Nuxt.js
  nuxt: `npx --yes nuxi@latest init {key}`,

  // Nuxt.js on Edge + Drizzle
  "nuxt-todos-edge":
    "npx --yes degit https://github.com/Atinux/nuxt-todos-edge.git {key}",

  // Remix
  remix: `npx --yes create-remix@latest {key}`,

  // Rust + Axum
  "rust-axum": `npx --yes degit https://github.com/tokio-rs/axum.git/examples/hello-world {key}`,

  "hono-next": `npm create hono@latest {key}`,

  "storybook-react": `npx --yes degit chromaui/intro-storybook-react-template {key}`,

  rails: "gem install rails && rails new --database=postgresql {key}",

  nest: "npx --yes @nestjs/cli new {key}",

  "tanstack-start":
    "npx --yes degit https://github.com/tanstack/router/examples/react/start-basic {key}",
};

const templatesToUpdate = process.argv.slice(3);

for (const [key, value] of Object.entries(VITE_TEMPLATES)) {
  if (templatesToUpdate.length > 0 && !templatesToUpdate.includes(key)) {
    continue;
  }

  const maxSteps = 5;

  if (!fs.existsSync(key)) {
    echo(
      chalk.yellow(`[0/${maxSteps}] ${key}:`),
      chalk.green(`Creating folder`)
    );
    await $`mkdir ${key}`;
  }

  echo(
    chalk.yellow(`[1/${maxSteps}] ${key}:`),
    chalk.green(`Deleting folder content`)
  );
  await $`find ${key} -mindepth 1 -maxdepth 1 ! -wholename '${key}/.devcontainer*' ! -wholename '${key}/.codesandbox*' -exec rm -r {} +`;

  echo(chalk.yellow(`[2/${maxSteps}] ${key}:`), chalk.green(`Running command`));
  const command = value.replace("{key}", key + "/tmp");
  await $([command]);

  echo(chalk.yellow(`[2/${maxSteps}] ${key}:`), chalk.green(`Move files`));
  await $`find ${key}/tmp/ -mindepth 1 -maxdepth 1 -exec mv -t ${key}/ {} +`;
  // await $`mv ${key}/tmp/.gitignore ${key} `;
  await $`rm -rf ${key}/tmp`;

  const isJavaScript = fs.existsSync(`${key}/package.json`);
  if (isJavaScript) {
    echo(
      chalk.yellow(`[3/${maxSteps}] ${key}:`),
      chalk.green(`Installing dependencies`)
    );
    cd(key);
    await $`pnpm i`;

    echo(chalk.yellow(`[4/${maxSteps}] ${key}:`), chalk.green(`Prettier`));
    await $`prettier . --write`;

    echo(
      chalk.yellow(`[5/${maxSteps}] ${key}:`),
      chalk.green(`Rename package.json#name`)
    );
    await $`npm pkg set 'name'=${key}`;
  }

  const isRust = fs.existsSync(`${key}/Cargo.toml`);
  if (isRust) {
    cd(key);
    // Replace some local dependencies with crates.io
    if (key === "rust-axum") {
      await $`cargo remove axum`;
      await $`cargo add axum`;
    }
  }

  cd("..");
}
