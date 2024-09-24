const fs = require('fs');
const path = require('path');

// Path to package.json (you can customize this if needed)
const filePath = path.join(__dirname, '..', 'package.json');

// New version (replace this with your desired version)
const newVersion = '1.0.1';

// Read the package.json file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading package.json file:', err);
    return;
  }

  // Parse the JSON
  let packageJson = JSON.parse(data);

  // Update the version field
  packageJson.version = newVersion;

  // Convert the modified object back to a JSON string
  const updatedJson = JSON.stringify(packageJson, null, 2); // Pretty-printing with 2 spaces

  // Write the changes back to package.json
  fs.writeFile(filePath, updatedJson, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to package.json file:', err);
    } else {
      console.log(`Version updated to ${newVersion} successfully!`);
    }
  });
});
