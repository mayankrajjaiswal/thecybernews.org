import React, { useState, useMemo } from 'react';

// Comprehensive HTTP Status Codes Database
const statusCodes = [
  // 1xx Informational
  { code: 100, class: '1xx', title: 'Continue', desc: 'The server has received the request headers and the client should proceed to send the request body.' },
  { code: 101, class: '1xx', title: 'Switching Protocols', desc: 'The requester has asked the server to switch protocols and the server has agreed to do so.' },
  
  // 2xx Success
  { code: 200, class: '2xx', title: 'OK', desc: 'Standard response for successful HTTP requests.' },
  { code: 201, class: '2xx', title: 'Created', desc: 'The request has been fulfilled, resulting in the creation of a new resource.' },
  { code: 202, class: '2xx', title: 'Accepted', desc: 'The request has been accepted for processing, but the processing has not been completed.' },
  { code: 204, class: '2xx', title: 'No Content', desc: 'The server successfully processed the request and is not returning any content.' },
  
  // 3xx Redirection
  { code: 301, class: '3xx', title: 'Moved Permanently', desc: 'This and all future requests should be directed to the given URI.' },
  { code: 302, class: '3xx', title: 'Found (Moved Temporarily)', desc: 'The resource was temporarily moved to a different URI.' },
  { code: 304, class: '3xx', title: 'Not Modified', desc: 'Indicates that the resource has not been modified since the version specified by the request headers.' },
  { code: 308, class: '3xx', title: 'Permanent Redirect', desc: 'The request and all future requests should be repeated using another URI.' },
  
  // 4xx Client Error
  { code: 400, class: '4xx', title: 'Bad Request', desc: 'The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax).' },
  { code: 401, class: '4xx', title: 'Unauthorized', desc: 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.' },
  { code: 403, class: '4xx', title: 'Forbidden', desc: 'The request contained valid data and was understood by the server, but the server is refusing action (often due to missing permissions).' },
  { code: 404, class: '4xx', title: 'Not Found', desc: 'The requested resource could not be found but may be available in the future.' },
  { code: 405, class: '4xx', title: 'Method Not Allowed', desc: 'A request method is not supported for the requested resource (e.g. a GET request on a form that requires POST).' },
  { code: 408, class: '4xx', title: 'Request Timeout', desc: 'The server timed out waiting for the request.' },
  { code: 429, class: '4xx', title: 'Too Many Requests', desc: 'The user has sent too many requests in a given amount of time (Rate Limiting).' },
  
  // 5xx Server Error
  { code: 500, class: '5xx', title: 'Internal Server Error', desc: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.' },
  { code: 502, class: '5xx', title: 'Bad Gateway', desc: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.' },
  { code: 503, class: '5xx', title: 'Service Unavailable', desc: 'The server cannot handle the request (because it is overloaded or down for maintenance).' },
  { code: 504, class: '5xx', title: 'Gateway Timeout', desc: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.' },
];

export default function HttpStatusReference() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeClass, setActiveClass] = useState('All');

  const filteredCodes = useMemo(() => {
    return statusCodes.filter(c => {
      const matchesSearch = searchTerm === '' || 
        c.code.toString().includes(searchTerm) || 
        c.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = activeClass === 'All' || c.class === activeClass;
      
      return matchesSearch && matchesClass;
    });
  }, [searchTerm, activeClass]);

  const getClassColor = (classType: string) => {
    switch(classType) {
      case '1xx': return 'bg-slate-100 text-slate-800';
      case '2xx': return 'bg-emerald-100 text-emerald-800';
      case '3xx': return 'bg-blue-100 text-blue-800';
      case '4xx': return 'bg-orange-100 text-orange-800';
      case '5xx': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-4xl mx-auto">
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <label htmlFor="status-search" className="block text-sm font-bold text-slate-700 mb-2">
            Search Status Codes
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
            <input
              id="status-search"
              type="text"
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
              placeholder="Search by code (e.g. 404) or name (e.g. Not Found)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="status-search-input"
            />
          </div>
        </div>
        
        <div className="w-full md:w-48">
           <label className="block text-sm font-bold text-slate-700 mb-2">
            Filter Category
          </label>
          <select
            value={activeClass}
            onChange={(e) => setActiveClass(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 font-bold text-sm text-slate-700"
            data-testid="status-class-filter"
          >
            <option value="All">All Codes</option>
            <option value="1xx">1xx Informational</option>
            <option value="2xx">2xx Success</option>
            <option value="3xx">3xx Redirection</option>
            <option value="4xx">4xx Client Error</option>
            <option value="5xx">5xx Server Error</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm max-h-[500px] overflow-y-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-4 font-bold w-24">Code</th>
              <th className="px-6 py-4 font-bold w-48">Title</th>
              <th className="px-6 py-4 font-bold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredCodes.length > 0 ? (
              filteredCodes.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors" data-testid="status-row">
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg font-bold text-sm ${getClassColor(item.class)}`}>
                      {item.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{item.title}</td>
                  <td className="px-6 py-4 text-slate-600">{item.desc}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-500 italic">
                  No status codes found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
