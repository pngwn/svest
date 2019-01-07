import { render } from '../src/render';

test('it should render a component to the dom and return a container', async () => {
  const { container, window } = await render('./fixtures/example.html');
  expect(container).toBeTruthy();
  expect(window).toBeTruthy();

  expect(container.getElementsByTagName('h1')[0].innerHTML).toBe('Hello');
});

test('should be able to pass props', async () => {
  const { container } = await render('./fixtures/props.html', {
    name: 'Frank',
  });

  expect(container.getElementsByTagName('h1')[0].innerHTML).toBe('Frank');
});
