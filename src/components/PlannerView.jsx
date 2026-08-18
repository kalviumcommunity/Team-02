import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sliders, 
  Eye, 
  Search, 
  Layers, 
  Clock, 
  ShieldAlert,
  ArrowUpRight,
  PackagePlus,
  Zap,
  Store,
  Boxes,
  Scale
} from 'lucide-react';
import { RequestDetailModal } from './RequestDetailModal';
import { SupplierPOModal } from './SupplierPOModal';

export const PlannerView = () => {
  const { 
    requests, 
    products, 
    stores,
    approveRequest, 
    batchApproveStandardRequests,
    rejectRequest, 
    overridePriority,
    showToast,
    searchQuery,
    setSearchQuery,
    riskFilter,
    setRiskFilter,
    priorityFilter,
    setPriorityFilter
  } = useApp();

  const [storeFilter, setStoreFilter] = useState('ALL');
  const [selectedReq, setSelectedReq] = useState(null);
  const [decisionReq, setDecisionReq] = useState(null);
  const [approvedQtyMap, setApprovedQtyMap] = useState({});
  const [decisionReason, setDecisionReason] = useState('');

  const [overrideModalReq, setOverrideModalReq] = useState(null);
  const [overridePriorityVal, setOverridePriorityVal] = useState('Urgent');
  const [overrideReason, setOverrideReason] = useState('');

  const [showPOModal, setShowPOModal] = useState(false);
  const [poTargetProdId, setPoTargetProdId] = useState('');

  // Pending approval queue: status = Requested or Under Review
  const pendingRequests = requests.filter(r => r.status === 'Requested' || r.status === 'Under Review');

  const approvalQueue = pendingRequests.filter(r => {
    const matchesSearch = !searchQuery || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.lines.some(l => l.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStore = storeFilter === 'ALL' || r.storeId === storeFilter;
    const matchesRisk = riskFilter === 'ALL' || r.lines.some(l => l.riskLevel === riskFilter);
    const matchesPriority = !priorityFilter || priorityFilter === 'ALL' || r.priority === priorityFilter;

    return matchesSearch && matchesStore && matchesRisk && matchesPriority;
  }).sort((a, b) => {
    // Sort by Urgency first, then Need-by time
    if (a.priority === 'Urgent' && b.priority !== 'Urgent') return -1;
    if (a.priority !== 'Urgent' && b.priority === 'Urgent') return 1;
    return new Date(a.needByTime) - new Date(b.needByTime);
  });

  // Calculate standard requests eligible for 1-click batch approval
  const eligibleStandardBatchCount = pendingRequests.filter(r => 
    r.priority === 'Standard' && 
    r.lines.every(l => {
      const prod = products.find(p => p.id === l.productId) || {};
      return Number(l.requestedQty) <= (prod.warehouseAvailable !== undefined ? prod.warehouseAvailable : 100);
    })
  ).length;

  // Compute Multi-Store SKU Demand Aggregation
  const skuDemandMap = {};
  pendingRequests.forEach(req => {
    req.lines.forEach(line => {
      if (!skuDemandMap[line.productId]) {
        const prod = products.find(p => p.id === line.productId) || {};
        skuDemandMap[line.productId] = {
          productId: line.productId,
          productName: line.productName,
          sku: line.sku,
          unitOfMeasure: line.unitOfMeasure,
          warehouseAvailable: prod.warehouseAvailable || 0,
          totalRequestedQty: 0,
          stores: []
        };
      }
      skuDemandMap[line.productId].totalRequestedQty += Number(line.requestedQty);
      skuDemandMap[line.productId].stores.push({
        requestId: req.id,
        storeId: req.storeId,
        storeName: req.storeName,
        priority: req.priority,
        requestedQty: line.requestedQty,
        needByTime: req.needByTime,
        riskLevel: line.riskLevel
      });
    });
  });

  const skuDemands = Object.values(skuDemandMap);

  const handleOpenDecision = (req) => {
    setDecisionReq(req);
    const initialMap = {};
    req.lines.forEach(l => {
      initialMap[l.id] = l.requestedQty;
    });
    setApprovedQtyMap(initialMap);
    setDecisionReason('');
  };

  const handleFullApprove = () => {
    if (!decisionReq) return;

    // Check if any approved quantity exceeds available warehouse stock
    for (const line of decisionReq.lines) {
      const prod = products.find(p => p.id === line.productId) || {};
      const maxAvailable = prod.warehouseAvailable !== undefined ? prod.warehouseAvailable : 100;
      const apprQty = approvedQtyMap[line.id] !== undefined ? Number(approvedQtyMap[line.id]) : Number(line.requestedQty);

      if (apprQty > maxAvailable) {
        showToast(`Cannot approve ${apprQty} units for ${line.productName}. Central warehouse only has ${maxAvailable} units available!`, 'error');
        return;
      }
      if (apprQty < 0) {
        showToast('Approved quantity cannot be negative.', 'error');
        return;
      }
    }

    approveRequest(decisionReq.id, approvedQtyMap, decisionReason || 'Quantity approved by planner.');
    setDecisionReq(null);
  };

  const handleReject = () => {
    if (!decisionReq) return;
    if (!decisionReason || !decisionReason.trim()) {
      showToast('Please enter a rejection rationale for store audit compliance.', 'error');
      return;
    }
    rejectRequest(decisionReq.id, decisionReason);
    setDecisionReq(null);
  };

  const handleSaveOverride = () => {
    if (!overrideModalReq || !overrideReason) return;
    overridePriority(overrideModalReq.id, overridePriorityVal, overrideReason);
    setOverrideModalReq(null);
  };

  return (
    <div>
      {/* Planner Workspace Header with Batch & PO Action Buttons */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Replenishment Approval Queue</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Prioritized by explainable stockout risk, urgency tier, need-by SLA, and warehouse supply.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Trigger Supplier Purchase Order */}
          <button 
            className="btn-secondary"
            style={{ borderColor: '#8b5cf6', color: '#a78bfa' }}
            onClick={() => { setPoTargetProdId(products[0]?.id || ''); setShowPOModal(true); }}
            title="Order upstream stock from suppliers to restock warehouse"
          >
            <PackagePlus size={16} />
            <span>Order Supplier PO</span>
          </button>

          {/* 1-Click Batch Approval */}
          <button 
            className="btn-primary"
            style={{ background: eligibleStandardBatchCount > 0 ? '#10b981' : 'var(--bg-card)', borderColor: '#10b981' }}
            disabled={eligibleStandardBatchCount === 0}
            onClick={batchApproveStandardRequests}
            title="Approve all routine Standard cycle orders where warehouse supply is plenty"
          >
            <Zap size={16} />
            <span>Batch Approve Standard ({eligibleStandardBatchCount})</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid-cols-4">
        <div className="stat-card">
          <div>
            <div className="label">Queue Size</div>
            <div className="value" style={{ color: '#a78bfa' }}>{approvalQueue.length}</div>
            <div className="subtext">Pending planner decision</div>
          </div>
          <div className="stat-icon" style={{ color: '#a78bfa' }}>
            <Layers size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="label">Urgent Requests</div>
            <div className="value" style={{ color: 'var(--risk-critical)' }}>
              {approvalQueue.filter(r => r.priority === 'Urgent').length}
            </div>
            <div className="subtext">High store stockout risk</div>
          </div>
          <div className="stat-icon" style={{ color: 'var(--risk-critical)' }}>
            <AlertTriangle size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="label">Critical Stockout Items</div>
            <div className="value" style={{ color: 'var(--risk-high)' }}>
              {approvalQueue.filter(r => r.lines.some(l => l.riskLevel === 'Critical')).length}
            </div>
            <div className="subtext">&lt; 4 hours remaining stock</div>
          </div>
          <div className="stat-icon" style={{ color: 'var(--risk-high)' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="label">Target Turnaround</div>
            <div className="value" style={{ color: 'var(--risk-low)' }}>&lt; 30m</div>
            <div className="subtext">Current SLA average: 18m</div>
          </div>
          <div className="stat-icon" style={{ color: 'var(--risk-low)' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Multi-Store Supply & Demand Balancing Matrix */}
      {skuDemands.length > 0 && (
        <div className="card-panel" style={{ marginBottom: '1.5rem' }}>
          <div className="panel-title" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scale size={20} color="#8b5cf6" />
              <span>Multi-Store Demand &amp; Central Supply Balancer</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Cross-store SKU competition &bull; {skuDemands.length} active demand groups
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {skuDemands.map(skuGroup => {
              const isDeficit = skuGroup.totalRequestedQty > skuGroup.warehouseAvailable;
              return (
                <div 
                  key={skuGroup.productId}
                  style={{
                    padding: '14px',
                    background: 'var(--bg-dark)',
                    borderRadius: '10px',
                    border: isDeficit ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {skuGroup.productName}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {skuGroup.sku}
                        </div>
                      </div>
                      <span className={`badge-risk ${isDeficit ? 'Critical' : 'Low'}`}>
                        {isDeficit ? 'Supply Deficit' : 'Optimal Supply'}
                      </span>
                    </div>

                    {/* Compare Total Store Demand vs Warehouse Stock */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '8px 10px', 
                      background: 'var(--bg-card)', 
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Total Stores Demand:</div>
                        <div style={{ fontWeight: 800, color: isDeficit ? 'var(--risk-critical)' : 'var(--text-primary)' }}>
                          {skuGroup.totalRequestedQty} {skuGroup.unitOfMeasure}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Central WH Supply:</div>
                        <div style={{ fontWeight: 800, color: skuGroup.warehouseAvailable < 50 ? 'var(--risk-high)' : 'var(--risk-low)' }}>
                          {skuGroup.warehouseAvailable} {skuGroup.unitOfMeasure}
                        </div>
                      </div>
                    </div>

                    {/* Competing Stores List */}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                      Competing Store Orders ({skuGroup.stores.length}):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {skuGroup.stores.map((st, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
                          <span>&bull; {st.storeName}: <strong>{st.requestedQty} {skuGroup.unitOfMeasure}</strong></span>
                          <span className={`badge-risk ${st.riskLevel}`} style={{ padding: '1px 5px', fontSize: '0.68rem' }}>
                            {st.priority === 'Urgent' ? '⚡ URGENT' : st.riskLevel}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions for this SKU */}
                  <div style={{ display: 'flex', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
                    {isDeficit && (
                      <button 
                        className="btn-secondary" 
                        style={{ fontSize: '0.74rem', padding: '4px 8px', flex: 1, borderColor: '#8b5cf6', color: '#a78bfa' }}
                        onClick={() => { setPoTargetProdId(skuGroup.productId); setShowPOModal(true); }}
                      >
                        <PackagePlus size={13} />
                        <span>Order Vendor PO</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Request Queue Table */}
      <div className="card-panel">
        <div className="panel-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <div className="panel-title">
            <CheckCircle2 size={20} color="var(--accent-primary)" />
            <span>Prioritized Request Queue ({approvalQueue.length})</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Search */}
            <div className="search-input-wrapper">
              <Search size={15} />
              <input
                className="search-input"
                placeholder="Search store, SKU, product..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Store Filter */}
            <select className="filter-select" value={storeFilter} onChange={e => setStoreFilter(e.target.value)}>
              <option value="ALL">All Stores</option>
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select className="filter-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
              <option value="ALL">All Priorities</option>
              <option value="Urgent">⚡ Urgent Only</option>
              <option value="Standard">Standard Cycle</option>
            </select>

            {/* Risk Filter */}
            <select className="filter-select" value={riskFilter} onChange={e => setRiskFilter(e.target.value)}>
              <option value="ALL">All Risk Levels</option>
              <option value="Critical">Critical Risk</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="grozo-table">
            <thead>
              <tr>
                <th>Request ID &amp; Store</th>
                <th>Item &amp; Quantity</th>
                <th>Priority &amp; Overrides</th>
                <th>Warehouse Stock</th>
                <th>Need-By Deadline</th>
                <th>Explainable Risk Driver</th>
                <th>Approval Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvalQueue.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No pending replenishment requests in approval queue.
                  </td>
                </tr>
              ) : (
                approvalQueue.map(req => {
                  const firstLine = req.lines[0];
                  const prod = products.find(p => p.id === firstLine?.productId) || {};
                  return (
                    <tr key={req.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{req.id}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{req.storeName}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{firstLine?.productName}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          Requested: <strong>{firstLine?.requestedQty}</strong> {firstLine?.unitOfMeasure}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {req.priority === 'Urgent' ? (
                            <span className="badge-priority-urgent">URGENT</span>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Standard</span>
                          )}
                          <button 
                            className="btn-secondary" 
                            style={{ padding: '2px 6px', fontSize: '0.72rem' }}
                            title="Override Priority / Risk"
                            onClick={() => { setOverrideModalReq(req); setOverrideReason(''); }}
                          >
                            <Sliders size={12} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: (prod.warehouseAvailable || 0) > 50 ? 'var(--risk-low)' : 'var(--risk-high)' }}>
                          {prod.warehouseAvailable !== undefined ? prod.warehouseAvailable : 150} Units
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Central WH Zone A</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                          {new Date(req.needByTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Need-by SLA</div>
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
                          <button className="btn-success" onClick={() => handleOpenDecision(req)}>
                            <CheckCircle2 size={14} />
                            <span>Decide</span>
                          </button>
                          <button className="btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setSelectedReq(req)}>
                            <Eye size={14} />
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

      {/* Detail View Modal */}
      {selectedReq && (
        <RequestDetailModal
          request={selectedReq}
          onClose={() => setSelectedReq(null)}
        />
      )}

      {/* Decision Drawer Modal (Approve / Partial / Reject) */}
      {decisionReq && (
        <div className="modal-overlay" onClick={() => setDecisionReq(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <div className="modal-title">Planner Decision for {decisionReq.id}</div>
              <button className="btn-secondary" onClick={() => setDecisionReq(null)}>✕</button>
            </div>

            <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{decisionReq.storeName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Urgency Justification: {decisionReq.urgencyReason || 'Standard replenishment cycle.'}
              </div>
            </div>

            {/* Line items approval quantity adjustment */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>Line Items &amp; Approved Quantities</div>
              {decisionReq.lines.map(line => {
                const prod = products.find(p => p.id === line.productId) || {};
                return (
                  <div key={line.id} style={{ 
                    padding: '12px', 
                    background: 'var(--bg-dark)', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)',
                    marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ fontWeight: 600 }}>{line.productName} ({line.sku})</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--risk-low)' }}>
                        WH Available: {prod.warehouseAvailable !== undefined ? prod.warehouseAvailable : 120} Units
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Requested Qty: <strong>{line.requestedQty}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Approved Qty:</label>
                        <input
                          type="number"
                          className="search-input"
                          style={{ width: '100px' }}
                          value={approvedQtyMap[line.id] !== undefined ? approvedQtyMap[line.id] : line.requestedQty}
                          onChange={e => setApprovedQtyMap({ ...approvedQtyMap, [line.id]: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Decision Reason */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Decision Reason / Notes (Mandatory for Partial or Rejection)
              </label>
              <textarea
                className="search-input"
                rows="2"
                placeholder="Log planner rationale, partial allocation reason, or rejection note..."
                value={decisionReason}
                onChange={e => setDecisionReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <button className="btn-danger" onClick={handleReject}>
                <XCircle size={16} />
                <span>Reject Request</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-secondary" onClick={() => setDecisionReq(null)}>Cancel</button>
                <button className="btn-primary" onClick={handleFullApprove}>
                  <CheckCircle2 size={16} />
                  <span>Submit Approval</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Priority Override Modal */}
      {overrideModalReq && (
        <div className="modal-overlay" onClick={() => setOverrideModalReq(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div className="modal-title">Override Priority for {overrideModalReq.id}</div>
              <button className="btn-secondary" onClick={() => setOverrideModalReq(null)}>✕</button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                New Priority Level
              </label>
              <select 
                className="filter-select" 
                style={{ width: '100%' }}
                value={overridePriorityVal}
                onChange={e => setOverridePriorityVal(e.target.value)}
              >
                <option value="Urgent">Urgent (Highest Priority)</option>
                <option value="Standard">Standard (Regular Cycle)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Audit Override Reason (Mandatory)
              </label>
              <textarea
                className="search-input"
                rows="2"
                placeholder="Document business rationale for overriding system priority..."
                value={overrideReason}
                onChange={e => setOverrideReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setOverrideModalReq(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveOverride} disabled={!overrideReason}>
                <span>Apply Override &amp; Log Audit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Purchase Order Modal */}
      {showPOModal && (
        <SupplierPOModal
          initialProductId={poTargetProdId}
          onClose={() => setShowPOModal(false)}
        />
      )}
    </div>
  );
};
