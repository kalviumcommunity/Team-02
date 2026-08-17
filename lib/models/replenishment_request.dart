import 'package:flutter/foundation.dart';

class RequestLine {
  final String id;
  final String productId;
  final String sku;
  final String productName;
  final int requestedQty;
  int approvedQty;
  int allocatedQty;
  int dispatchedQty;
  int receivedQty;
  final String unitOfMeasure;
  final double stockoutHours;
  final String riskLevel;
  final String riskReason;

  RequestLine({
    required this.id,
    required this.productId,
    required this.sku,
    required this.productName,
    required this.requestedQty,
    this.approvedQty = 0,
    this.allocatedQty = 0,
    this.dispatchedQty = 0,
    this.receivedQty = 0,
    required this.unitOfMeasure,
    required this.stockoutHours,
    required this.riskLevel,
    required this.riskReason,
  });

  factory RequestLine.fromMap(Map<String, dynamic> map) {
    return RequestLine(
      id: map['id'] ?? '',
      productId: map['productId'] ?? '',
      sku: map['sku'] ?? '',
      productName: map['productName'] ?? '',
      requestedQty: (map['requestedQty'] ?? 0) as int,
      approvedQty: (map['approvedQty'] ?? 0) as int,
      allocatedQty: (map['allocatedQty'] ?? 0) as int,
      dispatchedQty: (map['dispatchedQty'] ?? 0) as int,
      receivedQty: (map['receivedQty'] ?? 0) as int,
      unitOfMeasure: map['unitOfMeasure'] ?? 'Cases',
      stockoutHours: (map['stockoutHours'] ?? 24.0).toDouble(),
      riskLevel: map['riskLevel'] ?? 'Low',
      riskReason: map['riskReason'] ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'productId': productId,
      'sku': sku,
      'productName': productName,
      'requestedQty': requestedQty,
      'approvedQty': approvedQty,
      'allocatedQty': allocatedQty,
      'dispatchedQty': dispatchedQty,
      'receivedQty': receivedQty,
      'unitOfMeasure': unitOfMeasure,
      'stockoutHours': stockoutHours,
      'riskLevel': riskLevel,
      'riskReason': riskReason,
    };
  }
}

class StatusHistoryItem {
  final String status;
  final String actor;
  final String timestamp;
  final String reason;

  StatusHistoryItem({
    required this.status,
    required this.actor,
    required this.timestamp,
    required this.reason,
  });

  factory StatusHistoryItem.fromMap(Map<String, dynamic> map) {
    return StatusHistoryItem(
      status: map['status'] ?? '',
      actor: map['actor'] ?? '',
      timestamp: map['timestamp'] ?? '',
      reason: map['reason'] ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'status': status,
      'actor': actor,
      'timestamp': timestamp,
      'reason': reason,
    };
  }
}

class ReplenishmentRequest {
  final String id;
  final String storeId;
  final String storeName;
  final String region;
  final String requesterName;
  String status;
  String priority;
  final String urgencyReason;
  final String creationTime;
  final String needByTime;
  String lastUpdatedTime;
  String lastUpdatedSource;
  String shipmentRef;
  String carrier;
  final List<RequestLine> lines;
  final List<StatusHistoryItem> statusHistory;
  final List<String> linkedExceptions;

  ReplenishmentRequest({
    required this.id,
    required this.storeId,
    required this.storeName,
    required this.region,
    required this.requesterName,
    required this.status,
    required this.priority,
    required this.urgencyReason,
    required this.creationTime,
    required this.needByTime,
    required this.lastUpdatedTime,
    required this.lastUpdatedSource,
    this.shipmentRef = '',
    this.carrier = '',
    required this.lines,
    required this.statusHistory,
    required this.linkedExceptions,
  });

  factory ReplenishmentRequest.fromMap(Map<String, dynamic> map, String docId) {
    return ReplenishmentRequest(
      id: docId,
      storeId: map['storeId'] ?? '',
      storeName: map['storeName'] ?? '',
      region: map['region'] ?? '',
      requesterName: map['requesterName'] ?? '',
      status: map['status'] ?? 'Requested',
      priority: map['priority'] ?? 'Standard',
      urgencyReason: map['urgencyReason'] ?? '',
      creationTime: map['creationTime'] ?? '',
      needByTime: map['needByTime'] ?? '',
      lastUpdatedTime: map['lastUpdatedTime'] ?? '',
      lastUpdatedSource: map['lastUpdatedSource'] ?? '',
      shipmentRef: map['shipmentRef'] ?? '',
      carrier: map['carrier'] ?? '',
      lines: (map['lines'] as List<dynamic>?)
              ?.map((x) => RequestLine.fromMap(x as Map<String, dynamic>))
              .toList() ??
          [],
      statusHistory: (map['statusHistory'] as List<dynamic>?)
              ?.map((x) => StatusHistoryItem.fromMap(x as Map<String, dynamic>))
              .toList() ??
          [],
      linkedExceptions: List<String>.from(map['linkedExceptions'] ?? []),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'storeId': storeId,
      'storeName': storeName,
      'region': region,
      'requesterName': requesterName,
      'status': status,
      'priority': priority,
      'urgencyReason': urgencyReason,
      'creationTime': creationTime,
      'needByTime': needByTime,
      'lastUpdatedTime': lastUpdatedTime,
      'lastUpdatedSource': lastUpdatedSource,
      'shipmentRef': shipmentRef,
      'carrier': carrier,
      'lines': lines.map((x) => x.toMap()).toList(),
      'statusHistory': statusHistory.map((x) => x.toMap()).toList(),
      'linkedExceptions': linkedExceptions,
    };
  }
}

class ExceptionModel {
  final String id;
  final String requestId;
  final String storeId;
  final String storeName;
  final String sku;
  final String productName;
  final String type;
  final String severity;
  String owner;
  final String dueTime;
  String status;
  final String nextAction;
  String resolutionReason;

  ExceptionModel({
    required this.id,
    required this.requestId,
    required this.storeId,
    required this.storeName,
    required this.sku,
    required this.productName,
    required this.type,
    required this.severity,
    required this.owner,
    required this.dueTime,
    required this.status,
    required this.nextAction,
    this.resolutionReason = '',
  });

  factory ExceptionModel.fromMap(Map<String, dynamic> map, String docId) {
    return ExceptionModel(
      id: docId,
      requestId: map['requestId'] ?? '',
      storeId: map['storeId'] ?? '',
      storeName: map['storeName'] ?? '',
      sku: map['sku'] ?? '',
      productName: map['productName'] ?? '',
      type: map['type'] ?? '',
      severity: map['severity'] ?? 'Medium',
      owner: map['owner'] ?? '',
      dueTime: map['dueTime'] ?? '',
      status: map['status'] ?? 'Open',
      nextAction: map['nextAction'] ?? '',
      resolutionReason: map['resolutionReason'] ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'requestId': requestId,
      'storeId': storeId,
      'storeName': storeName,
      'sku': sku,
      'productName': productName,
      'type': type,
      'severity': severity,
      'owner': owner,
      'dueTime': dueTime,
      'status': status,
      'nextAction': nextAction,
      'resolutionReason': resolutionReason,
    };
  }
}
