import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import axios from 'axios';
import './App.css';

// Define the code templates for each language
const codeTemplates = {
    'cpp': `// C++
#include <iostream>

int main() {
    std::cout << "Hello, C++!";
    return 0;
}`,
    'c': `// C
#include <stdio.h>

int main() {
    printf("Hello, C!");
    return 0;
}`,
    'py': `// Python
print("Hello, Python!")`,
    'java': `// Java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
    'js': `// JavaScript
console.log("Hello, JavaScript!");`
};

function App() {
  const [code, setCode] = useState(codeTemplates['cpp']);
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCode(codeTemplates[language]);
  }, [language]);

  const getHighlighter = (lang) => {
    switch (lang) {
        case 'cpp': return languages.cpp;
        case 'c': return languages.c;
        case 'py': return languages.python;
        case 'java': return languages.java;
        case 'js': return languages.js; // Add this case
        default: return languages.clike;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOutput('Running...');

    const payload = {
        language,
        code
    };

    try {
        const { data } = await axios.post('http://localhost:3000/run', payload);
        console.log(data);
        if (data && data.output !== undefined) {
            setOutput(data.output);
        } else {
            setOutput('Unexpected response from server.');
        }
    } catch (error) {
        console.error(error.response);
        const errorMessage = error.response?.data?.error?.stderr || error.response?.data?.error || 'An unexpected error occurred.';
        setOutput(`Error: ${errorMessage}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">AlgoU Online Code Compiler</h1>
      <select 
        className="select-box border border-gray-300 rounded-lg py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500"
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value);
          setCode(codeTemplates[e.target.value]);
        }}
      >
        <option value='cpp'>C++</option>
        <option value='c'>C</option>
        <option value='py'>Python</option>
        <option value='java'>Java</option>
        <option value='js'>JavaScript</option> {/* Add this option */}
      </select>
      <br />
      <div className="bg-gray-100 shadow-md w-full max-w-lg mb-4" style={{ height: '300px', overflowY: 'auto' }}>
        <Editor
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, getHighlighter(language))}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            outline: 'none',
            border: 'none',
            backgroundColor: '#f7fafc',
            height: '100%',
            overflowY: 'auto'
          }}
        />
      </div>

      <button onClick={handleSubmit} type="button" className="text-center inline-flex items-center text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" disabled={loading}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 me-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
        </svg>
        {loading ? 'Running...' : 'Run'}
      </button>

      {output &&
        <div className="outputbox mt-4 bg-gray-100 rounded-md shadow-md p-4 w-full max-w-lg">
          <pre style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>{output}</pre>
        </div>
      }
    </div>
  );
}

export default App;
