import { generateRollup } from '../src/bundle/generateRollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';

const appRoot = require('app-root-path');

test('should generate a valid rollup config', () => {
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

  expect(output).toEqual(expOutput);
  expect(input.input).toEqual(expInput.input);
  expect(input.perf).toEqual(expInput.perf);
  expect(input.plugins[0].name).toEqual(expInput.plugins[0].name);
});

test('should combine configs properly', () => {
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

  expect(result.input.plugins[0].name).toBe('svelte');
  expect(result.input.plugins[1].name).toBe('node-resolve');
  expect(result.input.plugins[2].name).toBe('commonjs');
});

// mock-imports
// later
test('if there is no svelte plugin present, it should throw', () => {
  const userConfig = {
    input: {
      plugins: [resolve(), commonjs()],
    },
  };

  expect(() =>
    generateRollup('path/to/file', 'app', '-path-to-file', userConfig)
  ).toThrowError(
    'Your rollup config must include rollup-plugin-svelte in order to compile Svelte components.'
  );
});
