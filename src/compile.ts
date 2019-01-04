import { generateOptions } from './bundle/generateOptions';

export async function compile(filePath: string, name: string) {
  const [bundler, config] = await generateOptions(filePath, name);

  if (bundler === 'rollup') {
    const rollup = require('rollup').rollup;
    const bundle = await rollup(config.input);
    return await bundle.generate(config.output);
  } else if (bundler === 'webpack') {
    return await runWebpack(config);
  }
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
