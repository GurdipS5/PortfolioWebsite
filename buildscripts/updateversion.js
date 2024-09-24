const fs = require('fs');
const path = require('path');

var nbgv = require('nerdbank-gitversioning');
let version = nbgv.getVersion();
let p = Promise.resolve(version);
let vv = '';

// Use .then() to handle the resolved value of the promise
p.then((version) => {
  // Retrieve the cloudBuildNumber property
  vv = version.cloudBuildNumber;

  // Path to package.json (you can customize this if needed)
  const filePath = path.join(__dirname, '..', '.nuspec');

  // Read the package.json file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading package.json file:', err);
      return;
    }

    // Parse the JSON
    let packageJson = JSON.parse(data);

    // Update the version field
    packageJson.version = vv;

    // Convert the modified object back to a JSON string
    const updatedJson = JSON.stringify(packageJson, null, 2); // Pretty-printing with 2 spaces

    // Write the changes back to package.json
    fs.writeFile(filePath, updatedJson, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to .nuspec file:', err);
      } else {
        console.log(`Version updated to ${vv} successfully!`);
      }
    });
  });
});
