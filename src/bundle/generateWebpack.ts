export function generateWebpack(
  filePath: string,
  name: string,
  output: string,
  config: { input: any; output: any } = { input: { plugins: [] }, output: {} }
) {
  const newConfig = {
    entry: {
      bundle: filePath,
    },
    resolve: {
      extensions: ['.js', '.html'],
    },
    output: {
      path: '/test',
      filename: `${output}.js`,
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: {
            loader: 'svelte-loader',
            options: {
              format: 'iife',
              css: false,
            },
          },
        },
      ],
    },
    mode: 'production',
    devtool: 'source-map',
  };
}
