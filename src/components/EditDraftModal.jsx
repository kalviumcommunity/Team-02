import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Package, 
  Clock, 
  Send,
  Save
} from 'lucide-react';

export const EditDraftModal = ({ draftRequest, onClose }) => {
  const { products, stores, updateDraft, submitDraft, showToast } = useApp();

  if (!draftRequest) return null;

  const [priority, setPriority] = useState(draftRequest.priority || 'Standard');
  const [urgencyReason, setUrgencyReason] = useState(draftRequest.urgencyReason || '');
  const [needByHours, setNeedByHours] = useState('8');

  const [lines, setLines] = useState(
    draftRequest.lines.map(l => ({
      id: l.id,
      productId: l.productId,
      requestedQty: l.requestedQty
    }))
  );

  const handleAddLine = () => {
    const unselected = products.find(p => !lines.some(l => l.productId === p.id)) || products[0];
    setLines([...lines, { productId: unselected.id, requestedQty: 10 }]);
  };

  const handleRemoveLine = (idx) => {
    if (lines.length === 1) {
      showToast('A request must contain at least one product line item.', 'warning');
      return;
    }
    setLines(lines.filter((_, i) => i !== idx));
  };

  const handleLineChange = (idx, field, val) => {
    const updated = [...lines];
    updated[idx][field] = val;
    setLines(updated);
  };

  const handleSave = (andSubmit = false) => {
    if (priority === 'Urgent' && !urgencyReason.trim() && andSubmit) {
      showToast('Urgency Justification Reason is mandatory for Urgent requests.', 'error');
      return;
    }

    if (lines.some(l => !l.requestedQty || Number(l.requestedQty) <= 0)) {
      showToast('Requested Quantity must be at least 1 unit/case.', 'error');
      return;
    }

    const needByTime = new Date(Date.now() + Number(needByHours) * 3600 * 1000).toISOString();

    updateDraft(draftRequest.id, {
      priority,
      urgencyReason,
      needByTime,
      lines
    });

    if (andSubmit) {
      submitDraft(draftRequest.id);
    }

    onClose();
  };

  const storeObj = stores.find(s => s.id === draftRequest.storeId) || stores[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="modal-title">Edit Draft Request: {draftRequest.id}</div>
              <span className="badge-status Draft">Draft</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {storeObj.name} ({storeObj.region})
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose}>✕</button>
        </div>

        {/* Priority & Urgency Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Request Priority Tier
            </label>
            <select
              className="filter-select"
              style={{ width: '100%' }}
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              <option value="Standard">Standard Cycle Order</option>
              <option value="Urgent">Urgent Replenishment (High Stockout Risk)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Required Delivery SLA Deadline
            </label>
            <select
              className="filter-select"
              style={{ width: '100%' }}
              value={needByHours}
              onChange={e => setNeedByHours(e.target.value)}
            >
              <option value="4">Within 4 Hours (Expedited)</option>
              <option value="8">Within 8 Hours (Same Day)</option>
              <option value="24">Within 24 Hours (Next Cycle)</option>
            </select>
          </div>
        </div>

        {priority === 'Urgent' && (
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#f87171' }}>
              Urgency Justification Reason (Mandatory for Urgent Requests)
            </label>
            <textarea
              className="search-input"
              rows="2"
              placeholder="Detail sales velocity spike, promotion surge, or imminent shelf stockout..."
              value={urgencyReason}
              onChange={e => setUrgencyReason(e.target.value)}
            />
          </div>
        )}

        {/* Line Items List */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Product Line Items</div>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={handleAddLine}>
              <Plus size={14} />
              <span>Add Line Item</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lines.map((line, idx) => {
              const selectedProd = products.find(p => p.id === line.productId) || products[0];
              const hoursLeft = selectedProd.salesVelocityPerHour > 0 ? (selectedProd.currentStoreStock / selectedProd.salesVelocityPerHour).toFixed(1) : 24;
              const isCritical = parseFloat(hoursLeft) < 4;

              return (
                <div key={idx} style={{ 
                  padding: '12px', 
                  background: 'var(--bg-dark)', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>SKU Product</label>
                    <select
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={line.productId}
                      onChange={e => handleLineChange(idx, 'productId', e.target.value)}
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ width: '110px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Req Quantity</label>
                    <input
                      type="number"
                      min="1"
                      className="search-input"
                      value={line.requestedQty}
                      onChange={e => handleLineChange(idx, 'requestedQty', Number(e.target.value))}
                    />
                  </div>

                  <div style={{ width: '140px', fontSize: '0.75rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Store Stock: <strong>{selectedProd.currentStoreStock}</strong></div>
                    <div style={{ color: isCritical ? 'var(--risk-critical)' : 'var(--risk-low)', fontWeight: 600 }}>
                      ~{hoursLeft}h stock left
                    </div>
                  </div>

                  {lines.length > 1 && (
                    <button className="btn-danger" style={{ padding: '6px' }} onClick={() => handleRemoveLine(idx)}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn-secondary" onClick={() => handleSave(false)}>
            <Save size={15} />
            <span>Save Draft Changes</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={() => handleSave(true)}>
              <Send size={15} />
              <span>Save & Submit Request</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
