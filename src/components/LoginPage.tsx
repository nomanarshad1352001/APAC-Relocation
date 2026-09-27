import { useState, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

const LOGIN_IMG = 'https://images.pexels.com/photos/7031712/pexels-photo-7031712.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1600';
const LOGIN_IMG_ALT = 'https://images.pexels.com/photos/6587901/pexels-photo-6587901.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1600&w=1200';

const DEMO_EMAIL = 'admin@apac.com';
const DEMO_PASSWORD = 'admin123';

interface LoginPageProps {
  onBack: () => void;
  onLogin: () => void;
}

// ─── Floating gold particles ───
function Particles() {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 8) % 100}%`,
    size: 3 + (i % 3) * 2,
    duration: 12 + (i % 5) * 4,
    delay: (i * 1.7) % 10,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: -10,
            width: p.size,
            height: p.size,
            background: 'linear-gradient(135deg, #d6b45e, #b8912f)',
            boxShadow: '0 0 6px rgba(214,180,94,0.6)',
          }}
          animate={{
            y: [0, -window.innerHeight - 40],
            x: [0, (p.id % 2 === 0 ? 40 : -40)],
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.6, 1, 1, 0.4],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated success checkmark ───
function SuccessOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-ink flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        className="w-28 h-28 rounded-full gradient-gold flex items-center justify-center shadow-[0_0_80px_rgba(214,180,94,0.5)]"
      >
        <motion.svg
          viewBox="0 0 24 24" fill="none"
          className="w-14 h-14"
          stroke="#141210" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        >
          <motion.path
            d="M4 12.5l5 5L20 6.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          />
        </motion.svg>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-[38%] text-center"
      >
        <p className="font-display text-2xl text-ivory">Welcome back</p>
        <p className="text-sm text-ivory/60 mt-1 tracking-widest uppercase">Opening your atelier dashboard</p>
      </motion.div>
      {/* expanding ring */}
      <motion.div
        className="absolute rounded-full border border-gold/40"
        initial={{ width: 120, height: 120, opacity: 1 }}
        animate={{ width: 900, height: 900, opacity: 0 }}
        transition={{ duration: 1.6, delay: 0.5, ease: 'easeOut' }}
      />
    </motion.div>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};

const riseIn: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function LoginPage({ onBack, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autofilling, setAutofilling] = useState(false);
  const [success, setSuccess] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const schedule = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  // ─── Autofill with typing animation ───
  const handleAutofill = () => {
    setError('');
    setAutofilling(true);
    setEmail('');
    setPassword('');
    let i = 0;
    const emailTimer = setInterval(() => {
      i++;
      setEmail(DEMO_EMAIL.slice(0, i));
      if (i >= DEMO_EMAIL.length) {
        clearInterval(emailTimer);
        let j = 0;
        const passTimer = setInterval(() => {
          j++;
          setPassword(DEMO_PASSWORD.slice(0, j));
          if (j >= DEMO_PASSWORD.length) {
            clearInterval(passTimer);
            setAutofilling(false);
          }
        }, 55);
        timers.current.push(passTimer as unknown as ReturnType<typeof setTimeout>);
      }
    }, 55);
    timers.current.push(emailTimer as unknown as ReturnType<typeof setTimeout>);
  };

  // ─── Sign in ───
  const doSignIn = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (loading || success) return;
    setError('');
    setLoading(true);
    schedule(() => {
      setLoading(false);
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        setSuccess(true);
        schedule(() => onLogin(), 1900);
      } else {
        setError('Incorrect credentials — tap “Autofill demo” to use the demo account.');
      }
    }, 900);
  };

  // ─── One-click demo login ───
  const handleQuickLogin = () => {
    if (loading || success) return;
    setAutofilling(true);
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    schedule(() => {
      setAutofilling(false);
      setSuccess(true);
      schedule(() => onLogin(), 1900);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-ivory text-ink overflow-hidden relative">
      {/* Grain / noise backdrop */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #141210 1px, transparent 1px)', backgroundSize: '22px 22px' }} />

      <div className="min-h-screen grid lg:grid-cols-2">
        {/* ═══════ Left — Immersive image panel ═══════ */}
        <div className="relative hidden lg:block overflow-hidden bg-ink">
          <motion.img
            src={LOGIN_IMG}
            alt="Luxury interior"
            className="absolute inset-0 w-full h-full object-cover kenburns"
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          />
          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/30" />

          {/* Gold shimmer hairline */}
          <div className="absolute top-0 left-12 bottom-0 w-px shimmer-line opacity-60" />

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute top-10 left-12 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full border border-gold/60 flex items-center justify-center glass-dark">
              <span className="font-display text-gold-light text-sm">AP</span>
            </div>
            <div>
              <p className="font-display text-ivory tracking-wide">APAC Relocation</p>
              <p className="text-[10px] tracking-[0.35em] uppercase text-ivory/50">Private Client Suite</p>
            </div>
          </motion.div>

          {/* Second floating image card */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ delay: 0.9, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-40 right-10 w-56 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10 float-animation"
          >
            <img src={LOGIN_IMG_ALT} alt="Elegant staircase" className="w-full h-72 object-cover" />
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 left-12 max-w-md"
          >
            <p className="font-display text-2xl xl:text-3xl text-ivory leading-snug">
              “Your whole life, moved to America — <span className="italic gold-text">handled beautifully.</span>”
            </p>
            <footer className="mt-4 flex items-center gap-3">
              <div className="w-8 h-px bg-gold" />
              <span className="text-xs tracking-[0.25em] uppercase text-ivory/60">The APAC Atelier Promise</span>
            </footer>
          </motion.blockquote>
        </div>

        {/* ═══════ Right — Form panel ═══════ */}
        <div className="relative flex items-center justify-center px-6 sm:px-12 py-12">
          <Particles />

          {/* Back link */}
          <motion.button
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={onBack}
            className="absolute top-8 right-8 flex items-center gap-2 text-xs tracking-widest uppercase text-ink/50 hover:text-ink transition-colors"
          >
            <span className="w-6 h-px bg-current" /> Back to site
          </motion.button>

          {/* Mobile brand (lg hidden) */}
          <div className="lg:hidden absolute top-8 left-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center">
              <span className="font-display text-ink text-xs">AP</span>
            </div>
            <span className="font-display">APAC Relocation</span>
          </div>

          <motion.div variants={stagger} initial="hidden" animate="show" className="w-full max-w-md relative z-10">
            {/* Eyebrow */}
            <motion.div variants={riseIn} className="flex items-center gap-3 mb-6">
              <span className="w-10 h-px gradient-gold" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-gold font-semibold">Members Only</span>
            </motion.div>

            {/* Headings */}
            <motion.h1 variants={riseIn} className="font-display text-4xl sm:text-5xl leading-[1.05] mb-3">
              Step into the<br />
              <span className="italic gold-text">atelier dashboard.</span>
            </motion.h1>
            <motion.p variants={riseIn} className="text-sm text-ink/60 leading-relaxed mb-10">
              Manage moves, shipments, clients and invoices — all from one elegant command suite.
            </motion.p>

            {/* Demo card */}
            <motion.div variants={riseIn} className="relative rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/[0.08] to-transparent p-5 mb-8 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px shimmer-line" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-semibold mb-2">Demo Account</p>
                  <p className="text-xs font-mono text-ink/80">{DEMO_EMAIL}</p>
                  <p className="text-xs font-mono text-ink/80">{DEMO_PASSWORD.replace(/./g, '•')} <span className="text-ink/40 font-sans">(admin123)</span></p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleAutofill}
                    disabled={autofilling || loading || success}
                    className="px-4 py-2 rounded-full text-[11px] font-semibold tracking-wide bg-ink text-ivory hover:bg-black transition-all disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 4.8L18 8.4l-4.4 1.6L12 15l-1.6-5L6 8.4l4.4-1.6L12 2zm7 8l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" /></svg>
                    {autofilling ? 'Filling…' : 'Autofill demo'}
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickLogin}
                    disabled={autofilling || loading || success}
                    className="px-4 py-2 rounded-full text-[11px] font-semibold tracking-wide border border-gold text-gold hover:bg-gold hover:text-ink transition-all disabled:opacity-40"
                  >
                    One-click login →
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={doSignIn} className="space-y-5">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={riseIn}>
                <label className="block text-[11px] tracking-[0.25em] uppercase text-ink/50 font-semibold mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                    className="lux-input w-full px-5 py-4 rounded-xl text-sm"
                  />
                  <AnimatePresence>
                    {email && !autofilling && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gold/15 text-gold flex items-center justify-center text-[10px]"
                      >✓</motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div variants={riseIn}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] tracking-[0.25em] uppercase text-ink/50 font-semibold">Password</label>
                  <span className="text-[11px] text-gold hover:text-ink cursor-pointer transition-colors">Forgot?</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="lux-input w-full px-5 py-4 rounded-xl text-sm"
                  />
                  <AnimatePresence>
                    {password && !autofilling && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gold/15 text-gold flex items-center justify-center text-[10px]"
                      >✓</motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div variants={riseIn} className="pt-2">
                <motion.button
                  type="submit"
                  disabled={loading || success || autofilling}
                  whileHover={{ scale: loading ? 1 : 1.015 }}
                  whileTap={{ scale: loading ? 1 : 0.985 }}
                  className="relative w-full py-4 rounded-xl bg-ink text-ivory text-sm font-semibold tracking-[0.2em] uppercase overflow-hidden group disabled:opacity-70"
                >
                  {/* sweeping gold shine */}
                  <span className="absolute inset-0 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <span className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <motion.span
                          className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        Verifying…
                      </>
                    ) : 'Enter the Atelier'}
                  </span>
                </motion.button>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.div variants={riseIn} className="mt-10 flex items-center justify-center gap-4 text-[10px] tracking-[0.25em] uppercase text-ink/40">
              <span>FIDI</span><span className="w-1 h-1 rounded-full bg-gold" />
              <span>IAM</span><span className="w-1 h-1 rounded-full bg-gold" />
              <span>FMC OTI</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Success overlay */}
      <AnimatePresence>{success && <SuccessOverlay />}</AnimatePresence>
    </div>
  );
}
