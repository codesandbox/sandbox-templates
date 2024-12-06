import { getSyncedSandboxDetails } from "./api.ts";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
    throw new Error(`Failed to start sandbox ${sandboxId}, ${clusterName}`);
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
    throw new Error(`Failed to shutdown sandbox ${sandboxId}, ${clusterName}`);
  }
}

const clusters = ["fc-eu-0", "fc-eu-2", "fc-us-0", "fc-us-1"];

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

  // Wait for all sandbox restart to succeed or fail
  const results = await Promise.allSettled(
    clusters.map(async (clusterName) => {
      console.log(
        `Restarting sandbox Cluster:${clusterName} \t SandboxId:${sandboxDetails.id} \t Template: ${templateFolderName}`,
      );

      const TRIES = 3;

      for (let i = 0; i < TRIES; i++) {
        try {
          // Start sandbox so that shutdown works later (eg: start from hibernation)
          await startSandbox(clusterName, sandboxDetails.id);
          await shutdownSandbox(clusterName, sandboxDetails.id);
          await startSandbox(clusterName, sandboxDetails.id);
          console.log(
            "\x1b[32m%s\x1b[0m",
            `Restarted sandbox Cluster:${clusterName} \t SandboxId:${sandboxDetails.id} \t Template: ${templateFolderName}`,
          );
          break;
        } catch (e) {
          console.log(
            "\x1b[31m%s\x1b[0m",
            `Failed to restart sandbox Cluster:${clusterName} \t SandboxId:${sandboxDetails.id} \t Template: ${templateFolderName}`,
          );
          console.error(e);
          if (i === TRIES - 1) {
            throw e;
          }

          await sleep(1000);
        }
      }
    }),
  );

  // Get all restart promise rejections and log them and throw an error
  const rejections = results.filter((r) =>
    r.status === "rejected"
  ) as PromiseRejectedResult[];
  if (rejections.length > 0) {
    console.log(
      `Failed to restart sandboxes`,
      rejections.map((r) => r.reason.message),
    );
    throw new Error(`Failed to restart sandboxes`);
  }
}
