// import esm from 'esm';
const appRoot = require('app-root-path');

export function loadSvestConfig(): { bundler: string; bundlerConfig: string } {
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

  return config;
}

export function loadBundlerConfig(configPath: string) {
  let bundlerConfig;

  try {
    bundlerConfig = require(configPath).default || require(configPath);
  } catch (e) {
    try {
      bundlerConfig =
        require('esm')(module)(configPath).default ||
        require('esm')(module)(configPath);
    } catch {
      throw new Error(`Could not load bundler config from "${configPath}".`);
    }
  }

  return bundlerConfig;
}
