import { getSyncedSandboxDetails } from "./api.ts";
import { startSandbox, shutdownSandbox } from "./pitcher-manager.ts";
import { getTemplates } from "./utils.ts";
import { parse } from "https://deno.land/std@0.202.0/flags/mod.ts";

const clusters = ["fc-eu-0", "fc-us-0"];

const owner = "codesandbox";
const repo = "sandbox-templates";
const branch = "main";

async function prepareTemplate(
  template: string,
  options: { restart?: boolean } = {}
) {
  const { restart = false } = options;
  const sandboxDetails = await getSyncedSandboxDetails(
    owner,
    repo,
    branch,
    template
  );
  await Promise.all(
    clusters.map(async (clusterName) => {
      console.log(
        `${
          restart ? "Restarting" : "Starting"
        } sandbox, Cluster:${clusterName} \t SandboxId:${
          sandboxDetails.id
        } \t Template: ${template}`
      );

      // Start sandbox so that shutdown works later (eg: start from hibernation)
      await startSandbox(clusterName, sandboxDetails.id);

      if (restart) {
        await shutdownSandbox(clusterName, sandboxDetails.id);
        await startSandbox(clusterName, sandboxDetails.id);
      }
    })
  );
}

const flags = parse(Deno.args, {
  boolean: ["restart"],
  default: { restart: false },
});

const templates = await getTemplates();

for (const template of templates) {
  await prepareTemplate(template, {
    restart: flags.restart,
  });
}
