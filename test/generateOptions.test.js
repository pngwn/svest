import { outputName, generateOptions } from '../src/bundle/generateOptions';

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

test('generateOptions: if there is no test config or svest field in pkg.json it should throw an error', async () => {
  try {
    await generateOptions('some/path/to/file.js', 'app');
  } catch (e) {
    expect(e).toEqual(
      new Error(
        "No config file detected. Ensure there is either a 'svest.config.js' file in your app root or a 'svest' field in your 'package.json'."
      )
    );
  }
});

test('generateOptions: rollup configs should be processed correctly', async () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'rollup',
      bundlerConfig: './test/fixtures/rollup.test.js',
    },
  });

  const bundle = await generateOptions('path/to/file', 'app');
  expect(bundle.input.perf).toBeFalsy();
});

test('generateOptions: webpack configs should be processed correctly', async () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'webpack',
      bundlerConfig: './test/fixtures/webpack.test.js',
    },
  });

  const bundle = await generateOptions('path/to/file', 'app');
  expect(bundle.module).toBeTruthy();
});

test('generateOptions: other bundler types should throw an error', async () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'parcel',
      bundlerConfig: './test/fixtures/webpack.test.js',
    },
  });

  try {
    await generateOptions('path/to/file', 'app');
  } catch (e) {
    expect(e).toEqual(
      new Error(
        "Cannot recognise bundler option. Must be one of 'webpack' or 'rollup'."
      )
    );
  }
});
