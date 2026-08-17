import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/grozo_provider.dart';

class PlannerQueueView extends StatelessWidget {
  const PlannerQueueView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<GrozoProvider>(context);
    final pendingRequests = provider.requests.where((r) => r.status == 'Requested' || r.status == 'Under Review').toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Replenishment Planner Approval Queue', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 4),
          const Text('Prioritized by explainable risk score, urgency tier, need-by SLA, and warehouse supply.', style: TextStyle(fontSize: 13, color: Colors.grey)),
          const SizedBox(height: 20),

          // Approval Queue List
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: pendingRequests.length,
            itemBuilder: (context, idx) {
              final req = pendingRequests[idx];
              final line = req.lines.isNotEmpty ? req.lines[0] : null;

              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF131B2E),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFF223052)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      flex: 3,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('${req.id} • ${req.storeName}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 15)),
                          const SizedBox(height: 4),
                          Text('SKU: ${line?.sku ?? ''} (${line?.productName ?? ''})', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                          if (req.urgencyReason.isNotEmpty)
                            Padding(
                              padding: const EdgeInsets.only(top: 4),
                              child: Text('Urgency: ${req.urgencyReason}', style: const TextStyle(color: Color(0xFFEF4444), fontSize: 11, fontWeight: FontWeight.w600)),
                            ),
                        ],
                      ),
                    ),
                    Expanded(
                      flex: 2,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Requested: ${line?.requestedQty ?? 0} ${line?.unitOfMeasure ?? 'Cases'}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          const Text('WH Stock: 240 Cases', style: TextStyle(color: Color(0xFF10B981), fontSize: 11)),
                        ],
                      ),
                    ),
                    Expanded(
                      flex: 2,
                      child: Row(
                        children: [
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
                            onPressed: () => provider.approveRequest(req.id, {}, 'Approved full quantity'),
                            child: const Text('Approve'),
                          ),
                          const SizedBox(width: 8),
                          OutlinedButton(
                            style: OutlinedButton.styleFrom(foregroundColor: const Color(0xFFEF4444)),
                            onPressed: () => provider.rejectRequest(req.id, 'Planner stock allocation reject'),
                            child: const Text('Reject'),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
