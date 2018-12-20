import { merge } from '@pngwn/utils';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';

const appRoot = require('app-root-path');

export function generateRollup(
  filePath: string,
  name: string,
  output: string,
  config: { input: any; output: any } = { input: { plugins: [] }, output: {} }
): { input: any; output: any } {
  const newConfig = {
    input: {
      input: filePath,
      perf: false,
      plugins: [
        config.input.plugins.some(v => v.name === 'svelte') ? false : svelte(),
        config.input.plugins.some(v => v.name === 'node-resolve')
          ? false
          : resolve(),
      ].filter(v => v),
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
