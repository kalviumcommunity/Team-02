import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PackagePlus, Truck, ShieldCheck, X, Building2, AlertCircle } from 'lucide-react';

const VENDORS = [
  { id: 'V-101', name: 'Organic Valley Farms & Dairy', leadTime: 'Next Day 08:00 AM', rating: '99.4%' },
  { id: 'V-102', name: 'Del Monte Global Produce Co.', leadTime: 'Tomorrow 06:00 AM', rating: '98.8%' },
  { id: 'V-103', name: 'Tyson Prepared Fresh Meats', leadTime: 'Same Day 18:00 PM', rating: '99.1%' },
  { id: 'V-104', name: 'Nestle & Crystal Spring Waters', leadTime: 'Standard (24h)', rating: '99.7%' },
  { id: 'V-105', name: 'Kimberly-Clark Consumer Logistics', leadTime: 'Standard (48h)', rating: '97.9%' },
  { id: 'V-106', name: 'King Arthur Artisan Milling Co.', leadTime: 'Tomorrow 09:00 AM', rating: '98.5%' }
];

export const SupplierPOModal = ({ initialProductId, onClose }) => {
  const { products, createSupplierPO, showToast } = useApp();

  const [selectedProdId, setSelectedProdId] = useState(initialProductId || (products[0] ? products[0].id : ''));
  const [selectedVendor, setSelectedVendor] = useState(VENDORS[0].name);
  const [orderQty, setOrderQty] = useState(150);
  const [freightType, setFreightType] = useState('Priority Dedicated Express');
  const [poNotes, setPoNotes] = useState('Urgent warehouse safety buffer replenishment.');

  const selectedProduct = products.find(p => p.id === selectedProdId) || products[0] || {};
  const vendorInfo = VENDORS.find(v => v.name === selectedVendor) || VENDORS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderQty || orderQty <= 0) {
      showToast('Please enter a valid order quantity.', 'error');
      return;
    }

    createSupplierPO(selectedProduct.id, orderQty, selectedVendor, vendorInfo.leadTime);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.15)', borderRadius: '8px' }}>
              <PackagePlus size={22} color="#a78bfa" />
            </div>
            <div>
              <div className="modal-title">Trigger Supplier Purchase Order (PO)</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Replenish Central Warehouse inventory directly from upstream FMCG suppliers.
              </div>
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '6px 10px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Target Product & Current Warehouse Stock */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Target SKU to Replenish in Central Warehouse
            </label>
            <select
              className="filter-select"
              style={{ width: '100%' }}
              value={selectedProdId}
              onChange={e => setSelectedProdId(e.target.value)}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) &bull; Current WH Available: {p.warehouseAvailable || 0} {p.unitOfMeasure || 'units'}
                </option>
              ))}
            </select>
          </div>

          {/* Current WH Stock Banner */}
          <div style={{ 
            padding: '12px 14px', 
            background: 'var(--bg-dark)', 
            borderRadius: '8px', 
            border: '1px solid var(--border-color)',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current Central WH Stock:</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: (selectedProduct.warehouseAvailable || 0) < 50 ? 'var(--risk-critical)' : 'var(--risk-low)' }}>
                {selectedProduct.warehouseAvailable || 0} {selectedProduct.unitOfMeasure || 'Units'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>After Inbound PO Delivery:</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                {(selectedProduct.warehouseAvailable || 0) + Number(orderQty || 0)} {selectedProduct.unitOfMeasure || 'Units'}
              </div>
            </div>
          </div>

          {/* Vendor Selection */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Select Upstream Approved Vendor
            </label>
            <select
              className="filter-select"
              style={{ width: '100%' }}
              value={selectedVendor}
              onChange={e => setSelectedVendor(e.target.value)}
            >
              {VENDORS.map(v => (
                <option key={v.id} value={v.name}>
                  {v.name} &bull; Lead Time: {v.leadTime} (SLA Rating: {v.rating})
                </option>
              ))}
            </select>
          </div>

          {/* Order Quantity and Freight Tier */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                PO Quantity ({selectedProduct.unitOfMeasure || 'Units'})
              </label>
              <input
                type="number"
                min="10"
                step="10"
                className="search-input"
                style={{ width: '100%' }}
                value={orderQty}
                onChange={e => setOrderQty(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Inbound Freight Service Level
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={freightType}
                onChange={e => setFreightType(e.target.value)}
              >
                <option value="Priority Dedicated Express">Priority Dedicated Express (&lt; 12h)</option>
                <option value="Standard Scheduled Freight">Standard Scheduled Freight (24h)</option>
                <option value="Cold Chain Temperature Controlled">Cold Chain Climate Refrig</option>
              </select>
            </div>
          </div>

          {/* Procurement Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Procurement Audit Notes & Rationale
            </label>
            <textarea
              className="search-input"
              rows="2"
              placeholder="Enter purchasing justification for central warehouse safety buffer..."
              value={poNotes}
              onChange={e => setPoNotes(e.target.value)}
            />
          </div>

          {/* Modal Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ background: '#8b5cf6', borderColor: '#7c3aed' }}>
              <PackagePlus size={16} />
              <span>Issue PO &amp; Restock Warehouse (+{orderQty})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
