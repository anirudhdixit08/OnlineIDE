const { exec } = require("child_process");

const executePy = (filepath,inputFilePath) => {


  return new Promise((resolve, reject) => {
    exec(
      // `python ${filepath}`,
      `python ${filepath} < ${inputFilePath}`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executePy,
};
