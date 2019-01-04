import {
  prepare,
  generateName,
  prepareTests,
  splitSource,
} from '../src/prepare';
const appRoot = require('app-root-path');

test('splitSource: it should split the string into component and test parts', () => {
  const file = `<Example />
      <script>
          import Example from "./example.html";
      </script>
      <script context="test">somefunc();</script>`;

  expect(splitSource(file)).toEqual({
    svelte: `<Example />
      <script>
          import Example from "./example.html";
      </script>`,
    test: `somefunc();`,
  });
});

test('splitSource: the `test` script can appear first', () => {
  const file = `<script context="test">somefunc();</script>
      <Example />
      <script>
          import Example from "./example.html";
      </script>`;

  expect(splitSource(file)).toEqual({
    svelte: `<Example />
      <script>
          import Example from "./example.html";
      </script>`,
    test: `somefunc();`,
  });
});

test('splitSource: the `test` script can appear second', () => {
  const file = `<Example />
      <script context="test">somefunc();</script>
      <script>
          import Example from "./example.html";
      </script>`;
  expect(splitSource(file)).toEqual({
    svelte: `<Example /><script>
          import Example from "./example.html";
      </script>`,
    test: `somefunc();`,
  });
});

test('splitSource: the `test` script can appear third', () => {
  const file = `<Example />
      <script>
          import Example from "./example.html";
      </script>
      <script context="test">somefunc();</script>`;
  expect(splitSource(file)).toEqual({
    svelte: `<Example />
      <script>
          import Example from "./example.html";
      </script>`,
    test: `somefunc();`,
  });
});

test('splitSource: the `test` script can appear fourth', () => {
  const file = `<Example />
      <script>
          import Example from "./example.html";
      </script>
      <style>
        .css{
          font-size: 200px;
          height: 20px;
          width: 20px;
        }
      </style>
      <script context="test">somefunc();</script>`;

  expect(splitSource(file)).toEqual({
    svelte: `<Example />
      <script>
          import Example from "./example.html";
      </script>
      <style>
        .css{
          font-size: 200px;
          height: 20px;
          width: 20px;
        }
      </style>`,
    test: `somefunc();`,
  });
});

test('splitSource: if there is no test script it should throw', () => {
  const file = `<Example />
    <script>
        import Example from "./example.html";
    </script>`;

  expect(() => splitSource(file)).toThrowError(
    'There is no test script present. Make sure a script element with `context="test"` is present in the test file.'
  );
});

test('splitSource: if there is more than one test script it should throw', () => {
  const file = `<Example />
  <script>
      import Example from "./example.html";
  </script>
  <script context="test">somefunc();</script>
  <script context="test">somefunc();</script>`;

  expect(() => splitSource(file)).toThrowError(
    'You can only have one test script per test file. Please remove any additional test scripts.'
  );
});

// this kills the whole kaboodle
// `</script>` is not valid but it should work escaped
// will revisit

test.skip('splitSource: `</script>` in the test block should be ignored', () => {
  const file = `<Example />
    <script>
        import Example from "./example.html";
    </script>
    <script context="test">console.log("</script>")</script>`;

  expect(splitSource(file)).toEqual({
    svelte: `<Example />
  <script>
      import Example from "./example.html";
  </script>`,
    test: `console.log("</script>")`,
  });
});

test('prepareTests: inject the necessary code', () => {
  const script = 'const func = str => str.toUpperCase();';
  expect(prepareTests(script, 'Component')).toBe(`
    import { render } from 'svest';
    import Component from '../test-components/Component.html'

    const { container, window, ...testrefs } = render(Component);

    const func = str => str.toUpperCase();`);
});

test('generateName: generate a consistent name from the path', () => {
  expect(generateName(`${appRoot}/test/Components/ComponentName.html`)).toBe(
    'TestComponentsComponentName'
  );
});

test('generateName: non-alphanumeric characters should be stripped', () => {
  expect(
    generateName(`${appRoot}/test/Compo-n^e~nts/Component-Name.html`)
  ).toBe('TestComponentsComponentName');
});

test('generateName: names with leading numbers should have `$` prepended', () => {
  expect(generateName(`${appRoot}/123/Compo-n^e~nts/Component-Name.html`)).toBe(
    '$123ComponentsComponentName'
  );
});

test('prepare: should process single file testponents correctly', () => {
  const script = `<Example />

<script>
  import Example from './example.html';
</script>

<script context="test">
  test('it should do some test', () => {
    expect(true).toBe(true);
  })
</script>

<style>
  .css {
    font-family: monospace;
  }
</style>`;

  expect(prepare(script, `${appRoot}/test/Components/App.html`)).toEqual({
    test: `
    import { render } from 'svest';
    import TestComponentsApp from '../test-components/TestComponentsApp.html'

    const { container, window, ...testrefs } = render(TestComponentsApp);

    test('it should do some test', () => {
    expect(true).toBe(true);
  })`,
    svelte: `<Example />

<script>
  import Example from './example.html';
</script><style>
  .css {
    font-family: monospace;
  }
</style>`,
  });
});
