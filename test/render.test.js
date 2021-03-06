import { render, fireEvent, getNodeText } from '../src/render';
import 'jest-dom/extend-expect';

test('it should render a component to the dom and return a container', async () => {
  const { container, window, cleanup } = await render(
    './fixtures/example.html'
  );
  expect(container).toBeTruthy();
  expect(window).toBeTruthy();

  expect(container.getElementsByTagName('h1')[0].innerHTML).toBe('Hello');
  cleanup();
});

test('should be able to pass props', async () => {
  const { container, cleanup } = await render('./fixtures/props.html', {
    name: 'Frank',
  });

  expect(container.getElementsByTagName('h1')[0].innerHTML).toBe('Frank');
  cleanup();
});

test('should work with dom-testing-library', async () => {
  const { getByText, cleanup } = await render('./fixtures/domtest.html', {
    name: 'Frank',
  });

  const name = getByText('Frank');
  const button = getByText('Click');

  expect(name).toHaveTextContent('Frank');
  expect(button).toHaveTextContent('Click');

  await fireEvent.click(button);

  expect(getByText('I AM A WALRUS')).toBeTruthy();
  expect(name).toHaveTextContent('Jeremy');

  cleanup();
});

test('component vars should be available', async () => {
  const { vars, cleanup } = await render('./fixtures/App.html');

  expect(vars.input.value).toBe('');

  await fireEvent.click(vars.button);
  expect(vars.input.value).toBe('Benjamin');

  vars.input.value = 'Franklin';
  await fireEvent.input(vars.input);
  expect(getNodeText(vars.p)).toBe('Hello Franklin!');

  cleanup();
});
