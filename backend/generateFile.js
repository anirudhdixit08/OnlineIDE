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

// FIX: Added jobId as an argument
const generateFile = async (format, content, jobId) => {
    let filename;
    let fileContent = content;
    
    if (format === 'java') {
        const classNameRegex = /public\s+class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/;
        const match = content.match(classNameRegex);
        
        let originalClassName = 'Main'; 
        if (match && match[1]) {
            originalClassName = match[1];
        }

        const newClassName = `${originalClassName}_${jobId}`;
        filename = `${newClassName}.${format}`;

        const updatedContent = content.replace(
            new RegExp(`(public\\s+class\\s+)${escapeRegExp(originalClassName)}`, 'g'),
            `$1${newClassName}`
        );
        fileContent = updatedContent;

    } else {
        // FIX: Use the provided jobId for the filename
        filename = `${jobId}.${format}`;
    }

    const filePath = path.join(dirCodes, filename);
    await fs.writeFileSync(filePath, fileContent);
    return filePath;
};

module.exports = {
    generateFile,
};
