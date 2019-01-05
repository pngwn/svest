import { sep, normalize, join } from 'path';
import { generateRollup } from './generateRollup';
import { generateWebpack } from './generateWebpack';
import { loadSvestConfig, loadBundlerConfig } from './loadConfig';

const appRoot = require('app-root-path');

export function outputName(filePath: string): string {
  return normalize(filePath)
    .replace(appRoot, '')
    .replace(/\./g, '-')
    .split(sep)
    .join('-');
}

export function generateOptions(filePath: string, name: string): [string, any] {
  const config = loadSvestConfig();
  const configPath = normalize(join(appRoot.path, config.bundlerConfig));
  const bundlerConfig = loadBundlerConfig(configPath);
  const output = outputName(filePath);

  if (config.bundler.toLowerCase() === 'rollup') {
    return ['rollup', generateRollup(filePath, name, output, bundlerConfig)];
  } else if (config.bundler.toLowerCase() === 'webpack') {
    return ['webpack', generateWebpack(filePath, name, output, bundlerConfig)];
  } else {
    throw new Error(
      "Cannot recognise bundler option. Must be one of 'webpack' or 'rollup'."
    );
  }
}
