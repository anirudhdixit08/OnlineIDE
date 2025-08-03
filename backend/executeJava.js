const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");


const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filepath) => {

    const className = path.basename(filepath).split(".")[0];
    
    const classFilePath = path.join(outputPath, `${className}.class`);
    const command = `javac ${filepath} -d ${outputPath} && cd ${outputPath} && java ${className}`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (fs.existsSync(classFilePath)) {
                fs.unlinkSync(classFilePath);
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
    executeJava,
};
