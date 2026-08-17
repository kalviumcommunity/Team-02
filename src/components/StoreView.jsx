import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Package, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Search, 
  Eye, 
  TrendingDown, 
  Truck,
  FileCheck
} from 'lucide-react';
import { RequestDetailModal } from './RequestDetailModal';

export const StoreView = ({ openCreateModal }) => {
  const { 
    activeStoreId, 
    requests, 
    products, 
    stores, 
    confirmReceipt, 
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter
  } = useApp();

  const currentStore = stores.find(s => s.id === activeStoreId) || stores[0];

  // Filter requests for current store
  const storeRequests = requests.filter(r => {
    const matchesStore = r.storeId === activeStoreId;
    const matchesSearch = !searchQuery || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.lines.some(l => l.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesStore && matchesSearch && matchesStatus;
  });

  const [selectedReq, setSelectedReq] = useState(null);
  const [confirmModalReq, setConfirmModalReq] = useState(null);
  const [receiptQtyMap, setReceiptQtyMap] = useState({});
  const [discrepancyReason, setDiscrepancyReason] = useState('');

  // Operational metrics
  const arrivingToday = storeRequests.filter(r => r.status === 'Dispatched').length;
  const awaitingApproval = storeRequests.filter(r => r.status === 'Requested' || r.status === 'Under Review').length;
  const criticalStockouts = storeRequests.filter(r => r.lines.some(l => l.riskLevel === 'Critical')).length;
  const deliveredCount = storeRequests.filter(r => r.status === 'Delivered' || r.status === 'Partially Fulfilled').length;

  const handleOpenConfirm = (req) => {
    setConfirmModalReq(req);
    const initialMap = {};
    req.lines.forEach(l => {
      initialMap[l.id] = l.dispatchedQty || l.approvedQty || l.requestedQty;
    });
    setReceiptQtyMap(initialMap);
    setDiscrepancyReason('');
  };

  const handleSubmitReceipt = () => {
    if (!confirmModalReq) return;
    confirmReceipt(confirmModalReq.id, receiptQtyMap, discrepancyReason);
    setConfirmModalReq(null);
  };

  return (
    <div>
      {/* Top Banner Context */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{currentStore.name}</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Store Replenishment Workspace &bull; Risk Score Index: <span style={{ color: currentStore.riskScore > 75 ? 'var(--risk-critical)' : 'var(--risk-low)', fontWeight: 700 }}>{currentStore.riskScore}/100</span>
          </div>
        </div>

        <button className="btn-primary" onClick={openCreateModal}>
          <Plus size={16} />
          <span>New Replenishment Request</span>
        </button>
      </div>

      {/* Operational 4-Metrics Grid */}
      <div className="grid-cols-4">
        <div className="stat-card">
          <div>
            <div className="label">Arriving / In Transit</div>
            <div className="value" style={{ color: 'var(--status-dispatch)' }}>{arrivingToday}</div>
            <div className="subtext">Shipments currently dispatched</div>
          </div>
          <div className="stat-icon" style={{ color: 'var(--status-dispatch)' }}>
            <Truck size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="label">Awaiting Approval</div>
            <div className="value" style={{ color: '#a78bfa' }}>{awaitingApproval}</div>
            <div className="subtext">In planner review queue</div>
          </div>
          <div className="stat-icon" style={{ color: '#a78bfa' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="label">Critical Stockout Risk</div>
            <div className="value" style={{ color: 'var(--risk-critical)' }}>{criticalStockouts}</div>
            <div className="subtext">Items &lt; 4 hours stock remaining</div>
          </div>
          <div className="stat-icon" style={{ color: 'var(--risk-critical)' }}>
            <AlertTriangle size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="label">Delivered & Confirmed</div>
            <div className="value" style={{ color: 'var(--risk-low)' }}>{deliveredCount}</div>
            <div className="subtext">Completed cycle orders</div>
          </div>
          <div className="stat-icon" style={{ color: 'var(--risk-low)' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Main Request Control Table */}
      <div className="card-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Package size={20} color="var(--accent-primary)" />
            <span>Store Replenishment Requests</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="search-input-wrapper">
              <Search size={15} />
              <input
                className="search-input"
                placeholder="Search SKU, Product, or REQ ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="Requested">Requested</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="grozo-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Items & SKU</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Need-By Deadline</th>
                <th>Risk Driver Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {storeRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No replenishment requests found matching filter criteria.
                  </td>
                </tr>
              ) : (
                storeRequests.map(req => {
                  const firstLine = req.lines[0];
                  return (
                    <tr key={req.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{req.id}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(req.creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{firstLine ? firstLine.productName : 'Multi-item'}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                          {req.lines.length > 1 ? `+ ${req.lines.length - 1} additional items` : `${firstLine.requestedQty} ${firstLine.unitOfMeasure}`}
                        </div>
                      </td>
                      <td>
                        {req.priority === 'Urgent' ? (
                          <span className="badge-priority-urgent">URGENT</span>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Standard</span>
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
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Need-by Today
                        </div>
                      </td>
                      <td>
                        <span className={`badge-risk ${firstLine?.riskLevel || 'Low'}`}>
                          {firstLine?.riskLevel} Risk
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '240px' }}>
                          {firstLine?.riskReason}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setSelectedReq(req)}>
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                          {req.status === 'Dispatched' && (
                            <button className="btn-success" style={{ padding: '4px 8px' }} onClick={() => handleOpenConfirm(req)}>
                              <FileCheck size={14} />
                              <span>Confirm</span>
                            </button>
                          )}
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

      {/* Confirm Receipt & Discrepancy Modal */}
      {confirmModalReq && (
        <div className="modal-overlay" onClick={() => setConfirmModalReq(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div className="modal-title">Confirm Delivery Receipt for {confirmModalReq.id}</div>
              <button className="btn-secondary" onClick={() => setConfirmModalReq(null)}>✕</button>
            </div>

            <div style={{ marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Inspect shipment from <strong>{confirmModalReq.carrier || 'Grozo Logistics'}</strong> (Ref: {confirmModalReq.shipmentRef || 'TRK-DEFAULT'}).
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.25rem' }}>
              {confirmModalReq.lines.map(line => (
                <div key={line.id} style={{ padding: '10px', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{line.productName}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Dispatched Qty: <strong>{line.dispatchedQty || line.approvedQty}</strong> {line.unitOfMeasure}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Received Qty:</label>
                    <input
                      type="number"
                      className="search-input"
                      style={{ width: '100px' }}
                      value={receiptQtyMap[line.id] !== undefined ? receiptQtyMap[line.id] : line.dispatchedQty}
                      onChange={e => setReceiptQtyMap({ ...receiptQtyMap, [line.id]: Number(e.target.value) })}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Discrepancy / Damage Notes (If Received Qty &lt; Dispatched Qty)
              </label>
              <textarea
                className="search-input"
                rows="2"
                placeholder="Log damaged cases, crushed packages, or missing inventory details..."
                value={discrepancyReason}
                onChange={e => setDiscrepancyReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setConfirmModalReq(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSubmitReceipt}>
                <CheckCircle2 size={16} />
                <span>Confirm Receipt & Update Status</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
