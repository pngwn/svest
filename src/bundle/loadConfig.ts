const appRoot = require('app-root-path');

export function loadSvestConfig() {
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

export function loadBundlerConfig() {}
