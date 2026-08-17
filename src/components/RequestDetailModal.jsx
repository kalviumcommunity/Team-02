import React from 'react';
import { 
  Package, 
  Clock, 
  AlertTriangle, 
  History, 
  CheckCircle2, 
  Truck, 
  UserCheck, 
  ShieldAlert,
  FileText
} from 'lucide-react';

export const RequestDetailModal = ({ request, onClose, onActionClick }) => {
  if (!request) return null;

  const lifecycleStages = ['Requested', 'Under Review', 'Approved', 'Allocated', 'Picking', 'Packed', 'Dispatched', 'Delivered'];

  const getStageIndex = (status) => {
    if (status === 'Partially Approved') return 2;
    if (status === 'Partially Fulfilled') return 7;
    if (status === 'Blocked' || status === 'Rejected' || status === 'Cancelled') return -1;
    return lifecycleStages.indexOf(status);
  };

  const currentStageIdx = getStageIndex(request.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 className="modal-title">{request.id}</h2>
              <span className={`badge-status ${request.status.replace(/\s+/g, '')}`}>
                {request.status}
              </span>
              {request.priority === 'Urgent' && (
                <span className="badge-priority-urgent">URGENT</span>
              )}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {request.storeName} ({request.region}) • Created by {request.requesterName}
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose}>✕</button>
        </div>

        {/* Urgency Alert Reason */}
        {request.urgencyReason && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.12)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            padding: '10px 14px', 
            borderRadius: '8px', 
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={18} />
            <span><strong>Urgency Justification:</strong> {request.urgencyReason}</span>
          </div>
        )}

        {/* Lifecycle Status Timeline */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Lifecycle Progression Stage
          </div>
          <div className="lifecycle-timeline">
            {lifecycleStages.map((stage, idx) => {
              const isCompleted = currentStageIdx >= idx;
              const isActive = currentStageIdx === idx;
              return (
                <div key={stage} className={`timeline-step ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}>
                  {isCompleted ? <CheckCircle2 size={13} /> : <span>{idx + 1}</span>}
                  <span>{stage}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Line Items Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Package size={16} color="var(--accent-primary)" />
            <span>Requested Product Line Items</span>
          </div>
          <div className="table-responsive">
            <table className="grozo-table">
              <thead>
                <tr>
                  <th>SKU & Item Name</th>
                  <th>Req Qty</th>
                  <th>Appr Qty</th>
                  <th>Alloc Qty</th>
                  <th>Disp Qty</th>
                  <th>Rec Qty</th>
                  <th>Risk Level & Reason</th>
                </tr>
              </thead>
              <tbody>
                {request.lines.map(line => (
                  <tr key={line.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{line.productName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{line.sku} ({line.unitOfMeasure})</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{line.requestedQty}</td>
                    <td>{line.approvedQty}</td>
                    <td>{line.allocatedQty}</td>
                    <td>{line.dispatchedQty}</td>
                    <td>{line.receivedQty}</td>
                    <td>
                      <span className={`badge-risk ${line.riskLevel}`}>
                        {line.riskLevel} Risk
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {line.riskReason}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit History Timeline */}
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <History size={16} color="var(--accent-primary)" />
            <span>Immutable Audit Trail & Provenance History</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
            {request.statusHistory.map((hist, i) => (
              <div key={i} style={{ 
                padding: '8px 12px', 
                background: 'var(--bg-dark)', 
                borderRadius: '6px', 
                borderLeft: '3px solid var(--accent-primary)',
                fontSize: '0.82rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span><strong>{hist.actor}</strong> &bull; {hist.status}</span>
                  <span>{new Date(hist.timestamp).toLocaleString()}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{hist.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
