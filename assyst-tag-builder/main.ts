import fs from 'fs/promises';
import path from 'path';
import { rspack } from '@rspack/core';

async function isTsProject() {
    try {
        await fs.access('./src/index.ts');
        return true;
    } catch {
        return false;
    }
}
function buildWithRspack(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const compiler = rspack({
            entry: inputPath,

            output: {
                filename: path.basename(outputPath),
                path: path.resolve(path.dirname(outputPath)),
            },

            target: 'node',
            mode: 'production',

            devtool: 'inline-source-map',

            module: {
                rules: [
                    {
                        test: /\.(js|jsx|ts|tsx)$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'builtin:swc-loader',
                            options: {
                                jsc: {
                                    parser: {
                                        syntax: 'typescript', // or 'ecmascript' if no TS
                                        jsx: true,
                                    },

                                    transform: {
                                        react: {
                                            runtime: 'automatic',

                                            importSource:
                                                '@happyenderman/assyst-tag-templates',
                                        },
                                    },
                                },
                            },
                        },
                    },
                ],
            },

            optimization: {
                sideEffects: false,
            },
            resolve: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        });

        compiler.run((err, stats) => {
            if (err) return reject(err);

            if (stats?.hasErrors()) {
                return reject(new Error(stats.toString('errors-only')));
            }

            resolve();
        });
    });
}

async function main() {
    const isTs = await isTsProject();

    const inputPath = isTs ? './src/index.ts' : './src/index.js';
    const outputPath = './dist/tag.js';

    try {
        await buildWithRspack(inputPath, outputPath);

        await fs.appendFile(outputPath, '\n//# sourceURL=tag.js\n');

        console.log(`Build completed: ${outputPath}`);
    } catch (err) {
        console.error('rspack failed:', err);
        process.exit(1);
    }
}

main();
