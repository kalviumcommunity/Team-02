import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Pre-populated Enterprise Users Database (RBAC)
const USERS_DB = [
  {
    id: 'USR-101',
    email: 'sarah.jenkins@grozo.com',
    password: 'password123',
    name: 'Sarah Jenkins',
    role: 'store_manager',
    roleLabel: 'Store Manager',
    storeId: 'STR-101',
    storeName: 'Grozo Market #101 (Downtown)',
    avatar: 'SJ',
    badgeColor: '#3b82f6',
    token: 'token-store-mgr-101'
  },
  {
    id: 'USR-201',
    email: 'mark.taylor@grozo.com',
    password: 'password123',
    name: 'Mark Taylor',
    role: 'replenishment_planner',
    roleLabel: 'Replenishment Planner',
    storeId: 'ALL',
    storeName: 'Central Planning Operations',
    avatar: 'MT',
    badgeColor: '#8b5cf6',
    token: 'token-planner-201'
  },
  {
    id: 'USR-301',
    email: 'jim.carter@grozo.com',
    password: 'password123',
    name: 'Jim Carter',
    role: 'warehouse_dispatcher',
    roleLabel: 'Warehouse Dispatcher',
    storeId: 'ALL',
    storeName: 'Central Warehouse WMS Zone A',
    avatar: 'JC',
    badgeColor: '#06b6d4',
    token: 'token-warehouse-301'
  },
  {
    id: 'USR-401',
    email: 'alex.morgan@grozo.com',
    password: 'password123',
    name: 'Alex Morgan',
    role: 'regional_manager',
    roleLabel: 'Regional Operations Mgr',
    storeId: 'ALL',
    storeName: 'East & West Region Ops',
    avatar: 'AM',
    badgeColor: '#f59e0b',
    token: 'token-regional-401'
  },
  {
    id: 'USR-501',
    email: 'admin@grozo.com',
    password: 'password123',
    name: 'System Admin',
    role: 'sys_admin',
    roleLabel: 'System Administrator',
    storeId: 'ALL',
    storeName: 'Enterprise Governance',
    avatar: 'SA',
    badgeColor: '#ef4444',
    token: 'token-admin-501'
  }
];

let stores = [
  { id: 'STR-101', code: '101', name: 'Grozo Market #101 (Downtown)', region: 'East Region', manager: 'Sarah Jenkins', riskScore: 88, activeRequests: 5 },
  { id: 'STR-104', code: '104', name: 'Grozo Supercenter #104 (Suburbs)', region: 'East Region', manager: 'David Ross', riskScore: 42, activeRequests: 3 },
  { id: 'STR-205', code: '205', name: 'Grozo Express #205 (Westside)', region: 'West Region', manager: 'Elena Rostova', riskScore: 92, activeRequests: 6 },
  { id: 'STR-302', code: '302', name: 'Grozo Fresh Hub #302 (Metro)', region: 'Central Region', manager: 'Marcus Vance', riskScore: 65, activeRequests: 4 },
  { id: 'STR-409', code: '409', name: 'Grozo Market #409 (North)', region: 'Central Region', manager: 'Anita Roy', riskScore: 15, activeRequests: 1 },
];

let products = [
  { id: 'SKU-8821', sku: 'MILK-ORG-1G', name: 'Organic Whole Milk 1 Gal', category: 'Dairy & Eggs', unitOfMeasure: 'Cases (6/cs)', velocityTier: 'Tier A (Fast-Moving)', criticality: 'Essential Strategic', currentStoreStock: 12, salesVelocityPerHour: 3.5, warehouseAvailable: 240, presentationMin: 20 },
  { id: 'SKU-9902', sku: 'BANANA-ORG-3L', name: 'Organic Bananas 3 lb Bag', category: 'Produce', unitOfMeasure: 'Cases (10/cs)', velocityTier: 'Tier A (Fast-Moving)', criticality: 'High Demand', currentStoreStock: 8, salesVelocityPerHour: 4.2, warehouseAvailable: 180, presentationMin: 15 },
  { id: 'SKU-4412', sku: 'AVO-HAAS-4C', name: 'Haas Avocados Mesh Bag 4ct', category: 'Produce', unitOfMeasure: 'Cases (12/cs)', velocityTier: 'Tier A (Fast-Moving)', criticality: 'High Demand', currentStoreStock: 5, salesVelocityPerHour: 2.1, warehouseAvailable: 95, presentationMin: 10 },
  { id: 'SKU-1104', sku: 'EGGS-LARGE-12', name: 'Grade A Large White Eggs 12ct', category: 'Dairy & Eggs', unitOfMeasure: 'Cases (15/cs)', velocityTier: 'Tier A (Fast-Moving)', criticality: 'Essential Strategic', currentStoreStock: 18, salesVelocityPerHour: 2.8, warehouseAvailable: 310, presentationMin: 25 },
  { id: 'SKU-7751', sku: 'CHICKEN-ROT-1U', name: 'Fresh Rotisserie Whole Chicken', category: 'Prepared Foods', unitOfMeasure: 'Units', velocityTier: 'Tier A (Fast-Moving)', criticality: 'High Demand', currentStoreStock: 4, salesVelocityPerHour: 2.5, warehouseAvailable: 40, presentationMin: 10 },
  { id: 'SKU-6623', sku: 'WATER-SPRING-24', name: 'Natural Spring Water 24pk', category: 'Beverages', unitOfMeasure: 'Pallets (40/pl)', velocityTier: 'Tier A (Fast-Moving)', criticality: 'Essential Strategic', currentStoreStock: 2, salesVelocityPerHour: 0.8, warehouseAvailable: 50, presentationMin: 5 },
];

let requests = [
  {
    id: 'REQ-2026-8801',
    storeId: 'STR-101',
    storeName: 'Grozo Market #101 (Downtown)',
    region: 'East Region',
    requesterName: 'Sarah Jenkins (Store Mgr)',
    status: 'Requested',
    priority: 'Urgent',
    urgencyReason: 'Stockout imminent before evening rush. Sales velocity spiked +40%.',
    creationTime: '2026-08-17T09:15:00Z',
    needByTime: '2026-08-17T16:00:00Z',
    lastUpdatedTime: '2026-08-17T09:15:00Z',
    lastUpdatedSource: 'Backend API',
    lines: [
      { id: 'L-1', productId: 'SKU-8821', sku: 'MILK-ORG-1G', productName: 'Organic Whole Milk 1 Gal', requestedQty: 30, approvedQty: 0, allocatedQty: 0, dispatchedQty: 0, receivedQty: 0, unitOfMeasure: 'Cases (6/cs)', stockoutHours: 3.4, riskLevel: 'Critical', riskReason: 'Critical risk: projected stock hits 0 in 3.4h' }
    ],
    overrides: [],
    linkedExceptions: ['EXC-901'],
    statusHistory: [
      { status: 'Requested', actor: 'Sarah Jenkins', timestamp: '2026-08-17T09:15:00Z', reason: 'Submitted Urgent Order' }
    ]
  }
];

let exceptions = [
  {
    id: 'EXC-901',
    requestId: 'REQ-2026-8801',
    storeId: 'STR-101',
    storeName: 'Grozo Market #101 (Downtown)',
    sku: 'MILK-ORG-1G',
    productName: 'Organic Whole Milk 1 Gal',
    type: 'Stockout Risk & Delayed Review',
    severity: 'Critical',
    owner: 'Mark Taylor (Planner)',
    dueTime: '2026-08-17T14:00:00Z',
    status: 'Open',
    nextAction: 'Approve urgent request or expedite pick'
  }
];

let auditLogs = [
  { id: 'AUD-1001', timestamp: '2026-08-17T09:15:00Z', actor: 'Sarah Jenkins', role: 'Store Manager', action: 'Submit Request', requestId: 'REQ-2026-8801', previousStatus: 'Draft', newStatus: 'Requested', details: 'Submitted urgent replenishment request' }
];

let freshness = [
  { sourceName: 'Store POS Real-time Sales Feed', lastReceived: '2026-08-17T13:30:00Z', expectedIntervalMinutes: 15, status: 'Current' },
  { sourceName: 'Warehouse WMS Inventory Snapshot', lastReceived: '2026-08-17T13:10:00Z', expectedIntervalMinutes: 30, status: 'Current' },
  { sourceName: 'Logistics Fleet GPS Dispatch Tracking', lastReceived: '2026-08-17T12:00:00Z', expectedIntervalMinutes: 60, status: 'Delayed' },
  { sourceName: 'ERP Master Product & Store Catalog', lastReceived: '2026-08-17T00:00:00Z', expectedIntervalMinutes: 1440, status: 'Current' }
];

const logAudit = (actor, role, action, requestId, previousStatus, newStatus, details) => {
  auditLogs.unshift({
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor,
    role,
    action,
    requestId,
    previousStatus,
    newStatus,
    details
  });
};

// =====================================
// AUTHENTICATION API ENDPOINTS (RBAC)
// =====================================

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  // Find user by email or fallback to role matching for demo
  const user = USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase() || (role && u.role === role));

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials or user not registered.' });
  }

  // Create audit record
  logAudit(user.name, user.roleLabel, 'User Login', 'N/A', 'Logged Out', 'Authenticated', `User logged in from Web Client via REST API`);

  return res.json({
    success: true,
    message: `Authentication successful. Welcome ${user.name}!`,
    token: user.token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      roleLabel: user.roleLabel,
      storeId: user.storeId,
      storeName: user.storeName,
      avatar: user.avatar,
      badgeColor: user.badgeColor
    }
  });
});

// GET /api/auth/me (Validate session)
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : '';

  const user = USERS_DB.find(u => u.token === token) || USERS_DB[0];
  res.json({ success: true, user });
});

// =====================================
// DOMAIN DATA ENDPOINTS
// =====================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'Grozo Backend API', timestamp: new Date().toISOString() });
});

app.get('/api/stores', (req, res) => {
  res.json(stores);
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/requests', (req, res) => {
  const { storeId, status, priority } = req.query;
  let result = [...requests];

  if (storeId && storeId !== 'ALL') result = result.filter(r => r.storeId === storeId);
  if (status && status !== 'ALL') result = result.filter(r => r.status === status);
  if (priority && priority !== 'ALL') result = result.filter(r => r.priority === priority);

  res.json(result);
});

app.post('/api/requests', (req, res) => {
  const newReqData = req.body;
  const reqId = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newReq = {
    id: reqId,
    storeId: newReqData.storeId || 'STR-101',
    storeName: newReqData.storeName || 'Grozo Store',
    region: 'East Region',
    requesterName: newReqData.requesterName || 'Store Manager',
    status: newReqData.isDraft ? 'Draft' : 'Requested',
    priority: newReqData.priority || 'Standard',
    urgencyReason: newReqData.urgencyReason || '',
    creationTime: new Date().toISOString(),
    needByTime: newReqData.needByTime || new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    lastUpdatedTime: new Date().toISOString(),
    lastUpdatedSource: 'Backend API Server',
    lines: newReqData.lines || [],
    overrides: [],
    linkedExceptions: [],
    statusHistory: [
      { status: newReqData.isDraft ? 'Draft' : 'Requested', actor: 'Store Manager', timestamp: new Date().toISOString(), reason: 'Created via REST API' }
    ]
  };

  requests.unshift(newReq);
  logAudit('Store Manager', 'Store Manager', newReqData.isDraft ? 'Create Draft' : 'Submit Request', reqId, 'None', newReq.status, 'Created via API');

  res.status(201).json(newReq);
});

app.put('/api/requests/:id/status', (req, res) => {
  const { id } = req.params;
  const { newStatus, actor = 'System User', role = 'User', reason = 'Status updated', shipmentRef = '' } = req.body;

  const reqObj = requests.find(r => r.id === id);
  if (!reqObj) {
    return res.status(404).json({ error: 'Request not found' });
  }

  const prevStatus = reqObj.status;
  reqObj.status = newStatus;
  reqObj.lastUpdatedTime = new Date().toISOString();
  if (shipmentRef) reqObj.shipmentRef = shipmentRef;

  reqObj.statusHistory.push({
    status: newStatus,
    actor,
    timestamp: new Date().toISOString(),
    reason
  });

  logAudit(actor, role, `Update Status to ${newStatus}`, id, prevStatus, newStatus, reason);
  res.json(reqObj);
});

app.get('/api/exceptions', (req, res) => {
  res.json(exceptions);
});

app.put('/api/exceptions/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { resolutionReason = 'Resolved' } = req.body;

  const exc = exceptions.find(e => e.id === id);
  if (!exc) return res.status(404).json({ error: 'Exception not found' });

  exc.status = 'Resolved';
  exc.resolutionReason = resolutionReason;

  res.json(exc);
});

app.get('/api/audit-logs', (req, res) => {
  res.json(auditLogs);
});

app.get('/api/freshness', (req, res) => {
  res.json(freshness);
});

app.listen(PORT, () => {
  console.log(`\n🚀 Grozo Express Backend API running on http://localhost:${PORT}`);
  console.log(`🔑 Auth Endpoints: POST /api/auth/login, GET /api/auth/me`);
  console.log(`📋 Domain Endpoints: /api/requests, /api/stores, /api/products, /api/exceptions, /api/audit-logs\n`);
});
