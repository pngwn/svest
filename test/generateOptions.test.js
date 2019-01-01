import test from 'ava';
const mockRequire = require('mock-require');

import { outputName, generateOptions } from '../src/bundle/generateOptions';

const appRoot = require('app-root-path');

test('outputName: output name should return a string based upon the path', t => {
  t.is(outputName(`${appRoot}/src/path/file.html`), '-src-path-file-html');
});

test('generateOptions: if there is no test config or svest field in pkg.json it should throw an error', async t => {
  const err = await t.throwsAsync(
    generateOptions('some/path/to/file.js', 'app')
  );
  t.true(err instanceof Error);
  t.is(
    err.message,
    "No config file detected. Ensure there is either a 'svest.config.js' file in your app root or a 'svest' field in your 'package.json'."
  );
});

test('generateOptions: rollup configs should be processed correctly', async t => {
  mockRequire('../package.json', {
    svest: {
      bundler: 'rollup',
      bundlerConfig: './test/fixtures/rollup.test.js',
    },
  });

  const bundle = await generateOptions('path/to/file', 'app');
  t.false(bundle.input.perf);
});

test('generateOptions: webpack configs should be processed correctly', async t => {
  mockRequire('../package.json', {
    svest: {
      bundler: 'webpack',
      bundlerConfig: './test/fixtures/webpack.test.js',
    },
  });

  const bundle = await generateOptions('path/to/file', 'app');
  t.truthy(bundle.module);
});

test('generateOptions: other bundler types should throw an error', async t => {
  mockRequire('../package.json', {
    svest: {
      bundler: 'parcel',
      bundlerConfig: './test/fixtures/webpack.test.js',
    },
  });

  const err = await t.throwsAsync(generateOptions('path/to/file', 'app'));
  t.true(err instanceof Error);
  t.is(
    err.message,
    "Cannot recognise bundler option. Must be one of 'webpack' or 'rollup'."
  );
});
