const fs = require('fs');
const path = require('path');

export default function walkSync(currentDirPath: String, callback: Function, fileSearch: Boolean) {
  fs.readdirSync(currentDirPath).forEach(function (name: String) {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (fileSearch ? stat.isFile() : stat.isDirectory()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback, fileSearch);
    }
  });
}
