import { compile } from './compile';
import deasync from 'deasync';

export const process = (_s, filePath: string, _c, _o) => {
  let code, map, error;
  compile(filePath, 'App')
    .then(comp => {
      console.log(comp);
      code = comp.code;
      map = comp.map;
    })
    .catch(e => {
      console.log(e);
      error = e;
    });

  deasync.loopWhile(() => {
    // console.log('hello');
    return !error && (!code && !map);
  });

  // while (!code || !error) {}
  if (error) {
    throw new Error(error);
  }

  return { code, map };
};
