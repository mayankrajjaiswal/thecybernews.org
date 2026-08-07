import React, { useState, useEffect } from 'react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [highlightedText, setHighlightedText] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setError('');
      setHighlightedText([testString]);
      return;
    }

    try {
      // Validate flags
      const validFlags = /^[gimsuy]*$/;
      if (!validFlags.test(flags)) {
        throw new Error('Invalid regular expression flags.');
      }

      const regex = new RegExp(pattern, flags);
      setError('');

      if (!testString) {
        setMatches([]);
        setHighlightedText([]);
        return;
      }

      // Execute matching
      const foundMatches: string[] = [];
      let match;
      
      // We must reset lastIndex if global flag is used
      regex.lastIndex = 0;

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          // Prevent infinite loops on zero-width matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          foundMatches.push(match[0]);
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          foundMatches.push(match[0]);
        }
      }
      
      setMatches(foundMatches);

      // Build Highlighted Text
      if (foundMatches.length > 0) {
        // Safe splitting and highlighting for display
        const parts: React.ReactNode[] = [];
        let currentIndex = 0;
        
        // Reset regex for replace operation
        const highlightRegex = new RegExp(pattern, flags);
        
        let matchResult;
        let counter = 0;
        
        if (flags.includes('g')) {
           let lastMatchEnd = 0;
           while ((matchResult = highlightRegex.exec(testString)) !== null) {
              if (matchResult[0].length === 0) {
                 highlightRegex.lastIndex++;
                 continue; // skip zero-width for highlighting logic
              }
              
              // Add un-matched text before this match
              if (matchResult.index > lastMatchEnd) {
                 parts.push(<span key={`text-${counter}`}>{testString.substring(lastMatchEnd, matchResult.index)}</span>);
              }
              
              // Add matched text
              parts.push(<mark key={`match-${counter}`} className="bg-emerald-200 text-emerald-900 px-0.5 rounded-sm font-bold">{matchResult[0]}</mark>);
              
              lastMatchEnd = matchResult.index + matchResult[0].length;
              counter++;
           }
           // Add remaining text
           if (lastMatchEnd < testString.length) {
              parts.push(<span key={`text-end`}>{testString.substring(lastMatchEnd)}</span>);
           }
        } else {
           // Non-global replace
           const nonGlobalMatch = highlightRegex.exec(testString);
           if (nonGlobalMatch && nonGlobalMatch[0].length > 0) {
             parts.push(<span key="start">{testString.substring(0, nonGlobalMatch.index)}</span>);
             parts.push(<mark key="match" className="bg-emerald-200 text-emerald-900 px-0.5 rounded-sm font-bold">{nonGlobalMatch[0]}</mark>);
             parts.push(<span key="end">{testString.substring(nonGlobalMatch.index + nonGlobalMatch[0].length)}</span>);
           } else {
             parts.push(<span key="all">{testString}</span>);
           }
        }
        
        setHighlightedText(parts.length > 0 ? parts : [testString]);
      } else {
        setHighlightedText([testString]);
      }

    } catch (e: any) {
      setError(e.message || 'Invalid Regular Expression');
      setMatches([]);
      setHighlightedText([testString]);
    }
  }, [pattern, flags, testString]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-4xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-3">
          <label className="block text-sm font-bold text-slate-700 mb-2">Regular Expression</label>
          <div className="flex relative">
            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-500 font-mono text-lg">
              /
            </span>
            <input
              type="text"
              className="flex-1 block w-full px-4 py-3 border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono text-lg"
              placeholder="e.g. ^[a-z0-9_-]{3,16}$"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              data-testid="regex-pattern"
            />
            <span className="inline-flex items-center px-4 rounded-none border border-l-0 border-slate-300 bg-slate-50 text-slate-500 font-mono text-lg">
              /
            </span>
            <input
              type="text"
              className="block w-24 px-4 py-3 border border-l-0 border-slate-300 rounded-r-xl focus:ring-2 focus:ring-blue-500 font-mono text-lg text-blue-600"
              placeholder="flags"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              data-testid="regex-flags"
            />
          </div>
          {error && <p className="mt-2 text-sm font-bold text-red-600" data-testid="regex-error">{error}</p>}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-slate-700 mb-2">Test String</label>
        <textarea
          rows={5}
          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm shadow-sm"
          placeholder="Paste your logs, emails, or text here to test the pattern against..."
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          data-testid="regex-test-string"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Match Results */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
            Match Results
            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs" data-testid="match-count">
              {matches.length} matches
            </span>
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[12rem] max-h-[20rem] overflow-y-auto font-mono text-sm">
            {matches.length === 0 ? (
              <p className="text-slate-400 italic text-center mt-8">No matches found.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {matches.map((match, idx) => (
                  <li key={idx} className="py-2 text-emerald-700 break-all flex">
                    <span className="text-slate-400 mr-4 w-4">{idx + 1}.</span> 
                    {match}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Highlighted Visualizer */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
            Visualizer
          </h3>
          <div 
            className="bg-white border border-slate-200 shadow-inner rounded-xl p-4 min-h-[12rem] max-h-[20rem] overflow-y-auto font-mono text-sm whitespace-pre-wrap break-words text-slate-600"
            data-testid="regex-visualizer"
          >
            {highlightedText.length > 0 ? highlightedText : <span className="text-slate-300 italic">Test string empty.</span>}
          </div>
        </div>
      </div>
      
    </div>
  );
}
