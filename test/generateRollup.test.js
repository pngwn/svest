import { generateRollup } from '../src/bundle/generateRollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';

const appRoot = require('app-root-path');

test.skip('should generate a valid rollup config', () => {
  const { input: expInput, output: expOutput } = {
    input: {
      input: 'path/to/file',
      perf: false,
      plugins: [svelte()],
    },
    output: {
      generate: 'dom',
      dev: false,
      sourcemap: 'inline',
      format: 'iife',
      name: 'app',
      file: `${appRoot}/.svest_output/-path-to-file.js`,
    },
  };
  const { input, output } = generateRollup('path/to/file', '-path-to-file', [
    svelte(),
  ]);

  expect(output).toEqual(expOutput);
  expect(input.input).toEqual(expInput.input);
  expect(input.perf).toEqual(expInput.perf);
  expect(input.plugins[0].name).toEqual(expInput.plugins[0].name);
});

test('should combine configs properly', () => {
  const rollupPlugins = [svelte(), resolve(), commonjs()];

  const result = generateRollup('path/to/file', '-path-to-file', {
    rollupPlugins,
  });

  expect(result.input.plugins[0].name).toBe('node-resolve');
  expect(result.input.plugins[1].name).toBe('commonjs');
  expect(result.input.plugins[2].name).toBe('svelte');
});

// mock-imports
// later
test.skip('if there is no svelte plugin present, it should throw', () => {
  const rollupPlugins = [resolve(), commonjs()];

  expect(() =>
    generateRollup('path/to/file', '-path-to-file', { rollupPlugins })
  ).toThrowError(
    'Your rollup config must include rollup-plugin-svelte in order to compile Svelte components.'
  );
});

test.skip('if there is no svelte plugin present, it should throw', () => {
  const rollupPlugins = [resolve(), commonjs()];

  expect(() =>
    generateRollup('path/to/file', '-path-to-file', { rollupPlugins })
  ).toThrowError(
    'Your rollup config must include rollup-plugin-svelte in order to compile Svelte components.'
  );
});
