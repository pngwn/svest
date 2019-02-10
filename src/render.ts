import { compile } from './compile';
import { outputName } from './bundle/generateOptions';
import { getQueriesForElement } from 'dom-testing-library';
import { getPath } from './findLocation';
import { isAbsolute, basename } from 'path';

const appRoot = require('app-root-path');

export const render = async (path: string, data: object = {}) => {
  const base = basename(path).split('.')[0];
  const filePath = isAbsolute(path) ? path : getPath(path);

  await compile(filePath);
  const App = require(`${appRoot}/.svest_output/compiled/${outputName(
    filePath
  )}/${base}.js`);

  const container = document.body.appendChild(document.createElement('div'));
  const component = new App({
    target: container,
    props: data,
  });

  return {
    container,
    window,
    // ...dom.window.testrefs,
    ...getQueriesForElement(container),
    cleanup: () => component.$destroy(),
    //@ts-ignore
    vars: window.vars,
  };
};

export { fireEvent, getNodeText } from 'dom-testing-library';
