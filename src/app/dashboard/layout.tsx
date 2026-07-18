'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import {
  BarChart3,
  UtensilsCrossed,
  LayoutGrid,
  Sparkles,
  MapPin,
  Users,
  Settings,
  LogOut,
  Home,
  ChevronLeft,
} from 'lucide-react';
import type { ViewType } from '@/lib/types';

const navItems: { id: ViewType; label: string; icon: typeof BarChart3 }[] = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: BarChart3 },
  { id: 'menu', label: 'المنيو الذكي', icon: UtensilsCrossed },
  { id: 'menu-editor', label: 'محرر المنيو', icon: LayoutGrid },
  { id: 'auto-menu-generator', label: 'توليد قائمة AI', icon: Sparkles },
  { id: 'heatmap', label: 'خريطة حرارية', icon: MapPin },
  { id: 'crm', label: 'إدارة العملاء', icon: Users },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, setView, view, user, setUser } = useStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Keep store view in sync
  useEffect(() => {
    if (isAuthenticated && view !== 'dashboard' && view !== 'menu' && view !== 'menu-editor' && view !== 'auto-menu-generator' && view !== 'heatmap' && view !== 'crm' && view !== 'settings') {
      setView('dashboard');
    }
  }, [isAuthenticated, view, setView]);

  const handleNav = (targetView: ViewType) => {
    setView(targetView);
  };

  const handleLogout = () => {
    setUser(null);
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A46C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeView = (navItems.find(n => n.id === view)?.id || 'dashboard') as ViewType;

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0f] text-[#f0ece4] flex">
      {/* ═══════ Sidebar ═══════ */}
      <aside className="fixed top-0 right-0 h-screen w-64 bg-[#0d0d14]/95 backdrop-blur-xl border-l border-white/[0.06] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/[0.06]">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#C9A46C] to-[#7A1C1C] flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{
                background: 'linear-gradient(135deg, #C9A46C 0%, #E8D5A8 50%, #C9A46C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Servio AI
              </h1>
              <p className="text-[10px] text-[#f0ece4]/30">لوحة التحكم</p>
            </div>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#C9A46C]/10 text-[#C9A46C]'
                    : 'text-[#f0ece4]/50 hover:text-[#f0ece4] hover:bg-white/[0.03]'
                }`}
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                <span>{item.label}</span>
                {isActive && (
                  <div className="mr-auto w-1.5 h-1.5 rounded-full bg-[#C9A46C]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/[0.06]">
          {user?.name && (
            <div className="mb-3 px-3">
              <p className="text-sm font-medium text-[#f0ece4]/80 truncate">{user.name}</p>
              <p className="text-[11px] text-[#f0ece4]/30">صاحب المطعم</p>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-[#f0ece4]/40 hover:text-[#f0ece4]/70 hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <Home className="h-3.5 w-3.5" />
              الرئيسية
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              خروج
            </button>
          </div>
        </div>
      </aside>

      {/* ═══════ Mobile Header ═══════ */}
      <div className="lg:hidden fixed top-0 right-0 left-0 h-14 bg-[#0d0d14]/95 backdrop-blur-xl border-b border-white/[0.06] z-40 flex items-center px-4 gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#C9A46C] to-[#7A1C1C] flex items-center justify-center">
          <BarChart3 className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-sm" style={{
          background: 'linear-gradient(135deg, #C9A46C 0%, #E8D5A8 50%, #C9A46C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Servio AI
        </span>
      </div>

      {/* ═══════ Mobile Bottom Nav ═══════ */}
      <div className="lg:hidden fixed bottom-0 right-0 left-0 h-16 bg-[#0d0d14]/95 backdrop-blur-xl border-t border-white/[0.06] z-40 flex items-center justify-around px-2">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                isActive ? 'text-[#C9A46C]' : 'text-[#f0ece4]/30'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══════ Main Content ═══════ */}
      <main className="flex-1 lg:mr-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
}