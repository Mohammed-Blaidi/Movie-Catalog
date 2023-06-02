// fileHandler.js
const fs = require('fs');

function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

function writeFile(filename, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, content, 'utf8', (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  readFile,
  writeFile
};

  