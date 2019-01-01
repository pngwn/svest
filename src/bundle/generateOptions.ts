import { sep, normalize, join } from 'path';
import { generateRollup } from './generateRollup';
import { generateWebpack } from './generateWebpack';
import esm from 'esm';

const appRoot = require('app-root-path');

export function outputName(filePath: string): string {
  return normalize(filePath)
    .replace(appRoot, '')
    .replace(/\./g, '-')
    .split(sep)
    .join('-');
}

export async function generateOptions(filePath: string, name: string) {
  let config;
  try {
    config = require(`${appRoot}/svest.config.js`);
  } catch {
    try {
      config = require(`${appRoot}/package.json`).svest;
      if (config === undefined) {
        throw new Error();
      }
    } catch {
      throw new Error(
        "No config file detected. Ensure there is either a 'svest.config.js' file in your app root or a 'svest' field in your 'package.json'."
      );
    }
  }

  const configPath = normalize(join(appRoot.path, config.bundlerConfig));
  let bundlerConfig;

  try {
    bundlerConfig = require(configPath);
  } catch (e) {
    try {
      bundlerConfig = esm(module)(configPath).default;
    } catch {
      throw new Error(e);
    }
  }

  const output = outputName(filePath);

  if (config.bundler.toLowerCase() === 'rollup') {
    return generateRollup(filePath, name, output, bundlerConfig);
  } else if (config.bundler.toLowerCase() === 'webpack') {
    return generateWebpack(filePath, name, output, bundlerConfig);
  } else {
    throw new Error(
      "Cannot recognise bundler option. Must be one of 'webpack' or 'rollup'."
    );
  }
}
