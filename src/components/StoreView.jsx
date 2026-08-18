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
  Truck,
  FileCheck,
  Edit3,
  Send,
  XCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { RequestDetailModal } from './RequestDetailModal';
import { CreateRequestModal } from './CreateRequestModal';
import { EditDraftModal } from './EditDraftModal';

export const StoreView = ({ openCreateModal }) => {
  const { 
    activeStoreId, 
    requests, 
    products, 
    stores, 
    confirmReceipt, 
    submitDraft,
    cancelRequest,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter
  } = useApp();

  const currentStore = stores.find(s => s.id === activeStoreId) || stores[0];

  // Modals and selection state
  const [selectedReq, setSelectedReq] = useState(null);
  const [editingDraftReq, setEditingDraftReq] = useState(null);
  const [confirmModalReq, setConfirmModalReq] = useState(null);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickCreateProdId, setQuickCreateProdId] = useState(null);
  const [receiptQtyMap, setReceiptQtyMap] = useState({});
  const [discrepancyReason, setDiscrepancyReason] = useState('');
  const [isInventoryExpanded, setIsInventoryExpanded] = useState(true);

  // Filter requests for current store
  const storeRequests = requests.filter(r => {
    const matchesStore = r.storeId === activeStoreId;
    const matchesSearch = !searchQuery || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.lines.some(l => l.productName.toLowerCase().includes(searchQuery.toLowerCase()) || l.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesStore && matchesSearch && matchesStatus;
  });

  // Calculate store SKU health stats
  const skuStockHealth = products.map(prod => {
    const hoursLeft = prod.salesVelocityPerHour > 0 
      ? Number((prod.currentStoreStock / prod.salesVelocityPerHour).toFixed(1)) 
      : 24.0;
    
    let risk = 'Low';
    if (hoursLeft < 4) risk = 'Critical';
    else if (hoursLeft < 8) risk = 'High';
    else if (hoursLeft < 16) risk = 'Medium';

    const stockPercent = Math.min(100, Math.round((prod.currentStoreStock / (prod.presentationMin * 1.5)) * 100));

    return {
      ...prod,
      hoursLeft,
      risk,
      stockPercent
    };
  });

  const criticalSkus = skuStockHealth.filter(s => s.risk === 'Critical');
  const highRiskSkus = skuStockHealth.filter(s => s.risk === 'High');

  // Operational metrics
  const arrivingToday = storeRequests.filter(r => r.status === 'Dispatched').length;
  const awaitingApproval = storeRequests.filter(r => r.status === 'Requested' || r.status === 'Under Review' || r.status === 'Draft').length;
  const criticalStockoutsCount = criticalSkus.length;
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

  const handleQuickReplenish = (productId) => {
    setQuickCreateProdId(productId);
    setIsQuickCreateOpen(true);
  };

  const handleCancelClick = (req) => {
    if (window.confirm(`Are you sure you want to cancel replenishment request ${req.id}?`)) {
      cancelRequest(req.id, 'Cancelled by store manager');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header & Store Context */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>{currentStore.name}</h1>
            <span className="badge-risk High" style={{ fontSize: '0.78rem' }}>{currentStore.region}</span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px' }}>
            Store Manager Workspace &bull; Risk Score Index: <span style={{ color: currentStore.riskScore > 75 ? 'var(--risk-critical)' : 'var(--risk-low)', fontWeight: 700 }}>{currentStore.riskScore}/100</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={() => { setQuickCreateProdId(null); setIsQuickCreateOpen(true); }}>
            <Plus size={16} />
            <span>New Replenishment Request</span>
          </button>
        </div>
      </div>

      {/* Critical Stockout Alert Banner (if any SKU < 4h) */}
      {criticalSkus.length > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(249, 115, 22, 0.1) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.2)',
              color: 'var(--risk-critical)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#f87171' }}>
                Stockout Alert: {criticalSkus.length} SKU(s) Project Zero Shelf Inventory in &lt; 4 Hours
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {criticalSkus.map(s => `${s.name} (~${s.hoursLeft}h left)`).join(' • ')}
              </div>
            </div>
          </div>

          <button 
            className="btn-danger" 
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            onClick={() => handleQuickReplenish(criticalSkus[0].id)}
          >
            <Plus size={14} />
            <span>Auto-Replenish Critical SKU</span>
          </button>
        </div>
      )}

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
            <div className="label">Awaiting Approval / Review</div>
            <div className="value" style={{ color: '#a78bfa' }}>{awaitingApproval}</div>
            <div className="subtext">In planner review & draft queue</div>
          </div>
          <div className="stat-icon" style={{ color: '#a78bfa' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="label">Critical Stockout Risk</div>
            <div className="value" style={{ color: 'var(--risk-critical)' }}>{criticalStockoutsCount}</div>
            <div className="subtext">SKUs &lt; 4 hours store stock remaining</div>
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

      {/* Live Store Shelf Inventory & Stock Intelligence Panel */}
      <div className="card-panel">
        <div className="panel-header" style={{ cursor: 'pointer' }} onClick={() => setIsInventoryExpanded(!isInventoryExpanded)}>
          <div className="panel-title">
            <Layers size={20} color="var(--accent-primary)" />
            <span>Live Store Shelf Inventory & Velocity Forecast</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '8px' }}>
              ({products.length} catalog SKUs &bull; {criticalSkus.length} critical &bull; {highRiskSkus.length} high risk)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isInventoryExpanded ? 'Collapse' : 'Expand'}
            </span>
            <button className="btn-secondary" style={{ padding: '4px 8px' }}>
              {isInventoryExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {isInventoryExpanded && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '14px', 
            paddingTop: '0.75rem' 
          }}>
            {skuStockHealth.map(prod => (
              <div 
                key={prod.id} 
                style={{
                  padding: '14px',
                  background: 'var(--bg-dark)',
                  borderRadius: '10px',
                  border: prod.risk === 'Critical' 
                    ? '1px solid rgba(239, 68, 68, 0.4)' 
                    : prod.risk === 'High' 
                    ? '1px solid rgba(249, 115, 22, 0.3)' 
                    : '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px',
                  boxShadow: prod.risk === 'Critical' ? '0 0 12px rgba(239, 68, 68, 0.1)' : 'none'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>
                      {prod.name}
                    </div>
                    <span className={`badge-risk ${prod.risk}`}>
                      {prod.risk}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {prod.sku} &bull; {prod.category}
                  </div>

                  {/* Stock Fill Progress Bar */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Store Stock: <strong>{prod.currentStoreStock} {prod.unitOfMeasure}</strong></span>
                      <span style={{ color: prod.risk === 'Critical' ? 'var(--risk-critical)' : 'var(--text-muted)' }}>
                        Min: {prod.presentationMin}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${prod.stockPercent}%`,
                        height: '100%',
                        background: prod.risk === 'Critical' ? '#ef4444' : prod.risk === 'High' ? '#f97316' : '#10b981',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  {/* Velocity & Stockout Time */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', background: 'rgba(0,0,0,0.15)', padding: '6px 8px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Sales Velocity: <strong>{prod.salesVelocityPerHour}/h</strong></span>
                    <span style={{ 
                      fontWeight: 700, 
                      color: prod.risk === 'Critical' ? '#ef4444' : prod.risk === 'High' ? '#f97316' : '#10b981' 
                    }}>
                      ~{prod.hoursLeft}h stock left
                    </span>
                  </div>
                </div>

                <button 
                  className="btn-secondary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '6px 10px', fontSize: '0.78rem' }}
                  onClick={() => handleQuickReplenish(prod.id)}
                >
                  <Plus size={13} />
                  <span>Request Replenishment</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Replenishment Requests Table */}
      <div className="card-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Package size={20} color="var(--accent-primary)" />
            <span>Store Replenishment Requests</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '6px' }}>
              ({storeRequests.length} orders)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
              <option value="Draft">Draft</option>
              <option value="Requested">Requested</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Picking">Picking</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Partially Fulfilled">Partially Fulfilled</option>
              <option value="Blocked">Blocked</option>
              <option value="Cancelled">Cancelled</option>
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
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No replenishment requests found matching filter criteria.
                  </td>
                </tr>
              ) : (
                storeRequests.map(req => {
                  const firstLine = req.lines[0];
                  const isDraft = req.status === 'Draft';
                  const isRequestedOrReview = req.status === 'Requested' || req.status === 'Under Review';
                  const isDispatched = req.status === 'Dispatched' || req.status === 'Partially Fulfilled';

                  return (
                    <tr key={req.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{req.id}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(req.creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{firstLine ? firstLine.productName : 'Multi-item'}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                          {req.lines.length > 1 ? `+ ${req.lines.length - 1} additional items` : `${firstLine?.requestedQty} ${firstLine?.unitOfMeasure}`}
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
                          {new Date(req.needByTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td>
                        <span className={`badge-risk ${req.status === 'Delivered' ? 'Low' : (firstLine?.riskLevel || 'Low')}`}>
                          {req.status === 'Delivered' ? 'Restocked (Safe)' : `${firstLine?.riskLevel} Risk`}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '240px' }}>
                          {req.status === 'Delivered' ? 'Delivery verified. Shelf inventory replenished.' : firstLine?.riskReason}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {/* Draft State Actions */}
                          {isDraft && (
                            <>
                              <button 
                                className="btn-secondary" 
                                style={{ padding: '4px 8px' }} 
                                onClick={() => setEditingDraftReq(req)}
                                title="Edit Draft Items"
                              >
                                <Edit3 size={14} />
                                <span>Edit</span>
                              </button>
                              <button 
                                className="btn-primary" 
                                style={{ padding: '4px 8px' }} 
                                onClick={() => submitDraft(req.id)}
                                title="Submit Draft to Review Queue"
                              >
                                <Send size={14} />
                                <span>Submit</span>
                              </button>
                              <button 
                                className="btn-danger" 
                                style={{ padding: '4px 8px' }} 
                                onClick={() => handleCancelClick(req)}
                                title="Cancel Draft"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}

                          {/* Requested / Under Review State Actions */}
                          {isRequestedOrReview && (
                            <>
                              <button 
                                className="btn-secondary" 
                                style={{ padding: '4px 8px' }} 
                                onClick={() => setSelectedReq(req)}
                              >
                                <Eye size={14} />
                                <span>View</span>
                              </button>
                              <button 
                                className="btn-danger" 
                                style={{ padding: '4px 8px' }} 
                                onClick={() => handleCancelClick(req)}
                                title="Cancel Active Request"
                              >
                                <XCircle size={14} />
                                <span>Cancel</span>
                              </button>
                            </>
                          )}

                          {/* Dispatched Delivery Confirmation Action */}
                          {isDispatched && (
                            <>
                              <button 
                                className="btn-secondary" 
                                style={{ padding: '4px 8px' }} 
                                onClick={() => setSelectedReq(req)}
                              >
                                <Eye size={14} />
                                <span>View</span>
                              </button>
                              <button 
                                className="btn-success" 
                                style={{ padding: '4px 8px' }} 
                                onClick={() => handleOpenConfirm(req)}
                                title="Inspect & Confirm Delivery"
                              >
                                <FileCheck size={14} />
                                <span>Confirm</span>
                              </button>
                            </>
                          )}

                          {/* Other States (Approved, Picking, Delivered, Blocked, Cancelled) */}
                          {!isDraft && !isRequestedOrReview && !isDispatched && (
                            <button 
                              className="btn-secondary" 
                              style={{ padding: '4px 8px' }} 
                              onClick={() => setSelectedReq(req)}
                            >
                              <Eye size={14} />
                              <span>View</span>
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

      {/* Quick Create Replenishment Modal */}
      {isQuickCreateOpen && (
        <CreateRequestModal
          initialProductId={quickCreateProdId}
          onClose={() => {
            setIsQuickCreateOpen(false);
            setQuickCreateProdId(null);
          }}
        />
      )}

      {/* Edit Draft Modal */}
      {editingDraftReq && (
        <EditDraftModal
          draftRequest={editingDraftReq}
          onClose={() => setEditingDraftReq(null)}
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
              Inspect shipment from <strong>{confirmModalReq.carrier || 'Grozo Logistics Fleet'}</strong> (Ref: <code>{confirmModalReq.shipmentRef || 'TRK-DEFAULT'}</code>).
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.25rem' }}>
              {confirmModalReq.lines.map(line => {
                const expectedQty = line.dispatchedQty || line.approvedQty || line.requestedQty;
                return (
                  <div key={line.id} style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{line.productName}</div>
                      <span className="badge-risk Low" style={{ fontSize: '0.72rem' }}>{line.sku}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Dispatched Qty: <strong>{expectedQty}</strong> {line.unitOfMeasure}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Actual Received Qty:</label>
                      <input
                        type="number"
                        min="0"
                        className="search-input"
                        style={{ width: '100px' }}
                        value={receiptQtyMap[line.id] !== undefined ? receiptQtyMap[line.id] : expectedQty}
                        onChange={e => setReceiptQtyMap({ ...receiptQtyMap, [line.id]: Number(e.target.value) })}
                      />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{line.unitOfMeasure}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Discrepancy / Damage Notes (Optional if full receipt, Required if damaged / short-shipped)
              </label>
              <textarea
                className="search-input"
                rows="2"
                placeholder="Log damaged cases, crushed packaging, or missing inventory details..."
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
