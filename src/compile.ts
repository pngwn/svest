/* eslint-disable */
import { generateOptions } from './bundle/generateOptions';
import { rollup } from 'rollup';

export async function compile(filePath: string, name: string) {
  const [bundler, config] = await generateOptions(filePath, name);

  if (bundler === 'rollup') {
    const bundle = await rollup(config.input);
    const { code, map } = await bundle.generate(config.output);
    return { code, map };
  } else if (bundler === 'webpack') {
    return;
  }
}
