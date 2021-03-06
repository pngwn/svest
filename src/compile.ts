/* eslint-disable */
import { generateOptions } from './bundle/generateOptions';
import { getPath } from './findLocation';
import { isAbsolute } from 'path';

export async function compile(path: string) {
  const filePath = isAbsolute(path) ? path : getPath(path);

  const [bundler, config] = generateOptions(filePath);
  let code;

  if (bundler === 'rollup') {
    const rollup = require('rollup').rollup;
    let bundle;
    try {
      bundle = await rollup(config.input);
      try {
        code = await bundle.write(config.output);
        code = code.output ? code.output[0] : code;
      } catch (e) {
        throw new Error(e.message);
      }
    } catch (e) {
      throw new Error(e.message);
    }
  } else if (bundler === 'webpack') {
    // I'm going to bail on webpack for the time being
    throw new Error('Webpack is not currently Supported. Check back soon!');
    code = await runWebpack(config);
    code = new Function(`${code.code}`)();
  } else {
    throw new Error(
      "Bundler name not recognised. Must be one of 'rollup' or 'webpack'."
    );
  }

  return { code: code.code };
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

      res({ code });
    });
  });
}
