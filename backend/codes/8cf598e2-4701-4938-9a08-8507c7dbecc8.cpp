import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
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
        case 'js': return languages.js;
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
    <div className="min-h-screen flex items-center justify-center p-4 text-gray-100 bg-cover bg-center">
        <div className="absolute inset-0 bg-black opacity-75"></div>

        <div className="w-full max-w-5xl bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6 relative z-10">
            <h1 className="text-4xl font-extrabold text-center text-white">
                AlgoU Online Code Compiler
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-auto">
                    <label htmlFor="language-select" className="sr-only">Select Language</label>
                    <select
                        id="language-select"
                        value={language}
                        onChange={(e) => {
                          setLanguage(e.target.value);
                          setCode(codeTemplates[e.target.value]);
                        }}
                        className="w-full sm:w-48 p-3 rounded-xl bg-gray-700 text-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        <option value='cpp'>C++</option>
                        <option value='c'>C</option>
                        <option value='py'>Python</option>
                        <option value='java'>Java</option>
                        <option value='js'>JavaScript</option>
                    </select>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full sm:w-32 px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Run'}
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto rounded-xl border-2 border-white">
                <label htmlFor="code-editor" className="sr-only">Code Editor</label>
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
                        backgroundColor: '#2d3748',
                        color: '#f7fafc',
                        height: '100%',
                        minHeight: '25rem',
                    }}
                    className="w-full no-ligatures"
                />
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-2">Output</h2>
                <pre
                    className="w-full p-6 rounded-xl bg-gray-700 text-sm font-mono text-green-300 whitespace-pre-wrap break-words max-h-64 overflow-auto border-2 border-white"
                >
                    {output}
                </pre>
            </div>
        </div>
    </div>
  );
}

export default App;
