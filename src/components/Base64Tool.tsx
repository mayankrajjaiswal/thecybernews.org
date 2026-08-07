import React, { useState } from 'react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const processText = (text: string, currentMode: 'encode' | 'decode') => {
    setInput(text);
    setError('');
    setOutput('');

    if (!text) return;

    try {
      if (currentMode === 'encode') {
        // btoa expects a "binary" string. To safely encode unicode/emojis:
        const utf8Bytes = new TextEncoder().encode(text);
        const binaryString = String.fromCodePoint(...utf8Bytes);
        setOutput(btoa(binaryString));
      } else {
        // Decode
        const binaryString = atob(text.trim());
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        setOutput(new TextDecoder().decode(bytes));
      }
    } catch (e) {
      setError('Invalid input. Ensure the text is properly formatted for the selected mode.');
    }
  };

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    processText(input, newMode);
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit mb-6 mx-auto">
        <button
          onClick={() => handleModeChange('encode')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${mode === 'encode' ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Encode
        </button>
        <button
          onClick={() => handleModeChange('decode')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${mode === 'decode' ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Decode
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Input ({mode === 'encode' ? 'Plain Text' : 'Base64'})
          </label>
          <textarea
            rows={5}
            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm shadow-sm"
            placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste Base64 to decode...'}
            value={input}
            onChange={(e) => processText(e.target.value, mode)}
            data-testid="base64-input"
          />
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-bold text-slate-700">
              Output ({mode === 'encode' ? 'Base64' : 'Plain Text'})
            </label>
            {output && (
              <button onClick={copyToClipboard} className="text-xs font-semibold text-blue-600 hover:text-blue-800" data-testid="copy-btn">
                Copy Output
              </button>
            )}
          </div>
          <div className={`w-full p-4 border rounded-xl min-h-[8rem] font-mono text-sm break-all ${error ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-800'}`} data-testid="base64-output">
            {error ? error : output}
          </div>
        </div>
      </div>
    </div>
  );
}
