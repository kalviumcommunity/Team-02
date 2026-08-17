import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Store, 
  UserCheck, 
  Search,
  Filter,
  Check
} from 'lucide-react';

export const RegionalView = () => {
  const { 
    requests, 
    exceptions, 
    stores, 
    resolveException, 
    assignException 
  } = useApp();

  const [excSearch, setExcSearch] = useState('');
  const [excFilter, setExcFilter] = useState('ALL');
  const [resolveModalExc, setResolveModalExc] = useState(null);
  const [resolutionText, setResolutionText] = useState('');

  // Funnel calculations
  const totalReqs = requests.length;
  const requestedCount = requests.filter(r => r.status === 'Requested').length;
  const underReviewCount = requests.filter(r => r.status === 'Under Review').length;
  const approvedCount = requests.filter(r => r.status === 'Approved' || r.status === 'Partially Approved').length;
  const allocatedCount = requests.filter(r => r.status === 'Allocated' || r.status === 'Picking' || r.status === 'Packed').length;
  const dispatchedCount = requests.filter(r => r.status === 'Dispatched').length;
  const deliveredCount = requests.filter(r => r.status === 'Delivered' || r.status === 'Partially Fulfilled').length;
  const blockedCount = requests.filter(r => r.status === 'Blocked').length;

  const activeExceptions = exceptions.filter(e => {
    const matchesSearch = !excSearch || 
      e.id.toLowerCase().includes(excSearch.toLowerCase()) || 
      e.storeName.toLowerCase().includes(excSearch.toLowerCase()) ||
      e.productName.toLowerCase().includes(excSearch.toLowerCase());
    const matchesSeverity = excFilter === 'ALL' || e.severity === excFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleConfirmResolve = () => {
    if (!resolveModalExc || !resolutionText) return;
    resolveException(resolveModalExc.id, resolutionText);
    setResolveModalExc(null);
  };

  return (
    <div>
      {/* Regional Operations Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Regional Control Tower & Executive Operations</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Cross-store visibility, request lifecycle funnels, and network exception management.
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-cols-4">
        <div className="stat-card">
          <div>
            <div className="label">Preventable Stockout Rate</div>
            <div className="value" style={{ color: 'var(--risk-low)' }}>1.8%</div>
            <div className="subtext">&darr; 3.2% vs prior month</div>
          </div>
          <div className="stat-icon" style={{ color: 'var(--risk-low)' }}>
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="label">High-Risk Resolution Rate</div>
            <div className="value" style={{ color: '#38bdf8' }}>94.2%</div>
            <div className="subtext">Resolved prior to shelf stockout</div>
          </div>
          <div className="stat-icon" style={{ color: '#38bdf8' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="label">Active Exception Queue</div>
            <div className="value" style={{ color: 'var(--risk-critical)' }}>{exceptions.filter(e => e.status !== 'Resolved').length}</div>
            <div className="subtext">Open operational blockers</div>
          </div>
          <div className="stat-icon" style={{ color: 'var(--risk-critical)' }}>
            <ShieldAlert size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="label">Blocked Fulfillment</div>
            <div className="value" style={{ color: 'var(--risk-high)' }}>{blockedCount}</div>
            <div className="subtext">Requests requiring intervention</div>
          </div>
          <div className="stat-icon" style={{ color: 'var(--risk-high)' }}>
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Request Lifecycle Funnel Bar */}
      <div className="card-panel" style={{ marginBottom: '1.5rem' }}>
        <div className="panel-title" style={{ marginBottom: '1rem' }}>
          <BarChart3 size={20} color="var(--accent-primary)" />
          <span>Replenishment Request Lifecycle Funnel ({totalReqs} Total Active Orders)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
          <div style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', borderLeft: '3px solid #60a5fa' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1. Requested</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{requestedCount}</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', borderLeft: '3px solid #a78bfa' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2. In Review</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{underReviewCount}</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', borderLeft: '3px solid #34d399' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3. Approved</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{approvedCount}</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4. In WMS Pick/Pack</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{allocatedCount}</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', borderLeft: '3px solid #22d3ee' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>5. Dispatched</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{dispatchedCount}</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>6. Delivered</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{deliveredCount}</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
            <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>7. Blocked</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ef4444' }}>{blockedCount}</div>
          </div>
        </div>
      </div>

      {/* Store Risk Comparison Grid & Active Exception Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Store Comparison */}
        <div className="card-panel">
          <div className="panel-title" style={{ marginBottom: '1rem' }}>
            <Store size={20} color="var(--accent-primary)" />
            <span>Store Risk Index & Backlog Matrix</span>
          </div>

          <div className="table-responsive">
            <table className="grozo-table">
              <thead>
                <tr>
                  <th>Store Name & Region</th>
                  <th>Risk Index</th>
                  <th>Open Orders</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stores.map(st => (
                  <tr key={st.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{st.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{st.region} &bull; Mgr: {st.manager}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: st.riskScore > 75 ? 'var(--risk-critical)' : st.riskScore > 40 ? 'var(--risk-medium)' : 'var(--risk-low)' }}>
                        {st.riskScore}/100
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{st.activeRequests}</td>
                    <td>
                      <span className={`badge-risk ${st.riskScore > 75 ? 'Critical' : st.riskScore > 40 ? 'Medium' : 'Low'}`}>
                        {st.riskScore > 75 ? 'High Risk' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Exception Queue */}
        <div className="card-panel">
          <div className="panel-header">
            <div className="panel-title">
              <ShieldAlert size={20} color="var(--risk-critical)" />
              <span>Active Operational Exception Queue</span>
            </div>

            <select className="filter-select" value={excFilter} onChange={e => setExcFilter(e.target.value)}>
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
            {activeExceptions.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                No active operational exceptions.
              </div>
            ) : (
              activeExceptions.map(exc => (
                <div key={exc.id} style={{ 
                  padding: '12px', 
                  background: 'var(--bg-dark)', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)',
                  borderLeft: `4px solid ${exc.severity === 'Critical' ? 'var(--risk-critical)' : exc.severity === 'High' ? 'var(--risk-high)' : 'var(--risk-medium)'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{exc.id} &bull; {exc.type}</div>
                    <span className={`badge-risk ${exc.severity}`}>{exc.severity}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {exc.storeName} &bull; SKU: <strong>{exc.sku}</strong> ({exc.productName})
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Owner: <strong>{exc.owner}</strong> &bull; Next Action: {exc.nextAction}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge-status ${exc.status.replace(/\s+/g, '')}`}>{exc.status}</span>
                    {exc.status !== 'Resolved' && (
                      <button 
                        className="btn-success" 
                        style={{ padding: '3px 8px', fontSize: '0.76rem' }}
                        onClick={() => { setResolveModalExc(exc); setResolutionText(''); }}
                      >
                        <Check size={12} />
                        <span>Resolve Exception</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Resolve Exception Modal */}
      {resolveModalExc && (
        <div className="modal-overlay" onClick={() => setResolveModalExc(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div className="modal-title">Resolve Exception {resolveModalExc.id}</div>
              <button className="btn-secondary" onClick={() => setResolveModalExc(null)}>✕</button>
            </div>

            <div style={{ marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Type: <strong>{resolveModalExc.type}</strong> ({resolveModalExc.storeName})
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Resolution Reason & Corrective Action (Mandatory)
              </label>
              <textarea
                className="search-input"
                rows="3"
                placeholder="Log corrective action, transfer confirmation, or inventory adjustment rationale..."
                value={resolutionText}
                onChange={e => setResolutionText(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setResolveModalExc(null)}>Cancel</button>
              <button className="btn-success" onClick={handleConfirmResolve} disabled={!resolutionText}>
                <span>Mark Exception Resolved</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
