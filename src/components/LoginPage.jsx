import React, { useState } from 'react';
import { useApp, DEMO_USERS } from '../context/AppContext';
import { 
  Activity, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Store, 
  CheckCircle2, 
  Truck, 
  BarChart3, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const LoginPage = () => {
  const { login, quickLoginAs } = useApp();

  const [email, setEmail] = useState('sarah.jenkins@grozo.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('store_manager');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    login(email, password, selectedRole);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'store_manager': return Store;
      case 'replenishment_planner': return CheckCircle2;
      case 'warehouse_dispatcher': return Truck;
      case 'regional_manager': return BarChart3;
      case 'sys_admin': return ShieldCheck;
      default: return Activity;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundImage: `
        radial-gradient(at 15% 15%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
        radial-gradient(at 85% 85%, rgba(6, 182, 212, 0.12) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(139, 92, 246, 0.08) 0px, transparent 50%)
      `,
      backgroundAttachment: 'fixed'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1050px',
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '2.5rem',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-highlight)',
        borderRadius: '24px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
        padding: '2.5rem',
        overflow: 'hidden'
      }}>
        {/* Left Column: Form & Login */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.5rem' }}>
            <img 
              src="/logo.jpg" 
              alt="Grozo Official Logo" 
              style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '14px', 
                objectFit: 'cover',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
                border: '2px solid rgba(16, 185, 129, 0.4)'
              }} 
            />
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1 }}>Grozo</h1>
              <div style={{ fontSize: '0.75rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                Smart Replenishment &bull; Zero Stockouts
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>Sign In to Workspace</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Select your role or enter credentials to access your store, planner, or warehouse console.
          </p>

          <form onSubmit={handleFormSubmit}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <div className="search-input-wrapper" style={{ maxWidth: '100%' }}>
                <Mail size={16} />
                <input
                  type="email"
                  className="search-input"
                  placeholder="name@grozo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="search-input-wrapper" style={{ maxWidth: '100%' }}>
                <Lock size={16} />
                <input
                  type="password"
                  className="search-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                RBAC Access Scope Role
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
              >
                <option value="store_manager">Store Manager (Store #101)</option>
                <option value="replenishment_planner">Replenishment Planner (Queue)</option>
                <option value="warehouse_dispatcher">Warehouse Dispatcher (WMS)</option>
                <option value="regional_manager">Regional Operations Manager</option>
                <option value="sys_admin">System Administrator</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              <span>Authenticate & Enter Control Tower</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Right Column: Quick Demo Persona Selector Tiles */}
        <div style={{
          borderLeft: '1px solid var(--border-color)',
          paddingLeft: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
            <Sparkles size={18} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quick One-Click Persona Login
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Select any predefined role below to test real-time permissions & workspace views:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DEMO_USERS.map(user => {
              const IconComp = getRoleIcon(user.role);
              return (
                <div
                  key={user.id}
                  onClick={() => quickLoginAs(user)}
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = user.badgeColor;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: `${user.badgeColor}20`,
                      color: user.badgeColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComp size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.roleLabel} &bull; {user.storeName}</div>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: user.badgeColor }}>
                    Login &rarr;
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
