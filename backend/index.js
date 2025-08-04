const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const { generateFile } = require("./generateFile");
const {generateInputFile} = require("./generateInputFile")
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
const { executeJava } = require("./executeJava");
const { executeJs } = require("./executeJs");
const { executeC } = require("./executeC");
const mongoose = require('mongoose');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connectDB = async () => {
  try {
      await mongoose.connect('mongodb://localhost:27017/mycompilerdb');
      console.log("Connected to MongoDB");
  } catch (err) {
      console.error("Could not connect to MongoDB...", err);
      process.exit(1); // Exit process with failure
  }
};

connectDB();

app.get("/", (req, res) => {
  res.json({ online: "compiler" });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code , input} = req.body;
  if (code === undefined) {
    return res.status(404).json({ success: false, error: "Empty code!" });
  }
  try {
    const filePath = await generateFile(language, code);
    const inputFilePath = await generateInputFile(input);
    let output;
    switch (language) {
      case "cpp":
        output = await executeCpp(filePath,inputFilePath);
        break;
      case "py":
        output = await executePy(filePath,inputFilePath);
        break;
      case "java":
        output = await executeJava(filePath,inputFilePath);
        break;
      case "c":
        output = await executeC(filePath,inputFilePath);
        break;
      case "js":
        output = await executeJs(filePath);
        break;
      default:
    }
    res.json({ filePath, output, inputFilePath });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});
