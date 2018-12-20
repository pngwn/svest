import test from 'ava';

import { outputName } from '../src/bundle/generateOptions';

const appRoot = require('app-root-path');

test('outputName: output name should return a string based upon the path', t => {
  t.is(outputName(`${appRoot}/src/path/file.html`), '-src-path-file-html');
});
