import { generateOptions } from './bundle/generateOptions';
import stack from 'callsite';
import path from 'path';

export async function compile(relativeFilePath: string) {
  let theStack = stack()
    .filter(v => v.getFileName())
    .map(v => v.getFileName())
    .reverse();
  const index = theStack.findIndex(v => v === __filename) - 1;

  let filePath;

  try {
    filePath = path.resolve(path.dirname(theStack[index]), relativeFilePath);
  } catch (e) {
    throw new Error(e.message);
  }

  const [bundler, config] = generateOptions(filePath);
  let code;
  if (bundler === 'rollup') {
    const rollup = require('rollup').rollup;
    let bundle;
    try {
      bundle = await rollup(config.input);
      try {
        code = await bundle.generate(config.output);
        code = code.output ? code.output[0] : code;
      } catch (e) {
        throw new Error(e.message);
      }
    } catch (e) {
      throw new Error(e.message);
    }
  } else if (bundler === 'webpack') {
    code = await runWebpack(config);
  } else {
    throw new Error(
      "Bundler name not recognised. Must be one of 'rollup' or 'webpack'."
    );
  }

  // console.log(code, bundler, config);
  return { code: code.code, map: code.map };
}

async function runWebpack(config) {
  return new Promise((res, rej) => {
    const webpack = require('webpack');
    const MemoryFS = require('memory-fs');

    const fs = new MemoryFS({ boo: 'poo' });
    const compiler = webpack(config);
    compiler.outputFileSystem = fs;

    compiler.run((err, stats) => {
      if (err) rej(new Error(err));

      const info = stats.toJson();

      if (stats.hasErrors()) {
        rej(info.errors);
      }

      if (stats.hasWarnings()) {
        // eslint-disable-next-line
        console.warn(info.warnings);
      }
      const { path, filename } = stats.compilation.outputOptions;

      const code = fs.readFileSync(`${path}/${filename}`).toString();
      // const map = fs.readFileSync(`${path}/${filename}.map`).toString();
      res({ code });
    });
  });
}
