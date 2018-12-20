import { merge } from '@pngwn/utils';

const appRoot = require('app-root-path');

export function generateWebpack(
  filePath: string,
  name: string,
  output: string,
  config: { module: any; [x: string]: any }
) {
  if (
    config.module.rules.findIndex(v => v.use.loader === 'svelte-loader') === -1
  ) {
    throw new Error(
      'Your rollup config must include svelte-loader in order to compile Svelte components.'
    );
  }
  const newConfig = {
    entry: {
      bundle: filePath,
    },
    resolve: {
      extensions: ['.js', '.html'],
    },
    output: {
      path: `${appRoot}/.svest_output`,
      filename: `${output}.js`,
    },
    mode: 'production',
    devtool: 'source-map',
  };

  return merge(newConfig, config);
}
