import { generateName, prepareTests, splitSource } from './prepare';
const appRoot = require('app-root-path');

// There are cases these tests do not cover, many of them.
// `script` closing tags that appear inside the test block will kill it
// `</script>` is not valid in svelte it seems, skipped failing test below for the hell of it.

describe('prepare.splitSource', () => {
  test('it should split the string into component and test parts', () => {
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

  test('the `test` script can appear first', () => {
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

  test('the `test` script can appear second', () => {
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

  test('the `test` script can appear third', () => {
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

  test('the `test` script can appear fourth', () => {
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

  test('if there is no test script it should throw', () => {
    const file = `<Example />
    <script>
        import Example from "./example.html";
    </script>`;

    expect(() => splitSource(file)).toThrowError(
      'There is no test script present. Make sure a script element with `context="test"` is present in the test file.'
    );
  });

  test('if there is more than one test script it should throw', () => {
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

  // failing test examples
  test.skip('`</script>` in the test block should be ignore', () => {
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
});

describe('prepare.testSource', () => {
  test('inject the necessary code', () => {
    const script = 'const func = str => str.toUpperCase();';

    expect(prepareTests(script, 'Component')).toBe(`
    import { render } from 'svest';
    import Component from '../TestComponents/Component.html'

    const { container, window, ...testrefs } = render(Component);

    const func = str => str.toUpperCase();`);
  });
});

describe('prepare.generateName', () => {
  test('generate a consistent name from the path', () => {
    expect(generateName(`${appRoot}/test/Components/ComponentName.html`)).toBe(
      'TestComponentsComponentName'
    );
  });

  test('non-alphanumeric characters should be stripped', () => {
    expect(
      generateName(`${appRoot}/test/Compo-n^e~nts/Component-Name.html`)
    ).toBe('TestComponentsComponentName');
  });

  test('names with leading numbers should have `$` prepended', () => {
    expect(
      generateName(`${appRoot}/123/Compo-n^e~nts/Component-Name.html`)
    ).toBe('$123ComponentsComponentName');
  });
});
