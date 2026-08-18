import React, { useState } from 'react';
import { useApp, DEMO_USERS } from '../context/AppContext';
import { firestoreSync } from '../services/firestoreSync';
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
  Activity,
  Code2,
  HardDrive,
  Folder,
  Server,
  Play,
  Copy,
  Terminal,
  Layers,
  FileImage,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';

export const AdminView = () => {
  const { 
    auditLogs, 
    freshness, 
    requests, 
    products, 
    stores, 
    exceptions, 
    searchQuery, 
    setSearchQuery, 
    quickLoginAs, 
    currentUser,
    showToast 
  } = useApp();

  // Supabase Studio Tabs: 'tables' | 'auth' | 'sql' | 'storage' | 'audit' | 'settings'
  const [activeTab, setActiveTab] = useState('tables');
  const [selectedTable, setSelectedTable] = useState('requests');

  // SQL Runner state
  const [sqlQuery, setSqlQuery] = useState(`-- Select critical replenishment orders needing immediate warehouse dispatch
SELECT id, storeName, priority, status, needByTime 
FROM requests 
WHERE priority = 'Urgent' OR status = 'Requested';`);
  const [sqlResults, setSqlResults] = useState(null);
  const [sqlExecutionTime, setSqlExecutionTime] = useState(null);

  // Storage Bucket state
  const [selectedBucket, setSelectedBucket] = useState('delivery-proofs');

  // Table Data Mapping
  const getTableData = () => {
    switch (selectedTable) {
      case 'requests': return requests;
      case 'products': return products;
      case 'stores': return stores;
      case 'exceptions': return exceptions;
      case 'audit_logs': return auditLogs;
      case 'freshness_feeds': return freshness;
      default: return requests;
    }
  };

  const currentTableRows = getTableData();
  const tableColumns = currentTableRows.length > 0 ? Object.keys(currentTableRows[0]) : [];

  // SQL Execution Engine Simulator
  const handleExecuteSql = () => {
    const startTime = performance.now();
    const query = sqlQuery.trim().toLowerCase();

    try {
      let resultData = [];
      if (query.includes('from products')) {
        resultData = products;
      } else if (query.includes('from stores')) {
        resultData = stores;
      } else if (query.includes('from exceptions')) {
        resultData = exceptions;
      } else if (query.includes('from audit_logs')) {
        resultData = auditLogs;
      } else {
        resultData = requests;
      }

      if (query.includes('where priority = \'urgent\'')) {
        resultData = resultData.filter(r => r.priority === 'Urgent');
      }
      if (query.includes('where status = \'requested\'')) {
        resultData = resultData.filter(r => r.status === 'Requested');
      }

      const duration = (performance.now() - startTime).toFixed(2);
      setSqlResults(resultData);
      setSqlExecutionTime(duration);
      showToast(`Query executed in ${duration}ms (${resultData.length} rows returned)`, 'success');
    } catch (err) {
      showToast('SQL Execution Error: Syntax parse failure', 'error');
    }
  };

  const storageBuckets = [
    {
      id: 'delivery-proofs',
      name: 'delivery-proofs',
      isPublic: false,
      filesCount: 6,
      size: '4.8 MB',
      files: [
        { name: 'TRK-99201-signature.png', type: 'image/png', size: '420 KB', updated: '2026-08-17 11:05' },
        { name: 'STR-104-damaged-case-1.jpg', type: 'image/jpeg', size: '1.2 MB', updated: '2026-08-17 10:32' },
        { name: 'STR-104-damaged-case-2.jpg', type: 'image/jpeg', size: '980 KB', updated: '2026-08-17 10:33' },
        { name: 'STR-205-short-pick-shelf.jpg', type: 'image/jpeg', size: '850 KB', updated: '2026-08-17 09:35' },
        { name: 'bol-manifest-8804.pdf', type: 'application/pdf', size: '1.1 MB', updated: '2026-08-17 11:00' },
      ]
    },
    {
      id: 'product-catalog',
      name: 'product-catalog',
      isPublic: true,
      filesCount: 8,
      size: '12.4 MB',
      files: [
        { name: 'milk-org-1gal.png', type: 'image/png', size: '1.4 MB', updated: '2026-08-15 00:00' },
        { name: 'banana-org-3lb.png', type: 'image/png', size: '1.1 MB', updated: '2026-08-15 00:00' },
        { name: 'eggs-large-12ct.png', type: 'image/png', size: '1.8 MB', updated: '2026-08-15 00:00' },
        { name: 'rotisserie-chicken.png', type: 'image/png', size: '2.1 MB', updated: '2026-08-15 00:00' },
      ]
    },
    {
      id: 'audit-exports',
      name: 'audit-exports',
      isPublic: false,
      filesCount: 3,
      size: '1.8 MB',
      files: [
        { name: 'q3-compliance-audit.csv', type: 'text/csv', size: '650 KB', updated: '2026-08-16 23:59' },
        { name: 'inventory-reconciliation-log.json', type: 'application/json', size: '1.1 MB', updated: '2026-08-17 06:00' },
      ]
    }
  ];

  const currentBucketObj = storageBuckets.find(b => b.id === selectedBucket) || storageBuckets[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Supabase Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(62, 207, 142, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
        border: '1px solid rgba(62, 207, 142, 0.3)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#3ecf8e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(62, 207, 142, 0.4)'
          }}>
            <Database size={26} color="#0b0f19" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Grozo Cloud Database Console
              </h1>
              <span style={{ 
                background: 'rgba(245, 158, 11, 0.2)', 
                color: '#f59e0b', 
                border: '1px solid rgba(245, 158, 11, 0.4)', 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: '6px' 
              }}>
                🔥 FIREBASE FIRESTORE & SUPABASE
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Firebase Project: <code style={{ color: '#f59e0b', fontWeight: 600 }}>grozo-replenishment-tower</code> &bull; Firestore Rules: <span style={{ color: '#10b981', fontWeight: 600 }}>Active (RBAC Enforced)</span> &bull; Cloud Storage: <span style={{ color: '#3ecf8e', fontWeight: 600 }}>Connected</span>
            </div>
          </div>
        </div>

        {/* Studio Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary" 
            style={{ background: '#f59e0b', color: '#0b0f19', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700 }}
            onClick={async () => {
              showToast('Pushing all collections to live Cloud Firestore...', 'info');
              const res = await firestoreSync.seedAllCollectionsToFirestore({ requests, products, stores, exceptions, auditLogs });
              if (res.success) {
                showToast('🔥 Successfully synced all collections to Cloud Firestore!', 'success');
              } else {
                showToast(`Firestore Sync Notice: ${res.message}`, 'warning');
              }
            }}
          >
            <RefreshCw size={14} />
            <span>Sync All to Firebase Firestore</span>
          </button>

          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-card)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <button 
              className={`btn-secondary ${activeTab === 'tables' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('tables')}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <HardDrive size={14} />
              <span>Firestore / Tables</span>
            </button>
            <button 
              className={`btn-secondary ${activeTab === 'auth' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('auth')}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <Users size={14} />
              <span>Authentication</span>
            </button>
            <button 
              className={`btn-secondary ${activeTab === 'sql' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('sql')}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <Code2 size={14} />
              <span>SQL Editor</span>
            </button>
            <button 
              className={`btn-secondary ${activeTab === 'storage' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('storage')}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <Folder size={14} />
              <span>Storage Buckets</span>
            </button>
            <button 
              className={`btn-secondary ${activeTab === 'audit' ? 'btn-primary' : ''}`}
              onClick={() => setActiveTab('audit')}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <History size={14} />
              <span>Audit Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TABLE EDITOR TAB */}
      {/* ========================================================================= */}
      {activeTab === 'tables' && (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.25rem', alignItems: 'start' }}>
          {/* Table List Sidebar */}
          <div className="card-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
              Public Schema Tables
            </div>

            {[
              { id: 'requests', label: 'requests', count: requests.length },
              { id: 'products', label: 'products', count: products.length },
              { id: 'stores', label: 'stores', count: stores.length },
              { id: 'exceptions', label: 'exceptions', count: exceptions.length },
              { id: 'audit_logs', label: 'audit_logs', count: auditLogs.length },
              { id: 'freshness_feeds', label: 'freshness_feeds', count: freshness.length },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTable(t.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: selectedTable === t.id ? 'rgba(62, 207, 142, 0.15)' : 'transparent',
                  color: selectedTable === t.id ? '#3ecf8e' : 'var(--text-primary)',
                  border: selectedTable === t.id ? '1px solid rgba(62, 207, 142, 0.4)' : '1px solid transparent',
                  fontWeight: selectedTable === t.id ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HardDrive size={14} />
                  <span>{t.label}</span>
                </div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '10px' }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Table Data View */}
          <div className="card-panel" style={{ overflow: 'hidden' }}>
            <div className="panel-header" style={{ marginBottom: '0.75rem' }}>
              <div>
                <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HardDrive size={18} color="#3ecf8e" />
                  <span style={{ fontFamily: 'JetBrains Mono', color: '#3ecf8e' }}>public.{selectedTable}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    ({currentTableRows.length} rows &bull; {tableColumns.length} columns)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="search-input-wrapper" style={{ maxWidth: '240px' }}>
                  <Search size={14} />
                  <input
                    className="search-input"
                    placeholder={`Filter in ${selectedTable}...`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="table-responsive" style={{ maxHeight: '520px', overflowY: 'auto' }}>
              <table className="grozo-table">
                <thead>
                  <tr>
                    {tableColumns.map(col => (
                      <th key={col} style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentTableRows.map((row, rowIdx) => (
                    <tr key={row.id || rowIdx}>
                      {tableColumns.map(col => {
                        const val = row[col];
                        const displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                        const isId = col.toLowerCase().includes('id');
                        return (
                          <td key={col} style={{ fontSize: '0.78rem', fontFamily: isId ? 'JetBrains Mono' : 'inherit', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={displayVal}>
                            {displayVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. AUTHENTICATION TAB */}
      {/* ========================================================================= */}
      {activeTab === 'auth' && (
        <div className="card-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} color="#3ecf8e" />
                <span>Supabase Auth & User Security Directory</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Enterprise RBAC roles, JWT Bearer tokens, authentication provider, and verified identity status.
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="grozo-table">
              <thead>
                <tr>
                  <th>User Identity UID</th>
                  <th>Email & Provider</th>
                  <th>RBAC Assigned Role</th>
                  <th>Store / Region Scope</th>
                  <th>Active JWT Bearer Token</th>
                  <th>Security Status</th>
                  <th>Impersonate</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_USERS.map(user => {
                  const isCurrent = currentUser?.id === user.id;
                  return (
                    <tr key={user.id} style={{ background: isCurrent ? 'rgba(62, 207, 142, 0.08)' : 'transparent' }}>
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
                            <code style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.id}</code>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user.email}</div>
                        <div style={{ fontSize: '0.72rem', color: '#3ecf8e' }}>● Email / Password Provider</div>
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
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {user.storeName}
                      </td>
                      <td>
                        <code style={{ fontSize: '0.74rem', background: 'var(--bg-dark)', padding: '3px 8px', borderRadius: '4px', color: '#3ecf8e' }}>
                          Bearer token-{user.role.substring(0, 5)}-{user.id.split('-')[1]}
                        </code>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} />
                          <span>Verified (Active)</span>
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                          onClick={() => quickLoginAs(user)}
                        >
                          <Zap size={13} color="#3ecf8e" />
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

      {/* ========================================================================= */}
      {/* 3. SQL EDITOR TAB */}
      {/* ========================================================================= */}
      {activeTab === 'sql' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={18} color="#3ecf8e" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Interactive PostgreSQL Query Runner</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  onClick={() => setSqlQuery(`SELECT * FROM products WHERE currentStoreStock < presentationMin;`)}
                >
                  Preset: Low Stock
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  onClick={() => setSqlQuery(`SELECT id, storeName, priority, status FROM requests WHERE status = 'Requested';`)}
                >
                  Preset: Pending Orders
                </button>
                <button 
                  className="btn-primary" 
                  style={{ background: '#3ecf8e', color: '#0b0f19', padding: '6px 16px', fontWeight: 700 }}
                  onClick={handleExecuteSql}
                >
                  <Play size={14} fill="#0b0f19" />
                  <span>Run Query (Ctrl + Enter)</span>
                </button>
              </div>
            </div>

            <textarea
              className="search-input"
              rows="5"
              style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', color: '#3ecf8e', background: '#0b0f19' }}
              value={sqlQuery}
              onChange={e => setSqlQuery(e.target.value)}
            />
          </div>

          {/* Query Results View */}
          {sqlResults && (
            <div className="card-panel">
              <div className="panel-header">
                <div className="panel-title" style={{ fontSize: '0.92rem' }}>
                  <span>Query Results</span>
                  <span style={{ fontSize: '0.78rem', color: '#3ecf8e', fontWeight: 600, marginLeft: '8px' }}>
                    ({sqlResults.length} rows returned in {sqlExecutionTime}ms)
                  </span>
                </div>
              </div>

              <div className="table-responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className="grozo-table">
                  <thead>
                    <tr>
                      {sqlResults.length > 0 && Object.keys(sqlResults[0]).map(k => (
                        <th key={k} style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem' }}>{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sqlResults.map((r, i) => (
                      <tr key={i}>
                        {Object.keys(r).map(k => {
                          const val = r[k];
                          const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
                          return (
                            <td key={k} style={{ fontSize: '0.76rem', fontFamily: 'JetBrains Mono' }}>
                              {str}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. STORAGE BUCKETS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'storage' && (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.25rem' }}>
          {/* Storage Buckets List */}
          <div className="card-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Storage Buckets (S3 API)
            </div>

            {storageBuckets.map(bucket => (
              <button
                key={bucket.id}
                onClick={() => setSelectedBucket(bucket.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: selectedBucket === bucket.id ? 'rgba(62, 207, 142, 0.15)' : 'transparent',
                  color: selectedBucket === bucket.id ? '#3ecf8e' : 'var(--text-primary)',
                  border: selectedBucket === bucket.id ? '1px solid rgba(62, 207, 142, 0.4)' : '1px solid transparent',
                  fontWeight: selectedBucket === bucket.id ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Folder size={16} />
                  <span>{bucket.name}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{bucket.size}</span>
              </button>
            ))}
          </div>

          {/* Files inside Bucket */}
          <div className="card-panel">
            <div className="panel-header">
              <div>
                <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Folder size={18} color="#3ecf8e" />
                  <span style={{ fontFamily: 'JetBrains Mono', color: '#3ecf8e' }}>{currentBucketObj.name}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    ({currentBucketObj.files.length} objects &bull; {currentBucketObj.size})
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => showToast('Mock File Upload dialog opened. Drop PNG/JPG/PDF.', 'info')}>
                  <Upload size={14} />
                  <span>Upload File</span>
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="grozo-table">
                <thead>
                  <tr>
                    <th>Object Name</th>
                    <th>MIME Content Type</th>
                    <th>File Size</th>
                    <th>Last Modified</th>
                    <th>Public URL</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBucketObj.files.map((file, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                          <FileImage size={15} color="var(--accent-primary)" />
                          <span>{file.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{file.type}</td>
                      <td style={{ fontSize: '0.78rem' }}>{file.size}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{file.updated}</td>
                      <td>
                        <code style={{ fontSize: '0.72rem', color: '#3ecf8e' }}>
                          https://grozo.storage.supabase.co/{currentBucketObj.name}/{file.name}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. AUDIT LOGS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="card-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={20} color="#3ecf8e" />
                <span>Immutable PostgreSQL Audit Trail & CDC Replication Stream</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Full unalterable event sequence recording every transaction, state transition, and user override.
              </div>
            </div>
          </div>

          <div className="table-responsive" style={{ maxHeight: '480px', overflowY: 'auto' }}>
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
                {auditLogs.map(log => (
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
                      <span style={{ padding: '3px 8px', background: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
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
    </div>
  );
};
