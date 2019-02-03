import { sep, normalize } from 'path';
import { generateRollup } from './generateRollup';
import { generateWebpack } from './generateWebpack';

const appRoot = require('app-root-path');

export function outputName(filePath: string): string {
  return normalize(filePath)
    .replace(appRoot, '')
    .replace(/\./g, '-')
    .split(sep)
    .join('-');
}

export function generateOptions(filePath: string): [string, any] {
  let config;
  try {
    config = require(`${appRoot}/svest.config.js`);
    config = config.default || config;
  } catch (e) {
    throw new Error(
      "Ensure there is a 'svest.config.js' file in your root directory."
    );
  }

  const output = outputName(filePath);

  if (config.bundler.toLowerCase() === 'rollup') {
    return ['rollup', generateRollup(filePath, output, config)];
  } else if (config.bundler.toLowerCase() === 'webpack') {
    return [
      'webpack',
      generateWebpack(filePath, output, {
        plugins: config.plugins,
        module: config.module,
      }),
    ];
  } else {
    throw new Error(
      "Cannot recognise bundler option. Must be one of 'webpack' or 'rollup'."
    );
  }
}
