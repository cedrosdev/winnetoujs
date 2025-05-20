const Drawer = require("./drawer.js");
class Err {
  /**
   * Cod e001
   * Duplicated constructo error
   * @param  {string} id
   * @param  {string} filePath
   * @param  {string} originalFile
   */
  e001(id, filePath, originalFile) {
    new Drawer().drawWarning(
      "Error code: e001\n" +
        `The constructo [[${id}]] of file "${filePath}" is duplicated. The original file is "${originalFile}".`
    );
    process.stderr.write("\x07");
  }

  /**
   * Cod e002
   * Transpile constructo error
   * @param  {string} e
   */
  e002(e) {
    new Drawer().drawError(
      "Error Code: e002\n" +
        "Transpile constructo error. Original Message: " +
        e
    );
    process.stderr.write("\x07");
  }

  /**
   * Cod 003
   * win.config.json
   */
  e003() {
    new Drawer().drawError(
      "Error Code: 003\n" +
        `"./win.config.json" not found or misconfigured. Default config will be used.`
    );
    process.stderr.write("\x07");
  }

  e004() {
    new Drawer().drawError(
      "Error Code: 004\n" + `Fatal error when creating the css bundle`
    );
    process.stderr.write("\x07");
  }

  e005() {
    new Drawer().drawError(
      "Error Code: 005\n" + `The constructos folder does not exists`
    );
    process.stderr.write("\x07");
  }

  e006(file) {
    new Drawer().drawError(
      "Error Code: 006\n" +
        `There are a constructo without [[id]] in a file "${file}"`
    );
    process.stderr.write("\x07");
  }

  e007(error, file) {
    new Drawer().drawError(
      "Error Code: 007\n" +
        `Error while reading translation file. Check if it is a valid json file. \nOriginal error:  ${error}\nFile: ${file}`
    );
    process.stderr.write("\x07");
  }
}

module.exports = Err;
