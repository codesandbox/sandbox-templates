export async function getSyncedSandboxDetails(
  owner: string,
  repo: string,
  branch: string,
  folder: string
) {
  const response = await fetch(
    `https://codesandbox.io/api/v1/sandboxes/github/${owner}/${repo}/tree/${branch}${
      folder ? `/${folder}` : ""
    }`
  );
  const data = await response.json();
  return data.data as {
    id: string;
    title: string;
    description: string;
  };
}
