import { outputName, generateOptions } from '../src/bundle/generateOptions';

import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';

const appRoot = require('app-root-path');

beforeEach(() => {
  jest.resetModules();
});

afterAll(() => {
  jest.resetModules();
});

test('outputName: output name should return a string based upon the path', () => {
  expect(outputName(`${appRoot}/src/path/file.html`)).toBe(
    '-src-path-file-html'
  );
});

test('if there is no svest config in root, it should throw an error', async () => {
  try {
    await generateOptions('some/path/to/file.js');
  } catch (e) {
    expect(e.message).toEqual(
      "Ensure there is a 'svest.config.js' file in your root directory."
    );
  }
});

test('generateOptions: rollup configs should be processed correctly', async () => {
  jest.mock(
    '../svest.config.js',
    () => ({
      bundler: 'rollup',
      plugins: [svelte(), resolve()],
    }),
    { virtual: true }
  );

  const bundle = await generateOptions('path/to/file');
  expect(bundle[1].input.perf).toBeFalsy();
});

test('generateOptions: webpack configs should be processed correctly', async () => {
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

  const bundle = await generateOptions('path/to/file');
  expect(bundle[1].module).toBeTruthy();
});

test('generateOptions: other bundler types should throw an error', async () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'parcel',
      bundlerConfig: './test/fixtures/webpack.test.js',
    },
  });

  try {
    await generateOptions('path/to/file');
  } catch (e) {
    expect(e).toEqual(
      new Error(
        "Cannot recognise bundler option. Must be one of 'webpack' or 'rollup'."
      )
    );
  }
});
