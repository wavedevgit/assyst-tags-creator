/**
 * A utility to make an assyst tag (using typescript or javascript)
 * Adds eslint rules to match asssyt tags rules
 * Adds an automatic build system that makes the tag easier to use
 */
import inquirer from 'inquirer';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import util from 'util';

const execAsync = util.promisify(exec);

async function main() {
    const { projectName, description, language, initGit, useTagTemplates } =
        await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'Enter your project name:',
                validate: (input) =>
                    input ? true : 'Project name cannot be empty.',
            },
            {
                type: 'input',
                name: 'description',
                message: 'Enter a short project description (optional):',
            },
            {
                type: 'list',
                name: 'language',
                message: 'Which language would you like to use?',
                choices: ['TypeScript', 'JavaScript'],
                default: 'TypeScript',
            },
            {
                type: 'confirm',
                name: 'initGit',
                message: 'Do you want to initialize a Git repository?',
                default: true,
            },
            {
                type: 'confirm',
                name: 'useTagTemplates',
                message:
                    "Do you want to use tag templates, this means you'll get full access to assyst tag syntax, instead of just js tag?",
                default: false,
            },
        ]);

    const projectPath = path.resolve(process.cwd(), projectName);

    // Check if folder exists
    try {
        await fs.access(projectPath);
        console.error(`Error: Folder "${projectName}" already exists.`);
        process.exit(1);
    } catch {}

    await fs.mkdir(projectPath, { recursive: true });

    await execAsync(`npm init -y`, { cwd: projectPath });

    const pkgPath = path.join(projectPath, 'package.json');
    const pkgData = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
    pkgData.name = projectName;
    pkgData.description = description || '';
    pkgData.type = 'module';
    pkgData.scripts.build = 'assyst-tag-builder';
    pkgData.main = 'src/index.' + language === 'TypeScript' ? '.ts' : '.js';
    await fs.writeFile(pkgPath, JSON.stringify(pkgData, null, 2));

    await fs.mkdir(path.join(projectPath, 'src'));

    if (language === 'TypeScript') {
        // tsconfig.json
        const tsconfig = {
            compilerOptions: {
                target: 'ES2020',
                module: 'CommonJS',
                strict: true,
                esModuleInterop: true,
                skipLibCheck: true,
                forceConsistentCasingInFileNames: true,
                outDir: 'dist',
            },
            include: ['src'],
        };
        await fs.writeFile(
            path.join(projectPath, 'tsconfig.json'),
            JSON.stringify(tsconfig, null, 2),
        );
    }

    const eslintrc = {
        env: {
            node: true,
            es2021: true,
        },

        parser:
            language === 'TypeScript' ? '@typescript-eslint/parser' : undefined,

        plugins: [
            '@happyenderman/assyst-eslint-plugins',
            ...(language === 'TypeScript' ? ['@typescript-eslint'] : []),
        ],

        extends: [
            'eslint:recommended',
            'plugin:@happyenderman/assyst-eslint-plugins/recommended',
            ...(language === 'TypeScript'
                ? ['plugin:@typescript-eslint/recommended']
                : []),
        ],
    };
    await fs.writeFile(
        path.join(projectPath, '.eslintrc.json'),
        JSON.stringify(eslintrc, null, 2),
    );

    console.log('Installing dependencies...');
    const deps = [
        '@happyenderman/assyst-types',
        '@happyenderman/assyst-eslint-plugins',
        '@ħappyenderman/assyst-tag-builder',
        useTagTemplates ? '@happyenderman/assyst-tag-templates' : '',
        '@rspack/core',
    ].filter(Boolean);
    if (language === 'TypeScript')
        deps.push('typescript', '@typescript-eslint/parser', '@types/node');
    await execAsync(`npm install --save-dev ${deps.join(' ')}`, {
        cwd: projectPath,
    });
    console.log('Dependencies installed.');

    if (initGit) {
        console.log('Initializing Git repository...');
        await execAsync('git init', { cwd: projectPath });
        console.log('Git repo initialized.');
    }

    console.log(`Project "${projectName}" setup complete with ${language}!`);
}

main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
