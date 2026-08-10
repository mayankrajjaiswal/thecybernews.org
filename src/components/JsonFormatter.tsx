import React, { useState } from 'react';

export default function JsonFormatter() {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formatJson = () => {
    if (!inputJson.trim()) {
      setError('Please paste some JSON to format.');
      setOutputJson('');
      return;
    }

    try {
      // Parse to ensure validity, then stringify with 2 spaces for formatting
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutputJson(formatted);
      setError(null);
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
      setOutputJson('');
    }
  };

  const minifyJson = () => {
    if (!inputJson.trim()) return;
    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      setError(null);
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
      setOutputJson('');
    }
  };

  const clearAll = () => {
    setInputJson('');
    setOutputJson('');
    setError(null);
  };

  const copyToClipboard = () => {
    if (outputJson) {
      navigator.clipboard.writeText(outputJson);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-[800px]" data-testid="json-formatter">
      
      {/* Input Side */}
      <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-200 bg-slate-50">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-100">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            Input
          </h2>
          <button onClick={clearAll} className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors">Clear</button>
        </div>
        <textarea
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
          className="flex-grow w-full p-4 bg-transparent resize-none focus:outline-none font-mono text-sm text-slate-800"
          placeholder='{"paste": "your JSON here"}'
          data-testid="json-input"
        ></textarea>
        {error && (
          <div className="p-4 bg-red-50 border-t border-red-200 text-red-700 text-sm font-mono font-bold" data-testid="json-error">
            {error}
          </div>
        )}
      </div>

      {/* Output Side */}
      <div className="w-full lg:w-1/2 flex flex-col bg-slate-900">
        <div className="p-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4 bg-slate-950">
          <div className="flex gap-2">
            <button 
              onClick={formatJson}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
            >
              Format
            </button>
            <button 
              onClick={minifyJson}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg text-sm transition-colors"
            >
              Minify
            </button>
          </div>
          <button 
            onClick={copyToClipboard}
            disabled={!outputJson}
            className={`font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              outputJson ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            Copy
          </button>
        </div>
        
        <div className="flex-grow p-4 overflow-y-auto">
          {outputJson ? (
            <pre className="font-mono text-sm text-emerald-400 whitespace-pre-wrap" data-testid="json-output">
              {outputJson}
            </pre>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
              <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              <p className="font-medium">Valid JSON will appear here.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
