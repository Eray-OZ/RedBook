import React, { useState } from 'react';
import { Terminal, Play, RefreshCw, Server, CheckCircle, AlertTriangle, Code, Globe } from 'lucide-react';
import axios from 'axios';

interface ApiTesterProps {
  isOnline: boolean;
  onRefreshHealth: () => void;
}

type EndpointKey = 'getBooks' | 'searchBooks' | 'createBook' | 'getLogs' | 'createLog' | 'markLog' | 'statsStatus';

export const ApiTester: React.FC<ApiTesterProps> = ({ isOnline, onRefreshHealth }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointKey>('getBooks');
  const [searchParam, setSearchParam] = useState('Dune');
  const [logIdParam, setLogIdParam] = useState('00000000-0000-0000-0000-000000000000');
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
          title: "Test Volume " + Math.floor(Math.random() * 1000),
          itemType: "Book",
          defaultPageCount: 350,
          publishYear: new Date().toISOString(),
          googleBooksId: "sample-id-123",
          isbn: "9781234567890",
          coverImageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
          authorDto: {
            name: "Test Author",
            bio: "Automated test biography"
          }
        };
        const res = await axios.post('/api/book', samplePayload);
        setStatusCode(res.status);
        setTestResponse(res.data);
      } else if (selectedEndpoint === 'getLogs') {
        const res = await axios.get('/api/logs');
        setStatusCode(res.status);
        setTestResponse(res.data);
      } else if (selectedEndpoint === 'createLog') {
        const samplePayload = {
          bookookDto: {
            title: "Test Reading Log " + Math.floor(Math.random() * 1000),
            itemType: "Book",
            defaultPageCount: 280,
            publishYear: new Date().toISOString(),
            authorDto: {
              name: "Log Author",
              bio: "Test biography"
            }
          },
          status: "Reading",
          startDate: new Date().toISOString(),
          isReRead: false
        };
        const res = await axios.post('/api/logs', samplePayload);
        setStatusCode(res.status);
        setTestResponse(res.data);
      } else if (selectedEndpoint === 'markLog') {
        const samplePayload = {
          status: "Finished",
          finishDate: new Date().toISOString(),
          readPages: 280,
          rating: 4.8,
          reviewNotes: "Reading status updated to Finished via API diagnostic test."
        };
        const res = await axios.put(`/api/logs/${logIdParam}`, samplePayload);
        setStatusCode(res.status);
        setTestResponse(res.data);
      } else if (selectedEndpoint === 'statsStatus') {
        const res = await axios.get('/api/logs/stats-status');
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
          suggestion: "Ensure ASP.NET Core API is running on http://localhost:5233 (dotnet run in api folder)."
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-on-background pb-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">
            API Diagnostics & Testing Panel
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Test backend API endpoints live and inspect JSON response payloads.
          </p>
        </div>
        <button
          onClick={onRefreshHealth}
          className="py-2.5 px-4 bg-surface border-2 border-on-background rounded-lg font-label-md text-label-md text-on-background shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} className="text-secondary" />
          <span>Refresh Connection Status</span>
        </button>
      </div>

      {/* Backend Status Card */}
      <div className="bg-surface border-2 border-on-background rounded-xl p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Server size={36} className={isOnline ? 'text-secondary' : 'text-primary'} />
          <div>
            <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
              Target API: <code className="bg-surface-container-high px-2 py-0.5 rounded border border-on-background text-xs font-mono">http://localhost:5233</code>
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              {isOnline
                ? 'Connected to ASP.NET Core Web API backend server.'
                : 'API offline. Frontend operating in local demo mode.'}
            </p>
          </div>
        </div>

        <div className={`px-4 py-2 font-label-md font-bold text-xs uppercase tracking-widest rounded-lg border-2 border-on-background flex items-center gap-2 shadow-brutal-sm ${
          isOnline ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-container text-on-primary-container'
        }`}>
          {isOnline ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          <span>{isOnline ? 'HTTP 200 ONLINE' : 'DEMO MODE'}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 bg-surface border-2 border-on-background rounded-xl p-6 shadow-brutal space-y-6">
          <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-2 border-b-2 border-on-background/20 pb-3">
            <Terminal size={18} className="text-primary" />
            <span>Endpoint Selection</span>
          </h3>

          <div className="space-y-3 font-label-md">
            <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pt-1">
              Book Endpoints (/api/book)
            </div>

            <button
              onClick={() => setSelectedEndpoint('getBooks')}
              className={`w-full text-left p-3 rounded-lg border-2 border-on-background font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all ${
                selectedEndpoint === 'getBooks'
                  ? 'bg-primary text-on-primary shadow-brutal-sm'
                  : 'bg-surface-container-low text-on-background hover:bg-surface-variant'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-secondary text-on-secondary border border-on-background rounded text-[10px]">GET</span>
                <span>/api/book</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('searchBooks')}
              className={`w-full text-left p-3 rounded-lg border-2 border-on-background font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all ${
                selectedEndpoint === 'searchBooks'
                  ? 'bg-primary text-on-primary shadow-brutal-sm'
                  : 'bg-surface-container-low text-on-background hover:bg-surface-variant'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-secondary text-on-secondary border border-on-background rounded text-[10px]">GET</span>
                <span>/api/book/search-google-books</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('createBook')}
              className={`w-full text-left p-3 rounded-lg border-2 border-on-background font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all ${
                selectedEndpoint === 'createBook'
                  ? 'bg-primary text-on-primary shadow-brutal-sm'
                  : 'bg-surface-container-low text-on-background hover:bg-surface-variant'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-tertiary text-on-tertiary border border-on-background rounded text-[10px]">POST</span>
                <span>/api/book</span>
              </div>
            </button>

            <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pt-3 border-t-2 border-on-background/10">
              Reading Log Endpoints (/api/logs)
            </div>

            <button
              onClick={() => setSelectedEndpoint('getLogs')}
              className={`w-full text-left p-3 rounded-lg border-2 border-on-background font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all ${
                selectedEndpoint === 'getLogs'
                  ? 'bg-primary text-on-primary shadow-brutal-sm'
                  : 'bg-surface-container-low text-on-background hover:bg-surface-variant'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-secondary text-on-secondary border border-on-background rounded text-[10px]">GET</span>
                <span>/api/logs</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('createLog')}
              className={`w-full text-left p-3 rounded-lg border-2 border-on-background font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all ${
                selectedEndpoint === 'createLog'
                  ? 'bg-primary text-on-primary shadow-brutal-sm'
                  : 'bg-surface-container-low text-on-background hover:bg-surface-variant'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-tertiary text-on-tertiary border border-on-background rounded text-[10px]">POST</span>
                <span>/api/logs</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('markLog')}
              className={`w-full text-left p-3 rounded-lg border-2 border-on-background font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all ${
                selectedEndpoint === 'markLog'
                  ? 'bg-primary text-on-primary shadow-brutal-sm'
                  : 'bg-surface-container-low text-on-background hover:bg-surface-variant'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container border border-on-background rounded text-[10px]">PUT</span>
                <span>/api/logs/&#123;id&#125;</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('statsStatus')}
              className={`w-full text-left p-3 rounded-lg border-2 border-on-background font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all ${
                selectedEndpoint === 'statsStatus'
                  ? 'bg-primary text-on-primary shadow-brutal-sm'
                  : 'bg-surface-container-low text-on-background hover:bg-surface-variant'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-secondary text-on-secondary border border-on-background rounded text-[10px]">GET</span>
                <span>/api/logs/stats-status</span>
              </div>
            </button>
          </div>

          {selectedEndpoint === 'searchBooks' && (
            <div className="space-y-1">
              <label className="font-label-md text-xs font-bold text-on-background">
                Search Query Parameter (?query=)
              </label>
              <input
                type="text"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
                className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg font-body-md outline-none focus:border-secondary shadow-brutal-sm"
              />
            </div>
          )}

          {selectedEndpoint === 'markLog' && (
            <div className="space-y-1">
              <label className="font-label-md text-xs font-bold text-on-background">
                Log ID Parameter (/api/logs/&#123;id&#125;)
              </label>
              <input
                type="text"
                value={logIdParam}
                onChange={(e) => setLogIdParam(e.target.value)}
                className="w-full bg-surface-container-low text-on-background border-2 border-on-background p-3 rounded-lg font-mono text-xs outline-none focus:border-secondary shadow-brutal-sm"
                placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
              />
            </div>
          )}

          <button
            onClick={handleRunEndpoint}
            disabled={loading}
            className="w-full py-3 bg-secondary text-on-secondary border-2 border-on-background rounded-lg font-label-md text-label-md font-bold shadow-brutal-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Play size={16} />
            <span>{loading ? 'Sending Request...' : 'Run Request'}</span>
          </button>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 bg-surface border-2 border-on-background rounded-xl p-6 shadow-brutal flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b-2 border-on-background/20 pb-3">
            <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
              <Code size={18} className="text-primary" />
              <span>Response Payload (JSON)</span>
            </h3>

            {statusCode !== null && (
              <div className="flex items-center gap-2 font-label-md text-xs font-bold">
                <span className={`px-2.5 py-1 rounded-full border border-on-background ${statusCode >= 200 && statusCode < 300 ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>
                  HTTP {statusCode}
                </span>
                {executionTime !== null && (
                  <span className="px-2.5 py-1 bg-surface-container-high border border-on-background rounded-full text-on-background">
                    {executionTime} ms
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="bg-surface-container-high border-2 border-on-background rounded-lg p-4 min-h-[320px] max-h-[480px] overflow-auto font-mono text-xs text-on-background leading-relaxed shadow-brutal-sm">
            {testResponse ? (
              <pre>{JSON.stringify(testResponse, null, 2)}</pre>
            ) : (
              <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center text-on-surface-variant space-y-2 font-label-md">
                <Globe size={36} className="mx-auto opacity-40 text-primary" />
                <p>Click "Run Request" to inspect the live JSON response payload.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
