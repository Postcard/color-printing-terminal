var path = require("path");
const spawn = require("child_process").exec;

module.exports = {
  play(fileName) {
    spawn(
      `python ${path.join(
        __dirname,
        "..",
        "scripts",
        "play_sound.py"
      )} ${fileName}`
    );
  }
};
