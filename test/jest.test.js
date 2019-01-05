import { process } from '../jest';

const appRoot = require('app-root-path');

beforeAll(() => jest.resetModules());
afterEach(() => jest.resetModules());

test('it should return correctly even though the function is sync', () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'rollup',
      bundlerConfig: './test/fixtures/rollup.test.js',
    },
  });

  const { code, map } = process(
    '',
    `${appRoot}/test/fixtures/imported.html`,
    '',
    ''
  );

  expect(code).toBeTruthy();
  expect(map).toBeTruthy();
});

test('it should fail correctly when something goes wrong: rollup', () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'rollup',
      bundlerConfig: './test/fixtures/rollup.test.js',
    },
  });

  expect(() =>
    process('', `${appRoot}/test/fixtures/imprted.html`, '', '')
  ).toThrow();
});

test('it should fail correctly when something goes wrong:webpack', () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'webpack',
      bundlerConfig: './test/fixtures/webpack.badconfig.js',
    },
  });

  expect(() =>
    process('', `${appRoot}/test/fixtures/imprted.html`, '', '')
  ).toThrow();
});
