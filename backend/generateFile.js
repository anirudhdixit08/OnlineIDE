const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
}

const generateFile = async (format, content) => {
    let filename;
    let fileContent = content;
    const jobID = uuid(); 
    
    if (format === 'java') {
        const classNameRegex = /public\s+class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/;
        const match = content.match(classNameRegex);
        
        let originalClassName = 'Main'; 
        if (match && match[1]) {
            originalClassName = match[1];
        }

        const newClassName = `${originalClassName}_${jobID.replace(/-/g, '_')}`;
        filename = `${newClassName}.${format}`;

        const updatedContent = content.replace(
            new RegExp(`(public\\s+class\\s+)${escapeRegExp(originalClassName)}`, 'g'),
            `$1${newClassName}`
        );
        fileContent = updatedContent;

    } else {
        filename = `${jobID}.${format}`;
    }

    const filePath = path.join(dirCodes, filename);
    // **THIS IS THE CORRECTED LINE:**
    // It now writes the 'fileContent' (the modified code) to the file.
    await fs.writeFileSync(filePath, fileContent);
    return filePath;
};

module.exports = {
    generateFile,
};
