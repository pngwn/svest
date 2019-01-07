import { compile } from './compile';
import { JSDOM } from 'jsdom';

export async function render(path: string, data: object = {}) {
  const code = await compile(path);

  const dom = new JSDOM(
    `
    <body>
      <div id="app"></div>
    </body>
    <script>
    ${code.code}
    new App({
      props: ${JSON.stringify(data)} ,
      target: document.getElementById('app')
    })
    </script>
    `,
    { runScripts: 'dangerously' }
  );

  const container = dom.window.document.getElementById('app');

  return { container, window: dom.window, ...dom.window.testrefs };
}
