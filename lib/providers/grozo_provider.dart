import 'package:flutter/material.dart';
import '../models/replenishment_request.dart';
import '../services/firebase_service.dart';

class GrozoProvider extends ChangeNotifier {
  final FirebaseService _firebaseService = FirebaseService();

  String _activeRole = 'store_manager';
  String _activeStoreId = 'STR-101';
  String _searchQuery = '';
  String _statusFilter = 'ALL';
  String _riskFilter = 'ALL';

  List<ReplenishmentRequest> _requests = [];
  List<ExceptionModel> _exceptions = [];

  String get activeRole => _activeRole;
  String get activeStoreId => _activeStoreId;
  String get searchQuery => _searchQuery;
  String get statusFilter => _statusFilter;
  String get riskFilter => _riskFilter;

  List<ReplenishmentRequest> get requests => _requests;
  List<ExceptionModel> get exceptions => _exceptions;

  GrozoProvider() {
    _initMockFallback();
  }

  void setActiveRole(String role) {
    _activeRole = role;
    notifyListeners();
  }

  void setActiveStoreId(String storeId) {
    _activeStoreId = storeId;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setStatusFilter(String filter) {
    _statusFilter = filter;
    notifyListeners();
  }

  void setRiskFilter(String filter) {
    _riskFilter = filter;
    notifyListeners();
  }

  // Action Methods
  Future<void> submitRequest({
    required String priority,
    required String urgencyReason,
    required String needByTime,
    required List<RequestLine> lines,
  }) async {
    final reqId = 'REQ-2026-${(1000 + (DateTime.now().millisecondsSinceEpoch % 8999))}';

    final newReq = ReplenishmentRequest(
      id: reqId,
      storeId: _activeStoreId,
      storeName: 'Grozo Market #101 (Downtown)',
      region: 'East Region',
      requesterName: 'Sarah Jenkins (Store Mgr)',
      status: 'Requested',
      priority: priority,
      urgencyReason: urgencyReason,
      creationTime: DateTime.now().toIso8601String(),
      needByTime: needByTime,
      lastUpdatedTime: DateTime.now().toIso8601String(),
      lastUpdatedSource: 'Flutter App',
      lines: lines,
      statusHistory: [
        StatusHistoryItem(
          status: 'Requested',
          actor: 'Sarah Jenkins',
          timestamp: DateTime.now().toIso8601String(),
          reason: 'Submitted replenishment request',
        ),
      ],
      linkedExceptions: [],
    );

    _requests.insert(0, newReq);
    notifyListeners();
  }

  Future<void> approveRequest(String requestId, Map<String, int> approvedQtyMap, String reason) async {
    final idx = _requests.indexWhere((r) => r.id == requestId);
    if (idx != -1) {
      _requests[idx].status = 'Approved';
      _requests[idx].lastUpdatedTime = DateTime.now().toIso8601String();
      _requests[idx].statusHistory.add(StatusHistoryItem(
        status: 'Approved',
        actor: 'Mark Taylor (Planner)',
        timestamp: DateTime.now().toIso8601String(),
        reason: reason,
      ));
      notifyListeners();
    }
  }

  Future<void> rejectRequest(String requestId, String reason) async {
    final idx = _requests.indexWhere((r) => r.id == requestId);
    if (idx != -1) {
      _requests[idx].status = 'Rejected';
      _requests[idx].statusHistory.add(StatusHistoryItem(
        status: 'Rejected',
        actor: 'Mark Taylor (Planner)',
        timestamp: DateTime.now().toIso8601String(),
        reason: reason,
      ));
      notifyListeners();
    }
  }

  Future<void> advanceFulfillment(String requestId, String newStatus, {String shipmentRef = ''}) async {
    final idx = _requests.indexWhere((r) => r.id == requestId);
    if (idx != -1) {
      _requests[idx].status = newStatus;
      if (shipmentRef.isNotEmpty) _requests[idx].shipmentRef = shipmentRef;
      _requests[idx].statusHistory.add(StatusHistoryItem(
        status: newStatus,
        actor: 'Jim Carter (Warehouse)',
        timestamp: DateTime.now().toIso8601String(),
        reason: 'Milestone advanced to $newStatus',
      ));
      notifyListeners();
    }
  }

  Future<void> recordBlocker(String requestId, String blockerReason) async {
    final idx = _requests.indexWhere((r) => r.id == requestId);
    if (idx != -1) {
      _requests[idx].status = 'Blocked';
      final excId = 'EXC-${(100 + (DateTime.now().millisecondsSinceEpoch % 899))}';
      _requests[idx].linkedExceptions.add(excId);
      
      _exceptions.insert(0, ExceptionModel(
        id: excId,
        requestId: requestId,
        storeId: _requests[idx].storeId,
        storeName: _requests[idx].storeName,
        sku: _requests[idx].lines.isNotEmpty ? _requests[idx].lines[0].sku : 'SKU-BLK',
        productName: _requests[idx].lines.isNotEmpty ? _requests[idx].lines[0].productName : 'Blocked Line',
        type: 'Fulfillment Blocker',
        severity: 'High',
        owner: 'Jim Carter',
        dueTime: DateTime.now().add(const Duration(hours: 4)).toIso8601String(),
        status: 'Open',
        nextAction: 'Re-allocate stock or arrange emergency transfer',
      ));
      notifyListeners();
    }
  }

  Future<void> confirmReceipt(String requestId, Map<String, int> receivedQtyMap, String discrepancyReason) async {
    final idx = _requests.indexWhere((r) => r.id == requestId);
    if (idx != -1) {
      final isDiscrepancy = discrepancyReason.isNotEmpty;
      _requests[idx].status = isDiscrepancy ? 'Partially Fulfilled' : 'Delivered';
      _requests[idx].statusHistory.add(StatusHistoryItem(
        status: _requests[idx].status,
        actor: 'Sarah Jenkins (Store)',
        timestamp: DateTime.now().toIso8601String(),
        reason: discrepancyReason.isEmpty ? 'Receipt confirmed' : discrepancyReason,
      ));
      notifyListeners();
    }
  }

  void _initMockFallback() {
    _requests = [
      ReplenishmentRequest(
        id: 'REQ-2026-8801',
        storeId: 'STR-101',
        storeName: 'Grozo Market #101 (Downtown)',
        region: 'East Region',
        requesterName: 'Sarah Jenkins (Store Mgr)',
        status: 'Requested',
        priority: 'Urgent',
        urgencyReason: 'Stockout imminent before evening peak. Sales velocity +40%.',
        creationTime: DateTime.now().subtract(const Duration(hours: 2)).toIso8601String(),
        needByTime: DateTime.now().add(const Duration(hours: 4)).toIso8601String(),
        lastUpdatedTime: DateTime.now().toIso8601String(),
        lastUpdatedSource: 'Firestore Live Stream',
        lines: [
          RequestLine(
            id: 'L-101',
            productId: 'SKU-8821',
            sku: 'MILK-ORG-1G',
            productName: 'Organic Whole Milk 1 Gal',
            requestedQty: 30,
            unitOfMeasure: 'Cases (6/cs)',
            stockoutHours: 3.4,
            riskLevel: 'Critical',
            riskReason: 'Critical risk: Projected store stock reaches 0 in 3.4 hours',
          ),
        ],
        statusHistory: [
          StatusHistoryItem(status: 'Requested', actor: 'Sarah Jenkins', timestamp: DateTime.now().toIso8601String(), reason: 'Submitted urgent order')
        ],
        linkedExceptions: ['EXC-901'],
      ),
      ReplenishmentRequest(
        id: 'REQ-2026-8802',
        storeId: 'STR-205',
        storeName: 'Grozo Express #205 (Westside)',
        region: 'West Region',
        requesterName: 'Elena Rostova',
        status: 'Picking',
        priority: 'Urgent',
        urgencyReason: 'High demand weekend promo.',
        creationTime: DateTime.now().subtract(const Duration(hours: 4)).toIso8601String(),
        needByTime: DateTime.now().add(const Duration(hours: 2)).toIso8601String(),
        lastUpdatedTime: DateTime.now().toIso8601String(),
        lastUpdatedSource: 'WMS Floor Scanner',
        lines: [
          RequestLine(
            id: 'L-102',
            productId: 'SKU-7751',
            sku: 'CHICKEN-ROT-1U',
            productName: 'Fresh Rotisserie Whole Chicken',
            requestedQty: 30,
            approvedQty: 30,
            allocatedQty: 30,
            unitOfMeasure: 'Units',
            stockoutHours: 1.8,
            riskLevel: 'Critical',
            riskReason: 'Critical risk: Picking on warehouse floor',
          ),
        ],
        statusHistory: [],
        linkedExceptions: [],
      ),
    ];

    _exceptions = [
      ExceptionModel(
        id: 'EXC-901',
        requestId: 'REQ-2026-8801',
        storeId: 'STR-101',
        storeName: 'Grozo Market #101 (Downtown)',
        sku: 'MILK-ORG-1G',
        productName: 'Organic Whole Milk 1 Gal',
        type: 'Stockout Risk & Delayed Approval',
        severity: 'Critical',
        owner: 'Mark Taylor (Planner)',
        dueTime: DateTime.now().add(const Duration(hours: 2)).toIso8601String(),
        status: 'Open',
        nextAction: 'Approve urgent request or expedite pick',
      ),
    ];
  }
}
