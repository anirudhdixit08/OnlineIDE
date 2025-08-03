const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
const { executeJava } = require("./executeJava");
const { executeJs } = require("./executeJs");
const { executeC } = require("./executeC");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ online: "compiler" });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  if (code === undefined) {
    return res.status(404).json({ success: false, error: "Empty code!" });
  }
  try {
    const filePath = await generateFile(language, code);
    let output;
    switch (language) {
      case "cpp":
        output = await executeCpp(filePath);
        break;
      case "py":
        output = await executePy(filePath);
        break;
      case "java":
        output = await executeJava(filePath);
        break;
      case "c":
        output = await executeC(filePath);
        break;
      case "js":
        output = await executeJs(filePath);
        break;
      default:
    }
    res.json({ filePath, output });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});
