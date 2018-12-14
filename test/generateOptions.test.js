import test from 'ava';
import { generateRollup, outputName } from '../src/generateOptions';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const appRoot = require('app-root-path');

test('outputName: output name should return a string based upon the path', t => {
  t.is(outputName(`${appRoot}/src/path/file.html`), '-src-path-file-html');
});

test('generateRollup: should generate a valid rollup config', t => {
  const validRollup = {
    input: {
      input: 'path/to/file',
      perf: false,
    },
    output: {
      generate: 'dom',
      dev: false,
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: `${appRoot}/__test-cache/-path-to-file.js`,
    },
  };

  t.deepEqual(
    generateRollup('path/to/file', 'app', '-path-to-file', {}),
    validRollup
  );
});

test('generateRollup: should combine configs properly', t => {
  const userConfig = {
    input: {
      plugins: [resolve(), commonjs()],
    },
  };

  const result = generateRollup(
    'path/to/file',
    'app',
    '-path-to-file',
    userConfig
  );

  t.plan(2);
  t.true(result.input.plugins[0].name === 'node-resolve');
  t.true(result.input.plugins[1].name === 'commonjs');
});

// mock-imports
// later
test('generateRollup: should combine configs properly, retaining user defined plugins', t => {
  const userConfig = {
    input: {
      plugins: [resolve(), commonjs()],
    },
  };

  const result = generateRollup(
    'path/to/file',
    'app',
    '-path-to-file',
    userConfig
  );

  t.plan(2);
  t.true(result.input.plugins[0].name === 'node-resolve');
  t.true(result.input.plugins[1].name === 'commonjs');
});
