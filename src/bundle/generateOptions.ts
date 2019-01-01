import { sep, normalize, resolve, join } from 'path';
// import fse from 'fs-extra';
import { generateRollup } from './generateRollup';
import esm from 'esm';
// import { svest } from 'src/main';

const appRoot = require('app-root-path');

// const pkg = require(`${appRoot}/package.json`);
// const { bundlerConfig, bundler } = pkg.svest;

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

  const configPath = join(appRoot.path, config.bundlerConfig);
  let bundlerConfig;

  try {
    bundlerConfig = require(configPath);
    console.log(bundlerConfig);
  } catch (e) {
    try {
      bundlerConfig = esm(module)(configPath).default;
    } catch {
      throw new Error(e);
    }
  }

  const output = outputName(filePath);
  return generateRollup(filePath, name, output, bundlerConfig);
}
