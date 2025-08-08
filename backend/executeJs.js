const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");


const executeJs = (filepath, inputFilePath = null) => {
    return new Promise((resolve, reject) => {
        let command = `node ${filepath}`;
        if (inputFilePath) {
            if (!fs.existsSync(inputFilePath)) {
                return reject(new Error(`Input file not found: ${inputFilePath}`));
            }
            command = `node ${filepath} < ${inputFilePath}`;
        }

        // Add a small delay to ensure the file is completely written to the disk
        // This is a common practice to prevent race conditions in file operations.
        setTimeout(() => {
            exec(
                command,
                (error, stdout, stderr) => {
                    if (error) {
                        reject({ error, stderr });
                        return;
                    }
                    if (stderr) {
                        reject(stderr);
                        return;
                    }
                    resolve(stdout);
                }
            );
        }, 300);
    });
};

module.exports = {
    executeJs,
};
