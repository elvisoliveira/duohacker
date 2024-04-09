import { stringify } from 'userscript-meta';
import { readFileSync } from 'fs';
import multi from '@rollup/plugin-multi-entry';
import eslint from '@rollup/plugin-eslint';
import replace from '@rollup/plugin-replace';

const metadata = JSON.parse(readFileSync('package.json', 'utf-8'));
const __namespace = 'https://www.duolingo.com';

export default {
    input: [
        './src/types/*.js',
        './src/userscript.js',
    ],
    output: {
        file: 'bundle.js',
        banner: () => stringify({
            'name': metadata.name,
            'namespace': __namespace,
            'homepageURL': metadata.homepage,
            'supportURL': `${metadata.homepage}/issues`,
            'version': metadata.version,
            'description': metadata.description,
            'author': metadata.author,
            'match': [
                `${__namespace}/practice*`,
                `${__namespace}/learn*`
            ],
            'license': metadata.license,
            'grant': 'none',
            'run-at': 'document-end',
        }),
    },
    plugins: [
        replace({
            preventAssignment: true,
            __namespace
        }),
        multi({
            exports: false
        }),
        eslint()
    ]
};