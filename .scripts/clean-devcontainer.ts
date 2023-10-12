import { getTemplates } from "./utils.ts";

const templates = await getTemplates();

for (const template of templates) {
  const dockerFileContents = new TextDecoder().decode(
    await Deno.readFile(
      `./${template}/.devcontainer/Dockerfile`,
    ),
  ).trim();
  const lines = dockerFileContents.split("\n");

  if (lines.length === 1) {
    const imageName = lines[0].split(" ")[1];

    if (
      confirm(
        "Doing it for template " + template + " with image " + imageName +
          ", ready?",
      )
    ) {
      await Deno.remove(`./${template}/.devcontainer/Dockerfile`);
      await Deno.writeTextFile(
        `./${template}/.devcontainer/devcontainer.json`,
        JSON.stringify(
          {
            "name": "Devcontainer",
            "image": imageName,
          },
          undefined,
          2,
        ),
      );
    }
  }
}
