import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/grozo_provider.dart';

class WarehouseDispatcherView extends StatelessWidget {
  const WarehouseDispatcherView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<GrozoProvider>(context);
    final whQueue = provider.requests.where((r) => ['Approved', 'Allocated', 'Picking', 'Packed'].contains(r.status)).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Central Warehouse Fulfillment Hub', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 4),
          const Text('Pick, Pack, & Dispatch milestone execution for approved store orders.', style: TextStyle(fontSize: 13, color: Colors.grey)),
          const SizedBox(height: 20),

          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: whQueue.length,
            itemBuilder: (context, idx) {
              final req = whQueue[idx];
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
                          Text('Approved Qty: ${line?.approvedQty ?? line?.requestedQty ?? 0} ${line?.unitOfMeasure ?? 'Cases'}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                        ],
                      ),
                    ),
                    Expanded(
                      flex: 2,
                      child: Text('Milestone: ${req.status}', style: const TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.bold)),
                    ),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF06B6D4)),
                        onPressed: () => provider.advanceFulfillment(req.id, 'Dispatched', shipmentRef: 'TRK-99201-EAST'),
                        icon: const Icon(Icons.local_shipping, size: 16),
                        label: const Text('Dispatch Shipment'),
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
