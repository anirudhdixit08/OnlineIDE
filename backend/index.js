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
const {addJobToQueue} = require('./jobQueue')

const app = express();
dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connectDB = async () => {
  try {
      // await mongoose.connect('mongodb://localhost:27017/mycompilerdb');
      await mongoose.connect(process.env.MONGO_URI);
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

app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  if (!jobId) { 
    return res.status(400).json({ success: false, error: "Missing query id!" });
  }

  try {
    const job = await Job.findById(jobId);

    if (!job) { 
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

  try {
    let job = await new Job({
      language,
      code,
      input,
      startedAt: new Date(),
    }).save();
    
    const jobId = job._id;

    const filePath = await generateFile(language, code, jobId);
    
    let inputFilePath;
    if (input) {
      inputFilePath = await generateInputFile(input, jobId);
    }

    job.filePath = filePath;
    job.inputFilePath = inputFilePath;
    await job.save();
    
    addJobToQueue(jobId, { delay: 1000, removeOnComplete: true, timeout: 60000 });
    console.log(`Job added to queue with ID: ${jobId}`);

    res.status(201).json({ success: true, jobId });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});
