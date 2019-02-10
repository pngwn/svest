const appRoot = require('app-root-path');
import svelte from 'rollup-plugin-svelte';
import { prepareSvelte } from '../prepare';

export function generateRollup(
  filePath: string,
  output: string,
  config: any
): any {
  const rollupPlugins =
    (config.rollupPlugins &&
      config.rollupPlugins.filter(v => v.name !== 'svelte')) ||
    [];

  const compilerOptions = config.compilerOptions || {};
  const preprocess =
    config.compilerOptions && config.compilerOptions.preprocess
      ? config.compilerOptions.preprocess
      : [];

  const newConfig = {
    input: {
      input: filePath,
      onwarn: () => false,
      perf: false,
      plugins: rollupPlugins.concat(
        svelte({
          //...compilerOptions,
          preprocess: {
            markup({ content, filename }) {
              if (filename === filePath) {
                return { code: prepareSvelte(content).file, map: '' };
              }
            },
          },
        })
      ),
    },
    output: {
      dev: true,
      sourcemap: true,
      format: 'cjs',
      name: 'App',
      dir: `${appRoot}/.svest_output/compiled/${output}`,
    },
  };
  return newConfig;
}
