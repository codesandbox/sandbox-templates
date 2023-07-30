import * as path from "https://deno.land/std@0.196.0/path/mod.ts";

export const root = path.dirname(
  path.dirname(path.fromFileUrl(Deno.mainModule)),
);

export async function getTemplates(): Promise<Set<string>> {
  const folders = Deno.readDir(root);
  const templates = new Set<string>();

  for await (const folder of folders) {
    if (
      folder.name.startsWith(".") || folder.name.trim() === "" ||
      !folder.isDirectory
    ) {
      continue;
    }
    templates.add(folder.name);
  }

  return templates;
}
