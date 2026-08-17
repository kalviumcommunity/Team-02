export const INITIAL_STORES = [
  { id: 'STR-101', code: '101', name: 'Grozo Market #101 (Downtown)', region: 'East Region', manager: 'Sarah Jenkins', riskScore: 88, activeRequests: 5 },
  { id: 'STR-104', code: '104', name: 'Grozo Supercenter #104 (Suburbs)', region: 'East Region', manager: 'David Ross', riskScore: 42, activeRequests: 3 },
  { id: 'STR-205', code: '205', name: 'Grozo Express #205 (Westside)', region: 'West Region', manager: 'Elena Rostova', riskScore: 92, activeRequests: 6 },
  { id: 'STR-302', code: '302', name: 'Grozo Fresh Hub #302 (Metro)', region: 'Central Region', manager: 'Marcus Vance', riskScore: 65, activeRequests: 4 },
  { id: 'STR-409', code: '409', name: 'Grozo Market #409 (North)', region: 'Central Region', manager: 'Anita Roy', riskScore: 15, activeRequests: 1 },
];

export const INITIAL_PRODUCTS = [
  { id: 'SKU-8821', sku: 'MILK-ORG-1G', name: 'Organic Whole Milk 1 Gal', category: 'Dairy & Eggs', unitOfMeasure: 'Cases (6/cs)', velocityTier: 'Tier A (Fast-Moving)', criticality: 'Essential Strategic', currentStoreStock: 12, salesVelocityPerHour: 3.5, warehouseAvailable: 240, presentationMin: 20 },
  { id: 'SKU-9902', sku: 'BANANA-ORG-3L', name: 'Organic Bananas 3 lb Bag', category: 'Produce', unitOfMeasure: 'Cases (10/cs)', velocityTier: 'Tier A (Fast-Moving)', criticality: 'High Demand', currentStoreStock: 8, salesVelocityPerHour: 4.2, warehouseAvailable: 180, presentationMin: 15 },
  { id: 'SKU-4412', sku: 'AVO-HAAS-4C', name: 'Haas Avocados Mesh Bag 4ct', category: 'Produce', unitOfMeasure: 'Cases (12/cs)', velocityTier: 'Tier A (Fast-Moving)', criticality: 'High Demand', currentStoreStock: 5, salesVelocityPerHour: 2.1, warehouseAvailable: 95, presentationMin: 10 },
  { id: 'SKU-1104', sku: 'EGGS-LARGE-12', name: 'Grade A Large White Eggs 12ct', category: 'Dairy & Eggs', unitOfMeasure: 'Cases (15/cs)', velocityTier: 'Tier A (Fast-Moving)', criticality: 'Essential Strategic', currentStoreStock: 18, salesVelocityPerHour: 2.8, warehouseAvailable: 310, presentationMin: 25 },
  { id: 'SKU-3320', sku: 'BREAD-SOUR-1L', name: 'Artisan Sourdough Loaf 24oz', category: 'Bakery', unitOfMeasure: 'Cases (8/cs)', velocityTier: 'Tier B (Medium-Velocity)', criticality: 'Standard', currentStoreStock: 6, salesVelocityPerHour: 1.1, warehouseAvailable: 60, presentationMin: 8 },
  { id: 'SKU-7751', sku: 'CHICKEN-ROT-1U', name: 'Fresh Rotisserie Whole Chicken', category: 'Prepared Foods', unitOfMeasure: 'Units', velocityTier: 'Tier A (Fast-Moving)', criticality: 'High Demand', currentStoreStock: 4, salesVelocityPerHour: 2.5, warehouseAvailable: 40, presentationMin: 10 },
  { id: 'SKU-6623', sku: 'WATER-SPRING-24', name: 'Natural Spring Water 24pk', category: 'Beverages', unitOfMeasure: 'Pallets (40/pl)', velocityTier: 'Tier A (Fast-Moving)', criticality: 'Essential Strategic', currentStoreStock: 2, salesVelocityPerHour: 0.8, warehouseAvailable: 50, presentationMin: 5 },
  { id: 'SKU-5540', sku: 'DIAPER-SZ3-80', name: 'Comfort Care Diapers Size 3 80ct', category: 'Baby Care', unitOfMeasure: 'Cases (4/cs)', velocityTier: 'Tier B (Medium-Velocity)', criticality: 'High Demand', currentStoreStock: 3, salesVelocityPerHour: 0.4, warehouseAvailable: 85, presentationMin: 6 },
];

export const INITIAL_REQUESTS = [
  {
    id: 'REQ-2026-8801',
    storeId: 'STR-101',
    storeName: 'Grozo Market #101 (Downtown)',
    region: 'East Region',
    requesterName: 'Sarah Jenkins (Store Mgr)',
    status: 'Requested',
    priority: 'Urgent',
    urgencyReason: 'Stockout imminent before evening peak rush. Sales velocity spiked +40%.',
    creationTime: '2026-08-17T09:15:00Z',
    needByTime: '2026-08-17T16:00:00Z',
    lastUpdatedTime: '2026-08-17T09:15:00Z',
    lastUpdatedSource: 'Store POS / App',
    lines: [
      { id: 'L-1', productId: 'SKU-8821', sku: 'MILK-ORG-1G', productName: 'Organic Whole Milk 1 Gal', requestedQty: 30, approvedQty: 0, allocatedQty: 0, dispatchedQty: 0, receivedQty: 0, unitOfMeasure: 'Cases (6/cs)', stockoutHours: 3.4, riskLevel: 'Critical', riskReason: 'Critical risk: projected stock hits 0 in 3.4h, pending approval, Tier A SKU' },
      { id: 'L-2', productId: 'SKU-1104', sku: 'EGGS-LARGE-12', productName: 'Grade A Large White Eggs 12ct', requestedQty: 25, approvedQty: 0, allocatedQty: 0, dispatchedQty: 0, receivedQty: 0, unitOfMeasure: 'Cases (15/cs)', stockoutHours: 6.4, riskLevel: 'High', riskReason: 'High risk: stock below presentation min (18/25), Tier A Essential' }
    ],
    overrides: [],
    linkedExceptions: ['EXC-901'],
    statusHistory: [
      { status: 'Draft', actor: 'Sarah Jenkins', timestamp: '2026-08-17T09:00:00Z', reason: 'Draft created' },
      { status: 'Requested', actor: 'Sarah Jenkins', timestamp: '2026-08-17T09:15:00Z', reason: 'Submitted as Urgent Replenishment' }
    ]
  },
  {
    id: 'REQ-2026-8802',
    storeId: 'STR-205',
    storeName: 'Grozo Express #205 (Westside)',
    region: 'West Region',
    requesterName: 'Elena Rostova (Inventory Lead)',
    status: 'Approved',
    priority: 'Urgent',
    urgencyReason: 'Rotisserie Chicken inventory depleted due to local event promo.',
    creationTime: '2026-08-17T08:30:00Z',
    needByTime: '2026-08-17T15:00:00Z',
    lastUpdatedTime: '2026-08-17T10:00:00Z',
    lastUpdatedSource: 'Planner Console',
    lines: [
      { id: 'L-3', productId: 'SKU-7751', sku: 'CHICKEN-ROT-1U', productName: 'Fresh Rotisserie Whole Chicken', requestedQty: 30, approvedQty: 30, allocatedQty: 0, dispatchedQty: 0, receivedQty: 0, unitOfMeasure: 'Units', stockoutHours: 1.6, riskLevel: 'Critical', riskReason: 'Critical risk: 1.6 hours stock left, approved, awaiting warehouse picking' }
    ],
    overrides: [],
    linkedExceptions: [],
    statusHistory: [
      { status: 'Requested', actor: 'Elena Rostova', timestamp: '2026-08-17T08:30:00Z', reason: 'Submitted request' },
      { status: 'Under Review', actor: 'Mark Taylor (Planner)', timestamp: '2026-08-17T09:45:00Z', reason: 'Planner reviewing warehouse stock' },
      { status: 'Approved', actor: 'Mark Taylor (Planner)', timestamp: '2026-08-17T10:00:00Z', reason: 'Approved full qty (30 Units)' }
    ]
  },
  {
    id: 'REQ-2026-8803',
    storeId: 'STR-101',
    storeName: 'Grozo Market #101 (Downtown)',
    region: 'East Region',
    requesterName: 'Sarah Jenkins',
    status: 'Picking',
    priority: 'Standard',
    urgencyReason: '',
    creationTime: '2026-08-17T07:00:00Z',
    needByTime: '2026-08-17T18:00:00Z',
    lastUpdatedTime: '2026-08-17T11:20:00Z',
    lastUpdatedSource: 'WMS Warehouse App',
    lines: [
      { id: 'L-4', productId: 'SKU-9902', sku: 'BANANA-ORG-3L', productName: 'Organic Bananas 3 lb Bag', requestedQty: 40, approvedQty: 40, allocatedQty: 40, dispatchedQty: 0, receivedQty: 0, unitOfMeasure: 'Cases (10/cs)', stockoutHours: 4.8, riskLevel: 'Medium', riskReason: 'In process: picking started at central warehouse' }
    ],
    overrides: [],
    linkedExceptions: [],
    statusHistory: [
      { status: 'Requested', actor: 'Sarah Jenkins', timestamp: '2026-08-17T07:00:00Z', reason: 'Standard replenishment' },
      { status: 'Approved', actor: 'Mark Taylor', timestamp: '2026-08-17T08:10:00Z', reason: 'Approved' },
      { status: 'Allocated', actor: 'Warehouse System', timestamp: '2026-08-17T09:00:00Z', reason: 'Stock allocated in Zone A-4' },
      { status: 'Picking', actor: 'Jim Carter (Warehouse)', timestamp: '2026-08-17T11:20:00Z', reason: 'Picking in progress' }
    ]
  },
  {
    id: 'REQ-2026-8804',
    storeId: 'STR-302',
    storeName: 'Grozo Fresh Hub #302 (Metro)',
    region: 'Central Region',
    requesterName: 'Marcus Vance',
    status: 'Dispatched',
    priority: 'Standard',
    urgencyReason: '',
    creationTime: '2026-08-16T16:00:00Z',
    needByTime: '2026-08-17T14:00:00Z',
    lastUpdatedTime: '2026-08-17T11:00:00Z',
    lastUpdatedSource: 'Logistics Fleet GPS',
    shipmentRef: 'TRK-99201-EAST',
    carrier: 'Grozo Logistics Fleet #14',
    lines: [
      { id: 'L-5', productId: 'SKU-6623', sku: 'WATER-SPRING-24', productName: 'Natural Spring Water 24pk', requestedQty: 4, approvedQty: 4, allocatedQty: 4, dispatchedQty: 4, receivedQty: 0, unitOfMeasure: 'Pallets (40/pl)', stockoutHours: 12.0, riskLevel: 'Low', riskReason: 'In transit: ETA 1:30 PM today' }
    ],
    overrides: [],
    linkedExceptions: [],
    statusHistory: [
      { status: 'Requested', actor: 'Marcus Vance', timestamp: '2026-08-16T16:00:00Z', reason: 'Regular cycle order' },
      { status: 'Approved', actor: 'Mark Taylor', timestamp: '2026-08-16T17:30:00Z', reason: 'Approved' },
      { status: 'Dispatched', actor: 'Logistics Dispatch', timestamp: '2026-08-17T11:00:00Z', reason: 'Loaded on truck TRK-99201-EAST' }
    ]
  },
  {
    id: 'REQ-2026-8805',
    storeId: 'STR-205',
    storeName: 'Grozo Express #205 (Westside)',
    region: 'West Region',
    requesterName: 'Elena Rostova',
    status: 'Blocked',
    priority: 'Urgent',
    urgencyReason: 'Haas Avocados near zero shelf stock.',
    creationTime: '2026-08-17T06:30:00Z',
    needByTime: '2026-08-17T12:00:00Z',
    lastUpdatedTime: '2026-08-17T09:30:00Z',
    lastUpdatedSource: 'Warehouse WMS',
    lines: [
      { id: 'L-6', productId: 'SKU-4412', sku: 'AVO-HAAS-4C', productName: 'Haas Avocados Mesh Bag 4ct', requestedQty: 20, approvedQty: 20, allocatedQty: 5, dispatchedQty: 0, receivedQty: 0, unitOfMeasure: 'Cases (12/cs)', stockoutHours: 2.3, riskLevel: 'Critical', riskReason: 'Blocked: Short pick reported. Warehouse stock depleted.' }
    ],
    overrides: [{ field: 'priority', from: 'Standard', to: 'Urgent', actor: 'Elena Rostova', timestamp: '2026-08-17T06:30:00Z', reason: 'High demand weekend spike' }],
    linkedExceptions: ['EXC-902'],
    statusHistory: [
      { status: 'Requested', actor: 'Elena Rostova', timestamp: '2026-08-17T06:30:00Z', reason: 'Urgent request' },
      { status: 'Approved', actor: 'Mark Taylor', timestamp: '2026-08-17T07:15:00Z', reason: 'Approved full 20 cases' },
      { status: 'Blocked', actor: 'Jim Carter (Warehouse)', timestamp: '2026-08-17T09:30:00Z', reason: 'Short pick: Only 5 cases found in bin B-12. Remaining 15 unallocable.' }
    ]
  },
  {
    id: 'REQ-2026-8806',
    storeId: 'STR-104',
    storeName: 'Grozo Supercenter #104 (Suburbs)',
    region: 'East Region',
    requesterName: 'David Ross',
    status: 'Partially Fulfilled',
    priority: 'Standard',
    urgencyReason: '',
    creationTime: '2026-08-16T10:00:00Z',
    needByTime: '2026-08-17T10:00:00Z',
    lastUpdatedTime: '2026-08-17T10:30:00Z',
    lastUpdatedSource: 'Store Receiver POS',
    lines: [
      { id: 'L-7', productId: 'SKU-3320', sku: 'BREAD-SOUR-1L', productName: 'Artisan Sourdough Loaf 24oz', requestedQty: 20, approvedQty: 20, allocatedQty: 20, dispatchedQty: 20, receivedQty: 14, unitOfMeasure: 'Cases (8/cs)', stockoutHours: 18.0, riskLevel: 'Low', riskReason: 'Delivery received with discrepancy: 6 cases damaged in transit' }
    ],
    overrides: [],
    linkedExceptions: ['EXC-903'],
    statusHistory: [
      { status: 'Dispatched', actor: 'Warehouse', timestamp: '2026-08-16T18:00:00Z', reason: 'Dispatched' },
      { status: 'Partially Fulfilled', actor: 'David Ross (Store)', timestamp: '2026-08-17T10:30:00Z', reason: 'Received 14 of 20 cases. Reported 6 crushed cases.' }
    ]
  }
];

export const INITIAL_EXCEPTIONS = [
  {
    id: 'EXC-901',
    requestId: 'REQ-2026-8801',
    storeId: 'STR-101',
    storeName: 'Grozo Market #101 (Downtown)',
    sku: 'MILK-ORG-1G',
    productName: 'Organic Whole Milk 1 Gal',
    type: 'Stockout Risk & Delayed Review',
    severity: 'Critical',
    owner: 'Mark Taylor (Replenishment Planner)',
    dueTime: '2026-08-17T14:00:00Z',
    status: 'Open',
    nextAction: 'Review urgent request and approve partial or expedite warehouse pick.',
    resolutionReason: '',
    history: [
      { timestamp: '2026-08-17T09:15:00Z', actor: 'System Rule Engine', action: 'Created Exception: Projected stockout within 4h while request unapproved.' }
    ]
  },
  {
    id: 'EXC-902',
    requestId: 'REQ-2026-8806',
    storeId: 'STR-205',
    storeName: 'Grozo Express #205 (Westside)',
    sku: 'AVO-HAAS-4C',
    productName: 'Haas Avocados Mesh Bag 4ct',
    type: 'Warehouse Short Pick / Unallocable Stock',
    severity: 'High',
    owner: 'Jim Carter (Warehouse Lead)',
    dueTime: '2026-08-17T13:00:00Z',
    status: 'In Progress',
    nextAction: 'Check secondary warehouse location or arrange cross-store transfer from STR-409.',
    resolutionReason: '',
    history: [
      { timestamp: '2026-08-17T09:30:00Z', actor: 'Jim Carter', action: 'Created Exception: 15 cases short pick in Bin B-12' },
      { timestamp: '2026-08-17T10:15:00Z', actor: 'Mark Taylor', action: 'Acknowledged exception. Investigating cross-docking.' }
    ]
  },
  {
    id: 'EXC-903',
    requestId: 'REQ-2026-8806',
    storeId: 'STR-104',
    storeName: 'Grozo Supercenter #104 (Suburbs)',
    sku: 'BREAD-SOUR-1L',
    productName: 'Artisan Sourdough Loaf 24oz',
    type: 'Delivery Quantity Discrepancy',
    severity: 'Medium',
    owner: 'David Ross (Store Mgr)',
    dueTime: '2026-08-17T17:00:00Z',
    status: 'Acknowledged',
    nextAction: 'File carrier credit claim and generate replacement request for 6 cases.',
    resolutionReason: '',
    history: [
      { timestamp: '2026-08-17T10:30:00Z', actor: 'David Ross', action: 'Reported 6 cases crushed in transit' }
    ]
  }
];

export const INITIAL_FRESHNESS = [
  { sourceName: 'Store POS Real-time Sales Feed', lastReceived: '2026-08-17T13:30:00Z', expectedIntervalMinutes: 15, status: 'Current' },
  { sourceName: 'Warehouse WMS Inventory Snapshot', lastReceived: '2026-08-17T13:10:00Z', expectedIntervalMinutes: 30, status: 'Current' },
  { sourceName: 'Logistics Fleet GPS Dispatch Tracking', lastReceived: '2026-08-17T12:00:00Z', expectedIntervalMinutes: 60, status: 'Delayed' },
  { sourceName: 'ERP Master Product & Store Catalog', lastReceived: '2026-08-17T00:00:00Z', expectedIntervalMinutes: 1440, status: 'Current' },
];

export const INITIAL_AUDIT_LOG = [
  { id: 'AUD-1001', timestamp: '2026-08-17T09:15:00Z', actor: 'Sarah Jenkins', role: 'Store Manager', action: 'Submit Request', requestId: 'REQ-2026-8801', previousStatus: 'Draft', newStatus: 'Requested', details: 'Submitted urgent replenishment request for Organic Milk & Eggs.' },
  { id: 'AUD-1002', timestamp: '2026-08-17T10:00:00Z', actor: 'Mark Taylor', role: 'Replenishment Planner', action: 'Approve Request', requestId: 'REQ-2026-8802', previousStatus: 'Under Review', newStatus: 'Approved', details: 'Approved 30 units Rotisserie Chicken. Urgency validated.' },
  { id: 'AUD-1003', timestamp: '2026-08-17T11:20:00Z', actor: 'Jim Carter', role: 'Warehouse Dispatcher', action: 'Fulfillment Advance', requestId: 'REQ-2026-8803', previousStatus: 'Allocated', newStatus: 'Picking', details: 'Began picking 40 cases Organic Bananas in Zone A-4.' },
  { id: 'AUD-1004', timestamp: '2026-08-17T11:00:00Z', actor: 'Logistics Dispatch', role: 'Warehouse Dispatcher', action: 'Dispatch Shipment', requestId: 'REQ-2026-8804', previousStatus: 'Packed', newStatus: 'Dispatched', details: 'Dispatched on Fleet Truck #14 with shipment ref TRK-99201-EAST.' },
];
