const fetchLimitPlugin = {
    meta: {
        name: '@happyenderman/assyst-eslint-plugins',
        version: '1.0.2',
        namespace: '@happyenderman/assyst-eslint-plugins',
    },
    rules: {
        'fetch-limit': {
            meta: {
                type: 'problem',
                docs: {
                    description: 'Limit fetch calls to a maximum of 5 per file',
                },
                schema: [
                    {
                        type: 'object',
                        properties: {
                            max: {
                                type: 'integer',
                                minimum: 1,
                            },
                        },
                        additionalProperties: false,
                    },
                ],
            },
            create(context) {
                const options = context.options[0] || {};
                const maxCalls = options.max || 5;
                let fetchCallCount = 0;

                return {
                    CallExpression(node) {
                        if (
                            (node.callee.type === 'Identifier' &&
                                node.callee.name === 'fetch') ||
                            (node.callee.type === 'MemberExpression' &&
                                node.callee.property.name === 'fetch')
                        ) {
                            fetchCallCount++;
                            if (fetchCallCount > maxCalls) {
                                context.report({
                                    node,
                                    message: `fetch call exceeds limit of ${maxCalls} per file (call #${fetchCallCount})`,
                                });
                            }
                        }
                    },
                };
            },
        },
    },
};

export default fetchLimitPlugin;
