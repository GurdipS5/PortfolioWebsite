const fs = require('fs');
const path = require('path');

// Path to the .nuspec file
const nuspecPath = path.resolve(__dirname, '..', '.nuspec');

var nbgv = require('nerdbank-gitversioning');

let version = nbgv.getVersion();

let p = Promise.resolve(version);
let vv = '';

// Use .then() to handle the resolved value of the promise
p.then((version) => {
  // Retrieve the cloudBuildNumber property
  vv = version.cloudBuildNumber;
  console.log(vv); // Output: '1.0.9+cd46792ea3'

  // Now read the .nuspec file after vv is assigned
  fs.readFile(nuspecPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading .nuspec file: ${err}`);
      process.exit(1);
    }

    // Replace the <version> element with the new version
    const updatedData = data.replace(/<version>(.*?)<\/version>/, `<version>${vv}</version>`);

    // Write the updated .nuspec file
    fs.writeFile(nuspecPath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing .nuspec file: ${err}`);
        process.exit(1);
      }
      console.log(`Version updated to ${vv}`);
    });
  });
}).catch((error) => {
  console.error('Error:', error);
});
