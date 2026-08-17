import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/grozo_provider.dart';

class RegionalOpsView extends StatelessWidget {
  const RegionalOpsView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<GrozoProvider>(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Regional Control Tower & Executive Operations', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 4),
          const Text('Cross-store visibility, request lifecycle funnels, and network exception management.', style: TextStyle(fontSize: 13, color: Colors.grey)),
          const SizedBox(height: 20),

          // Lifecycle Funnel Bar
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
                const Text('Lifecycle Funnel Overview', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                const SizedBox(height: 14),
                Row(
                  children: [
                    _buildFunnelStage('1. Requested', '${provider.requests.where((r) => r.status == 'Requested').length}', const Color(0xFF60A5FA)),
                    _buildFunnelStage('2. Approved', '${provider.requests.where((r) => r.status == 'Approved').length}', const Color(0xFF34D399)),
                    _buildFunnelStage('3. Picking', '${provider.requests.where((r) => r.status == 'Picking').length}', const Color(0xFFF472B6)),
                    _buildFunnelStage('4. Dispatched', '${provider.requests.where((r) => r.status == 'Dispatched').length}', const Color(0xFF22D3EE)),
                    _buildFunnelStage('5. Blocked', '${provider.requests.where((r) => r.status == 'Blocked').length}', const Color(0xFFEF4444)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Exception Queue
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
                const Text('Active Operational Exceptions', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                const SizedBox(height: 12),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: provider.exceptions.length,
                  itemBuilder: (context, idx) {
                    final exc = provider.exceptions[idx];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0B0F19),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: const Color(0xFF223052)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('${exc.id} • ${exc.type}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                              Text('${exc.storeName} • SKU: ${exc.sku}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEF4444).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(exc.severity, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFEF4444))),
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

  Widget _buildFunnelStage(String stageName, String count, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        margin: const EdgeInsets.only(right: 8),
        decoration: BoxDecoration(
          color: const Color(0xFF0B0F19),
          borderRadius: BorderRadius.circular(8),
          border: Border(left: BorderSide(color: color, width: 4)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(stageName, style: const TextStyle(fontSize: 11, color: Colors.grey)),
            const SizedBox(height: 4),
            Text(count, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
          ],
        ),
      ),
    );
  }
}
