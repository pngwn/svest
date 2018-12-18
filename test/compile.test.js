import test from 'ava';
import { compile } from '../src/compile';
import fs from 'fs-extra';
import { normalize } from 'path';

const appRoot = require('app-root-path');

const clean = async () =>
  await fs.remove(normalize(`${appRoot}/.svest_output`));

test('it should compile without dying', async t => {
  const file = `${appRoot}/test/fixtures/imported.html`;
  await compile(file, 'app');
  const compiled = await fs.readFile(
    normalize(`${appRoot}/.svest_output/-test-fixtures-imported-html.js`),
    'utf8'
  );
  t.truthy(compiled);
  await clean();
});
