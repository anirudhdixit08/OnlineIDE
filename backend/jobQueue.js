const Queue = require("bull");
const Job = require("./models/job.model"); 
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const { generateFile } = require("./generateFile");
const {generateInputFile} = require("./generateInputFile")
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
const { executeJava } = require("./executeJava");
const { executeJs } = require("./executeJs");
const { executeC } = require("./executeC");

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mycompilerdb');
        console.log("Worker connected to MongoDB");
    } catch (err) {
        console.error("Worker could not connect to MongoDB...", err);
        process.exit(1); 
    }
};

connectDB();

const jobQueue = new Queue("job-queue");
const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async (job) => {
    const { id: jobId } = job.data; 
    

    const jobFind = await Job.findById(jobId);
    
    if(!jobFind){
        console.log("Job not found!");
        return; 
    }

    console.log("Processing job with ID:", jobId);
    console.log("Fetched Job with input file path:", jobFind.inputFilePath);

    try {
      let output;
      // FIX: Removed the check for file paths as they are generated on the server.
      
      switch (jobFind.language) {
        case "cpp":
          output = await executeCpp(jobFind.filePath, jobFind.inputFilePath);
          break;
        case "py":
          output = await executePy(jobFind.filePath, jobFind.inputFilePath);
          break;
        case "java":
          output = await executeJava(jobFind.filePath, jobFind.inputFilePath);
          break;
        case "c":
          output = await executeC(jobFind.filePath, jobFind.inputFilePath);
          break;
        case "js":
          output = await executeJs(jobFind.filePath);
          break;
        default:
          throw new Error(`Unsupported language: ${jobFind.language}`);
      }
      
      jobFind.completedAt = new Date();
      jobFind.status = "success";
      jobFind.output = output;
      await jobFind.save();
      console.log("Job completed successfully:", jobFind);
    } catch (error) {
      jobFind.completedAt = new Date();
      jobFind.status = "error";
      jobFind.output = JSON.stringify(error);
      await jobFind.save();
      console.error("Job failed:", jobFind, error);
    }
});

jobQueue.on("failed", (job, error) => {
    console.error(`Job ID ${job.id} failed with reason:`, error.message);
});

// FIX: Added a timeout option with a default value of 60 seconds
const addJobToQueue = async(jobId, options = { timeout: 60000 }) => {
    // FIX: Added a try...catch block to handle errors when adding a job
    try {
        await jobQueue.add({id : jobId}, options);
        console.log(`Job with ID ${jobId} successfully added to the queue.`);
    } catch (error) {
        console.error(`Failed to add job with ID ${jobId} to the queue:`, error);
    }
    finally{
        console.log("Done with function addJobToQueue");
    }
}

module.exports = {
    addJobToQueue
}
