const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeJs = (filepath) => {
    return new Promise((resolve, reject) => {
        // Add a small delay to ensure the file is completely written to the disk
        setTimeout(() => {
            exec(
                `node ${filepath}`,
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
        }, 300); // A 300ms delay to prevent race conditions
    });
};

module.exports = {
    executeJs,
};
