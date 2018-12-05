import {getValues} from "../../helpers/getValues";
const path = require('path');
const inputPath = path.resolve(__dirname, 'input.txt');

function part1() {
  const values: Array<string> = getValues(inputPath);
  let total: bigint  = 0n;

  values.forEach(val => total += BigInt(val));

  console.log('part1:', total.toString());
}

function part2() {
  let values: Array<string> = getValues(inputPath);
  let frequency: bigint = 0n;
  let duplicateFrequencyFound: boolean = false;
  let pastFrequencies: Array<bigint> = [frequency];
  let index: number = 0;

  while (!duplicateFrequencyFound) {
    if (index === values.length) index = 0;

    frequency += BigInt(values[index]);

    if (pastFrequencies.includes(frequency)) {
      duplicateFrequencyFound = true;
    }

    pastFrequencies.push(frequency);

    index++;
  }

  console.log('part2:', frequency.toString());
}

function main() {
  part1();
  part2();
}

main();
