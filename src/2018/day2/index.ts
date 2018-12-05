import {getValues} from "../../helpers/getValues";
const path = require('path');
const inputPath = path.resolve(__dirname, 'input.txt');

function part1() {
  const values: Array<string> = getValues(inputPath);
  const totalCounts: Record<string, number> = {};
  let total: number = 1;

  const lineLetterCounts: Array<Array<number>> = values.map((value: string) => {
    const counts: Record<string, number> = {};

    value.split('').forEach((char: string) => {
      counts[char] = (counts[char] || 0) + 1;
    });

    return [...new Set(Object.values(counts)
      .filter(val => val > 1))];
  });

  lineLetterCounts.forEach(line => {
    line.forEach(val => {
      totalCounts[val] = (totalCounts[val] || 0) + 1;
    });
  });

  Object.values(totalCounts).forEach(val => total *= val);

  console.log('part 1:', total);
}

function part2() {
  const values: Array<string> = getValues(inputPath);

  for (let x = 0; x < values.length - 1; x++) {
    for (let y = x + 1; y < values.length; y++) {
      let diffCount: number = 0;
      let index: number = 0;
      const arr1: Array<string> = values[x].split('');
      const arr2: Array<string> = values[y].split('');

      while (diffCount < 2 && index < arr1.length) {
        if (arr1[index] !== arr2[index]) diffCount++;
        index++;
      }

      if (index === arr1.length) {
        console.log('part 2:', arr1.filter(value => -1 !== arr2.indexOf(value)).join(''));
        break;
      }
    }
  }
}

function main() {
  part1();
  part2();
}

main();
