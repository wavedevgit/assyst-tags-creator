import { readFileSync, writeFileSync } from 'fs';

const file = './dist/main.js';

let content = readFileSync(file, 'utf8');

if (!content.startsWith('#!/usr/bin/env node')) {
    content = '#!/usr/bin/env node\n' + content;
}

writeFileSync(file, content);
