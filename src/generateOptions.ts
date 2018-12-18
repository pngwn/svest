import { sep, normalize } from 'path';
import { merge } from '@pngwn/utils';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';

const appRoot = require('app-root-path');

// const pkg = require(`${appRoot}/package.json`);
// const { bundlerConfig = {} } = pkg.svest;

export function generateRollup(
  filePath: string,
  name: string,
  output: string,
  config: object = {}
): { input: any; output: any } {
  const newConfig = {
    input: {
      input: filePath,
      perf: false,
      plugins: [svelte(), resolve()],
    },
    output: {
      generate: 'dom',
      dev: false,
      sourcemap: true,
      format: 'iife',
      name,
      file: `${appRoot}/.svest_output/${output}.js`,
    },
  };
  return merge(config, newConfig);
}

export function outputName(filePath: string): string {
  return normalize(filePath)
    .replace(appRoot, '')
    .replace(/\./g, '-')
    .split(sep)
    .join('-');
}

export function generateOptions(filePath: string, name: string) {
  const output = outputName(filePath);
  return generateRollup(filePath, name, output);
}
