import { getSyncedSandboxDetails } from './api.ts';
import { startSandbox } from './pitcher-manager.ts';
import { access } from 'node:fs/promises';
import * as path from "https://deno.land/std@0.196.0/path/mod.ts";
import { getTemplates, root } from './utils.ts';

const clusters = [
    'fc-eu-0',
    'fc-us-0',
];

const owner = 'codesandbox';
const repo = 'sandbox-templates';
const branch = 'main';

async function prepareSandbox(dir: string) {
    const sandboxDetails = await getSyncedSandboxDetails(owner, repo, branch, dir);
    await Promise.all(clusters.map(async (clusterName) => {
        console.log(`Starting sandbox, Cluster:${clusterName} \t SandboxId:${sandboxDetails.id} \t Template: ${dir}`);
        await startSandbox(clusterName, sandboxDetails.id)
    }));
}

async function getTemplateDirs() {
    const filesInTemplatesDir = await getTemplates();

    const stats = await Promise.all([...filesInTemplatesDir].map(async (template) => {
        const templateJsonPath = path.join(root, template, '.codesandbox', 'template.json');
        let templateJsonExists = false;

        try {
            await access(templateJsonPath);
            templateJsonExists = true;
        } catch (e) {

        }

        return {
            dir: template,
            templateJsonExists
        }
    }));

    return stats.filter(stat => stat.templateJsonExists).map(stat => stat.dir);

}

async function start() {
    const templateDirsWithTemplateJson = await getTemplateDirs();

    for(const templateDir of templateDirsWithTemplateJson){
        await prepareSandbox(templateDir);
    }
    
}

start().catch((e) => {
    console.error("Failed", e);
});