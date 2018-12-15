import test from 'ava';
import { compile } from '../src/compile';

const appRoot = require('app-root-path');

test('it should compile without dying', async t => {
  const file = `${appRoot}/test/fixtures/imported.html`;
  t.notThrowsAsync(async () => await compile(file));
});
