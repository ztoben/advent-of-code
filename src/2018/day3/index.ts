import {getValues} from "../../helpers/getValues";
const path = require('path');
const inputPath = path.resolve(__dirname, 'input.txt');

function part1() {
  const values: Array<string> = getValues(inputPath);
  const totalCounts: { [key: string]: number } = {};

  values.forEach(val => {
    const [, , topLeft, dimensions] = val.split(' ');
    const [x, y] = topLeft.split(',');
    const [width, height] = dimensions.split('x');

    for (let pox = parseInt(x); pox < (parseInt(x) + parseInt(width)); pox++) {
      for (let poy = parseInt(y); poy < (parseInt(y) + parseInt(height)); poy++) {
        totalCounts[`${pox},${poy}`] = (totalCounts[`${pox},${poy}`] || 0) + 1;
      }
    }
  });

  const totals = Object.values(totalCounts).filter(x => x > 1);

  console.log('part 1:', totals.length);
}

function part2() {
  const values: Array<string> = getValues(inputPath);
  const idsPerPosition: { [key: string]: Array<string> } = {};
  let clearedIds: Array<string> = [];

  values.forEach(val => {
    const [id, , topLeft, dimensions] = val.split(' ');
    const [x, y] = topLeft.split(',');
    const [width, height] = dimensions.split('x');
    let idCleared = true;

    for (let pox = parseInt(x); pox < (parseInt(x) + parseInt(width)); pox++) {
      for (let poy = parseInt(y); poy < (parseInt(y) + parseInt(height)); poy++) {
        if (idsPerPosition[`${pox},${poy}`]) {
          idsPerPosition[`${pox},${poy}`].push(id);
          idCleared = false;
        } else {
          idsPerPosition[`${pox},${poy}`] = [id];
        }
      }
    }

    if (!idCleared) {
      for (let pox = parseInt(x); pox < (parseInt(x) + parseInt(width)); pox++) {
        for (let poy = parseInt(y); poy < (parseInt(y) + parseInt(height)); poy++) {
          idsPerPosition[`${pox},${poy}`].forEach(id => {
            clearedIds = clearedIds.filter(x => x !== id);
          });
        }
      }
    } else {
      clearedIds.push(id);
    }
  });

  console.log('part 2:', clearedIds.join('').substring(1));
}

function main() {
  part1();
  part2();
}

main();
