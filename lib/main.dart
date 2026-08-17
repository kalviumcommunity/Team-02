import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/grozo_provider.dart';
import 'views/store_manager_view.dart';
import 'views/planner_queue_view.dart';
import 'views/warehouse_dispatcher_view.dart';
import 'views/regional_ops_view.dart';
import 'views/admin_view.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => GrozoProvider(),
      child: const GrozoApp(),
    ),
  );
}

class GrozoApp extends StatelessWidget {
  const GrozoApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Grozo - Replenishment Control Tower',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0B0F19),
        cardColor: const Color(0xFF131B2E),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      ),
      home: const MainShell(),
    );
  }
}

class MainShell extends StatelessWidget {
  const MainShell({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<GrozoProvider>(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF131B2E),
        elevation: 0,
        title: Row(
          children: [
            const Icon(Icons.flash_on, color: Color(0xFF6366F1)),
            const SizedBox(width: 8),
            RichText(
              text: const TextSpan(
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                children: [
                  TextSpan(text: 'Grozo ', style: TextStyle(color: Colors.white)),
                  TextSpan(text: 'CONTROL TOWER', style: TextStyle(color: Color(0xFF6366F1), fontSize: 11, letterSpacing: 1)),
                ],
              ),
            ),
          ],
        ),
        actions: [
          // Role Switcher Buttons
          _buildRoleBtn(context, provider, 'store_manager', 'Store Manager', Icons.store),
          _buildRoleBtn(context, provider, 'replenishment_planner', 'Planner Queue', Icons.check_circle_outline),
          _buildRoleBtn(context, provider, 'warehouse_dispatcher', 'Warehouse WMS', Icons.local_shipping),
          _buildRoleBtn(context, provider, 'regional_manager', 'Regional Ops', Icons.bar_chart),
          _buildRoleBtn(context, provider, 'sys_admin', 'Admin', Icons.security),
          const SizedBox(width: 16),
        ],
      ),
      body: _buildActiveView(provider.activeRole),
    );
  }

  Widget _buildRoleBtn(BuildContext context, GrozoProvider provider, String roleKey, String label, IconData icon) {
    final isActive = provider.activeRole == roleKey;
    return Padding(
      padding: const EdgeInsets.only(right: 6),
      child: TextButton.icon(
        style: TextButton.styleFrom(
          backgroundColor: isActive ? const Color(0xFF6366F1) : Colors.transparent,
          foregroundColor: isActive ? Colors.white : Colors.grey,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        ),
        onPressed: () => provider.setActiveRole(roleKey),
        icon: Icon(icon, size: 16),
        label: Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
      ),
    );
  }

  Widget _buildActiveView(String role) {
    switch (role) {
      case 'store_manager':
        return const StoreManagerView();
      case 'replenishment_planner':
        return const PlannerQueueView();
      case 'warehouse_dispatcher':
        return const WarehouseDispatcherView();
      case 'regional_manager':
        return const RegionalOpsView();
      case 'sys_admin':
        return const AdminView();
      default:
        return const StoreManagerView();
    }
  }
}
