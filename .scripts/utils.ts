import * as path from "https://deno.land/std@0.196.0/path/mod.ts";

export const root = path.dirname(
  path.dirname(path.fromFileUrl(Deno.mainModule)),
);

/**
 * Gets all templates by scanning the folders in the repository
 *
 * @param hideMigration Whether to skip the sandbox-migration folder
 */
export async function getTemplates(
  hideMigration = false,
): Promise<Set<string>> {
  const folders = Deno.readDir(root);
  const templates = new Set<string>();

  for await (const folder of folders) {
    if (!isDirValidTemplate(folder.name) || !folder.isDirectory) {
      continue;
    }
    if (hideMigration && folder.name === "sandbox-migration") {
      continue;
    }

    templates.add(folder.name);
  }

  return templates;
}

export function isDirValidTemplate(dirName: string): boolean {
  return !dirName.startsWith(".") && dirName.trim() !== "";
}
