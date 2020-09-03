const path = require('path');
const fs = require('fs');

/**
 * Retrieves a list of available schema names.
 * @returns {array} The list of schema names
 */
function getSchemaNames() {
  const directoryPath = path.join(__dirname, '../');
  const contents = fs.readdirSync(directoryPath);
  return contents.filter((item) => item !== 'validator');
}

module.exports = getSchemaNames;