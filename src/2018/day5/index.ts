import {getValues} from "../../helpers/getValues";
const path = require('path');
const inputPath = path.resolve(__dirname, 'input.txt');

function canPolymersMerge(a: string, b: string) {
  if (a == a.toUpperCase()) {
    if (b == b.toLowerCase()) {
      return a.toUpperCase() === b.toUpperCase();
    }
  }

  if (a == a.toLowerCase()) {
    if (b == b.toUpperCase()) {
      return a.toUpperCase() === b.toUpperCase();
    }
  }

  return false;
}

function part1() {
  const polymers: Array<string> = getValues(inputPath)[0].split('');
  let canStillCondense = true;

  while (canStillCondense) {
    let foundPolymer = false;

    for (let x = 0; x < polymers.length - 1; x ++) {
      if (canPolymersMerge(polymers[x], polymers[x+1])) {
        polymers.splice(x, 2);
        foundPolymer = true;
        break;
      }
    }

    canStillCondense = foundPolymer;
  }

  console.log('part 1:', polymers.join('').length);
}

function part2() {
  const polymers: Array<string> = getValues(inputPath)[0].split('');
  const polymerTypes: Array<string> = [...new Set(polymers.map(val => val.toUpperCase()))];
  let shortestPolymerLength = polymers.length;

  console.log('original length:', polymers.length);

  polymerTypes.forEach(type => {
    let filteredPolymers = [...polymers].filter(val => val.toUpperCase() !== type);
    let canStillCondense = true;

    while (canStillCondense) {
      let foundPolymer = false;

      for (let x = 0; x < filteredPolymers.length - 1; x++) {
        if (canPolymersMerge(filteredPolymers[x], filteredPolymers[x + 1])) {
          filteredPolymers.splice(x, 2);
          foundPolymer = true;
          break;
        }
      }

      canStillCondense = foundPolymer;
    }

    if (filteredPolymers.length < shortestPolymerLength) shortestPolymerLength = filteredPolymers.length;

    console.log(`length with ${type} removed:`, filteredPolymers.length);
  });

  console.log('part 2:', shortestPolymerLength);
}

function main() {
  part1();
  part2();
}

main();
