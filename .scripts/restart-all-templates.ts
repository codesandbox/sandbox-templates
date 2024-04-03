import { restartTemplate } from "./pitcher-manager.ts";
import { getTemplates } from "./utils.ts";
import { chunk } from "https://deno.land/std@0.221.0/collections/chunk.ts";

const template = Deno.args[0];

const CONCURRENT_RESTART_COUNT = 5;

if (template) {
  console.log(`Restarting template: ${template}`);
  await restartTemplate(template);
} else {
  const templates = await getTemplates();

  let doneCount = 0;
  const templateChunks = chunk([...templates], CONCURRENT_RESTART_COUNT);

  for (const templateChunk of templateChunks) {
    const promises = [];
    for (const template of templateChunk) {
      console.log(
        `Restarting template: ${template} (${doneCount + 1}/${templates.size})`,
      );
      promises.push(
        restartTemplate(template).catch((e) => {
          console.error("Failed to restart " + template);
          console.error(e);
        }),
      );

      doneCount++;
    }

    await Promise.all(promises);
  }
}
