import * as path from "https://deno.land/std@0.196.0/path/mod.ts";
import { getTemplates } from "./utils.ts";
import { sortBy } from "https://deno.land/std@0.196.0/collections/sort_by.ts";
import { Markdown } from "https://deno.land/x/deno_markdown/mod.ts";

const basePath = path.dirname(path.dirname(path.fromFileUrl(Deno.mainModule)));
const readmeLocation = path.join(basePath, "README.md");
const templateLocation = path.join(basePath, "templates.json");
const decoder = new TextDecoder("utf-8");
const readmeContents = decoder.decode(await Deno.readFile(readmeLocation));
const templates = await getTemplates(true);

const templateInfos = await Promise.all(
  [...templates].map(async (template) => {
    const url = `https://codesandbox.io/api/v1/sandboxes/github/codesandbox/sandbox-templates/tree/main/${template}`;

    const { data } = await fetch(url).then((x) => x.json());

    return {
      id: data.id as string,
      title: data.title as string,
      description: data.description as string,
      iconUrl: data.custom_template.icon_url as string,
      tags: data.tags as string[],
      editorUrl: `https://codesandbox.io/s/github/codesandbox/sandbox-templates/tree/main/${template}`,
      forkCount: data.fork_count as number,
      viewCount: data.view_count as number,
      likeCount: data.like_count as number,
      author: data.author,
      git: data.git,
      insertedAt: data.inserted_at as string,
    };
  })
);

const sortedTemplates = sortBy(templateInfos, (t) =>
  t.title.toLocaleLowerCase()
);

const markdown = new Markdown();
markdown.table(
  [
    [
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
      "Description",
    ],

    ...sortedTemplates.map((templateInfo) => [
      `<img align="center" src="${templateInfo.iconUrl}" alt="${templateInfo.title}" width="16"/> [**${templateInfo.title}**](${templateInfo.editorUrl})`,
      templateInfo.description,
    ]),
  ],
  {}
);

const newReadme = readmeContents.replace(
  /<!--TEMPLATES_START-->[\s\S]*<!--TEMPLATES_END-->/,
  `<!--TEMPLATES_START-->\n${markdown.content}\n<!--TEMPLATES_END-->`
);

await Deno.writeFile(readmeLocation, new TextEncoder().encode(newReadme));

const dataJson = JSON.stringify(
  sortedTemplates.map((templateInfo) => ({
    id: templateInfo.id,
    title: templateInfo.title,
    description: templateInfo.description,
    iconUrl: templateInfo.iconUrl,
    tags: templateInfo.tags,
    editorUrl: templateInfo.editorUrl,
    forkCount: templateInfo.forkCount,
    viewCount: templateInfo.viewCount,
    likeCount: templateInfo.likeCount,
    author: templateInfo.author,
    git: templateInfo.git,
    insertedAt: templateInfo.insertedAt,
  })),
  null,
  2
);

await Deno.writeTextFile(templateLocation, dataJson);

/**
 * Returns the number formatted to show the k and M symbols when necessary.
 */
function numberToSymbol(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }

  return `${count}`;
}
