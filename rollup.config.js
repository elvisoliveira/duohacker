import { stringify } from 'userscript-metadata';
import { readFileSync } from "fs";
import multi from '@rollup/plugin-multi-entry';

const metadata = JSON.parse(readFileSync("package.json", "utf-8"));

export default {
  input: [
    "./src/types/*.js",
    "./src/userscript.js",
  ],
  output: {
    file: 'bundle.js',
    banner: () => stringify({
      'name': metadata.name,
      'namespace': 'https://www.duolingo.com/',
      'homepageURL': 'https://github.com/elvisoliveira/duohacker',
      'supportURL': 'https://github.com/elvisoliveira/duohacker/issues',
      'version': metadata.version,
      'description': metadata.description,
      'author': metadata.author,
      'match': [
        'https://www.duolingo.com/practice*',
        'https://www.duolingo.com/learn*'
      ],
      'license': metadata.license,
      'grant': 'none',
      'run-at': 'document-end',
    }),
  },
  plugins: [
    multi({
      exports: false
    })
  ]
};