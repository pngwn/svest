import path from 'path';

const appRoot = require('app-root-path');

export function generateWebpack(
  filePath: string,
  output: string,
  config: { module: any; [x: string]: any }
): any {
  const loaderIndex = config.module.rules.findIndex(
    v => v.use.loader === 'svelte-loader'
  );
  if (loaderIndex === -1) {
    throw new Error(
      'Your rollup config must include svelte-loader in order to compile Svelte components.'
    );
  }
  config.module.rules[loaderIndex].use.options.format = 'esm';
  config.module.rules[loaderIndex].use.options.dev = false;
  const newConfig = {
    entry: filePath,
    resolve: {
      extensions: ['.js', '.html', '.svelte'],
    },
    output: {
      path: path.resolve(`${appRoot}/.svest_output`),
      filename: `${output}.js`,
    },
    mode: 'development',
    devtool: 'inline-source-map',
    module: config.module,
    plugins: config.plugins || [],
  };
  return newConfig;
}
