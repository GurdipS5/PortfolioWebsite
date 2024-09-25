const fs = require('fs');
const { DOMParser, XMLSerializer } = require('xmldom');

// Path to the .nuspec file one directory above
const filePath = '../devscard/.nuspec'; // Replace with actual file name if needed

// Read the XML file
fs.readFile(filePath, 'utf8', (err, xmlData) => {
  if (err) {
    console.error('Error reading the XML file:', err);
    return;
  }

  // Parse the XML string into a DOM object
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlData, 'text/xml');

  // Find the <version> element
  const versionElement = xmlDoc.getElementsByTagName('version')[0];

  // Update the version value
  if (versionElement) {
    versionElement.textContent = '2.0'; // Update the version here
  }

  // Serialize the updated XML back into a string
  const serializer = new XMLSerializer();
  const updatedXmlString = serializer.serializeToString(xmlDoc);

  // Write the updated XML back to the file
  fs.writeFile(filePath, updatedXmlString, (err) => {
    if (err) {
      console.error('Error writing the updated XML file:', err);
    } else {
      console.log('Version updated successfully in the .nuspec file!');
    }
  });
});
