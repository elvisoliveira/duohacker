import { stringify } from 'userscript-meta';
import { readFileSync } from "fs";
import multi from '@rollup/plugin-multi-entry';

const metadata = JSON.parse(readFileSync("package.json", "utf-8"));
const namespace = 'https://www.duolingo.com';

export default {
  input: [
    "./src/types/*.js",
    "./src/userscript.js",
  ],
  output: {
    file: 'bundle.js',
    banner: () => stringify({
      'name': metadata.name,
      'namespace': namespace,
      'homepageURL': metadata.homepage,
      'supportURL': `${metadata.homepage}/issues`,
      'version': metadata.version,
      'description': metadata.description,
      'author': metadata.author,
      'match': [
        `${namespace}/practice*`,
        `${namespace}/learn*`
      ],
      'license': metadata.license,
      'grant': 'none',
      'run-at': 'document-end',
    }),
  },
  plugins: [
    multi({
      exports: false
    }),
  ]
};