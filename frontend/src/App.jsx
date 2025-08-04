import React, { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import axios from "axios";
import "./App.css";


const codeTemplates = {
  cpp: `// C++
#include <iostream>
using namespace std;
int main() {
    int a, b;
    std::cout << "Enter two numbers: " << std::endl;
    std::cin >> a >> b;
    std::cout << "The sum is: " << a + b << std::endl;
    return 0;
}`,
  c: `// C
#include <stdio.h>

int main() {
    int a, b;
    printf("Enter two numbers:\\n");
    if (scanf("%d %d", &a, &b) == 2) {
        printf("The sum is: %d\\n", a + b);
    } else {
        printf("Invalid input.\\n");
    }
    return 0;
}`,
  py: `# Python
import sys
# Read from standard input
try:
    a = int(sys.stdin.readline())
    b = int(sys.stdin.readline())
    print(f"The sum is: {a + b}")
except (ValueError, TypeError):
    print("Invalid input.")`,
  java: `// Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        try {
            System.out.println("Enter two numbers:");
            int a = scanner.nextInt();
            int b = scanner.nextInt();
            System.out.println("The sum is: " + (a + b));
        } catch (Exception e) {
            System.out.println("Invalid input.");
        } finally {
            scanner.close();
        }
    }
}`,
  js: `// JavaScript (Node.js)
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
  lines.push(line);
});

rl.on('close', () => {
  const [a, b] = lines.map(Number);
  console.log('The sum is:', a + b);
});`,
};

const inputTemplates = {
  cpp: `10 20`,
  c: `10 20`,
  py: `10\n20`,
  java: `10 20`,
  js: `10\n20`,
};

function App() {
  const [code, setCode] = useState(codeTemplates["cpp"]);
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState(inputTemplates["cpp"]);
  const [loading, setLoading] = useState(false);
  const [runClicked, setRunClicked] = useState(false);
  const [jobId, setJobId] = useState(null); 
  const [jobStatus, setJobStatus] = useState("pending");

  useEffect(() => {
    setCode(codeTemplates[language]);
    setInput(inputTemplates[language]);
  }, [language]);

  const getHighlighter = (lang) => {
    switch (lang) {
      case "cpp":
        return languages.cpp;
      case "c":
        return languages.c;
      case "py":
        return languages.python;
      case "java":
        return languages.java;
      case "js":
        return languages.js;
      default:
        return languages.clike;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOutput("Running...");
    setRunClicked(true);
    setJobId(null); 
    setJobStatus("pending");

    const payload = {
      language,
      code,
      input,
    };

    try {
      const { data } = await axios.post("http://localhost:3000/run", payload);
      setJobId(data.jobId);
      
      const intervalId = setInterval(async () => {
        const { data: statusData } = await axios.get("http://localhost:3000/status", {
          params: { id: data.jobId }
        });
        
        console.log(`Job ID: ${data.jobId}, Status: ${statusData.job.status}`);
        setJobStatus(statusData.job.status);

        if (statusData.success && (statusData.job.status === "success" || statusData.job.status === "error")) {
          if (statusData.job.status === "success") {
            // FIX: Removed jobId from the output
            setOutput(statusData.job.output);
          } else {
            const error = JSON.parse(statusData.job.output);
            const errorMessage = error?.error?.stderr || error?.error?.message || "An unexpected error occurred.";
            setOutput(`Error: ${errorMessage}`);
          }
          clearInterval(intervalId);
          setLoading(false);
        }
      }, 500); 

    } catch (error) {
      console.error(error.response);
      const errorMessage =
        error.response?.data?.error?.stderr ||
        error.response?.data?.error ||
        "An unexpected error occurred.";
      setOutput(`Error: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col p-4 text-gray-100 bg-gray-800 font-inter">
      <div className="w-full flex-1 rounded-2xl p-8 space-y-6 relative z-10 flex flex-col">
        <h1 className="text-4xl font-extrabold text-center text-white">
          Online Code Compiler
        </h1>

        <div className="flex items-center justify-between space-x-4 mb-4">
          <div className="flex-1">
            <label htmlFor="language-select" className="sr-only">
              Select Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                // The useEffect hook will handle setting the code and input templates
              }}
              className="w-full p-3 rounded-xl bg-gray-700 text-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="py">Python</option>
              <option value="java">Java</option>
              <option value="js">JavaScript</option>
            </select>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Run"
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0 flex-1">
          <div className="md:w-1/2 flex-1 rounded-xl border-2 border-white max-h-[70vh] bg-[#2d3748] flex flex-col">
            <label htmlFor="code-editor" className="sr-only">
              Code Editor
            </label>
            <div className="flex-1 overflow-y-auto">
              <Editor
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={(code) => highlight(code, getHighlighter(language))}
                padding={10}
                style={{
                  fontFamily: "ui-monospace",
                  fontSize: 12,
                  outline: "none",
                  border: "none",
                  backgroundColor: "#2d3748",
                  color: "#f7fafc",
                  height: "100%",
                  overflowY: "auto",
                }}
                className="w-full no-ligatures"
              />
            </div>
          </div>

          <div className="flex flex-col md:w-1/2 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Input</h2>
                <button
                  onClick={() => setInput("")}
                  className="text-sm px-4 py-1 rounded-full text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your input here..."
                className="w-full p-4 rounded-xl bg-gray-700 text-white text-sm font-mono border-2 border-white focus:outline-none focus:ring-2 focus:ring-white h-48 overflow-auto resize-none"
              ></textarea>
            </div>

            <div className="space-y-2 flex-1 flex flex-col max-h-[30vh]">
              <h2 className="text-xl font-bold">Output</h2>
              {runClicked && (
                <div className="flex-1 overflow-y-auto rounded-xl border-2 border-white bg-gray-700 p-6 text-sm font-mono text-green-300 whitespace-pre-wrap break-words">
                  <pre>{output}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
