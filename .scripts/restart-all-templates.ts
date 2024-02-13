import { restartTemplate } from "./pitcher-manager.ts";
import { getTemplates } from "./utils.ts";

const template = Deno.args[0];

if (template) {
  console.log(`Restarting template: ${template}`);
  await restartTemplate(template);
} else {
  const templates = await getTemplates();

  let doneCount = 0;
  for (const template of templates) {
    console.log(
      `Restarting template: ${template} (${doneCount + 1}/${templates.size})`
    );
    await restartTemplate(template);
    doneCount++;
  }
}
