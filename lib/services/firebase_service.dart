import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/replenishment_request.dart';

class FirebaseService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Stream of Replenishment Requests from Cloud Firestore
  Stream<List<ReplenishmentRequest>> streamRequests() {
    return _db.collection('requests').orderBy('creationTime', descending: true).snapshots().map((snapshot) {
      return snapshot.docs.map((doc) => ReplenishmentRequest.fromMap(doc.data(), doc.id)).toList();
    });
  }

  // Stream of Active Exceptions
  Stream<List<ExceptionModel>> streamExceptions() {
    return _db.collection('exceptions').snapshots().map((snapshot) {
      return snapshot.docs.map((doc) => ExceptionModel.fromMap(doc.data(), doc.id)).toList();
    });
  }

  // Add new Replenishment Request to Firestore
  Future<void> createRequest(ReplenishmentRequest request) async {
    await _db.collection('requests').doc(request.id).set(request.toMap());
    await _logAudit(
      actor: request.requesterName,
      role: 'Store Manager',
      action: 'Submit Request',
      requestId: request.id,
      prevStatus: 'None',
      newStatus: request.status,
      details: 'Created ${request.priority} request with ${request.lines.length} lines via Cloud Firestore',
    );
  }

  // Update Status Transaction (Approvals, Warehouse Advancement, Delivery)
  Future<void> updateStatus({
    required String requestId,
    required String newStatus,
    required String actor,
    required String role,
    required String reason,
    Map<String, int>? updatedLineQuantities,
    String shipmentRef = '',
  }) async {
    final docRef = _db.collection('requests').doc(requestId);

    await _db.runTransaction((transaction) async {
      final snapshot = await transaction.get(docRef);
      if (!snapshot.exists) return;

      final data = snapshot.data()!;
      final prevStatus = data['status'] as String;
      final linesData = List<Map<String, dynamic>>.from(data['lines'] ?? []);

      // Update Line Quantities if passed
      if (updatedLineQuantities != null) {
        for (var line in linesData) {
          final lineId = line['id'];
          if (updatedLineQuantities.containsKey(lineId)) {
            final val = updatedLineQuantities[lineId]!;
            if (newStatus == 'Approved' || newStatus == 'Partially Approved') {
              line['approvedQty'] = val;
            } else if (newStatus == 'Allocated') {
              line['allocatedQty'] = val;
            } else if (newStatus == 'Dispatched') {
              line['dispatchedQty'] = val;
            } else if (newStatus == 'Delivered' || newStatus == 'Partially Fulfilled') {
              line['receivedQty'] = val;
            }
          }
        }
      }

      final statusHistory = List<Map<String, dynamic>>.from(data['statusHistory'] ?? []);
      statusHistory.add({
        'status': newStatus,
        'actor': actor,
        'timestamp': DateTime.now().toIso8601String(),
        'reason': reason,
      });

      transaction.update(docRef, {
        'status': newStatus,
        'lastUpdatedTime': DateTime.now().toIso8601String(),
        'lastUpdatedSource': 'Cloud Firestore',
        if (shipmentRef.isNotEmpty) 'shipmentRef': shipmentRef,
        'lines': linesData,
        'statusHistory': statusHistory,
      });

      await _logAudit(
        actor: actor,
        role: role,
        action: 'Update Status to $newStatus',
        requestId: requestId,
        prevStatus: prevStatus,
        newStatus: newStatus,
        details: reason,
      );
    });
  }

  // Create Exception Ticket in Firestore
  Future<void> createException(ExceptionModel exception) async {
    await _db.collection('exceptions').doc(exception.id).set(exception.toMap());
  }

  // Log Audit Event
  Future<void> _logAudit({
    required String actor,
    required String role,
    required String action,
    required String requestId,
    required String prevStatus,
    required String newStatus,
    required String details,
  }) async {
    final auditRef = _db.collection('audit_logs').doc();
    await auditRef.set({
      'id': auditRef.id,
      'timestamp': DateTime.now().toIso8601String(),
      'actor': actor,
      'role': role,
      'action': action,
      'requestId': requestId,
      'previousStatus': prevStatus,
      'newStatus': newStatus,
      'details': details,
    });
  }
}
