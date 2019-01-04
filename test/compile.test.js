import { compile } from '../src/compile';
import fs from 'fs-extra';
import { normalize } from 'path';

const appRoot = require('app-root-path');

const clean = async () =>
  await fs.remove(normalize(`${appRoot}/.svest_output`));

// skipping for now, will retest when config loading functionality has been implemented
test.skip('it should compile without dying', async t => {
  const file = `${appRoot}/test/fixtures/imported.html`;
  const compiled = await compile(file, 'app');

  t.truthy(compiled);
  await clean();
});
