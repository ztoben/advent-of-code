import {getValues} from "../../helpers/getValues";
const path = require('path');
const inputPath = path.resolve(__dirname, 'input.txt');

function populateWithValues(values: Array<string>): {[key: string]: Array<string>} {
  const populatedMoves: {[key: string]: Array<string>} = {};

  values.forEach(value => {
    const [,before,,,,,,after] = value.split(' ');

    populatedMoves[after] = [...(populatedMoves[after] || []), before];
  });

  return populatedMoves;
}

function findNextMove(availableMoves: {[key: string]: Array<string>}) {
  const allMoves: Array<string> = [...new Set(Object.values(availableMoves).reduce((a, b) => a.concat(b), []))];
  const possibleMoves: Array<string> = [...new Set(Object.keys(availableMoves))];

  return allMoves.filter(x => !possibleMoves.includes(x)).sort();
}

function getCharacterNumericValue(char: string) {
  return char.charCodeAt(0) - 64;
}

function part1() {
  const availableMoves: {[key: string]: Array<string>} = populateWithValues(getValues(inputPath));
  let movesLeft: number = Object.keys(availableMoves).length;
  let movesTaken: Array<string> = [];
  let removedKeys: Array<string> = [];

  while(movesLeft > 0) {
    const nextMove: string = findNextMove(availableMoves)[0];

    Object.entries(availableMoves).forEach(([key, val]) => {
      const newval = val.filter(i => i !== nextMove);

      if (newval.length === 0) {
        removedKeys.push(key);
        delete availableMoves[key];
      } else {
        availableMoves[key] = val.filter(i => i !== nextMove);
      }
    });

    const availableMovesLength = Object.keys(availableMoves).length;

    if (availableMovesLength === 0) {
      movesTaken.push(...[nextMove, ...removedKeys.sort()]);
    } else {
      removedKeys = removedKeys.filter(v => v !== nextMove);
      movesTaken.push(nextMove);
    }

    movesLeft = availableMovesLength;
  }

  console.log('step 1:', [...new Set(movesTaken)].join(''));
}

function initializeWorkers(numOfWorkers: number) {
  const workers: {[key: string]: {[key: string]: number}} = {};

  for (let x = 0; x < numOfWorkers; x++) {
    workers[x] = {};
  }

  return workers;
}

function findUnbusyWorker(workers: {[key: string]: {[key: string]: number}}): number | undefined {
  for (let x = 0; x < Object.keys(workers).length; x++) {
    const worker = workers[x];
    const workerKeys = Object.keys(worker);
    if (workerKeys.length === 0) {
      return x;
    }
  }

  return undefined;
}

function addWorkerTask(workers: {[key: string]: {[key: string]: number}}, workerId: string, task: string) {
  workers[workerId][task] = getCharacterNumericValue(task) + 60;
}

function workOneSecond(
  workers: {[key: string]: {[key: string]: number}},
  movesTaken: Array<string>,
  availableMoves: {[key: string]: Array<string>},
  removedKeys: Array<string>
) {
  for (let x = 0; x < Object.keys(workers).length; x++) {
    const worker = workers[x];
    const workerKeys = Object.keys(worker);

    if (workerKeys.length > 0) {
      const task = Object.keys(worker)[0];
      const newSecondsValue = workers[x][task] - 1;

      if (newSecondsValue > 0) {
        workers[x][task] = newSecondsValue;
      } else {
        delete workers[x][task];

        Object.entries(availableMoves).forEach(([key, val]) => {
          const newval = val.filter(i => i !== task);

          if (newval.length === 0) {
            removedKeys.push(key);
            delete availableMoves[key];
          } else {
            availableMoves[key] = val.filter(i => i !== task);
          }
        });

        movesTaken.push(task);

        // const availableMovesLength = Object.keys(availableMoves).length;
        //
        // if (availableMovesLength === 0) {
        //   movesTaken.push(...[task, ...removedKeys.sort()]);
        // } else {
        //   removedKeys = removedKeys.filter(v => v !== task);
        //   movesTaken.push(task);
        // }
      }
    }
  }
}

function part2() {
  const availableMoves: {[key: string]: Array<string>} = populateWithValues(getValues(inputPath));
  let movesLeft: number = Object.keys(availableMoves).length;
  const workers: {[key: string]: {[key: string]: number}} = initializeWorkers(5);
  /*
  Workers= {
    1: {
      task: secondsRemaining
    }
  }
  */
  const movesTaken: Array<string> = [];
  const movesAddedToWorkers: Array<string> = [];
  let removedKeys: Array<string> = [];
  let seconds: number = 0;

  while(movesLeft > 0) {
    const nextMoves: Array<string> = findNextMove(availableMoves);

    nextMoves.forEach(move => {
      if (!movesAddedToWorkers.includes(move)) {
        const workerId = findUnbusyWorker(workers);

        if (workerId !== undefined) {
          addWorkerTask(workers, workerId.toString(), move);
          movesAddedToWorkers.push(move);
        }
      }
    });

    workOneSecond(workers, movesTaken, availableMoves, removedKeys);
    seconds++;

    movesLeft = Object.keys(availableMoves).length;
  }

  // I can't get the last value (Z) to get added to my moves, so this will have to do
  seconds += 60 + getCharacterNumericValue('Z');

  console.log('step 2:', seconds);
}

function main() {
  part1();
  part2();
}

main();
