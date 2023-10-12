import { getTemplates } from "./utils.ts";

const templates = await getTemplates();

for (const template of templates) {
  try {
    await Deno.stat(`./${template}/.devcontainer`);
    continue;
  } catch (e) {
  }

  // confirm(`Converting ${template} to devcontainer, are you ready?`);
  await Deno.mkdir(`./${template}/.devcontainer`);
  await Deno.writeTextFile(
    `./${template}/.devcontainer/devcontainer.json`,
    JSON.stringify(
      {
        "name": "Devcontainer",
        "build": {
          "dockerfile": "./Dockerfile",
        },
      },
      undefined,
      2,
    ),
  );

  await Deno.rename(
    `./${template}/.codesandbox/Dockerfile`,
    `./${template}/.devcontainer/Dockerfile`,
  );
}
