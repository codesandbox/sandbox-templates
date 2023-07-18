export async function startSandbox(clusterName, sandboxId) {
    const response = await fetch(`https://${clusterName}.pitcher.csb.app/api/v1/sandboxes/branches/${sandboxId}`)
    return response.json();
}

export async function hibernateSandbox(clusterName, sandboxId) {
    await fetch(`https://${clusterName}.pitcher.csb.app/api/v1/sandboxes/branches/${sandboxId}?hibernate=true`, {
        method: 'DELETE',
    });
}

export async function shutdownSandbox(clusterName, sandboxId) {
    await fetch(`https://${clusterName}.pitcher.csb.app/api/v1/sandboxes/branches/${sandboxId}`, {
        method: 'DELETE',
    });
}