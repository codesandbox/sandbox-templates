import { getSyncedSandboxDetails } from "./api.ts";

export async function startSandbox(clusterName: string, sandboxId: string) {
  const response = await fetch(
    `https://codesandbox.io/api/beta/sandboxes/branches/${sandboxId}/instance?pitcherManagerURL=https://${clusterName}.pitcher.csb.app/api/v1`,
    {
      method: "POST",
      headers: {
        "Cookie": `guardian_default_token=${
          Deno.env.get("CODESANDBOX_API_TOKEN")
        };`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to start sandbox");
  }

  return response.json();
}

export async function shutdownSandbox(clusterName: string, sandboxId: string) {
  const response = await fetch(
    `https://codesandbox.io/api/beta/sandboxes/branches/${sandboxId}/instance?pitcherManagerURL=https://${clusterName}.pitcher.csb.app/api/v1`,
    {
      method: "DELETE",
      headers: {
        "Cookie": `guardian_default_token=${
          Deno.env.get("CODESANDBOX_API_TOKEN")
        };`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to shutdown sandbox");
  }
}

const clusters = ["fc-eu-0", "fc-eu-2", "fc-us-0"];

export function getClusterPreviewUrls(
  templateName: string,
  port: number,
): string[] {
  return clusters.map(
    (cluster) => `https://${templateName}-${port}.${cluster}.pitcher.csb.app`,
  );
}

const owner = "codesandbox";
const repo = "sandbox-templates";
const branch = "main";

export async function restartTemplate(templateFolderName: string) {
  const sandboxDetails = await getSyncedSandboxDetails(
    owner,
    repo,
    branch,
    templateFolderName,
  );
  await Promise.all(
    clusters.map(async (clusterName) => {
      console.log(
        `Restarting sandbox Cluster:${clusterName} \t SandboxId:${sandboxDetails.id} \t Template: ${templateFolderName}`,
      );

      // Start sandbox so that shutdown works later (eg: start from hibernation)
      await startSandbox(clusterName, sandboxDetails.id);
      await shutdownSandbox(clusterName, sandboxDetails.id);
      await startSandbox(clusterName, sandboxDetails.id);
    }),
  );
}
