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
  if (config.input.plugins.findIndex(v => v.name === 'svelte') === -1) {
    throw new Error(
      'Your rollup config must provide rollup-plugin-svelte in order to compile Svelte components.'
    );
  }
  const newConfig = {
    input: {
      input: filePath,
      perf: false,
      plugins: [],
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
