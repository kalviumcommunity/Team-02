import React, { useState } from 'react';
import { useApp, DEMO_USERS } from '../context/AppContext';
import { 
  ShieldCheck, 
  History, 
  Upload, 
  Sliders, 
  Users, 
  FileText, 
  CheckCircle2, 
  Search,
  Database,
  Key,
  Lock,
  UserCheck,
  Zap,
  Activity
} from 'lucide-react';

export const AdminView = () => {
  const { auditLogs, freshness, searchQuery, setSearchQuery, quickLoginAs, currentUser } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState('auth_users'); // 'auth_users' | 'audit_logs' | 'config'
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState(null);

  const filteredLogs = auditLogs.filter(log => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return log.id.toLowerCase().includes(q) ||
      log.actor.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.requestId.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q);
  });

  const handleSimulateImport = () => {
    try {
      if (!importJson) {
        setImportStatus({ success: false, message: 'Please paste JSON data to import.' });
        return;
      }
      JSON.parse(importJson);
      setImportStatus({ success: true, message: 'Successfully validated and ingested 12 product inventory records. Row-level audit logged.' });
      setImportJson('');
    } catch (err) {
      setImportStatus({ success: false, message: `Validation Error: Invalid JSON syntax (${err.message}).` });
    }
  };

  return (
    <div>
      {/* Admin Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>System Administration & Auth Governance</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Supabase/Firebase style Auth console, user role management, data ingestion, and audit logs.
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-card)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button 
            className={`btn-secondary ${activeAdminTab === 'auth_users' ? 'btn-primary' : ''}`}
            onClick={() => setActiveAdminTab('auth_users')}
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            <Users size={15} />
            <span>Auth Users ({DEMO_USERS.length})</span>
          </button>
          <button 
            className={`btn-secondary ${activeAdminTab === 'audit_logs' ? 'btn-primary' : ''}`}
            onClick={() => setActiveAdminTab('audit_logs')}
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            <History size={15} />
            <span>Audit History ({auditLogs.length})</span>
          </button>
          <button 
            className={`btn-secondary ${activeAdminTab === 'config' ? 'btn-primary' : ''}`}
            onClick={() => setActiveAdminTab('config')}
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            <Sliders size={15} />
            <span>Config & Ingestion</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Supabase/Firebase Auth User Registry Console */}
      {activeAdminTab === 'auth_users' && (
        <div className="card-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} color="var(--accent-primary)" />
                <span>Authentication & User Registry Console (RBAC)</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Manage registered user accounts, active session tokens, security roles, and permissions.
              </div>
            </div>

            <div className="search-input-wrapper">
              <Search size={15} />
              <input
                className="search-input"
                placeholder="Search auth users, emails, roles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="grozo-table">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Email & ID</th>
                  <th>Assigned RBAC Role</th>
                  <th>Scope Location</th>
                  <th>Active Auth Token</th>
                  <th>Status</th>
                  <th>Quick Impersonate</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_USERS.map(user => {
                  const isCurrent = currentUser?.id === user.id;
                  return (
                    <tr key={user.id} style={{ background: isCurrent ? 'rgba(99, 102, 241, 0.06)' : 'transparent' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: user.badgeColor,
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {user.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</div>
                            {isCurrent && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--risk-low)', fontWeight: 700 }}>● Active Session</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user.email}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.id}</div>
                      </td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '12px', 
                          fontSize: '0.76rem', 
                          fontWeight: 700,
                          background: `${user.badgeColor}20`,
                          color: user.badgeColor,
                          border: `1px solid ${user.badgeColor}40`
                        }}>
                          {user.roleLabel}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                        {user.storeName}
                      </td>
                      <td>
                        <code style={{ fontSize: '0.74rem', background: 'var(--bg-dark)', padding: '3px 6px', borderRadius: '4px', color: 'var(--accent-primary)' }}>
                          token-{user.role.substring(0, 5)}-{user.id.split('-')[1]}
                        </code>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--risk-low)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} />
                          <span>Verified</span>
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                          onClick={() => quickLoginAs(user)}
                        >
                          <Zap size={13} color="var(--accent-primary)" />
                          <span>Login As</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Immutable Audit Log Viewer */}
      {activeAdminTab === 'audit_logs' && (
        <div className="card-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">
                <History size={20} color="var(--accent-primary)" />
                <span>Immutable System Audit Log History</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Complete unalterable event sequence recording every login, status change, override, and blocker.
              </div>
            </div>

            <div className="search-input-wrapper">
              <Search size={15} />
              <input
                className="search-input"
                placeholder="Search audit logs by actor, action, REQ ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="grozo-table">
              <thead>
                <tr>
                  <th>Audit ID & Timestamp</th>
                  <th>Actor & Role</th>
                  <th>Action</th>
                  <th>Request ID</th>
                  <th>State Transition</th>
                  <th>Details & Rationale</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{log.id}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{log.actor}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.role}</div>
                    </td>
                    <td>
                      <span style={{ padding: '3px 8px', background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{log.requestId}</td>
                    <td>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {log.previousStatus} &rarr; <strong>{log.newStatus}</strong>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '320px' }}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Configuration & Data Ingestion */}
      {activeAdminTab === 'config' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Threshold Configuration */}
          <div className="card-panel">
            <div className="panel-title" style={{ marginBottom: '1rem' }}>
              <Sliders size={20} color="var(--accent-primary)" />
              <span>Configurable Operational Thresholds</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '10px', background: 'var(--bg-dark)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Critical Stockout Warning Threshold</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hours to projected zero inventory</div>
                <input className="search-input" style={{ width: '120px', marginTop: '6px' }} defaultValue="4.0 Hours" />
              </div>

              <div style={{ padding: '10px', background: 'var(--bg-dark)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Planner Review SLA Deadline</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Target approval queue turnaround</div>
                <input className="search-input" style={{ width: '120px', marginTop: '6px' }} defaultValue="30 Minutes" />
              </div>

              <div style={{ padding: '10px', background: 'var(--bg-dark)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Feed Freshness Delay Alert</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Stale data warning threshold</div>
                <input className="search-input" style={{ width: '120px', marginTop: '6px' }} defaultValue="60 Minutes" />
              </div>
            </div>
          </div>

          {/* Batch Data Import */}
          <div className="card-panel">
            <div className="panel-title" style={{ marginBottom: '1rem' }}>
              <Upload size={20} color="var(--accent-primary)" />
              <span>Batch Data Ingestion & Import Validator</span>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <textarea
                className="search-input"
                rows="5"
                placeholder='Paste JSON/CSV payload (e.g. [{"sku": "MILK-ORG-1G", "stock": 450, "timestamp": "2026-08-17T13:40:00Z"}])'
                value={importJson}
                onChange={e => setImportJson(e.target.value)}
              />
            </div>

            {importStatus && (
              <div style={{ 
                padding: '10px', 
                borderRadius: '6px', 
                fontSize: '0.82rem',
                marginBottom: '10px',
                background: importStatus.success ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                color: importStatus.success ? '#34d399' : '#f87171',
                border: `1px solid ${importStatus.success ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`
              }}>
                {importStatus.message}
              </div>
            )}

            <button className="btn-primary" onClick={handleSimulateImport}>
              <Database size={15} />
              <span>Validate Payload & Ingest</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
