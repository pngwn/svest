import { render } from '../src/render';

let window;
let container;
let cleanup;
beforeAll(async () => {
  const c = await render('../test-components/TestfixturesApp.html');
  window = c.window;
  container = c.container;
  cleanup = c.cleanup;
});

afterAll(() => {
  cleanup();
});

test('smoke', () => {
  expect(container).toBeTruthy();
});
