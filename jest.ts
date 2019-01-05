const compile = require('./dist/main.cjs').compile;
import deasync from 'deasync';

export const process = (_s, filePath, _c, _o) => {
  let code;
  let map;
  let error;
  compile(filePath, 'App')
    .then(comp => {
      code = comp.code;
      map = comp.map;
    })
    .catch(e => {
      error = e;
    });

  deasync.loopWhile(() => {
    return !error && (!code && !map);
  });

  if (error) {
    throw new Error(error);
  }

  return { code, map };
};
