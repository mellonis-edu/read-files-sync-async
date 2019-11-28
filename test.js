/* eslint-disable no-console */
const fs = require('fs');
// Синхронные
// fs.readdirSync
// fs.readFileSync
// Асинхронные
// fs.readdir
// fs.readFile

fs.readdirSync('.', { withFileTypes: true })
  .forEach((dirEntry) => {
    if (dirEntry.isDirectory()) {
      console.log(`Directory: ${dirEntry.name}`);
    } else if (dirEntry.isFile()) {
      console.log(`File: ${dirEntry.name}`);
      console.log(fs.readFileSync(dirEntry.name, 'utf-8'));
    }
  });

console.log('AFTER SYNC');

fs.readdir('.', { withFileTypes: true }, (readdirError, dirEntryList) => {
  if (!readdirError) {
    dirEntryList
      .filter((dirEntry) => dirEntry.isDirectory() || dirEntry.isFile())
      .map((dirEntry) => {
        if (dirEntry.isDirectory()) {
          return Promise.resolve({
            dirEntry,
          });
        }

        return new Promise((resolve, reject) => {
          fs.readFile(dirEntry.name, 'utf-8', (readFileError, fileContent) => {
            if (!readFileError) {
              resolve({
                dirEntry,
                fileContent,
              });
            } else {
              reject(readFileError);
            }
          });
        });
      })
      .reduce(
        (previousPromise, currentPromise) => previousPromise
          .then(() => currentPromise
            .then(({
              dirEntry,
              fileContent,
            }) => {
              if (dirEntry.isDirectory()) {
                console.log(`Directory: ${dirEntry.name}`);
              } else if (dirEntry.isFile()) {
                console.log(`File: ${dirEntry.name}`);
                console.log(fileContent);
              }
            })),
        Promise.resolve(),
      );
  } else {
    console.error(readdirError);
  }
});

console.log('AFTER ASYNC');
