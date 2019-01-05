import { merge } from '@pngwn/utils';

const appRoot = require('app-root-path');

export function generateRollup(
  filePath: string,
  name: string,
  output: string,
  config: { input: any; output: any; plugins: any }
): any {
  if (config.plugins.findIndex(v => v.name === 'svelte') === -1) {
    throw new Error(
      'Your rollup config must include rollup-plugin-svelte in order to compile Svelte components.'
    );
  }

  const newConfig = {
    input: {
      input: filePath,
      perf: false,
      plugins: config.plugins,
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
  return newConfig;
  return merge(config, newConfig);
}
