import { compile } from '../src/compile';

const appRoot = require('app-root-path');

afterEach(() => jest.resetModules());

test('it should compile without dying: rollup', async () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'rollup',
      bundlerConfig: './test/fixtures/rollup.test.js',
    },
  });

  const file = `${appRoot}/test/fixtures/imported.html`;
  const { code, map } = await compile(file, 'app');

  expect(code).toBeTruthy();
  expect(map).toBeTruthy();
});

test('it should compile without dying: webpack', async () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'webpack',
      bundlerConfig: './test/fixtures/webpack.test.js',
    },
  });

  const file = `${appRoot}/test/fixtures/imported.html`;
  const { code, map } = await compile(file, 'app');

  expect(code).toBeTruthy();
  expect(map).toBeTruthy();
});

test('a bad webpack config should throw an error', async () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'webpack',
      bundlerConfig: './test/fixtures/webpack.badconfig.js',
    },
  });

  const file = `${appRoot}/test/fixtures/imported.html`;
  try {
    await compile(file, 'app');
  } catch (e) {
    expect(e).toBeTruthy();
  }
});

test('a really bad webpack config should also throw an error', async () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'webpack',
      bundlerConfig: './test/fixtures/webpack.badconfig.js',
    },
  });

  const file = `${appRoot}/test/fixtures/imported.html`;
  try {
    await compile(file, 'app');
  } catch (e) {
    expect(e).toBeTruthy();
  }
});
