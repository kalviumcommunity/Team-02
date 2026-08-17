import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Box, 
  ArrowRight, 
  Search, 
  ShieldAlert,
  Play,
  FileCheck
} from 'lucide-react';
import { RequestDetailModal } from './RequestDetailModal';

export const WarehouseView = () => {
  const { 
    requests, 
    advanceFulfillment, 
    recordBlocker, 
    searchQuery,
    setSearchQuery
  } = useApp();

  // Active warehouse queue: Approved, Allocated, Picking, Packed
  const warehouseQueue = requests.filter(r => {
    const isWarehouseStatus = ['Approved', 'Partially Approved', 'Allocated', 'Picking', 'Packed'].includes(r.status);
    const matchesSearch = !searchQuery || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.lines.some(l => l.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    return isWarehouseStatus && matchesSearch;
  });

  const [selectedReq, setSelectedReq] = useState(null);
  const [dispatchModalReq, setDispatchModalReq] = useState(null);
  const [shipmentRef, setShipmentRef] = useState('');

  const [blockerModalReq, setBlockerModalReq] = useState(null);
  const [blockerReason, setBlockerReason] = useState('');

  const handleOpenDispatch = (req) => {
    setDispatchModalReq(req);
    setShipmentRef(`TRK-${Math.floor(10000 + Math.random() * 90000)}-${req.region.split(' ')[0].toUpperCase()}`);
  };

  const handleConfirmDispatch = () => {
    if (!dispatchModalReq || !shipmentRef) return;
    advanceFulfillment(dispatchModalReq.id, 'Dispatched', shipmentRef);
    setDispatchModalReq(null);
  };

  const handleConfirmBlocker = () => {
    if (!blockerModalReq || !blockerReason) return;
    recordBlocker(blockerModalReq.id, blockerReason);
    setBlockerModalReq(null);
  };

  return (
    <div>
      {/* Warehouse WMS Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Central Warehouse Fulfillment Hub</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Pick, Pack, & Dispatch execution for store replenishment orders.
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid-cols-4">
        <div className="stat-card">
          <div>
            <div className="label">Ready to Allocate</div>
            <div className="value" style={{ color: '#38bdf8' }}>
              {warehouseQueue.filter(r => r.status === 'Approved' || r.status === 'Partially Approved').length}
            </div>
            <div className="subtext">Stock reservation pending</div>
          </div>
          <div className="stat-icon" style={{ color: '#38bdf8' }}>
            <Box size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="label">Currently Picking</div>
            <div className="value" style={{ color: '#f472b6' }}>
              {warehouseQueue.filter(r => r.status === 'Picking').length}
            </div>
            <div className="subtext">Active floor picker assignments</div>
          </div>
          <div className="stat-icon" style={{ color: '#f472b6' }}>
            <Package size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="label">Packed & Ready</div>
            <div className="value" style={{ color: '#c084fc' }}>
              {warehouseQueue.filter(r => r.status === 'Packed').length}
            </div>
            <div className="subtext">Staged at loading dock B</div>
          </div>
          <div className="stat-icon" style={{ color: '#c084fc' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="label">Dispatch Adherence</div>
            <div className="value" style={{ color: 'var(--risk-low)' }}>96.4%</div>
            <div className="subtext">On-time departure rate</div>
          </div>
          <div className="stat-icon" style={{ color: 'var(--risk-low)' }}>
            <Truck size={22} />
          </div>
        </div>
      </div>

      {/* Fulfillment Table */}
      <div className="card-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Truck size={20} color="var(--accent-primary)" />
            <span>Fulfillment Pipeline Queue</span>
          </div>

          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              className="search-input"
              placeholder="Search destination store, SKU, REQ ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="grozo-table">
            <thead>
              <tr>
                <th>Request & Store Destination</th>
                <th>Item & Approved Qty</th>
                <th>Priority</th>
                <th>Current Milestone</th>
                <th>Need-By Deadline</th>
                <th>Fulfillment Action</th>
              </tr>
            </thead>
            <tbody>
              {warehouseQueue.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No active fulfillment orders in warehouse queue.
                  </td>
                </tr>
              ) : (
                warehouseQueue.map(req => {
                  const firstLine = req.lines[0];
                  return (
                    <tr key={req.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{req.id}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{req.storeName}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{firstLine?.productName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Approved: <strong>{firstLine?.approvedQty || firstLine?.requestedQty}</strong> {firstLine?.unitOfMeasure}
                        </div>
                      </td>
                      <td>
                        {req.priority === 'Urgent' ? (
                          <span className="badge-priority-urgent">URGENT</span>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Standard</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge-status ${req.status.replace(/\s+/g, '')}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                          {new Date(req.needByTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {req.status === 'Approved' || req.status === 'Partially Approved' ? (
                            <button className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => advanceFulfillment(req.id, 'Allocated')}>
                              <Box size={14} />
                              <span>Allocate Stock</span>
                            </button>
                          ) : req.status === 'Allocated' ? (
                            <button className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => advanceFulfillment(req.id, 'Picking')}>
                              <Play size={14} />
                              <span>Start Picking</span>
                            </button>
                          ) : req.status === 'Picking' ? (
                            <button className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => advanceFulfillment(req.id, 'Packed')}>
                              <FileCheck size={14} />
                              <span>Mark Packed</span>
                            </button>
                          ) : req.status === 'Packed' ? (
                            <button className="btn-success" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => handleOpenDispatch(req)}>
                              <Truck size={14} />
                              <span>Dispatch Shipment</span>
                            </button>
                          ) : null}

                          <button 
                            className="btn-danger" 
                            style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                            title="Log Short Pick / Blocker"
                            onClick={() => { setBlockerModalReq(req); setBlockerReason(''); }}
                          >
                            <ShieldAlert size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReq && (
        <RequestDetailModal
          request={selectedReq}
          onClose={() => setSelectedReq(null)}
        />
      )}

      {/* Dispatch Shipment Modal */}
      {dispatchModalReq && (
        <div className="modal-overlay" onClick={() => setDispatchModalReq(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div className="modal-title">Dispatch Shipment for {dispatchModalReq.id}</div>
              <button className="btn-secondary" onClick={() => setDispatchModalReq(null)}>✕</button>
            </div>

            <div style={{ marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Destination Store: <strong>{dispatchModalReq.storeName}</strong> ({dispatchModalReq.region})
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Shipment / Bill of Lading Tracking Reference Number
              </label>
              <input
                className="search-input"
                value={shipmentRef}
                onChange={e => setShipmentRef(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Assigned Logistics Fleet Carrier
              </label>
              <input
                className="search-input"
                value="Grozo Fleet Truck #14 (Direct Express)"
                readOnly
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setDispatchModalReq(null)}>Cancel</button>
              <button className="btn-success" onClick={handleConfirmDispatch}>
                <Truck size={16} />
                <span>Confirm Fleet Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Short Pick / Blocker Modal */}
      {blockerModalReq && (
        <div className="modal-overlay" onClick={() => setBlockerModalReq(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div className="modal-title" style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={20} />
                <span>Log Fulfillment Blocker / Short Pick</span>
              </div>
              <button className="btn-secondary" onClick={() => setBlockerModalReq(null)}>✕</button>
            </div>

            <div style={{ marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Logging a blocker will transition <strong>{blockerModalReq.id}</strong> to <code>Blocked</code> status and automatically open a High-Severity exception ticket.
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Blocker Reason & Warehouse Bin Notes (Mandatory)
              </label>
              <textarea
                className="search-input"
                rows="3"
                placeholder="Log bin short pick (e.g. Bin B-12 stock exhausted), damaged inventory, or dock delay..."
                value={blockerReason}
                onChange={e => setBlockerReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setBlockerModalReq(null)}>Cancel</button>
              <button className="btn-danger" onClick={handleConfirmBlocker} disabled={!blockerReason}>
                <span>Flag Blocker & Open Exception</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
