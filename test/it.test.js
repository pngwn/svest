import { compile } from '../src/main';

test('smoke', async () => {
  const App = await compile('./fixtures/imported.html');
  expect(App).toBeTruthy();
});
