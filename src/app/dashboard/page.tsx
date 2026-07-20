'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import dynamic from 'next/dynamic';
import type { ViewType } from '@/lib/types';

// Lazy-load heavy components to avoid SSR issues with Recharts etc.
const Dashboard = dynamic(() => import('@/components/dashboard'), { ssr: false });
const SmartMenu = dynamic(() => import('@/components/smart-menu'), { ssr: false });
const MenuEditor = dynamic(() => import('@/components/menu-editor'), { ssr: false });
const AutoMenuGenerator = dynamic(() => import('@/components/auto-menu-generator'), { ssr: false });
const HeatmapViewer = dynamic(() => import('@/components/heatmap-viewer'), { ssr: false });
const CRMDashboard = dynamic(() => import('@/components/crm-dashboard'), { ssr: false });
const AdminSettings = dynamic(() => import('@/components/admin-settings'), { ssr: false });

const viewComponents: Partial<Record<ViewType, React.ComponentType>> = {
  dashboard: Dashboard,
  menu: SmartMenu,
  'menu-editor': MenuEditor,
  'auto-menu-generator': AutoMenuGenerator,
  heatmap: HeatmapViewer,
  crm: CRMDashboard,
  settings: AdminSettings,
};

export default function DashboardPage() {
  const { view, setView } = useStore(
    useShallow((state) => ({
      view: state.view,
      setView: state.setView,
    }))
  );

  // Default to dashboard view when first entering
  useEffect(() => {
    if (!viewComponents[view]) {
      setView('dashboard');
    }
  }, [view, setView]);

  const ActiveComponent = viewComponents[view] || Dashboard;

  return <ActiveComponent />;
}