import { stringify } from 'userscript-meta';
import { readFileSync } from 'fs';
import prettier from 'rollup-plugin-prettier';

import eslint from '@rollup/plugin-eslint';
import multi from '@rollup/plugin-multi-entry';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const development = process.env.ROLLUP_WATCH;
const metadata = JSON.parse(readFileSync('package.json', 'utf-8'));
const __namespace = 'https://www.duolingo.com';

export default {
    input: [
        './src/types/*.js',
        './src/userscript.js',
    ],
    output: {
        file: development && `dev.${metadata.main}` || metadata.main,
        banner: () => stringify({
            'name': development && `dev.${metadata.name}` || metadata.name,
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
        terser({
            format: {
                comments: false
            },
            compress: false
        }),
        prettier({
            tabWidth: 4,
            singleQuote: true,
            parser: 'babel'
        }),
        eslint()
    ]
};