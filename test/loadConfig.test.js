import { loadSvestConfig } from '../src/bundle/loadConfig';

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

  test('rollup configs should be processed correctly', async () => {
    jest.setMock('../package.json', {
      svest: {
        bundler: 'rollup',
        bundlerConfig: './test/fixtures/rollup.test.js',
      },
    });

    const config = await loadSvestConfig();

    expect(config.bundler).toBe('rollup');
  });

  test('webpack configs should be processed correctly', async () => {
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
