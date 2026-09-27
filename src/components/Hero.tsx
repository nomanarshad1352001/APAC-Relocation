import { motion, type Variants } from 'framer-motion';
import Icon from './ui/Icon';
import EditableText from './ui/EditableText';

const HERO_MAIN = 'https://images.pexels.com/photos/8082324/pexels-photo-8082324.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400';
const HERO_SECONDARY = 'https://images.pexels.com/photos/29603655/pexels-photo-29603655.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=600';

const badgeDefaults = ['FIDI Accredited', 'IAM Member', 'FMC OTI Licensed', '4.94 Star Rating', '2,108 Reviews'];

interface Props {
  adminMode?: boolean;
  onToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const riseIn: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero({ adminMode = false }: Props) {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-ivory">
      <div className="absolute top-0 right-0 w-[55%] h-[70%] bg-gradient-to-bl from-gold/[0.07] to-transparent rounded-bl-[120px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full border border-gold/15 translate-x-[-40%] translate-y-[30%]" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #141210 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          {/* Left */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="lg:col-span-6">
            <motion.div variants={riseIn} className="flex items-center gap-3 mb-8">
              <span className="w-12 h-px gradient-gold" />
              <span className="text-[11px] tracking-[0.4em] uppercase text-gold font-semibold">
                <EditableText id="hero.eyebrow" defaultText="White-Glove International Relocation" adminMode={adminMode} />
              </span>
            </motion.div>

            <motion.h1 variants={riseIn} className="font-display text-ink text-5xl sm:text-6xl xl:text-[5.25rem] leading-[1.02] mb-7">
              <EditableText id="hero.title.a" defaultText="Your whole life," adminMode={adminMode} />
              <br />
              <EditableText id="hero.title.b" defaultText="moved to" adminMode={adminMode} />{' '}
              <span className="italic gold-text">
                <EditableText id="hero.title.c" defaultText="America." adminMode={adminMode} />
              </span>
            </motion.h1>

            <motion.p variants={riseIn} className="text-base sm:text-lg text-ink/60 leading-relaxed mb-10 max-w-lg">
              <EditableText
                id="hero.sub"
                defaultText="Visas, sea and air freight, US Customs — orchestrated as one seamless door-to-door journey. From your Singapore flat to your American front door, every detail whispered to perfection."
                adminMode={adminMode}
                multiline
              />
            </motion.p>

            <motion.div variants={riseIn} className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="#quote"
                className="relative inline-flex items-center justify-center px-9 py-4 rounded-full bg-ink text-ivory text-sm font-semibold tracking-wide overflow-hidden group"
              >
                <span className="absolute inset-0 gradient-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative flex items-center gap-2 group-hover:text-ink transition-colors duration-500">
                  <EditableText id="hero.cta.primary" defaultText="Get Instant Quote" adminMode={adminMode} />
                  <Icon name="arrowRight" size={16} className="group-hover:translate-x-1 transition-transform duration-500" />
                </span>
              </a>
              <a
                href="#lead-form"
                className="inline-flex items-center justify-center px-9 py-4 rounded-full border border-ink/20 text-sm font-semibold text-ink hover:border-gold hover:text-gold transition-all duration-300"
              >
                <EditableText id="hero.cta.secondary" defaultText="Book a Private Survey" adminMode={adminMode} />
              </a>
            </motion.div>

            <motion.div variants={riseIn} className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-ink/10 border-y border-ink/10 py-6 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="px-4 first:pl-0">
                  <div className="font-display text-sm sm:text-base text-ink">
                    <EditableText id={`hero.stat.${i}.value`} defaultText={['Singapore to USA', '20–35 days', 'Full household', 'Door-to-door'][i]} adminMode={adminMode} />
                  </div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-ink/45 mt-1">
                    <EditableText id={`hero.stat.${i}.label`} defaultText={['Dedicated Corridor', 'Sea Freight', 'White-Glove Service', 'One Contract'][i]} adminMode={adminMode} />
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={riseIn} className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {badgeDefaults.map((label, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] tracking-wider uppercase text-ink/50">
                  <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                  <EditableText id={`hero.badge.${i}`} defaultText={label} adminMode={adminMode} />
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — imagery */}
          <div className="lg:col-span-6 relative h-[520px] sm:h-[620px]">
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 w-[78%] h-[80%] rounded-[28px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(20,18,16,0.35)]"
            >
              <img src={HERO_MAIN} alt="Elegant luxury living room" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute right-4 top-4 w-[78%] h-[80%] rounded-[28px] border border-gold/40 pointer-events-none"
            />

            <motion.div
              initial={{ opacity: 0, y: 80, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: -4 }}
              transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 bottom-8 w-[36%] rounded-2xl overflow-hidden shadow-2xl border-4 border-ivory float-animation"
            >
              <img src={HERO_SECONDARY} alt="Refined interior detail" className="w-full h-64 sm:h-80 object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1 }}
              className="absolute left-[8%] sm:left-[4%] top-6 glass-dark rounded-2xl px-5 py-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="font-display text-ivory text-lg leading-none">
                    <EditableText id="hero.route.from" defaultText="SIN" adminMode={adminMode} />
                  </p>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-ivory/50 mt-1">Origin</p>
                </div>
                <div className="flex items-center gap-1 px-2">
                  <span className="w-8 h-px bg-gold" />
                  <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="text-gold-light">
                    <Icon name="plane" size={16} />
                  </motion.span>
                  <span className="w-8 h-px bg-gold" />
                </div>
                <div className="text-center">
                  <p className="font-display text-ivory text-lg leading-none">
                    <EditableText id="hero.route.to" defaultText="USA" adminMode={adminMode} />
                  </p>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-ivory/50 mt-1">Destination</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="absolute bottom-0 right-[6%] bg-ivory border border-ink/10 rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-ink">
                <Icon name="check" size={18} />
              </div>
              <div>
                <p className="font-display text-ink text-sm">
                  <EditableText id="hero.chip.title" defaultText="2,108 families" adminMode={adminMode} />
                </p>
                <p className="text-[10px] tracking-widest uppercase text-ink/45">
                  <EditableText id="hero.chip.sub" defaultText="moved with zero losses" adminMode={adminMode} />
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-ink/10 bg-ivory/60 backdrop-blur-sm overflow-hidden py-3">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap text-[11px] tracking-[0.3em] uppercase text-ink/40"
        >
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex">
              {['Sea Freight', 'Air Cargo', 'Fine Art Handling', 'Pet Travel', 'Vehicle Shipping', 'Customs Clearance', 'Marine Insurance', 'Door-to-Door'].map((t) => (
                <span key={`${dup}-${t}`} className="flex items-center">
                  <span className="px-6">{t}</span>
                  <span className="w-1 h-1 rounded-full bg-gold" />
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
