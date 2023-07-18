import { getSyncedSandboxDetails } from './api.js';
import { startSandbox } from './pitcher-manager.js';
import { readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from "node:url";

const clusters = [
    'fc-eu-0',
    'fc-us-0',
];

const owner = 'codesandbox';
const repo = 'sandbox-templates';
const branch = 'main';

async function prepareSandbox(dir) {
    const sandboxDetails = await getSyncedSandboxDetails(owner, repo, branch, dir);
    await Promise.all(clusters.map(async (clusterName) => {
        console.log(`Starting sandbox, Cluster:${clusterName} \t SandboxId:${sandboxDetails.id} \t Template: ${dir}`);
        await startSandbox(clusterName, sandboxDetails.id)
    }));
}

async function getTemplateDirs(dirToSearchIn) {
    const filesInTemplatesDir = await readdir(dirToSearchIn, { withFileTypes: true });

    const stats = await Promise.all(filesInTemplatesDir.filter(file => file.isDirectory()).map(async (dir) => {
        const templateJsonPath = path.join(dir.path, dir.name, '.codesandbox', 'template.json');
        let templateJsonExists = false;

        try {
            await access(templateJsonPath);
            templateJsonExists = true;
        } catch (e) {

        }

        return {
            dir: dir.name,
            templateJsonExists
        }
    }));

    return stats.filter(stat => stat.templateJsonExists).map(stat => stat.dir);

}

async function start() {
    const dirWithTempaltes = path.dirname(path.resolve(fileURLToPath(import.meta.url), '../'));
    const templateDirsWithTemplateJson = await getTemplateDirs(dirWithTempaltes);

    for(const templateDir of templateDirsWithTemplateJson){
        await prepareSandbox(templateDir);
    }
    
}

start().catch((e) => {
    console.error("Failed", e);
});