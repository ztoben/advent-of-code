import {getValues} from "../../helpers/getValues";
const fs = require('fs');
const path = require('path');
const inputPath = path.resolve(__dirname, 'input.txt');

function getPrintValue(index: number): string {
  return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[index];
}

function getArrayBounds(values: Array<string>): {[key: string]: number} {
  let minx = 1000;
  let miny = 1000;
  let maxx = 0;
  let maxy = 0;

  values.forEach(val => {
    const [, strx, stry] = val.split(', ');
    const x = parseInt(strx);
    const y = parseInt(stry);

    if (x < minx) minx = x;
    if (x > maxx) maxx = x;
    if (y < miny) miny = y;
    if (y > maxy) maxy = y;
  });

  return {minx, miny, maxx, maxy};
}

function prettyPrintArray(values: Array<Array<string>>): string {
  return JSON.stringify(values.map(row => {
    return row.join('');
  }), null, 2);
}

function getNearestManhattanValue(x: number, y: number, values: Array<string>, minx: number, miny: number): string {
  let points: {[key: string]: number} = {};

  values.forEach(val => {
    const [id, strx, stry] = val.split(', ');
    const xx = parseInt(strx) - minx;
    const yy = parseInt(stry) - miny;

    // get manhattan value
    points[id] = Math.abs(x - xx) + Math.abs(y - yy);
  });

  const shortestDistance = Math.min(...Object.values(points));
  const filteredPoints = Object.entries(points).filter(([_key, val]) => val === shortestDistance);

  return filteredPoints.length > 1 ? '.' : getPrintValue(parseInt(filteredPoints[0][0]));
}

function addAllManhattanValues(x: number, y: number, values: Array<string>, minx: number, miny: number): string {
  let total: number = 0;

  values.forEach(val => {
    const [, strx, stry] = val.split(', ');
    const xx = parseInt(strx) - minx;
    const yy = parseInt(stry) - miny;

    // get manhattan value
    total += Math.abs(x - xx) + Math.abs(y - yy);
  });

  return total < 10000 ? '#' : '.';
}

function part1() {
  const values: Array<string> = getValues(inputPath).map((val: string, idx: number) => `${idx}, ${val}`);
  const {minx, miny, maxx, maxy} = getArrayBounds(values);
  const valueArray: Array<Array<string>> = [];
  const counts: {[key: string]: number} = {};
  const invalidIds: Array<string> = [];
  const width = maxx - minx;
  const height = maxy - miny;

  for (let y = 0; y <= height; y++) {
    valueArray[y] = [];

    for (let x = 0; x <= width; x++) {
      valueArray[y][x] = getNearestManhattanValue(x, y, values, minx, miny);
    }
  }

  valueArray.forEach((row, y) => {
    row.forEach((val, x) => {
      counts[val] = (counts[val] || 0) + 1;
      if (x === 0 || y === 0 || x === width || y === height) invalidIds.push(val);
    });
  });

  fs.writeFile(path.resolve(__dirname, 'part_1.json'), prettyPrintArray(valueArray), (err: Error) => {
    if (err) console.log(err);
  });

  console.log('part 1:',
    Math.max(
      ...Object.values(
        Object.entries(counts)
          .filter(([id]) => !invalidIds.includes(id))
          .map(([_key, val]) => val))));
}

function part2() {
  const values: Array<string> = getValues(inputPath).map((val: string, idx: number) => `${idx}, ${val}`);
  const {minx, miny, maxx, maxy} = getArrayBounds(values);
  const valueArray: Array<Array<string>> = [];
  const width = maxx - minx;
  const height = maxy - miny;

  for (let y = 0; y <= height; y++) {
    valueArray[y] = [];

    for (let x = 0; x <= width; x++) {
      valueArray[y][x] = addAllManhattanValues(x, y, values, minx, miny);
    }
  }

  fs.writeFile(path.resolve(__dirname, 'part_2.json'), prettyPrintArray(valueArray), (err: Error) => {
    if (err) console.log(err);
  });

  console.log('part 2:',
    valueArray
      .reduce((acc, val) => acc.concat(val), [])
      .filter(val => val === '#').length);
}

function main() {
  part1();
  part2();
}

main();
