import walkSync from './src/helpers/walkSync';
const {prompt} = require('enquirer');
const path = require('path');
const fs = require('fs');

const buildYearChoices = () => {
  const years: Array<string> = [];

  let directorySearch = function(filePath: string, _stat: any) {
    const directory: Array<string> = filePath.match(/\/([^\/]+)\/?$/) || [];

    if (directory.length > 0 && directory[1] !== 'helpers') {
      years.push(directory[1])
    }
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
  const isNew: boolean = process.env.mode === 'new';

  const chooseYear = [{
    type: 'select',
    name: 'year',
    message: isNew
      ? 'Which year should a solution be created in?'
      : 'Which year would you like to run a solution from?',
    initial: 0,
    choices: buildYearChoices()
  }];

  const {year} = await prompt(chooseYear);

  if (isNew) {
    const chooseFolder = {
      type: 'input',
      name: 'folderName',
      message: 'Folder name?'
    };

    const {folderName} = await prompt(chooseFolder);
    const dirName = `./src/${year}/${folderName}`;

    if (!fs.existsSync(dirName)){
      fs.mkdirSync(dirName);
    }

    fs.closeSync(fs.openSync(path.resolve(__dirname, 'src', year, folderName, 'index.ts'), 'w'));
    fs.closeSync(fs.openSync(path.resolve(__dirname, 'src', year, folderName, 'readme.md'), 'w'));
    fs.closeSync(fs.openSync(path.resolve(__dirname, 'src', year, folderName, 'input.txt'), 'w'));

    console.log('Created files in ' + dirName);
  } else {
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
}

main();
