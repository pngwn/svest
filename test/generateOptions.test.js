import test from 'ava';
const mockRequire = require('mock-require');

// mockRequire('../package.json', {
//   svest: { bundler: 'rollup', bundlerConfig: './test/fixtures/rollup.test.js' },
// });
// const { svest } = require('../package.json');

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

test('generateOptions: config type and location passed to svest should be used', async t => {
  mockRequire('../package.json', {
    svest: {
      bundler: 'rollup',
      bundlerConfig: './test/fixtures/rollup.test.js',
    },
  });

  const bundle = await generateOptions('path/to/file', 'app');
  t.false(bundle.input.perf);
});
