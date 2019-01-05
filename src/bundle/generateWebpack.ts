import { merge } from '@pngwn/utils';
import path from 'path';

const appRoot = require('app-root-path');

export function generateWebpack(
  filePath: string,
  output: string,
  config: { module: any; [x: string]: any }
): any {
  if (
    config.module.rules.findIndex(v => v.use.loader === 'svelte-loader') === -1
  ) {
    throw new Error(
      'Your rollup config must include svelte-loader in order to compile Svelte components.'
    );
  }
  const newConfig = {
    entry: filePath,
    resolve: {
      extensions: ['.js', '.html'],
    },
    output: {
      path: path.resolve(`${appRoot}/.svest_output`),
      filename: `${output}.js`,
    },
    mode: 'production',
    devtool: 'source-map',
  };

  return merge(newConfig, config);
}
