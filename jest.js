const compile = require('./dist/main.es').compile;
const deasync = require('deasync');

// eslint-disable-next-line
const process = (_s, filePath: string, _c, _o) => {
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

exports.process = process;
