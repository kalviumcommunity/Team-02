import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { StoreView } from './components/StoreView';
import { PlannerView } from './components/PlannerView';
import { WarehouseView } from './components/WarehouseView';
import { RegionalView } from './components/RegionalView';
import { AdminView } from './components/AdminView';
import { CreateRequestModal } from './components/CreateRequestModal';

const AppContent = () => {
  const { currentUser, activeRole } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // If not authenticated, render Login Page
  if (!currentUser) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (activeRole) {
      case 'store_manager':
        return <StoreView openCreateModal={() => setIsCreateModalOpen(true)} />;
      case 'replenishment_planner':
        return <PlannerView />;
      case 'warehouse_dispatcher':
        return <WarehouseView />;
      case 'regional_manager':
        return <RegionalView />;
      case 'sys_admin':
        return <AdminView />;
      default:
        return <StoreView openCreateModal={() => setIsCreateModalOpen(true)} />;
    }
  };

  return (
    <div className="app-container">
      <Header onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      <main className="main-content">
        {renderActiveView()}
      </main>

      {isCreateModalOpen && (
        <CreateRequestModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
