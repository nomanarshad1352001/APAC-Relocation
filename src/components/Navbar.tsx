import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onLogout?: () => void;
  onDashboardClick?: () => void;
}

export default function Navbar({ isLoggedIn, onLoginClick, onLogout, onDashboardClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'The Journey', href: '#process' },
    { label: 'Pricing', href: '#quote' },
    { label: 'Destinations', href: '#destinations' },
    { label: 'Visa Guide', href: '#visas' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center transition-transform group-hover:rotate-[15deg] duration-500">
              <span className="font-display text-ink text-xs">AP</span>
            </div>
            <div className="leading-none">
              <span className="font-display text-lg text-ink">APAC <span className="italic gold-text">Relocation</span></span>
              <span className="block text-[9px] tracking-[0.4em] uppercase text-ink/45 mt-1">Singapore → USA</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-9">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-[13px] font-medium text-ink/60 hover:text-ink transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-px gradient-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={onDashboardClick}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-gold hover:text-ink transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Dashboard
                </button>
                <button onClick={onLogout} className="text-[13px] font-medium text-ink/50 hover:text-ink transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink/20 text-[13px] font-semibold text-ink hover:border-gold hover:text-gold transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Private Login
              </button>
            )}
            <a
              href="#quote"
              className="relative px-6 py-3 bg-ink text-ivory text-[13px] font-semibold rounded-full overflow-hidden group"
            >
              <span className="absolute inset-0 gradient-gold translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
              <span className="relative group-hover:text-ink transition-colors duration-400">Get Instant Quote</span>
            </a>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -mr-2"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span className={`block h-[1.5px] bg-ink transition-all duration-300 ${mobileOpen ? 'w-6 rotate-45 translate-y-[9px]' : 'w-6'}`} />
              <span className={`block h-[1.5px] bg-ink transition-all duration-300 ${mobileOpen ? 'opacity-0' : 'w-4'}`} />
              <span className={`block h-[1.5px] bg-ink transition-all duration-300 ${mobileOpen ? 'w-6 -rotate-45 -translate-y-[10px]' : 'w-6'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden glass border-t border-ink/10 overflow-hidden"
          >
            <div className="px-6 py-7 space-y-1">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="block font-display text-2xl text-ink py-2 gold-underline w-fit"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="pt-6 flex flex-col gap-3">
                {isLoggedIn ? (
                  <>
                    <button onClick={() => { onDashboardClick?.(); setMobileOpen(false); }} className="w-full py-3.5 rounded-full gradient-gold text-ink text-sm font-semibold">
                      Open Dashboard
                    </button>
                    <button onClick={() => { onLogout?.(); setMobileOpen(false); }} className="w-full py-3.5 rounded-full border border-ink/15 text-sm font-semibold text-ink">
                      Sign out
                    </button>
                  </>
                ) : (
                  <button onClick={() => { onLoginClick?.(); setMobileOpen(false); }} className="w-full py-3.5 rounded-full border border-ink/20 text-sm font-semibold text-ink">
                    Private Login
                  </button>
                )}
                <a href="#quote" onClick={() => setMobileOpen(false)} className="w-full text-center py-3.5 rounded-full bg-ink text-ivory text-sm font-semibold">
                  Get Instant Quote
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
