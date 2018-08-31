const path = require('path');
const fs = require('fs');

function readFiles(onFileContent) {
  return fs.readdir(__dirname, function(err, filenames) {
    if (err) {
      console.log(err);
      return;
    }

    return filenames.filter((x) => x.endsWith('sql')).forEach((filename) => {
      fs.readFile(path.join(__dirname, filename), 'utf-8', (err, content) => {
        if (err) {
          console.log(err);
          return;
        }

        onFileContent(filename, content);
      });
    });
  });
}

// const populateRankings = fs
//   .readFileSync(path.join(__dirname, 'populate_rankings.sql'))
//   .toString();

readFiles((filename, content) => {
  const [name] = filename.split('.');
  module.exports[name] = content.toString();
});
