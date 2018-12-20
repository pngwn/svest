import test from 'ava';

import { generateRollup } from '../src/bundle/generateRollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';

const appRoot = require('app-root-path');

test('should generate a valid rollup config', t => {
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
    { input: { plugins: [svelte()] } }
  );

  t.plan(4);
  t.deepEqual(output, expOutput);
  t.is(input.input, expInput.input);
  t.is(input.perf, expInput.perf);
  t.true(input.plugins[0].name === expInput.plugins[0].name);
});

test('should combine configs properly', t => {
  const userConfig = {
    input: {
      plugins: [svelte(), resolve(), commonjs()],
    },
  };

  const result = generateRollup(
    'path/to/file',
    'app',
    '-path-to-file',
    userConfig
  );

  t.plan(3);
  t.true(result.input.plugins[0].name === 'svelte');
  t.true(result.input.plugins[1].name === 'node-resolve');
  t.true(result.input.plugins[2].name === 'commonjs');
});

// mock-imports
// later
test('if there is no svelte plugin present, it should throw', t => {
  const userConfig = {
    input: {
      plugins: [resolve(), commonjs()],
    },
  };

  t.throws(() =>
    generateRollup('path/to/file', 'app', '-path-to-file', userConfig)
  );
});

test('if there is no svelte plugin present, it should throw with a helpful error message', t => {
  const userConfig = {
    input: {
      plugins: [resolve(), commonjs()],
    },
  };

  t.throws(
    () => generateRollup('path/to/file', 'app', '-path-to-file', userConfig),
    'Your rollup config must include rollup-plugin-svelte in order to compile Svelte components.'
  );
});
