import { getSyncedSandboxDetails } from "./api.ts";

export async function startSandbox(clusterName: string, sandboxId: string) {
  const response = await fetch(
    `https://${clusterName}.pitcher.csb.app/api/v1/sandboxes/branches/${sandboxId}`
  );
  return response.json();
}

export async function hibernateSandbox(clusterName: string, sandboxId: string) {
  await fetch(
    `https://${clusterName}.pitcher.csb.app/api/v1/sandboxes/branches/${sandboxId}?hibernate=true`,
    {
      method: "DELETE",
    }
  );
}

export async function shutdownSandbox(clusterName: string, sandboxId: string) {
  await fetch(
    `https://${clusterName}.pitcher.csb.app/api/v1/sandboxes/branches/${sandboxId}`,
    {
      method: "DELETE",
    }
  );
}

const clusters = ["fc-eu-0", "fc-eu-2", "fc-us-0"];

const owner = "codesandbox";
const repo = "sandbox-templates";
const branch = "main";

export async function restartTemplate(templateFolderName: string) {
  const sandboxDetails = await getSyncedSandboxDetails(
    owner,
    repo,
    branch,
    templateFolderName
  );
  await Promise.all(
    clusters.map(async (clusterName) => {
      console.log(
        `Restarting sandbox Cluster:${clusterName} \t SandboxId:${sandboxDetails.id} \t Template: ${templateFolderName}`
      );

      // Start sandbox so that shutdown works later (eg: start from hibernation)
      await startSandbox(clusterName, sandboxDetails.id);
      await shutdownSandbox(clusterName, sandboxDetails.id);
      await startSandbox(clusterName, sandboxDetails.id);
    })
  );
}
