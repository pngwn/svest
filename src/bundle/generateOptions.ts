import { sep, normalize } from 'path';
import { generateRollup } from './generateRollup';

const appRoot = require('app-root-path');

// const pkg = require(`${appRoot}/package.json`);
// const { bundlerConfig = {} } = pkg.svest;

export function outputName(filePath: string): string {
  return normalize(filePath)
    .replace(appRoot, '')
    .replace(/\./g, '-')
    .split(sep)
    .join('-');
}

export function generateOptions(filePath: string, name: string) {
  const output = outputName(filePath);
  return generateRollup(filePath, name, output);
}
