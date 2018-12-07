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
  return path;
}

export function prepareTests(testSource: string, name: string): string {
  return `
    import { render } from 'svest';
    import ${name} from '../TestComponents/${name}.html'

    const { container, window, ...testrefs } = render(${name});
    
    ${testSource}`;
}

export function prepare(source, path) {
  const { test, svelte } = splitSource(source);
  //
  //    generate path specific name for component
  //    prepare test script
  //    prepare test script and write
}
