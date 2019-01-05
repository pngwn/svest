import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript';
import pkg from './package.json';
// import fs from 'fs';
// import path from 'path';

const opts = {
  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
    json(),
    typescript({
      typescript: require('typescript'),
      module: 'esnext',
      allowJs: true,
    }),
  ],
};

// let files = fs
//   .readdirSync(path.join(__dirname, 'src'))
//   .filter(v => path.extname(v) && v.indexOf('d.ts') < 0)
//   .map(v => path.join('src', v));

// files = files
//   .concat(
//     fs
//       .readdirSync(path.join(__dirname, 'src', 'bundle'))
//       .map(v => path.join('src', 'bundle', v))
//   )
//   .reduce((acc, next) => {
//     return {
//       ...acc,
//       [next.replace('src/', '').replace('.ts', '')]: next,
//     };
//   }, {});

export default [
  {
    ...opts,
    input: 'src/main.ts',
    external: ['deasync'],
    output: [
      { file: pkg.module, format: 'es', sourcemap: false },
      { file: pkg.main, format: 'cjs', sourcemap: false },
    ],
  },
  {
    ...opts,
    input: 'jest.ts',
    external: () => true,
    output: {
      file: 'jest.js',
      format: 'cjs',
    },
  },
];
