import { getSyncedSandboxDetails } from "./api.ts";
import { shutdownSandbox, startSandbox } from "./pitcher-manager.ts";
import { getTemplates } from "./utils.ts";

const clusters = ["fc-eu-0", "fc-eu-2", "fc-us-0"];

const owner = "codesandbox";
const repo = "sandbox-templates";
const branch = "main";

let doneCount = 0;
async function restartTemplate(template: string) {
  const sandboxDetails = await getSyncedSandboxDetails(
    owner,
    repo,
    branch,
    template
  );
  await Promise.all(
    clusters.map(async (clusterName) => {
      console.log(
        `Restarting sandbox (${doneCount}/${templates.size}), Cluster:${clusterName} \t SandboxId:${sandboxDetails.id} \t Template: ${template}`
      );

      // Start sandbox so that shutdown works later (eg: start from hibernation)
      await startSandbox(clusterName, sandboxDetails.id);
      await shutdownSandbox(clusterName, sandboxDetails.id);
      await startSandbox(clusterName, sandboxDetails.id);
    })
  );
  doneCount++;
}
const templates = await getTemplates();

for (const template of templates) {
  await restartTemplate(template);
}
