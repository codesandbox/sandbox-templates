export async function startSandbox(clusterName: string, sandboxId: string) {
  const response = await fetch(
    `https://${clusterName}.pitcher.csb.app/api/v1/sandboxes/branches/${sandboxId}`,
  );
  return response.json();
}

export async function hibernateSandbox(clusterName: string, sandboxId: string) {
  await fetch(
    `https://${clusterName}.pitcher.csb.app/api/v1/sandboxes/branches/${sandboxId}?hibernate=true`,
    {
      method: "DELETE",
    },
  );
}

export async function shutdownSandbox(clusterName: string, sandboxId: string) {
  await fetch(
    `https://${clusterName}.pitcher.csb.app/api/v1/sandboxes/branches/${sandboxId}`,
    {
      method: "DELETE",
    },
  );
}
