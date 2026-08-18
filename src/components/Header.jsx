import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  CheckCircle2, 
  Truck, 
  BarChart3, 
  ShieldCheck, 
  RotateCcw, 
  PlusCircle, 
  Activity,
  Clock,
  LogOut,
  Sun,
  Moon,
  AlertTriangle
} from 'lucide-react';

export const Header = ({ onOpenCreateModal }) => {
  const { 
    theme,
    toggleTheme,
    currentUser,
    logout,
    activeRole, 
    activeStoreId, 
    setActiveStoreId, 
    stores, 
    freshness, 
    resetData,
    toast
  } = useApp();

  const [showFreshnessDetails, setShowFreshnessDetails] = useState(false);

  const getRoleBadgeInfo = (role) => {
    switch (role) {
      case 'store_manager':
        return { label: 'Store Manager Workspace', icon: Store, color: '#3b82f6' };
      case 'replenishment_planner':
        return { label: 'Planner Queue Workspace', icon: CheckCircle2, color: '#8b5cf6' };
      case 'warehouse_dispatcher':
        return { label: 'Warehouse WMS Workspace', icon: Truck, color: '#06b6d4' };
      case 'regional_manager':
        return { label: 'Regional Ops Control Tower', icon: BarChart3, color: '#f59e0b' };
      case 'sys_admin':
        return { label: 'System Admin Governance', icon: ShieldCheck, color: '#ef4444' };
      default:
        return { label: 'Workspace', icon: Activity, color: '#6366f1' };
    }
  };

  const roleInfo = getRoleBadgeInfo(activeRole);
  const RoleIcon = roleInfo.icon;
  const overallFreshness = freshness.some(f => f.status === 'Delayed') ? 'Delayed' : 'Current';

  return (
    <>
      <header className="grozo-navbar">
        {/* Brand Logo & Strict Role Access Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="brand-logo" style={{ cursor: 'pointer' }}>
            <img 
              src="/logo.jpg" 
              alt="Grozo Logo" 
              style={{ 
                height: '42px', 
                width: '42px', 
                borderRadius: '10px', 
                objectFit: 'cover',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.25)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)'
              }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', leadingTrim: 'both' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.1 }}>Grozo</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Smart Replenishment
              </span>
            </div>
          </div>

          {/* Strict RBAC Active Role Indicator (Only shows user's permitted workspace) */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '6px 14px', 
            background: 'var(--bg-card)', 
            border: `1px solid ${roleInfo.color}50`, 
            borderRadius: '20px',
            boxShadow: `0 0 10px ${roleInfo.color}20`
          }}>
            <RoleIcon size={16} color={roleInfo.color} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: roleInfo.color }}>
              {roleInfo.label}
            </span>
          </div>
        </div>

        {/* Right Action Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Theme Toggle Button (Light/Dark) */}
          <button 
            className="btn-secondary" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            style={{ padding: '8px 12px', borderRadius: '20px' }}
          >
            {theme === 'light' ? <Moon size={16} color="var(--accent-primary)" /> : <Sun size={16} color="#f59e0b" />}
            <span style={{ fontSize: '0.8rem' }}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          {/* Store Location Scope: Locked badge for Store Manager, Dropdown for Regional / Admin */}
          {activeRole === 'store_manager' ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '6px 12px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}>
              <Store size={15} color="#3b82f6" />
              <span>{stores.find(s => s.id === activeStoreId)?.name || 'Grozo Market #101'}</span>
              <span style={{ fontSize: '0.68rem', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '1px 6px', borderRadius: '8px', fontWeight: 700 }}>
                ASSIGNED
              </span>
            </div>
          ) : (activeRole === 'regional_manager' || activeRole === 'sys_admin') ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Store size={16} style={{ color: 'var(--text-muted)' }} />
              <select
                className="filter-select"
                value={activeStoreId}
                onChange={e => setActiveStoreId(e.target.value)}
                title="Filter View by Store Location"
              >
                <option value="ALL">All Network Stores (5)</option>
                {stores.map(st => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>
          ) : null}

          {/* Data Freshness Indicator */}
          <button 
            className={`freshness-badge ${overallFreshness.toLowerCase()}`}
            onClick={() => setShowFreshnessDetails(!showFreshnessDetails)}
            title="Click to view source feed status"
          >
            <div className={`dot-indicator ${overallFreshness === 'Delayed' ? 'pulse' : ''}`} />
            <span>Feed Data: {overallFreshness}</span>
          </button>

          {/* Quick Create Button for Store Manager */}
          {activeRole === 'store_manager' && (
            <button className="btn-primary" onClick={onOpenCreateModal}>
              <PlusCircle size={16} />
              <span>New Replenishment</span>
            </button>
          )}

          {/* User Profile & Logout */}
          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', borderLeft: '1px solid var(--border-color)' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: currentUser.badgeColor || 'var(--accent-primary)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {currentUser.avatar}
              </div>
              <div style={{ fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.2' }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{currentUser.roleLabel}</div>
              </div>
              <button 
                className="btn-secondary" 
                style={{ padding: '6px', marginLeft: '6px' }}
                onClick={logout}
                title="Log Out & Switch User"
              >
                <LogOut size={15} color="#ef4444" />
              </button>
            </div>
          )}

          {/* Reset Mock Data */}
          <button className="btn-secondary" onClick={resetData} title="Reset all data to baseline PRD mock dataset">
            <RotateCcw size={15} />
          </button>
        </div>
      </header>

      {/* Toast Overlay */}
      {toast && (
        <div className="toast-banner">
          {toast.type === 'error' ? <AlertTriangle size={18} color="#ef4444" /> : <CheckCircle2 size={18} color="#10b981" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Freshness Modal Drawer */}
      {showFreshnessDetails && (
        <div className="modal-overlay" onClick={() => setShowFreshnessDetails(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} color="var(--accent-primary)" />
                <span>Source Data Freshness & Sync Feeds</span>
              </div>
              <button className="btn-secondary" onClick={() => setShowFreshnessDetails(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {freshness.map((feed, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    padding: '12px', 
                    background: 'var(--bg-dark)', 
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{feed.sourceName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Last Sync: {new Date(feed.lastReceived).toLocaleTimeString()} (Every {feed.expectedIntervalMinutes}m)
                    </div>
                  </div>
                  <span className={`badge-risk ${feed.status === 'Current' ? 'Low' : 'High'}`}>
                    {feed.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
