#!/usr/bin/env zx

const VITE_TEMPLATES = {
  "vue-vite": "npm create vite@latest ${key} --template vue-ts",
  // "vite-ts": "vanilla-ts",
};

for (const [key, value] of Object.entries(VITE_TEMPLATES)) {
  const maxSteps = 4;

  console.log(`[1/${maxSteps}] Deleting folder content`);
  $`find ${key} -mindepth 1 -maxdepth 1 ! -wholename '${key}/.devcontainer*' ! -wholename '${key}/.codesandbox*' -exec rm -r {} +`;

  console.log(`[2/${maxSteps}] Running command ${value}...`);
  await $`${value.replace("${key}", key)}`;
}
