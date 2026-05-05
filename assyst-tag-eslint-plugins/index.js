import fetchLimitPlugin from './fetch-calls-limit.js';

export default [
    {
        ignores: ['node_modules/**'],
    },

    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                fetch: 'readonly',
                console: 'readonly',
                process: 'readonly',
            },
        },

        plugins: {
            'fetch-limit': fetchLimitPlugin,
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

            'fetch-limit/fetch-limit': ['error', { max: 5 }],
        },
    },
];
