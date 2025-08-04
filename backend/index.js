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
const Job = require("./models/job.model")

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
      process.exit(1); 
  }
};

connectDB();

app.get("/", (req, res) => {
  res.json({ online: "compiler" });
});

// FIX: Added a /status endpoint to check job status by ID
app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  if (!jobId) { // Check if jobId is missing
    return res.status(400).json({ success: false, error: "Missing query id!" });
  }

  try {
    const job = await Job.findById(jobId);

    if (!job) { // Check if a job with that ID was found
      return res.status(404).json({ success: false, error: "Job not found." });
    }
    return res.status(200).json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, error: JSON.stringify(error) });
  }
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code, input } = req.body;
  if (code === undefined) {
    return res.status(404).json({ success: false, error: "Empty code!" });
  }

  let job; // FIX: Declared 'let job' outside of the try block
  try {
    const filePath = await generateFile(language, code);
    const inputFilePath = await generateInputFile(input);

    job = await new Job({
      language,
      filepath: filePath, 
      inputFilePath,
      code,
      input,
      startedAt: new Date(), // FIX: Set startedAt here
    }).save();
    
    const jobId = job._id;
    console.log(jobId);

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
    job["completedAt"] = new Date();
    job["status"] = "success";
    job["output"] = output;
    await job.save();
    console.log(job);

    // FIX: Send a single, final response
    res.status(201).json({ success: true, jobId: job._id, filePath, output, inputFilePath });
  } catch (error) {
    // FIX: This catch block is now robust against ReferenceError
    if (job) {
      job["completedAt"] = new Date();
      job["status"] = "error";
      job["output"] = JSON.stringify(error);
      await job.save();
      console.log(job);
    }
    res.status(500).json({ error: error });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});
