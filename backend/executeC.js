const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = (filepath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);

    return new Promise((resolve, reject) => {
        exec(
            // Use 'gcc' for C code. The command is otherwise identical to C++.
            `gcc ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.exe`,
            (error, stdout, stderr) => {
                // Clean up compiled file
                if (fs.existsSync(outPath)) {
                    fs.unlinkSync(outPath);
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
            }
        );
    });
};

module.exports = {
    executeC,
};
