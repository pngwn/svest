const compile = require('../dist/main.cjs.js').compile;
import test from 'ava';

test('smoke', async t => {
  // await t.throwsAsync(
  //   async () => {
  //     await compile('./fixtures/imported.html');
  //   },
  //   { instanceOf: TypeError, message: '🦄' }
  // );
  const App = await compile('./fixtures/imported.html');
  t.plan(1);
  t.truthy(App);
});
