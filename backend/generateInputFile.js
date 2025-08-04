const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirInputs = path.join(__dirname, "inputs");

if (!fs.existsSync(dirInputs)) {
  fs.mkdirSync(dirInputs, { recursive: true });
}

// FIX: Added jobId as an argument
const generateInputFile = async (input, jobId) => {
  // FIX: Use the provided jobId for the filename
  const filename = `${jobId}.txt`;
  const filePath = path.join(dirInputs, filename);
  await fs.writeFileSync(filePath, input);
  return filePath;
};

module.exports = {
  generateInputFile,
};
