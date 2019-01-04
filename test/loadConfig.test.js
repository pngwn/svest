import { loadSvestConfig, loadBundlerConfig } from '../src/bundle/loadConfig';
const appRoot = require('app-root-path');

afterEach(() => jest.resetModules());

describe('loadSvestConfig', () => {
  test('if there is no test config or svest field in pkg.json it should throw an error', async () => {
    try {
      await loadSvestConfig();
    } catch (e) {
      expect(e).toEqual(
        new Error(
          "No config file detected. Ensure there is either a 'svest.config.js' file in your app root or a 'svest' field in your 'package.json'."
        )
      );
    }
  });

  test('rollup settings should be processed correctly', async () => {
    jest.setMock('../package.json', {
      svest: {
        bundler: 'rollup',
        bundlerConfig: './test/fixtures/rollup.test.js',
      },
    });

    const config = await loadSvestConfig();

    expect(config.bundler).toBe('rollup');
  });

  test('webpack settings should be processed correctly', async () => {
    jest.setMock('../package.json', {
      svest: {
        bundler: 'webpack',
        bundlerConfig: './test/fixtures/webpack.test.js',
      },
    });

    const config = await loadSvestConfig();
    expect(config.bundler).toBe('webpack');
  });
});

describe('loadWebpack', () => {
  test('if there is no bundler config it should throw an error', async () => {
    const configPath = 'path/that/does/not/exist';
    try {
      await loadBundlerConfig(configPath);
    } catch (e) {
      expect(e).toEqual(
        new Error(`Could not load bundler config from "${configPath}".`)
      );
    }
  });

  test('rollup configs should be loaded correctly', async () => {
    const config = await loadBundlerConfig(
      `${appRoot}/test/fixtures/rollup.test.js`
    );

    expect(typeof config.input).toBe('object');
  });

  test('webpack configs should be loaded correctly', async () => {
    const config = await loadBundlerConfig(
      `${appRoot}/test/fixtures/webpack.test.js`
    );

    expect(typeof config.module).toBe('object');
  });

  test('webpack configs should be loaded correctly', async () => {
    const config = await loadBundlerConfig(
      `${appRoot}/test/fixtures/rollup.testmod.js`
    );

    expect(typeof config.input).toBe('object');
  });
});
