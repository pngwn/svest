const appRoot = require('app-root-path');
import { sep } from 'path';

interface SourceObject {
  svelte: string;
  test: string;
}

export function splitSource(source: string): SourceObject {
  const re = new RegExp(/([^]*)<script context="test">([^]*?)<\/script>([^]*)/);
  const reg = source.match(
    new RegExp(/<script context="test">([^]*?)<\/script>/g)
  );

  if (reg === null)
    throw new Error(
      'There is no test script present. Make sure a script element with `context="test"` is present in the test file.'
    );
  if (reg.length > 1)
    throw new Error(
      'You can only have one test script per test file. Please remove any additional test scripts.'
    );

  const matches = re.exec(source);

  return {
    test: matches[2].trim(),
    svelte: matches[1].trim() + matches[3].trim(),
  };
}

export function generateName(path: string): string {
  const re = new RegExp(`${appRoot}|\.html|\.svelte|${sep}|[^a-zA-Z0-9]`, 'g');
  return path
    .replace(re, '')
    .replace(/(^[a-zA-Z])([^]*)/g, (_, p1, p2) => `${p1.toUpperCase()}${p2}`)
    .replace(/^[0-9]/, '$$$&');
}

export function prepareTests(testSource: string, name: string): string {
  return `
    import { render } from 'svest';
    import ${name} from '../test-components/${name}.html'

    const { container, window, ...testrefs } = render(${name});

    ${testSource}`;
}

export function prepare(source, componentPath) {
  const { test, svelte } = splitSource(source);
  const name = generateName(componentPath);

  return {
    test: prepareTests(test, name),
    svelte,
  };
}
