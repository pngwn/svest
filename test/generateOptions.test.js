import { outputName, generateOptions } from '../src/bundle/generateOptions';

const appRoot = require('app-root-path');

test('outputName: output name should return a string based upon the path', () => {
  expect(outputName(`${appRoot}/src/path/file.html`)).toBe(
    '-src-path-file-html'
  );
});

test('generateOptions: if there is no test config or svest field in pkg.json it should throw an error', async () => {
  try {
    await generateOptions('some/path/to/file.js', 'app');
  } catch (e) {
    expect(e).toEqual(
      new Error(
        "No config file detected. Ensure there is either a 'svest.config.js' file in your app root or a 'svest' field in your 'package.json'."
      )
    );
  }
});
