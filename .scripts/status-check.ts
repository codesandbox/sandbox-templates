import JSON5 from "npm:json5@2.2.3";
import * as path from "https://deno.land/std@0.196.0/path/mod.ts";
import { getTemplates } from "./utils.ts";
import { getClusterPreviewUrls } from "./pitcher-manager.ts";
import { getSyncedSandboxDetails } from "./api.ts";

const basePath = path.dirname(path.dirname(path.fromFileUrl(Deno.mainModule)));
const templates = await getTemplates();

type TemplateInfo = {
  folder: string;
  ports: number[];
};

const templateInfo: TemplateInfo[] = await Promise.all(
  [...templates].map(async (folder) => {
    try {
      const codeSandboxConfig = await Deno.readTextFile(
        path.join(basePath, folder, ".codesandbox", "tasks.json"),
      );
      const { tasks } = JSON5.parse(codeSandboxConfig);
      const ports = Object.values(tasks)
        .map((task) => {
          const typedTask = task as { preview?: { port?: number } };

          return typedTask?.preview?.port;
        })
        .filter(Boolean) as number[];

      return { folder, ports };
    } catch (_e) {
      return { folder, ports: [] };
    }
  }),
);

console.log(templateInfo);

type PortStatus = {
  url: string;
  status: "succeeded" | "failed";
  error?: string;
};
type Status = {
  folder: string;
  ports: Record<number, PortStatus[]>;
};

const owner = "codesandbox";
const repo = "sandbox-templates";
const branch = "main";

const statuses: Status[] = [];
for (const { folder, ports } of templateInfo) {
  if (ports.length === 0) {
    console.log(`Warning: no ports found for ${folder}`);
    continue;
  }

  const status: Status = {
    folder,
    ports: {},
  };

  for (const port of ports) {
    console.log(`Checking ${folder} on port ${port}`);
    const syncedTemplateInfo = await getSyncedSandboxDetails(
      owner,
      repo,
      branch,
      folder,
    );
    const previewUrls = getClusterPreviewUrls(syncedTemplateInfo.id, port);

    status.ports[port] = await Promise.all(
      previewUrls.map(async (url) => {
        try {
          const response = await fetch(url);

          const status: PortStatus = response.status >= 500
            ? {
              url,
              status: "failed",
              error: response.statusText,
            }
            : {
              url,
              status: "succeeded",
            };

          return status;
        } catch (_e) {
          return { url, status: "failed" };
        }
      }),
    );
  }
  statuses.push(status);
}

const failedStatuses = statuses.filter((status) =>
  Object.values(status.ports).some((ports) =>
    ports.some((port) => port.status === "failed")
  )
);

if (failedStatuses.length > 0) {
  console.log("Failed. Failed statuses:");
  console.log("");
  console.log(failedStatuses);
  Deno.exit(1);
} else {
  console.log("All statuses succeeded!");
  Deno.exit(0);
}
