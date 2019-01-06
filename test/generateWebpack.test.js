import { generateWebpack } from '../src/bundle/generateWebpack';

const appRoot = require('app-root-path');

test('should generate a valid webpack config', () => {
  const expected = {
    entry: 'path/to/file',
    resolve: {
      extensions: ['.js', '.html', '.svelte'],
    },
    output: {
      path: `${appRoot}/.svest_output`,
      filename: `-path-to-file.js`,
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: {
            loader: 'svelte-loader',
            options: {
              format: 'esm',
              css: false,
              dev: false,
            },
          },
        },
      ],
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [],
  };

  const output = generateWebpack('path/to/file', '-path-to-file', {
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
  });

  expect(output).toEqual(expected);
  expect(output.module.rules[0].use.loader).toBe('svelte-loader');
});

test('should take additional webpack loaders', () => {
  const output = generateWebpack('path/to/file', '-path-to-file', {
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
        {
          test: /\.(png|jpg|gif)$/,
          use: {
            loader: 'file-loader',
          },
        },
      ],
    },
  });

  expect(output.module.rules.length).toBe(2);
  expect(output.module.rules[1].use.loader).toBe('file-loader');
});

test('if there is no svelte-loader present, it should throw with a helpful error message', () => {
  const userConfig = {
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif)$/,
          use: {
            loader: 'file-loader',
          },
        },
      ],
    },
  };

  expect(() =>
    generateWebpack('path/to/file', '-path-to-file', userConfig)
  ).toThrowError(
    'Your rollup config must include svelte-loader in order to compile Svelte components.'
  );
});
