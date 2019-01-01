/* eslint-disable */
import { generateOptions } from './bundle/generateOptions';
import { rollup } from 'rollup';

export async function compile(filePath: string, name: string) {
  const { input, output } = await generateOptions(filePath, name);
  const bundle = await rollup(input);
  const { code, map } = await bundle.generate(output);
  return { code, map };
}
