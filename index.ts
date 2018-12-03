import walkSync from './src/walkSync';
const {prompt} = require('enquirer');

const buildYearChoices = () => {
  const years: Array<string> = [];

  let directorySearch = function(filePath: string, _stat: any) {
    const year: Array<string> = filePath.match(/\/([^\/]+)\/?$/) || [];

    years.push(year.length > 0 ? year[1] : filePath);
  };

  walkSync('./src', directorySearch, false);

  return years.map((year: string) => {
    return {name: year, message: year, value: year};
  });
};

const buildDayChoices = (year: Number) => {
  const days : Array<string> = [];

  let directorySearch = function(filePath: string, _stat: any) {
    const foundDay: Array<string> = filePath.match(/\/([^\/]+)\/?$/) || [];

    days.push(foundDay.length > 0 ? foundDay[1]: filePath);
  };

  walkSync(`./src/${year}`, directorySearch, false);

  return days.map((day: string) => {
    return {name: day, message: day, value: day};
  });
};

async function main() {
  const chooseYear = [{
    type: 'select',
    name: 'year',
    message: 'Which year would you like to run a solution from?',
    initial: 0,
    choices: buildYearChoices()
  }];

  const {year} = await prompt(chooseYear);

  const chooseDay = [{
    type: 'select',
    name: 'day',
    message: 'Which day would you like to run?',
    initial: 0,
    choices: buildDayChoices(year)
  }];

  const {day} = await prompt(chooseDay);

  require(`./src/${year}/${day}/index.ts`);
}

main();
