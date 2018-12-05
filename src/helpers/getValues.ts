const fs = require('fs');

export function getValues(inputPath: string) {
  const input = fs.readFileSync(inputPath, 'utf8');

  return input.toString().split("\n").filter((v: string) => v);
}
