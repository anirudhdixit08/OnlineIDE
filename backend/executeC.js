const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = (filepath, inputFilePath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);
    const command = `gcc "${filepath}" -o "${outPath}" && cd "${outputPath}" && ./${jobId}.exe ${
        inputFilePath ? `< "${inputFilePath}"` : ""
    }`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (fs.existsSync(outPath)) {
                fs.unlink(outPath, (err) => {
                    if (err) console.error(`Failed to delete executable: ${err}`);
                });
            }

            if (error) {
                reject({ error, stderr });
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            resolve(stdout);
        });
    });
};

module.exports = {
    executeC,
};