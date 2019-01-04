import { compile } from '../src/compile';

const appRoot = require('app-root-path');

afterAll(() => jest.resetModules());

jest.setMock('../package.json', {
  svest: {
    bundler: 'rollup',
    bundlerConfig: './test/fixtures/rollup.test.js',
  },
});

test('it should compile without dying', async () => {
  const file = `${appRoot}/test/fixtures/imported.html`;
  const compiled = await compile(file, 'app');

  expect(compiled).toBeTruthy();
});
