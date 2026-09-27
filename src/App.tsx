import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LoginPage from './components/LoginPage';
import QuoteCalculator from './components/QuoteCalculator';
import Process from './components/Process';
import ShippingCalculator from './components/ShippingCalculator';
import EstimateBreakdown from './components/EstimateBreakdown';
import Services from './components/Services';
import Timeline from './components/Timeline';
import VisaOptions from './components/VisaOptions';
import Destinations from './components/Destinations';
import PetRelocation from './components/PetRelocation';
import Stats from './components/Stats';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import LeadForm from './components/LeadForm';
import Footer from './components/Footer';
import ToastContainer, { type ToastData } from './components/ui/Toast';
import Dashboard from './components/dashboard/Dashboard';
import { SiteContentProvider } from './store/siteContent';
import { SiteDataProvider } from './store/SiteDataContext';
import { generateId } from './store/useStore';

type View = 'landing' | 'login' | 'dashboard';

const viewTransition = {
  initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -24, filter: 'blur(8px)' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminBarVisible, setAdminBarVisible] = useState(true);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToasts((prev) => [...prev, { id: generateId('toast'), message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setAdminBarVisible(true);
    setView('landing');
    addToast('Welcome to the atelier, Admin.', 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('landing');
    addToast('Signed out. Until next time.', 'info');
  };

  const adminMode = isLoggedIn && adminBarVisible;

  return (
    <SiteContentProvider>
      <SiteDataProvider>
      <AnimatePresence mode="wait">
        {view === 'login' && !isLoggedIn && (
          <motion.div key="login" {...viewTransition}>
            <LoginPage onBack={() => setView('landing')} onLogin={handleLogin} />
          </motion.div>
        )}

        {view === 'dashboard' && isLoggedIn && (
          <motion.div key="dashboard" {...viewTransition}>
            <Dashboard onExit={() => setView('landing')} />
          </motion.div>
        )}

        {view === 'landing' && (
          <motion.div key="landing" {...viewTransition}>
            <div className="min-h-screen bg-ivory text-ink antialiased">
              {/* Admin micro-bar */}
              <AnimatePresence>
                {adminMode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[60] bg-ink text-ivory overflow-hidden"
                  >
                    <div className="max-w-7xl mx-auto px-5 py-2 flex items-center justify-center gap-3 text-[11px] tracking-wider uppercase flex-wrap">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold pulse-dot" />
                        Atelier session — <span className="text-gold-light font-semibold normal-case">admin@apac.com</span>
                      </span>
                      <span className="hidden sm:inline text-ivory/30">·</span>
                      <span className="hidden sm:inline text-ivory/60">hover any text to edit it</span>
                      <button
                        onClick={() => setView('dashboard')}
                        className="px-3.5 py-1 rounded-full gradient-gold text-ink font-bold normal-case text-[11px] hover:opacity-90 transition-opacity"
                      >
                        Open Dashboard
                      </button>
                      <button
                        onClick={() => setAdminBarVisible(false)}
                        className="px-3 py-1 rounded-full border border-ivory/25 hover:border-ivory/50 transition-colors normal-case"
                      >
                        Hide
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Navbar
                isLoggedIn={isLoggedIn}
                onLoginClick={() => setView('login')}
                onLogout={handleLogout}
                onDashboardClick={() => setView('dashboard')}
              />

              <Hero adminMode={adminMode} />
              <QuoteCalculator adminMode={adminMode} onToast={addToast} />
              <Process adminMode={adminMode} onToast={addToast} />
              <ShippingCalculator adminMode={adminMode} />
              <EstimateBreakdown adminMode={adminMode} onToast={addToast} />
              <Services adminMode={adminMode} onToast={addToast} />
              <Timeline adminMode={adminMode} onToast={addToast} />
              <VisaOptions adminMode={adminMode} onToast={addToast} />
              <Destinations adminMode={adminMode} onToast={addToast} />
              <PetRelocation adminMode={adminMode} onToast={addToast} />
              <Stats adminMode={adminMode} onToast={addToast} />
              <FAQ adminMode={adminMode} onToast={addToast} />
              <Contact adminMode={adminMode} onToast={addToast} />
              <LeadForm adminMode={adminMode} onToast={addToast} />
              <Footer adminMode={adminMode} />

              {/* Restore admin bar */}
              <AnimatePresence>
                {isLoggedIn && !adminBarVisible && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={() => setAdminBarVisible(true)}
                    className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl bg-ink text-ivory text-xs font-semibold tracking-wider uppercase hover:bg-black transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    Show Atelier Bar
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </SiteDataProvider>
    </SiteContentProvider>
  );
}
