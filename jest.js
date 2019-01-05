'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deasync = _interopDefault(require('deasync'));

const compile = require('./dist/main.cjs').compile;
const process = (_s, filePath, _c, _o) => {
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
