import React, { useState } from 'react';
import { Terminal, Play, RefreshCw, Server, CheckCircle, AlertTriangle, Code, Globe } from 'lucide-react';
import axios from 'axios';

interface ApiTesterProps {
  isOnline: boolean;
  onRefreshHealth: () => void;
}

export const ApiTester: React.FC<ApiTesterProps> = ({ isOnline, onRefreshHealth }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'getBooks' | 'searchBooks' | 'createBook'>('getBooks');
  const [searchParam, setSearchParam] = useState('Dune');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const handleRunEndpoint = async () => {
    setLoading(true);
    setTestResponse(null);
    setStatusCode(null);
    const startTime = performance.now();

    try {
      if (selectedEndpoint === 'getBooks') {
        const res = await axios.get('/api/book');
        setStatusCode(res.status);
        setTestResponse(res.data);
      } else if (selectedEndpoint === 'searchBooks') {
        const res = await axios.get(`/api/book/search-google-books?query=${encodeURIComponent(searchParam)}`);
        setStatusCode(res.status);
        setTestResponse(res.data);
      } else if (selectedEndpoint === 'createBook') {
        const samplePayload = {
          title: "Test Manuscript " + Math.floor(Math.random() * 1000),
          itemType: "Book",
          defaultPageCount: 350,
          publishYear: new Date().toISOString(),
          author: {
            name: "Test Author",
            bio: "Automated test author"
          }
        };
        const res = await axios.post('/api/book', samplePayload);
        setStatusCode(res.status);
        setTestResponse(res.data);
      }
    } catch (err: any) {
      if (err.response) {
        setStatusCode(err.response.status);
        setTestResponse(err.response.data);
      } else {
        setStatusCode(500);
        setTestResponse({
          error: "Connection Refused / Backend Offline",
          message: err.message,
          suggestion: "Ensure ASP.NET Core API is running on http://localhost:5233 (dotnet run in api folder)"
        });
      }
    } finally {
      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-[#e4e2e1] font-black uppercase tracking-wider italic">
            API Diagnostics & Endpoint Tester
          </h1>
          <p className="font-label text-xs text-[#e4e2e1]/70 uppercase tracking-widest mt-1">
            Test and inspect backend API endpoints for RedBook in real-time.
          </p>
        </div>
        <button
          onClick={onRefreshHealth}
          className="illuminated-btn bg-[#1b1c1c] text-[#d4af37] border-[#d4af37]/40"
        >
          <RefreshCw size={16} />
          <span>Ping Status</span>
        </button>
      </div>

      {/* Backend Status Card */}
      <div className="parchment-card p-6 rounded-sm border-2 border-[#d4af37] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <Server size={36} className={isOnline ? 'text-emerald-800' : 'text-[#9e1b1b]'} />
          <div>
            <h3 className="font-display font-bold text-lg text-[#383014] flex items-center gap-2">
              Target API: <code className="bg-[#1a1512] text-[#d4af37] px-2 py-0.5 rounded text-xs">http://localhost:5233</code>
            </h3>
            <p className="font-body text-xs text-[#383014]/80 mt-1">
              {isOnline
                ? 'Connected to ASP.NET Core Web API backend.'
                : 'Backend API offline. Frontend proxy using demo mock fallbacks.'}
            </p>
          </div>
        </div>

        <div className={`px-4 py-2 font-label font-bold text-xs uppercase tracking-widest rounded-sm border flex items-center gap-2 ${
          isOnline ? 'bg-emerald-900 text-emerald-200 border-emerald-500' : 'bg-[#9e1b1b] text-white border-[#d4af37]'
        }`}>
          {isOnline ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          <span>{isOnline ? 'HTTP 200 ONLINE' : 'DEMO MODE'}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 parchment-card p-6 rounded-sm border border-[#d4af37] space-y-6">
          <h3 className="font-display font-bold text-lg text-[#383014] flex items-center gap-2 border-b border-[#383014]/15 pb-3 italic">
            <Terminal size={18} className="text-[#9e1b1b]" />
            <span>Select Endpoint</span>
          </h3>

          <div className="space-y-3 font-label">
            <button
              onClick={() => setSelectedEndpoint('getBooks')}
              className={`w-full text-left p-3.5 rounded-sm border font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all ${
                selectedEndpoint === 'getBooks'
                  ? 'bg-[#1a1512] text-[#d4af37] border-[#d4af37]'
                  : 'bg-[#f4ecd8] text-[#383014] border-[#383014]/20 hover:border-[#d4af37]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="badge-crimson">GET</span>
                <span>/api/book</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('searchBooks')}
              className={`w-full text-left p-3.5 rounded-sm border font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all ${
                selectedEndpoint === 'searchBooks'
                  ? 'bg-[#1a1512] text-[#d4af37] border-[#d4af37]'
                  : 'bg-[#f4ecd8] text-[#383014] border-[#383014]/20 hover:border-[#d4af37]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="badge-crimson">GET</span>
                <span>/api/book/search-google-books</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('createBook')}
              className={`w-full text-left p-3.5 rounded-sm border font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all ${
                selectedEndpoint === 'createBook'
                  ? 'bg-[#1a1512] text-[#d4af37] border-[#d4af37]'
                  : 'bg-[#f4ecd8] text-[#383014] border-[#383014]/20 hover:border-[#d4af37]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="badge-gold">POST</span>
                <span>/api/book</span>
              </div>
            </button>
          </div>

          {selectedEndpoint === 'searchBooks' && (
            <div className="space-y-1">
              <label className="font-label text-xs font-bold uppercase tracking-wider text-[#383014]">
                Query Parameter (?query=)
              </label>
              <input
                type="text"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
                className="w-full bg-[#1a1512] text-[#f4ecd8] border border-[#d4af37]/60 p-3 rounded-sm font-body outline-none focus:ring-2 focus:ring-[#9e1b1b]"
              />
            </div>
          )}

          <button
            onClick={handleRunEndpoint}
            disabled={loading}
            className="illuminated-btn w-full py-3"
          >
            <Play size={16} />
            <span>{loading ? 'Executing Request...' : 'Send Request'}</span>
          </button>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 bg-[#1a1512] p-6 rounded-sm border-2 border-[#d4af37] flex flex-col justify-between space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
            <h3 className="font-display font-bold text-lg text-[#d4af37] flex items-center gap-2 italic">
              <Code size={18} />
              <span>Response Payload</span>
            </h3>

            {statusCode !== null && (
              <div className="flex items-center gap-2 font-label text-xs font-bold">
                <span className={`px-2.5 py-1 rounded text-white ${statusCode >= 200 && statusCode < 300 ? 'bg-emerald-900' : 'bg-[#9e1b1b]'}`}>
                  HTTP {statusCode}
                </span>
                {executionTime !== null && (
                  <span className="px-2.5 py-1 bg-[#131313] text-[#d4af37] border border-[#d4af37]/40 rounded">
                    {executionTime} ms
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="bg-[#0e0e0e] border border-[#d4af37]/30 rounded-sm p-4 min-h-[320px] max-h-[480px] overflow-auto font-mono text-xs text-[#f4ecd8] leading-relaxed">
            {testResponse ? (
              <pre>{JSON.stringify(testResponse, null, 2)}</pre>
            ) : (
              <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center text-[#d4af37]/50 space-y-2 font-label">
                <Globe size={36} className="mx-auto opacity-40" />
                <p>Click "Send Request" to view live JSON response.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
