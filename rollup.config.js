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

export default [
  {
    ...opts,
    input: 'src/main.ts',
    external: ['callsite', 'rollup-plugin-svelte', 'svelte'],
    output: [
      { file: pkg.module, format: 'es', sourcemap: false },
      { file: pkg.main, format: 'cjs', sourcemap: false },
    ],
  },
];
