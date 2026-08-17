import 'package:flutter/material.dart';

class AdminView extends StatelessWidget {
  const AdminView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('System Administration & Governance', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 4),
          const Text('Data ingestion validator, threshold policies, and Firestore security rules governance.', style: TextStyle(fontSize: 13, color: Colors.grey)),
          const SizedBox(height: 20),

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
                const Text('Configurable Operational Thresholds', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                const SizedBox(height: 12),
                const ListTile(
                  title: Text('Critical Stockout Warning Threshold', style: TextStyle(color: Colors.white, fontSize: 14)),
                  subtitle: Text('Hours to projected zero inventory', style: TextStyle(color: Colors.grey, fontSize: 12)),
                  trailing: Text('4.0 Hours', style: TextStyle(color: Color(0xFF6366F1), fontWeight: FontWeight.bold)),
                ),
                const Divider(color: Color(0xFF223052)),
                const ListTile(
                  title: Text('Planner Review SLA Target', style: TextStyle(color: Colors.white, fontSize: 14)),
                  subtitle: Text('Max pending approval queue time', style: TextStyle(color: Colors.grey, fontSize: 12)),
                  trailing: Text('30 Minutes', style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
