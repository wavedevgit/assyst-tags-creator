import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import esbuild from 'esbuild';

const execAsync = promisify(exec);

async function isTsProject() {
    try {
        await fs.access('./src/index.ts');
        return true;
    } catch {
        return false;
    }
}

async function main() {
    const shouldBuildTs = await isTsProject();

    if (shouldBuildTs) {
        console.log('Building TypeScript source...');
        try {
            await fs.rm('./dist', { force: true, recursive: true });
        } catch {}

        try {
            await execAsync('npx tsc');
            console.log('TypeScript build completed');
        } catch (err) {
            console.error('TypeScript build failed:', err.stderr || err);
            process.exit(1);
        }
    }

    const inputPath = shouldBuildTs ? './dist/index.js' : './src/index.js';
    const outputPath = './dist/tag.js';

    try {
        await esbuild.build({
            entryPoints: [inputPath],
            bundle: true,
            outfile: outputPath,
            platform: 'node',
            format: 'cjs',
            sourcemap: false,
        });

        await fs.appendFile(outputPath, '\n//# sourceURL=tag.js\n');

        console.log(`Build completed: ${outputPath}`);
    } catch (err) {
        console.error('esbuild failed:', err);
        process.exit(1);
    }
}

main();
