import React, { useState, useEffect, useRef } from 'react';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pagefind, setPagefind] = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize Pagefind only on the client side
  useEffect(() => {
    async function loadPagefind() {
      // Don't attempt to load pagefind during vitest runs
      if (typeof window !== 'undefined' && !(window as any).__VITEST__) {
        try {
          // Construct URL dynamically to avoid Vite static analysis crashing on missing file during dev
          const pfUrl = '/pagefind/pagefind.js';
          const pf = await import(/* @vite-ignore */ pfUrl);
          await pf.init();
          setPagefind(pf);
        } catch (e) {
          console.warn('Pagefind not available during dev mode or failed to load.');
        }
      }
    }
    loadPagefind();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);

    if (!value.trim() || !pagefind) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    // Execute search
    const searchResult = await pagefind.search(value);
    
    // Load the first 5 results data
    const fiveResults = await Promise.all(searchResult.results.slice(0, 5).map((r: any) => r.data()));
    setResults(fiveResults);
    setIsSearching(false);
  };

  return (
    <div className="relative w-full max-w-md hidden md:block" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          placeholder="Search guides, dictionary, scams..."
          value={query}
          onChange={handleSearch}
          onFocus={() => query && setIsOpen(true)}
        />
      </div>

      {/* Dropdown Results */}
      {isOpen && query.trim() && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-200 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-sm text-slate-500 text-center">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {results.map((result, idx) => (
                <li key={idx}>
                  <a href={result.url} className="block p-4 hover:bg-slate-50 transition-colors">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{result.meta.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: result.excerpt }}></p>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-slate-500 text-center">No results found for "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
}
