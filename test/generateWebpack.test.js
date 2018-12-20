import test from 'ava';

import { generateWebpack } from '../src/bundle/generateWebpack';

const appRoot = require('app-root-path');

test('should generate a valid webpack config', t => {
  const expected = {
    entry: {
      bundle: 'path/to/file',
    },
    resolve: {
      extensions: ['.js', '.html'],
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

  const output = generateWebpack('path/to/file', 'app', '-path-to-file', {
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
  t.plan(2);
  t.deepEqual(output, expected);
  t.is(output.module.rules[0].use.loader, 'svelte-loader');
});

test('should take additional webpack loaders', t => {
  const output = generateWebpack('path/to/file', 'app', '-path-to-file', {
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
  t.plan(2);
  t.is(output.module.rules.length, 2);
  t.is(output.module.rules[1].use.loader, 'file-loader');
});

test('if there is no svelte-loader present, it should throw', t => {
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
  t.throws(() =>
    generateWebpack('path/to/file', 'app', '-path-to-file', userConfig)
  );
});

test('if there is no svelte-loader present, it should throw with a helpful error message', t => {
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
  t.throws(
    () => generateWebpack('path/to/file', 'app', '-path-to-file', userConfig),
    'Your rollup config must include svelte-loader in order to compile Svelte components.'
  );
});
