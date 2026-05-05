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
                validate: (input: string) =>
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
                    'Use tag templates (full assyst syntax support instead of JS tag)?',
                default: false,
            },
        ]);

    const projectPath = path.resolve(process.cwd(), projectName);

    try {
        await fs.access(projectPath);
        console.error(`Folder "${projectName}" already exists.`);
        process.exit(1);
    } catch {}

    await fs.mkdir(projectPath, { recursive: true });

    await execAsync(`npm init -y`, { cwd: projectPath });

    const pkgPath = path.join(projectPath, 'package.json');
    const pkgData = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));

    pkgData.name = projectName;
    pkgData.description = description || '';
    pkgData.type = 'module';

    pkgData.main = language === 'TypeScript' ? 'src/index.ts' : 'src/index.js';

    pkgData.scripts = {
        build: 'assyst-tag-builder',
    };

    await fs.writeFile(pkgPath, JSON.stringify(pkgData, null, 2));

    await fs.mkdir(path.join(projectPath, 'src'));

    // TS config fix
    if (language === 'TypeScript') {
        const tsconfig = {
            compilerOptions: {
                target: 'ES2020',
                module: 'NodeNext',
                moduleResolution: 'NodeNext',
                strict: true,
                esModuleInterop: true,
                skipLibCheck: true,
                outDir: 'dist',
            },
            include: ['src'],
        };

        await fs.writeFile(
            path.join(projectPath, 'tsconfig.json'),
            JSON.stringify(tsconfig, null, 2),
        );
    }

    const eslintConfig = `import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import assystPlugin from '@happyenderman/assyst-eslint-plugins';

export default [
    {
        ignores: ['node_modules/**', 'dist/**'],
    },
    {
        files: ['**/*.{ts,tsx}', '**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: ${language === 'TypeScript' ? 'tsParser' : 'undefined'},
            globals: {
                console: 'readonly',
                process: 'readonly',
                fetch: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            '@happyenderman/assyst-eslint-plugins': assystPlugin,
        },
        rules: {
            'no-console': 'off',
            'no-restricted-syntax': [
                'error',
                {
                    selector: "MemberExpression[object.name='console']",
                    message:
                        'Console logs are useless, as assyst evals javascript, use return value instead',
                },
            ],
            '@happyenderman/assyst-eslint-plugins/fetch-limit': [
                'error',
                { max: 5 },
            ],
        },
    },
];`;

    await fs.writeFile(
        path.join(projectPath, 'eslint.config.js'),
        eslintConfig,
    );

    console.log('Installing dependencies...');

    const deps = [
        '@happyenderman/assyst-types',
        '@happyenderman/assyst-eslint-plugins',
        '@happyenderman/assyst-tag-builder',
        useTagTemplates && '@happyenderman/assyst-tag-templates',
        '@rspack/core',
    ].filter(Boolean) as string[];

    if (language === 'TypeScript') {
        deps.push(
            'typescript',
            '@typescript-eslint/parser',
            '@types/node',
            '@typescript-eslint/eslint-plugin',
        );
    }

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
