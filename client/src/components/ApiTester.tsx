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
          title: "Test Book " + Math.floor(Math.random() * 1000),
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
    <div>
      <div className="section-title-bar">
        <div>
          <h1 className="section-title">API Endpoint Explorer & Diagnostics</h1>
          <p className="section-subtitle">
            Inspect, test, and monitor ASP.NET Core ReadRate API endpoints in real-time.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={onRefreshHealth}>
          <RefreshCw size={16} />
          <span>Ping Health Check</span>
        </button>
      </div>

      {/* Backend Health Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Server size={32} className={isOnline ? 'text-emerald-400' : 'text-amber-400'} />
          <div>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Target Server: <code style={{ color: 'var(--accent-secondary)' }}>http://localhost:5233</code>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isOnline
                ? 'Connected to ASP.NET Core Web API (OpenAPI / Swagger endpoint operational)'
                : 'Backend API offline. Frontend proxy is active; requests use simulated local data.'}
            </p>
          </div>
        </div>

        <div className={`badge ${isOnline ? 'badge-journal' : 'badge-audiobook'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          {isOnline ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          <span>{isOnline ? 'STATUS 200 OK' : 'OFFLINE / FALLBACK'}</span>
        </div>
      </div>

      {/* Tester Interface Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem' }}>
        {/* Left Column: Endpoint selector & params */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={18} className="text-violet-400" />
            <span>Select Endpoint</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button
              className={`btn btn-secondary ${selectedEndpoint === 'getBooks' ? 'btn-primary' : ''}`}
              style={{ justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
              onClick={() => setSelectedEndpoint('getBooks')}
            >
              <span className="badge badge-book" style={{ marginRight: '0.5rem' }}>GET</span>
              <span>/api/book</span>
            </button>

            <button
              className={`btn btn-secondary ${selectedEndpoint === 'searchBooks' ? 'btn-primary' : ''}`}
              style={{ justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
              onClick={() => setSelectedEndpoint('searchBooks')}
            >
              <span className="badge badge-book" style={{ marginRight: '0.5rem' }}>GET</span>
              <span>/api/book/search-google-books</span>
            </button>

            <button
              className={`btn btn-secondary ${selectedEndpoint === 'createBook' ? 'btn-primary' : ''}`}
              style={{ justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
              onClick={() => setSelectedEndpoint('createBook')}
            >
              <span className="badge badge-journal" style={{ marginRight: '0.5rem' }}>POST</span>
              <span>/api/book</span>
            </button>
          </div>

          {selectedEndpoint === 'searchBooks' && (
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label className="input-label">Query Parameter (?query=)</label>
              <input
                type="text"
                className="text-input"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
              />
            </div>
          )}

          {selectedEndpoint === 'createBook' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Auto Payload:</label>
              <pre
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  color: '#a78bfa',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {JSON.stringify({
                  title: "Test Book Sample",
                  itemType: "Book",
                  defaultPageCount: 350,
                  publishYear: new Date().toISOString(),
                  author: { name: "Test Author", bio: "Automated test" }
                }, null, 2)}
              </pre>
            </div>
          )}

          <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} onClick={handleRunEndpoint} disabled={loading}>
            <Play size={18} />
            <span>{loading ? 'Executing Request...' : 'Send Request'}</span>
          </button>
        </div>

        {/* Right Column: Response Inspector */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={18} className="text-cyan-400" />
              <span>Response Payload</span>
            </h3>

            {statusCode !== null && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className={`badge ${statusCode >= 200 && statusCode < 300 ? 'badge-journal' : 'badge-magazine'}`}>
                  HTTP {statusCode}
                </span>
                {executionTime !== null && (
                  <span className="badge badge-ebook">
                    {executionTime} ms
                  </span>
                )}
              </div>
            )}
          </div>

          <div
            style={{
              background: '#090d16',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              flex: 1,
              minHeight: '300px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              overflow: 'auto',
              color: testResponse ? '#e2e8f0' : 'var(--text-dim)',
            }}
          >
            {testResponse ? (
              <pre>{JSON.stringify(testResponse, null, 2)}</pre>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                <Globe size={32} style={{ opacity: 0.3 }} />
                <span>Click "Send Request" to view live JSON response from ASP.NET Core</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
