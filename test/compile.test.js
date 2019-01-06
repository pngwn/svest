import { compile } from '../src/compile';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';

const appRoot = require('app-root-path');

afterEach(() => jest.resetModules());

test('it should compile without dying: rollup', async () => {
  jest.mock(
    '../svest.config.js',
    () => ({
      bundler: 'rollup',
      plugins: [svelte(), resolve()],
    }),
    { virtual: true }
  );

  const file = `${appRoot}/test/fixtures/imported.html`;
  const { code } = await compile(file, 'app');
  expect(code).toBeTruthy();
});

test.skip('it should compile without dying: webpack', async () => {
  jest.mock(
    '../svest.config.js',
    () => ({
      bundler: 'webpack',
      module: {
        rules: [
          {
            test: /\.html$/,
            exclude: /node_modules/,
            use: {
              loader: 'svelte-loader',
              options: {
                format: 'cjs',
                css: false,
              },
            },
          },
        ],
      },
    }),
    { virtual: true }
  );

  const file = `${appRoot}/test/fixtures/imported.html`;
  const { code } = await compile(file, 'app');

  expect(code).toBeTruthy();
});

test('a bad webpack config should throw an error', async () => {
  jest.setMock(
    '../svest.config.js',
    () => ({
      bundler: 'webpack',
      module: {
        rules: [
          {
            test: /\.html$/,
            exclude: /node_modules/,
            use: {
              loader: 'svelte-loader',
              options: {
                format: 'spoon',
                css: false,
              },
            },
          },
        ],
      },
    }),
    { virtual: true }
  );

  const file = `${appRoot}/test/fixtures/imported.html`;
  try {
    await compile(file, 'app');
  } catch (e) {
    expect(e).toBeTruthy();
  }
});

test('a really bad webpack config should also throw an error', async () => {
  jest.mock(
    '../svest.config.js',
    () => ({
      bundler: 'webpack',
      module: {
        darules: [
          {
            test: /\.html$/,
            exclude: /node_modules/,
            use: {
              loader: 'svelte-loader',
              options: {
                format: 'spoon',
                css: false,
              },
            },
          },
        ],
      },
    }),
    { virtual: true }
  );

  const file = `${appRoot}/test/fixtures/imported.html`;
  try {
    await compile(file, 'app');
  } catch (e) {
    expect(e).toBeTruthy();
  }
});
