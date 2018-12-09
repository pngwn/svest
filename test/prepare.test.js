import test from 'ava';

import {
  prepare,
  generateName,
  prepareTests,
  splitSource,
} from '../src/prepare';
const appRoot = require('app-root-path');

test('splitSource: it should split the string into component and test parts', t => {
  const file = `<Example />
      <script>
          import Example from "./example.html";
      </script>
      <script context="test">somefunc();</script>`;

  t.deepEqual(splitSource(file), {
    svelte: `<Example />
      <script>
          import Example from "./example.html";
      </script>`,
    test: `somefunc();`,
  });
});

test('splitSource: the `test` script can appear first', t => {
  const file = `<script context="test">somefunc();</script>
      <Example />
      <script>
          import Example from "./example.html";
      </script>`;

  t.deepEqual(splitSource(file), {
    svelte: `<Example />
      <script>
          import Example from "./example.html";
      </script>`,
    test: `somefunc();`,
  });
});

test('splitSource: the `test` script can appear second', t => {
  const file = `<Example />
      <script context="test">somefunc();</script>
      <script>
          import Example from "./example.html";
      </script>`;

  t.deepEqual(splitSource(file), {
    svelte: `<Example /><script>
          import Example from "./example.html";
      </script>`,
    test: `somefunc();`,
  });
});

test('splitSource: the `test` script can appear third', t => {
  const file = `<Example />
      <script>
          import Example from "./example.html";
      </script>
      <script context="test">somefunc();</script>`;

  t.deepEqual(splitSource(file), {
    svelte: `<Example />
      <script>
          import Example from "./example.html";
      </script>`,
    test: `somefunc();`,
  });
});

test('splitSource: the `test` script can appear fourth', t => {
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

  t.deepEqual(splitSource(file), {
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

test('splitSource: if there is no test script it should throw', t => {
  const file = `<Example />
    <script>
        import Example from "./example.html";
    </script>`;

  t.throws(
    () => splitSource(file),
    Error,
    'There is no test script present. Make sure a script element with `context="test"` is present in the test file.'
  );
});

test('splitSource: if there is more than one test script it should throw', t => {
  const file = `<Example />
  <script>
      import Example from "./example.html";
  </script>
  <script context="test">somefunc();</script>
  <script context="test">somefunc();</script>`;

  t.throws(
    () => splitSource(file),
    Error,
    'You can only have one test script per test file. Please remove any additional test scripts.'
  );
});

// this kills the whole kaboodle
// `</script>` is not valid but it should work escaped
// will revisit

test.skip('splitSource: `</script>` in the test block should be ignored', t => {
  const file = `<Example />
    <script>
        import Example from "./example.html";
    </script>
    <script context="test">console.log("</script>")</script>`;

  t.deepEqual(splitSource(file), {
    svelte: `<Example />
    <script>
        import Example from "./example.html";
    </script>`,
    test: `console.log("</script>")`,
  });
});

test('prepareTests: inject the necessary code', t => {
  const script = 'const func = str => str.toUpperCase();';

  t.is(
    prepareTests(script, 'Component'),
    `
    import { render } from 'svest';
    import Component from '../test-components/Component.html'

    const { container, window, ...testrefs } = render(Component);

    const func = str => str.toUpperCase();`
  );
});

test('generateName: generate a consistent name from the path', t => {
  t.is(
    generateName(`${appRoot}/test/Components/ComponentName.html`),
    'TestComponentsComponentName'
  );
});

test('generateName: non-alphanumeric characters should be stripped', t => {
  t.is(
    generateName(`${appRoot}/test/Compo-n^e~nts/Component-Name.html`),
    'TestComponentsComponentName'
  );
});

test('generateName: names with leading numbers should have `$` prepended', t => {
  t.is(
    generateName(`${appRoot}/123/Compo-n^e~nts/Component-Name.html`),
    '$123ComponentsComponentName'
  );
});

test('prepare: should process single file testponents correctly', t => {
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

  t.deepEqual(prepare(script, `${appRoot}/test/Components/App.html`), {
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
