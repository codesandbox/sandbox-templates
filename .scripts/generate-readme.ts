import * as path from "https://deno.land/std@0.196.0/path/mod.ts";
import { getTemplates } from "./utils.ts";
import { sortBy } from "https://deno.land/std@0.196.0/collections/sort_by.ts";
import { Markdown } from "https://deno.land/x/deno_markdown/mod.ts";

const readmeLocation = path.join(
  path.dirname(path.dirname(path.fromFileUrl(Deno.mainModule))),
  "README.md",
);
const decoder = new TextDecoder("utf-8");
const readmeContents = decoder.decode(await Deno.readFile(readmeLocation));
const templates = await getTemplates();

const templateInfos = await Promise.all([...templates].map(async (template) => {
  const url =
    `https://codesandbox.io/api/v1/sandboxes/github/codesandbox/sandbox-templates/tree/main/${template}`;

  const { data } = await fetch(url).then((x) => x.json());

  return {
    title: data.title as string,
    description: data.description as string,
    iconUrl: data.custom_template.icon_url as string,
    tags: data.tags as string[],
    editorUrl:
      `https://codesandbox.io/s/github/codesandbox/sandbox-templates/tree/main/${template}`,
  };
}));

const sortedTemplates = sortBy(
  templateInfos,
  (t) => t.title.toLocaleLowerCase(),
);

const markdown = new Markdown();
markdown.table([
  ["Title", "Description", "Tags"],

  ...sortedTemplates.map((
    templateInfo,
  ) => [
    `<img align="center" src="${templateInfo.iconUrl}" alt="${templateInfo.title}" width="16"/> [**${templateInfo.title}**](${templateInfo.editorUrl})`,
    templateInfo.description,
    templateInfo.tags.join(", "),
  ]),
]);

const newReadme = readmeContents.replace(
  /<!--TEMPLATES_START-->[\s\S]*<!--TEMPLATES_END-->/,
  `<!--TEMPLATES_START-->\n${markdown.content}\n<!--TEMPLATES_END-->`,
);

await Deno.writeFile(readmeLocation, new TextEncoder().encode(newReadme));
