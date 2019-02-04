import { compile } from './compile';
import { outputName } from './bundle/generateOptions';
import { getQueriesForElement } from 'dom-testing-library';

const appRoot = require('app-root-path');

export const render = async (path: string, data: object = {}) => {
  await compile(path);
  const App = require(`${appRoot}/.svest_output/compiled/-test-${outputName(
    path
  )}.js`);

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
    ...window.vars,
  };
};

export { fireEvent, getNodeText } from 'dom-testing-library';
