import { merge } from '@pngwn/utils';

const appRoot = require('app-root-path');

export function generateRollup(
  filePath: string,
  output: string,
  plugins: [{ name }]
): any {
  if (plugins.findIndex(v => v.name === 'svelte') === -1) {
    throw new Error(
      'Your rollup config must include rollup-plugin-svelte in order to compile Svelte components.'
    );
  }

  const newConfig = {
    input: {
      input: filePath,
      perf: false,
      plugins: plugins,
    },
    output: {
      generate: 'dom',
      dev: false,
      sourcemap: 'inline',
      format: 'iife',
      name: 'app',
      file: `${appRoot}/.svest_output/${output}.js`,
    },
  };
  return newConfig;
}
