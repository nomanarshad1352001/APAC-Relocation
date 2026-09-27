import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon, { type IconName } from '../ui/Icon';

const navItems: { id: string; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Overview', icon: 'chart' },
  { id: 'website', label: 'Website CMS', icon: 'layers' },
  { id: 'shipments', label: 'Shipments', icon: 'anchor' },
  { id: 'clients', label: 'Clients', icon: 'users' },
  { id: 'invoices', label: 'Invoices', icon: 'money' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'team', label: 'Team', icon: 'home' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExit: () => void;
  children: ReactNode;
}

export default function DashboardShell({ activeTab, onTabChange, onExit, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside animate={{ width: sidebarOpen ? 240 : 72 }} transition={{ duration: 0.2 }} className="hidden lg:flex flex-col bg-gray-900 text-white flex-shrink-0 overflow-hidden">
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
            <span className="font-display text-gray-900 text-sm">AP</span>
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
              <div className="text-sm font-bold truncate">APAC Relocation</div>
              <div className="text-[10px] text-gray-400">Admin Dashboard</div>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id ? 'active bg-white/12 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className={`flex-shrink-0 ${activeTab === item.id ? 'text-gold-light' : ''}`}>
                <Icon name={item.icon} size={18} />
              </span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs">
            <svg className={`w-4 h-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="absolute left-0 top-0 bottom-0 w-64 bg-gray-900 text-white p-4 space-y-1">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center"><span className="font-display text-gray-900 text-sm">AP</span></div>
                <div><div className="text-sm font-bold">APAC Relocation</div><div className="text-[10px] text-gray-400">Dashboard</div></div>
              </div>
              {navItems.map((item) => (
                <button key={item.id} onClick={() => { onTabChange(item.id); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${activeTab === item.id ? 'bg-white/12 text-white' : 'text-gray-400'}`}>
                  <Icon name={item.icon} size={18} /><span>{item.label}</span>
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Open menu">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 capitalize">{activeTab}</h1>
              <p className="text-xs text-gray-500 hidden sm:block">APAC Relocation Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
              <span className="text-xs font-medium text-green-700">All systems operational</span>
            </div>
            <button onClick={onExit} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              <span className="hidden sm:inline">Back to Site</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
