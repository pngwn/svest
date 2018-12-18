import test from 'ava';
import { generateRollup, outputName } from '../src/generateOptions';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';

const appRoot = require('app-root-path');

test('outputName: output name should return a string based upon the path', t => {
  t.is(outputName(`${appRoot}/src/path/file.html`), '-src-path-file-html');
});

test('generateRollup: should generate a valid rollup config', t => {
  const { input: expInput, output: expOutput } = {
    input: {
      input: 'path/to/file',
      perf: false,
      plugins: [svelte()],
    },
    output: {
      generate: 'dom',
      dev: false,
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: `${appRoot}/.svest_output/-path-to-file.js`,
    },
  };
  const { input, output } = generateRollup(
    'path/to/file',
    'app',
    '-path-to-file',
    {}
  );

  t.plan(4);
  t.deepEqual(output, expOutput);
  t.is(input.input, expInput.input);
  t.is(input.perf, expInput.perf);
  t.true(input.plugins[0].name === expInput.plugins[0].name);
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

  t.plan(3);
  t.true(result.input.plugins[0].name === 'node-resolve');
  t.true(result.input.plugins[1].name === 'commonjs');
  t.true(result.input.plugins[2].name === 'svelte');
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
