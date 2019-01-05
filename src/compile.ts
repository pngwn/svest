import { generateOptions } from './bundle/generateOptions';

export async function compile(filePath: string, name: string) {
  const [bundler, config] = generateOptions(filePath, name);
  let code;
  if (bundler === 'rollup') {
    const rollup = require('rollup').rollup;
    let bundle;
    try {
      bundle = await rollup(config.input);
      try {
        code = await bundle.generate(config.output);
      } catch (e) {
        throw new Error(e);
      }
    } catch (e) {
      throw new Error(e);
    }
  } else if (bundler === 'webpack') {
    code = await runWebpack(config);
  } else {
    throw new Error(
      "Bundler name not recognised. Must be one of 'rollup' or 'webpack'."
    );
  }

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
      const map = fs.readFileSync(`${path}/${filename}.map`).toString();
      res({ code, map });
    });
  });
}
