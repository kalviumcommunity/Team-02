import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_STORES, 
  INITIAL_PRODUCTS, 
  INITIAL_REQUESTS, 
  INITIAL_EXCEPTIONS, 
  INITIAL_FRESHNESS, 
  INITIAL_AUDIT_LOG 
} from '../data/mockData';
import { apiService } from '../services/apiService';

const AppContext = createContext();

export const DEMO_USERS = [
  {
    id: 'USR-101',
    email: 'sarah.jenkins@grozo.com',
    name: 'Sarah Jenkins',
    role: 'store_manager',
    roleLabel: 'Store Manager',
    storeId: 'STR-101',
    storeName: 'Grozo Market #101 (Downtown)',
    avatar: 'SJ',
    badgeColor: '#3b82f6',
    description: 'Manages store stock, submits replenishment orders & confirms deliveries.'
  },
  {
    id: 'USR-201',
    email: 'mark.taylor@grozo.com',
    name: 'Mark Taylor',
    role: 'replenishment_planner',
    roleLabel: 'Replenishment Planner',
    storeId: 'ALL',
    storeName: 'Central Planning Operations',
    avatar: 'MT',
    badgeColor: '#8b5cf6',
    description: 'Reviews approval queue, evaluates supply stock, approves/rejects orders.'
  },
  {
    id: 'USR-301',
    email: 'jim.carter@grozo.com',
    name: 'Jim Carter',
    role: 'warehouse_dispatcher',
    roleLabel: 'Warehouse Dispatcher',
    storeId: 'ALL',
    storeName: 'Central Warehouse WMS Zone A',
    avatar: 'JC',
    badgeColor: '#06b6d4',
    description: 'Executes picking, packing, dispatch fleet routing & blocker logging.'
  },
  {
    id: 'USR-401',
    email: 'alex.morgan@grozo.com',
    name: 'Alex Morgan',
    role: 'regional_manager',
    roleLabel: 'Regional Operations Mgr',
    storeId: 'ALL',
    storeName: 'East & West Region Ops',
    avatar: 'AM',
    badgeColor: '#f59e0b',
    description: 'Monitors lifecycle funnels, store risk indexes & active exception tickets.'
  },
  {
    id: 'USR-501',
    email: 'admin@grozo.com',
    name: 'System Admin',
    role: 'sys_admin',
    roleLabel: 'System Administrator',
    storeId: 'ALL',
    storeName: 'Enterprise Governance',
    avatar: 'SA',
    badgeColor: '#ef4444',
    description: 'Configures SLA thresholds, batch data ingestion & audit trail logs.'
  }
];

export const AppProvider = ({ children }) => {
  // Theme State: 'light' | 'dark' (Defaulting to Light Theme as requested)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('grozo_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('grozo_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Current Authenticated User (null if logged out)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('grozo_current_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0];
  });

  const [activeRole, setActiveRole] = useState(() => {
    return currentUser ? currentUser.role : 'store_manager';
  });

  const [activeStoreId, setActiveStoreId] = useState(() => {
    return currentUser ? currentUser.storeId : 'STR-101';
  });

  // State entities
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('grozo_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [exceptions, setExceptions] = useState(() => {
    const saved = localStorage.getItem('grozo_exceptions');
    return saved ? JSON.parse(saved) : INITIAL_EXCEPTIONS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('grozo_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [stores] = useState(INITIAL_STORES);

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('grozo_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOG;
  });

  const [freshness, setFreshness] = useState(() => {
    const saved = localStorage.getItem('grozo_freshness');
    return saved ? JSON.parse(saved) : INITIAL_FRESHNESS;
  });

  const [toast, setToast] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Persistence
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('grozo_current_user', JSON.stringify(currentUser));
      localStorage.setItem('grozo_role', currentUser.role);
    } else {
      localStorage.removeItem('grozo_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('grozo_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('grozo_exceptions', JSON.stringify(exceptions));
  }, [exceptions]);

  useEffect(() => {
    localStorage.setItem('grozo_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('grozo_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Auth RBAC Actions with Backend Integration
  const login = async (email, password, selectedRole = 'store_manager') => {
    const apiResult = await apiService.login(email, password, selectedRole);

    if (apiResult && apiResult.success) {
      setCurrentUser(apiResult.user);
      setActiveRole(apiResult.user.role);
      if (apiResult.user.storeId !== 'ALL') setActiveStoreId(apiResult.user.storeId);
      showToast(`Authenticated via Express API: Welcome ${apiResult.user.name}!`);
      return;
    }

    const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() || u.role === selectedRole);
    const userObj = foundUser || {
      id: `USR-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: selectedRole,
      roleLabel: selectedRole.replace('_', ' ').toUpperCase(),
      storeId: activeStoreId,
      storeName: 'Grozo Store',
      avatar: email.substring(0, 2).toUpperCase(),
      badgeColor: '#6366f1',
      description: 'Authenticated User'
    };

    setCurrentUser(userObj);
    setActiveRole(userObj.role);
    if (userObj.storeId !== 'ALL') setActiveStoreId(userObj.storeId);
    showToast(`Welcome back, ${userObj.name}! Authenticated as ${userObj.roleLabel}.`);
  };

  const quickLoginAs = async (userObj) => {
    await login(userObj.email, 'password123', userObj.role);
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out of Grozo Control Tower.', 'info');
  };

  const logAudit = (actor, role, action, requestId, previousStatus, newStatus, details) => {
    const newLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      role,
      action,
      requestId,
      previousStatus,
      newStatus,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const getActorName = () => {
    return currentUser ? currentUser.name : 'System User';
  };

  // Request Actions
  const createRequest = async (newReq) => {
    const reqId = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const storeObj = stores.find(s => s.id === (newReq.storeId || activeStoreId)) || stores[0];

    const formattedRequest = {
      id: reqId,
      storeId: storeObj.id,
      storeName: storeObj.name,
      region: storeObj.region,
      requesterName: getActorName(),
      status: newReq.isDraft ? 'Draft' : 'Requested',
      priority: newReq.priority || 'Standard',
      urgencyReason: newReq.urgencyReason || '',
      creationTime: new Date().toISOString(),
      needByTime: newReq.needByTime || new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      lastUpdatedTime: new Date().toISOString(),
      lastUpdatedSource: 'Store POS / App',
      lines: newReq.lines.map((l, idx) => {
        const prod = products.find(p => p.id === l.productId) || {};
        const hoursLeft = prod.salesVelocityPerHour > 0 ? (prod.currentStoreStock / prod.salesVelocityPerHour).toFixed(1) : 24.0;
        let risk = 'Low';
        if (hoursLeft < 4) risk = 'Critical';
        else if (hoursLeft < 8) risk = 'High';
        else if (hoursLeft < 16) risk = 'Medium';

        return {
          id: `L-${Date.now()}-${idx}`,
          productId: l.productId,
          sku: prod.sku || l.sku || 'SKU-UNKNOWN',
          productName: prod.name || l.productName,
          requestedQty: Number(l.requestedQty),
          approvedQty: 0,
          allocatedQty: 0,
          dispatchedQty: 0,
          receivedQty: 0,
          unitOfMeasure: prod.unitOfMeasure || 'Cases',
          stockoutHours: Number(hoursLeft),
          riskLevel: risk,
          riskReason: `${risk} risk: projected store stock reaches 0 in ${hoursLeft}h (${prod.velocityTier || 'Tier A'})`
        };
      }),
      overrides: [],
      linkedExceptions: [],
      statusHistory: [
        { status: newReq.isDraft ? 'Draft' : 'Requested', actor: getActorName(), timestamp: new Date().toISOString(), reason: newReq.isDraft ? 'Draft created' : 'Request submitted' }
      ]
    };

    await apiService.createRequest(formattedRequest);
    setRequests(prev => [formattedRequest, ...prev]);
    logAudit(getActorName(), activeRole, newReq.isDraft ? 'Create Draft' : 'Submit Request', reqId, 'None', formattedRequest.status, `Created ${formattedRequest.priority} request`);
    showToast(`Request ${reqId} successfully ${newReq.isDraft ? 'saved as Draft' : 'submitted for approval'}!`);
  };

  const approveRequest = async (requestId, approvedLinesMap, reason = 'Approved by planner') => {
    await apiService.updateStatus(requestId, 'Approved', reason, getActorName(), activeRole);

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      const prevStatus = req.status;

      let isPartial = false;
      const updatedLines = req.lines.map(line => {
        const approvedQty = Number(approvedLinesMap[line.id] !== undefined ? approvedLinesMap[line.id] : line.requestedQty);
        if (approvedQty < line.requestedQty) isPartial = true;
        return { ...line, approvedQty };
      });

      const newStatus = isPartial ? 'Partially Approved' : 'Approved';
      logAudit(getActorName(), activeRole, isPartial ? 'Partially Approve' : 'Full Approve', req.id, prevStatus, newStatus, reason);

      return {
        ...req,
        status: newStatus,
        lastUpdatedTime: new Date().toISOString(),
        lastUpdatedSource: 'Planner Console',
        lines: updatedLines,
        statusHistory: [
          ...req.statusHistory,
          { status: newStatus, actor: getActorName(), timestamp: new Date().toISOString(), reason }
        ]
      };
    }));
    showToast(`Request ${requestId} status updated!`);
  };

  const rejectRequest = async (requestId, reason) => {
    await apiService.updateStatus(requestId, 'Rejected', reason, getActorName(), activeRole);

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      logAudit(getActorName(), activeRole, 'Reject Request', req.id, req.status, 'Rejected', reason);
      return {
        ...req,
        status: 'Rejected',
        lastUpdatedTime: new Date().toISOString(),
        lastUpdatedSource: 'Planner Console',
        statusHistory: [
          ...req.statusHistory,
          { status: 'Rejected', actor: getActorName(), timestamp: new Date().toISOString(), reason }
        ]
      };
    }));
    showToast(`Request ${requestId} rejected.`, 'error');
  };

  const advanceFulfillment = async (requestId, targetStatus, shipmentRef = '') => {
    await apiService.updateStatus(requestId, targetStatus, `Advanced to ${targetStatus}`, getActorName(), activeRole, shipmentRef);

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      const prevStatus = req.status;

      const updatedLines = req.lines.map(line => {
        if (targetStatus === 'Allocated') return { ...line, allocatedQty: line.approvedQty };
        if (targetStatus === 'Dispatched') return { ...line, dispatchedQty: line.allocatedQty };
        return line;
      });

      logAudit(getActorName(), activeRole, `Advance to ${targetStatus}`, req.id, prevStatus, targetStatus, shipmentRef ? `Shipment Ref: ${shipmentRef}` : `Milestone updated`);

      return {
        ...req,
        status: targetStatus,
        shipmentRef: shipmentRef || req.shipmentRef,
        carrier: shipmentRef ? 'Grozo Logistics Fleet' : req.carrier,
        lastUpdatedTime: new Date().toISOString(),
        lastUpdatedSource: 'Warehouse WMS',
        lines: updatedLines,
        statusHistory: [
          ...req.statusHistory,
          { status: targetStatus, actor: getActorName(), timestamp: new Date().toISOString(), reason: shipmentRef ? `Dispatched via ${shipmentRef}` : `Advanced to ${targetStatus}` }
        ]
      };
    }));
    showToast(`Request ${requestId} advanced to ${targetStatus}!`);
  };

  const recordBlocker = async (requestId, blockerReason) => {
    await apiService.updateStatus(requestId, 'Blocked', blockerReason, getActorName(), activeRole);
    const excId = `EXC-${Math.floor(100 + Math.random() * 900)}`;

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      logAudit(getActorName(), activeRole, 'Flag Blocker', req.id, req.status, 'Blocked', blockerReason);

      return {
        ...req,
        status: 'Blocked',
        lastUpdatedTime: new Date().toISOString(),
        lastUpdatedSource: 'Warehouse WMS',
        linkedExceptions: [...req.linkedExceptions, excId],
        statusHistory: [
          ...req.statusHistory,
          { status: 'Blocked', actor: getActorName(), timestamp: new Date().toISOString(), reason: blockerReason }
        ]
      };
    }));

    const reqObj = requests.find(r => r.id === requestId);
    const newExc = {
      id: excId,
      requestId,
      storeId: reqObj ? reqObj.storeId : 'STR-101',
      storeName: reqObj ? reqObj.storeName : 'Store',
      sku: reqObj && reqObj.lines[0] ? reqObj.lines[0].sku : 'SKU-MULTIPLE',
      productName: reqObj && reqObj.lines[0] ? reqObj.lines[0].productName : 'Multiple Lines',
      type: 'Fulfillment Blocker / Short Pick',
      severity: 'High',
      owner: getActorName(),
      dueTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      status: 'Open',
      nextAction: 'Re-allocate from backup stock or transfer inventory',
      resolutionReason: '',
      history: [{ timestamp: new Date().toISOString(), actor: getActorName(), action: `Created Blocker Exception: ${blockerReason}` }]
    };

    setExceptions(prev => [newExc, ...prev]);
    showToast(`Blocker logged for ${requestId}. Exception ${excId} opened.`, 'warning');
  };

  const confirmReceipt = async (requestId, receivedQtyMap, discrepancyReason = '') => {
    const isDiscrepancy = discrepancyReason.isNotEmpty;
    const newStatus = isDiscrepancy ? 'Partially Fulfilled' : 'Delivered';
    await apiService.updateStatus(requestId, newStatus, discrepancyReason || 'Receipt confirmed', getActorName(), activeRole);

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;

      const updatedLines = req.lines.map(line => {
        const receivedQty = Number(receivedQtyMap[line.id] !== undefined ? receivedQtyMap[line.id] : line.dispatchedQty);
        return { ...line, receivedQty };
      });

      logAudit(getActorName(), activeRole, isDiscrepancy ? 'Report Delivery Discrepancy' : 'Confirm Full Receipt', req.id, req.status, newStatus, discrepancyReason || 'Received full shipment');

      return {
        ...req,
        status: newStatus,
        lastUpdatedTime: new Date().toISOString(),
        lastUpdatedSource: 'Store POS / App',
        lines: updatedLines,
        statusHistory: [
          ...req.statusHistory,
          { status: newStatus, actor: getActorName(), timestamp: new Date().toISOString(), reason: discrepancyReason || 'Receipt confirmed' }
        ]
      };
    }));
    showToast(`Receipt confirmed for ${requestId}!`);
  };

  const overridePriority = (requestId, newPriority, reason) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      logAudit(getActorName(), activeRole, 'Override Priority', req.id, req.priority, newPriority, reason);

      return {
        ...req,
        priority: newPriority,
        overrides: [
          ...req.overrides,
          { field: 'priority', from: req.priority, to: newPriority, actor: getActorName(), timestamp: new Date().toISOString(), reason }
        ]
      };
    }));
    showToast(`Priority overridden to ${newPriority} for ${requestId}`);
  };

  const resolveException = (exceptionId, resolutionReason) => {
    setExceptions(prev => prev.map(exc => {
      if (exc.id !== exceptionId) return exc;
      return {
        ...exc,
        status: 'Resolved',
        resolutionReason,
        history: [
          ...exc.history,
          { timestamp: new Date().toISOString(), actor: getActorName(), action: `Resolved Exception: ${resolutionReason}` }
        ]
      };
    }));
    showToast(`Exception ${exceptionId} resolved!`);
  };

  const resetData = () => {
    setRequests(INITIAL_REQUESTS);
    setExceptions(INITIAL_EXCEPTIONS);
    setProducts(INITIAL_PRODUCTS);
    setAuditLogs(INITIAL_AUDIT_LOG);
    setFreshness(INITIAL_FRESHNESS);
    setCurrentUser(DEMO_USERS[0]);
    localStorage.clear();
    showToast('Reset all data to baseline PRD mock dataset.', 'info');
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      currentUser,
      login,
      quickLoginAs,
      logout,
      activeRole,
      setActiveRole,
      activeStoreId,
      setActiveStoreId,
      requests,
      exceptions,
      products,
      stores,
      auditLogs,
      freshness,
      toast,
      showToast,
      searchQuery,
      setSearchQuery,
      statusFilter,
      setStatusFilter,
      priorityFilter,
      setPriorityFilter,
      riskFilter,
      setRiskFilter,
      createRequest,
      approveRequest,
      rejectRequest,
      advanceFulfillment,
      recordBlocker,
      confirmReceipt,
      overridePriority,
      resolveException,
      resetData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
