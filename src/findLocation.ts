import stack from 'callsite';
import path from 'path';

export function getPath(relativeFilePath: string) {
  let theStack = stack()
    .filter(v => v.getFileName())
    .map(v => v.getFileName())
    .reverse();

  let index = theStack.findIndex(v => v === __filename) - 1;
  if (theStack[index].includes('compile')) index--;
  if (theStack[index].includes('render')) index--;

  let filePath;

  try {
    filePath = path.resolve(path.dirname(theStack[index]), relativeFilePath);
  } catch (e) {
    throw new Error(e.message);
  }
  return filePath;
}
