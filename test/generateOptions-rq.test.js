beforeEach(() => {
  jest.resetModules();
});

afterAll(() => {
  jest.resetModules();
});

test('generateOptions: rollup configs should be processed correctly', async () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'rollup',
      bundlerConfig: './test/fixtures/rollup.test.js',
    },
  });
  const { generateOptions } = require('../src/bundle/generateOptions');

  const bundle = await generateOptions('path/to/file', 'app');
  expect(bundle.input.perf).toBeFalsy();
});

test('generateOptions: webpack configs should be processed correctly', async () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'webpack',
      bundlerConfig: './test/fixtures/webpack.test.js',
    },
  });
  const { generateOptions } = require('../src/bundle/generateOptions');

  const bundle = await generateOptions('path/to/file', 'app');
  expect(bundle.module).toBeTruthy();
});

test('generateOptions: other bundler types should throw an error', async () => {
  jest.setMock('../package.json', {
    svest: {
      bundler: 'parcel',
      bundlerConfig: './test/fixtures/webpack.test.js',
    },
  });
  const { generateOptions } = require('../src/bundle/generateOptions');

  try {
    await generateOptions('path/to/file', 'app');
  } catch (e) {
    expect(e).toEqual(
      new Error(
        "Cannot recognise bundler option. Must be one of 'webpack' or 'rollup'."
      )
    );
  }
});
