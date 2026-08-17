import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/grozo_provider.dart';
import '../models/replenishment_request.dart';

class StoreManagerView extends StatelessWidget {
  const StoreManagerView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<GrozoProvider>(context);
    final requests = provider.requests.where((r) => r.storeId == provider.activeStoreId).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Grozo Market #101 (Downtown)',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Store Manager & Inventory Workspace • Risk Score Index: 88/100',
                    style: TextStyle(fontSize: 13, color: Colors.grey),
                  ),
                ],
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: () => _showCreateDialog(context),
                icon: const Icon(Icons.add, size: 18),
                label: const Text('New Replenishment', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // 4 Metric Cards Row
          Row(
            children: [
              _buildStatCard('Arriving Today', '${requests.where((r) => r.status == 'Dispatched').length}', 'In transit fleet', const Color(0xFF06B6D4)),
              const SizedBox(width: 14),
              _buildStatCard('Awaiting Approval', '${requests.where((r) => r.status == 'Requested').length}', 'Pending planner review', const Color(0xFFA78BFA)),
              const SizedBox(width: 14),
              _buildStatCard('Critical Stockout Risk', '${requests.where((r) => r.lines.any((l) => l.riskLevel == 'Critical')).length}', '< 4 hours stock remaining', const Color(0xFFEF4444)),
              const SizedBox(width: 14),
              _buildStatCard('Delivered & Confirmed', '${requests.where((r) => r.status == 'Delivered').length}', 'Completed cycle orders', const Color(0xFF10B981)),
            ],
          ),
          const SizedBox(height: 24),

          // Requests Data Table Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF131B2E),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF223052)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Active Store Replenishment Orders', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                    SizedBox(
                      width: 260,
                      height: 36,
                      child: TextField(
                        onChanged: provider.setSearchQuery,
                        decoration: InputDecoration(
                          hintText: 'Search SKU or REQ ID...',
                          hintStyle: const TextStyle(fontSize: 12, color: Colors.grey),
                          prefixIcon: const Icon(Icons.search, size: 16, color: Colors.grey),
                          filled: true,
                          fillColor: const Color(0xFF0B0F19),
                          contentPadding: EdgeInsets.zero,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(6), borderSide: BorderSide.none),
                        ),
                        style: const TextStyle(fontSize: 13, color: Colors.white),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Table
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: requests.length,
                  itemBuilder: (context, index) {
                    final req = requests[index];
                    final line = req.lines.isNotEmpty ? req.lines[0] : null;
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0B0F19),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: const Color(0xFF223052)),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            flex: 2,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(req.id, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                                Text('Created: ${req.creationTime.substring(11, 16)}', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                              ],
                            ),
                          ),
                          Expanded(
                            flex: 3,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(line?.productName ?? 'Multi-Item', style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.white)),
                                Text('${line?.requestedQty ?? 0} ${line?.unitOfMeasure ?? 'Cases'}', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                              ],
                            ),
                          ),
                          Expanded(
                            flex: 2,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: req.priority == 'Urgent' ? const Color(0xFFEF4444).withOpacity(0.2) : Colors.transparent,
                                border: Border.all(color: req.priority == 'Urgent' ? const Color(0xFFEF4444) : Colors.grey),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                req.priority,
                                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: req.priority == 'Urgent' ? const Color(0xFFEF4444) : Colors.grey),
                              ),
                            ),
                          ),
                          Expanded(
                            flex: 2,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFF6366F1).withOpacity(0.15),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(req.status, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF818CF8))),
                            ),
                          ),
                          Expanded(
                            flex: 1,
                            child: IconButton(
                              icon: const Icon(Icons.arrow_forward, color: Colors.grey, size: 18),
                              onPressed: () {},
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, String subtext, Color accentColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF131B2E),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: const Color(0xFF223052)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.5)),
            const SizedBox(height: 6),
            Text(value, style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: accentColor)),
            const SizedBox(height: 4),
            Text(subtext, style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  void _showCreateDialog(BuildContext context) {
    final provider = Provider.of<GrozoProvider>(context, listen: false);
    final qtyController = TextEditingController(text: '25');
    final reasonController = TextEditingController();
    String priority = 'Standard';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF131B2E),
        title: const Text('Create Replenishment Order', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Product Item: Organic Whole Milk 1 Gal (MILK-ORG-1G)', style: TextStyle(color: Colors.grey, fontSize: 12)),
            const SizedBox(height: 12),
            TextField(
              controller: qtyController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Requested Quantity (Cases)', labelStyle: TextStyle(color: Colors.grey)),
              style: const TextStyle(color: Colors.white),
            ),
            const SizedBox(height: 12),
            StatefulBuilder(
              builder: (context, setState) => Column(
                children: [
                  DropdownButton<String>(
                    value: priority,
                    dropdownColor: const Color(0xFF0B0F19),
                    style: const TextStyle(color: Colors.white),
                    isExpanded: true,
                    items: const [
                      DropdownMenuItem(value: 'Standard', child: Text('Standard Cycle Order')),
                      DropdownMenuItem(value: 'Urgent', child: Text('Urgent (Stockout Imminent)')),
                    ],
                    onChanged: (val) => setState(() => priority = val!),
                  ),
                  if (priority == 'Urgent')
                    TextField(
                      controller: reasonController,
                      decoration: const InputDecoration(labelText: 'Urgency Justification Reason', labelStyle: TextStyle(color: Color(0xFFEF4444))),
                      style: const TextStyle(color: Colors.white),
                    ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel', style: TextStyle(color: Colors.grey))),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1)),
            onPressed: () {
              provider.submitRequest(
                priority: priority,
                urgencyReason: reasonController.text,
                needByTime: DateTime.now().add(const Duration(hours: 6)).toIso8601String(),
                lines: [
                  RequestLine(
                    id: 'L-${DateTime.now().millisecondsSinceEpoch}',
                    productId: 'SKU-8821',
                    sku: 'MILK-ORG-1G',
                    productName: 'Organic Whole Milk 1 Gal',
                    requestedQty: int.tryParse(qtyController.text) ?? 25,
                    unitOfMeasure: 'Cases (6/cs)',
                    stockoutHours: 3.4,
                    riskLevel: 'Critical',
                    riskReason: 'Critical risk: Store stock projected to hit 0 in 3.4h',
                  )
                ],
              );
              Navigator.pop(context);
            },
            child: const Text('Submit Request'),
          ),
        ],
      ),
    );
  }
}
