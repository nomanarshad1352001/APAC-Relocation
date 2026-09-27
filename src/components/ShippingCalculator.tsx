import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import Icon, { type IconName } from './ui/Icon';
import EditableText from './ui/EditableText';

interface TransportOption { id: string; label: string; icon: IconName; baseCost: number; days: string; }

const transportOptions: TransportOption[] = [
  { id: 'air', label: 'Air Freight', icon: 'plane', baseCost: 8500, days: '5–7' },
  { id: 'express', label: 'Express Courier', icon: 'truck', baseCost: 12000, days: '3–5' },
  { id: 'fcl', label: 'Full Container', icon: 'anchor', baseCost: 5500, days: '25–35' },
  { id: 'lcl', label: 'Shared Container', icon: 'package', baseCost: 3200, days: '30–40' },
  { id: 'combo', label: 'Air + Sea Combo', icon: 'layers', baseCost: 6800, days: '10–20' },
];

const volumes = [
  { id: 'studio', label: 'Studio', multiplier: 0.5 },
  { id: '1bed', label: '1 Bedroom', multiplier: 1.0 },
  { id: '2bed', label: '2 Bedroom', multiplier: 1.6 },
  { id: '3bed', label: '3 Bedroom', multiplier: 2.2 },
  { id: '4bed', label: '4 Bedroom+', multiplier: 3.0 },
];

const extras = [
  { id: 'selfpack', label: 'Self Pack', modifier: -0.15 },
  { id: 'fragile', label: 'Fragile Only', modifier: 0.1 },
  { id: 'fullpack', label: 'Full Pack', modifier: 0.25 },
  { id: 'unpack', label: 'Destination Unpack', modifier: 0.15 },
  { id: 'insurance', label: 'Transit Insurance', modifier: 0.08 },
];

interface Props { adminMode?: boolean; }

export default function ShippingCalculator({ adminMode = false }: Props) {
  const { ref, inView } = useAnimateOnScroll();
  const [transport, setTransport] = useState('lcl');
  const [volumeIdx, setVolumeIdx] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(['insurance']);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const estimate = useMemo(() => {
    const t = transportOptions.find((o) => o.id === transport)!;
    const v = volumes[volumeIdx];
    let cost = t.baseCost * v.multiplier;
    selectedExtras.forEach((id) => {
      const ex = extras.find((e) => e.id === id);
      if (ex) cost += cost * ex.modifier;
    });
    return Math.round(cost);
  }, [transport, volumeIdx, selectedExtras]);

  const selectedTransport = transportOptions.find((o) => o.id === transport)!;

  return (
    <section id="calculator" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-semibold mb-4">
            <EditableText id="calc.eyebrow" defaultText="Live Pricing Engine" adminMode={adminMode} />
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">
            <EditableText id="calc.heading" defaultText="Build your move" adminMode={adminMode} />
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            <EditableText id="calc.sub" defaultText="Configure your shipment and see real-time estimates" adminMode={adminMode} />
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="bg-ivory rounded-3xl border border-ink/8 shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-3">
            <div className="lg:col-span-2 p-6 sm:p-8 space-y-8">
              {/* Route */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-ink/6">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-ink text-ivory flex items-center justify-center text-[10px] font-bold tracking-wider">SIN</span>
                  <div>
                    <div className="text-[10px] tracking-widest uppercase text-muted">Origin</div>
                    <div className="text-sm font-semibold text-ink">
                      <EditableText id="calc.origin" defaultText="Singapore" adminMode={adminMode} />
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-32 h-px bg-ink/20 relative">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold bg-ivory px-1"><Icon name="arrowRight" size={16} /></span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-full gradient-gold text-ink flex items-center justify-center text-[10px] font-bold tracking-wider">SFO</span>
                  <div>
                    <div className="text-[10px] tracking-widest uppercase text-muted">Destination</div>
                    <div className="text-sm font-semibold text-ink">
                      <EditableText id="calc.dest" defaultText="San Francisco" adminMode={adminMode} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Transport */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Transportation Mode</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {transportOptions.map((opt) => (
                    <button key={opt.id} onClick={() => setTransport(opt.id)} className={`p-3 rounded-xl border text-center transition-all ${transport === opt.id ? 'border-gold bg-gold/10 shadow-sm' : 'border-ink/12 hover:border-ink/25 bg-white'}`}>
                      <div className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center mb-1.5 ${transport === opt.id ? 'gradient-gold text-ink' : 'bg-ink/5 text-ink/60'}`}>
                        <Icon name={opt.icon} size={16} />
                      </div>
                      <div className="text-xs font-medium text-ink">{opt.label}</div>
                      <div className="text-[10px] text-muted mt-0.5">{opt.days} days</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Home Size</h3>
                <input type="range" min={0} max={volumes.length - 1} value={volumeIdx} onChange={(e) => setVolumeIdx(Number(e.target.value))} className="w-full h-2 bg-ink/10 rounded-full appearance-none cursor-pointer accent-gold" />
                <div className="flex justify-between mt-2">
                  {volumes.map((v, i) => (
                    <span key={v.id} className={`text-xs transition-colors ${i === volumeIdx ? 'text-gold font-semibold' : 'text-muted'}`}>{v.label}</span>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Options</h3>
                <div className="flex flex-wrap gap-2">
                  {extras.map((ex) => (
                    <button key={ex.id} onClick={() => toggleExtra(ex.id)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${selectedExtras.includes(ex.id) ? 'border-gold bg-gold/10 text-gold' : 'border-ink/12 text-gray-600 hover:border-ink/25 bg-white'}`}>
                      {selectedExtras.includes(ex.id) && <Icon name="check" size={12} />}
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Estimate */}
            <div className="bg-ink p-6 sm:p-8 text-ivory flex flex-col justify-between">
              <div>
                <div className="text-sm text-ivory/50 mb-1">
                  <EditableText id="calc.panel.label" defaultText="Estimated Total" adminMode={adminMode} />
                </div>
                <motion.div key={estimate} initial={{ scale: 0.95, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-5xl mb-2">
                  ${estimate.toLocaleString()}
                </motion.div>
                <div className="text-sm text-ivory/50 mb-8">
                  {selectedTransport.label} · {volumes[volumeIdx].label} · {selectedTransport.days} days
                </div>
                <div className="space-y-3">
                  {[{ l: 'International Freight', p: 0.45 }, { l: 'Origin Packing', p: 0.2 }, { l: 'Destination Delivery', p: 0.15 }, { l: 'Customs Clearance', p: 0.12 }, { l: 'Insurance', p: 0.08 }].map((row) => (
                    <div key={row.l} className="flex justify-between text-sm">
                      <span className="text-ivory/50">{row.l}</span>
                      <span>${Math.round(estimate * row.p).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-ivory/15 pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${estimate.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-3">
                <a href="#lead-form" className="block text-center w-full py-3 gradient-gold text-ink font-semibold rounded-xl hover:opacity-90 transition-all">Lock This Price</a>
                <a href="#quote" className="block text-center w-full py-3 bg-ivory/10 text-ivory font-medium rounded-xl hover:bg-ivory/20 transition-all text-sm">Book a Survey</a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
