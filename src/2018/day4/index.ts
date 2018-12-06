import {getValues} from "../../helpers/getValues";
const path = require('path');
const inputPath = path.resolve(__dirname, 'input.txt');

function getSortedValues() {
  const matcher = /\[.*?]/g;

  return getValues(inputPath).sort((a: string, b: string) => {
    const aDateMatch = a.match(matcher);
    const aDate = aDateMatch && aDateMatch[0] || '';
    const bDateMatch = b.match(matcher);
    const bDate = bDateMatch && bDateMatch[0] || '';

    if (aDate.split(' ')[0] < bDate.split(' ')[0]) {
      return -1;
    }

    if (aDate.split(' ')[0] > bDate.split(' ')[0]) {
      return 1;
    }

    const aHours = aDate.split(' ')[1].split(':')[0];
    const bHours = bDate.split(' ')[1].split(':')[0];

    if (aHours < bHours) return -1;
    if (aHours > bHours) return 1;

    const aMinutes = aDate.split(' ')[1].split(':')[1];
    const bMinutes = bDate.split(' ')[1].split(':')[1];

    if (aMinutes < bMinutes) return -1;
    if (aMinutes > bMinutes) return 1;

    return 0;
  });
}

function populateGuards(values: Array<string>) {
  const guards: {[key: string]: {[key: string]: number}} = {};
  let currGuard: string = '';

  for(let index = 0; index < values.length -1; index++) {
    const action = values[index].split(' ')[3];

    if (action === 'asleep') {
      const startMinute: number = parseInt(values[index].split(' ')[1].slice(0, -1).split(':')[1]);
      const endMinute: number = parseInt(values[index + 1].split(' ')[1].slice(0, -1).split(':')[1]);

      for (let minute = startMinute; minute < endMinute; minute++) {
        if (guards[currGuard]) {
          guards[currGuard][minute] = (guards[currGuard][minute] || 0) + 1;
          guards[currGuard]['total'] = guards[currGuard]['total'] + 1;
        } else {
          guards[currGuard] = {
            [minute]: 1,
            ['total']: 1
          };
        }
      }
    } else if (action !== 'up') {
      currGuard = action.substring(1);
    }
  }

  return guards;
}

function part1() {
  const values: Array<string> = getSortedValues();
  const guards: {[key: string]: {[key: string]: number}} = populateGuards(values);

  let highestTotal = 0;
  let highestMinute = 0;
  let highestKey = '';

  Object.entries(guards).forEach(([key, val]) => {
    if (val.total > highestTotal) {
      let highestMinuteVal = 0;
      let highestMinuteKey = '';

      Object.entries(val).forEach(([subKey, subVal]) => {
        if (subVal > highestMinuteVal && subKey !== 'total') {
          highestMinuteVal = subVal;
          highestMinuteKey = subKey;
        }
      });

      highestKey = key;
      highestTotal = val.total;
      highestMinute = parseInt(highestMinuteKey);
    }
  });

  console.log('part 1:', parseInt(highestKey) * highestMinute);
}

function part2() {
  const values: Array<string> = getSortedValues();
  const guards: {[key: string]: {[key: string]: number}} = populateGuards(values);

  let highestTotalMinutes = 0;
  let highestMinuteKey = '';
  let guardKey = '';

  Object.entries(guards).forEach(([key, val]) => {
    Object.entries(val).forEach(([minuteKey, minuteVal]) => {
      if (minuteVal > highestTotalMinutes && minuteKey !== 'total') {
        highestTotalMinutes = minuteVal;
        highestMinuteKey = minuteKey;
        guardKey = key;
      }
    });
  });

  console.log(guards[guardKey][highestMinuteKey]);

  console.log('part 2:', parseInt(guardKey) * parseInt(highestMinuteKey));
}

function main() {
  part1();
  part2();
}

main();
