import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { useCollection } from '../store/SiteDataContext';
import { generateId } from '../store/useStore';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import CrudActions from './ui/CrudActions';
import Icon from './ui/Icon';
import EditableText from './ui/EditableText';

interface SavedQuote {
  id: string;
  from: string; to: string; date: string; moveType: string;
  name: string; email: string; phone: string;
  estimate: number; createdAt: string;
}

const moveTypes = ['Household', 'Office', 'Vehicle', 'Partial', 'Student'];

interface Props { adminMode: boolean; onToast: (msg: string, type: 'success' | 'error' | 'info') => void; }

export default function QuoteCalculator({ adminMode, onToast }: Props) {
  const { ref, inView } = useAnimateOnScroll();
  const { items: savedQuotes, create, update, remove } = useCollection<SavedQuote>('site_quotes', []);
  const [showSaved, setShowSaved] = useState(false);
  const [editItem, setEditItem] = useState<SavedQuote | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ from: 'Singapore', to: '', date: '', moveType: 'Household', name: '', email: '', phone: '' });
  const [estimate, setEstimate] = useState<number | null>(null);

  const calcEstimate = (data: typeof form) => {
    if (data.to && data.moveType) {
      const base: Record<string, number> = { Household: 5200, Office: 7800, Vehicle: 3500, Partial: 2800, Student: 1500 };
      const cityMod: Record<string, number> = { 'San Francisco': 1.2, 'New York': 1.3, 'Los Angeles': 1.1, Seattle: 1.15, Austin: 1.0, Boston: 1.25 };
      return Math.round((base[data.moveType] || 5200) * (cityMod[data.to] || 1.1));
    }
    return null;
  };

  const handleChange = (field: string, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    setEstimate(calcEstimate(updated));
  };

  const handleSaveQuote = () => {
    if (!estimate) { onToast('Select a destination to generate your estimate', 'info'); return; }
    const name = form.name.trim() || `Quote ${savedQuotes.length + 1}`;
    create({ id: generateId('q'), ...form, name, estimate, createdAt: new Date().toLocaleString() });
    onToast(`Quote saved for ${name}`, 'success');
  };

  const handleSaveEdit = () => {
    if (editItem) {
      const newEst = calcEstimate(form);
      update(editItem.id, { ...form, estimate: newEst || editItem.estimate });
      onToast('Quote updated', 'success');
      setEditItem(null);
    }
  };

  const handleDelete = () => { if (deleteId) { remove(deleteId); onToast('Quote deleted', 'error'); setDeleteId(null); } };

  return (
    <section id="quote" className="py-20 lg:py-32 bg-ivory relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.05] to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-semibold mb-4">
            <EditableText id="quote.eyebrow" defaultText="Instant Pricing" adminMode={adminMode} />
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">
            <EditableText id="quote.heading" defaultText="Get your estimate in 60 seconds" adminMode={adminMode} />
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            <EditableText id="quote.sub" defaultText="Real carrier rates. No hidden fees. Lock your price for 14 days." adminMode={adminMode} />
          </p>
          {adminMode && savedQuotes.length > 0 && (
            <button onClick={() => setShowSaved(!showSaved)} className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-ivory text-sm font-semibold hover:bg-black transition-colors">
              <Icon name="clipboard" size={14} /> Saved Quotes ({savedQuotes.length})
            </button>
          )}
        </motion.div>

        <AnimatePresence>
          {adminMode && showSaved && savedQuotes.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
              <div className="bg-white border border-gold/30 rounded-2xl p-5">
                <h3 className="text-base font-bold text-ink mb-4 flex items-center gap-2"><Icon name="clipboard" size={16} className="text-gold" /> Saved Quotes</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {savedQuotes.map((q) => (
                    <div key={q.id} className="bg-ivory rounded-xl p-4 border border-ink/8 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-ink">{q.name} — {q.from} → {q.to}</div>
                        <div className="text-xs text-muted">{q.moveType} · ${q.estimate.toLocaleString()} · {q.createdAt}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setForm({ from: q.from, to: q.to, date: q.date, moveType: q.moveType, name: q.name, email: q.email, phone: q.phone }); setEstimate(q.estimate); setShowSaved(false); onToast('Quote loaded', 'info'); }} className="px-3 py-1.5 rounded-lg bg-ink text-ivory text-xs font-medium hover:bg-black transition-colors">Load</button>
                        <CrudActions onEdit={() => { setEditItem(q); setForm({ from: q.from, to: q.to, date: q.date, moveType: q.moveType, name: q.name, email: q.email, phone: q.phone }); setEstimate(q.estimate); }} onDelete={() => setDeleteId(q.id)} compact />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2 bg-white rounded-3xl border border-ink/8 p-6 sm:p-8 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-5">
              {[['Moving From', 'from', 'input'], ['Moving To', 'to', 'select'], ['Moving Date', 'date', 'date'], ['Full Name', 'name', 'input'], ['Email', 'email', 'input'], ['Phone', 'phone', 'input']].map(([label, field, kind]) => (
                <div key={field} className={field === 'phone' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                  {kind === 'select' ? (
                    <select value={form.to} onChange={(e) => handleChange('to', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white transition-all">
                      <option value="">Select destination</option><option>San Francisco</option><option>New York</option><option>Los Angeles</option><option>Seattle</option><option>Austin</option><option>Boston</option>
                    </select>
                  ) : kind === 'date' ? (
                    <input type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white transition-all" />
                  ) : (
                    <input value={(form as any)[field]} onChange={(e) => handleChange(field, e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white transition-all" placeholder={field === 'from' ? 'Singapore' : ''} />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Move Type</label>
                <div className="flex flex-wrap gap-2">
                  {moveTypes.map((t) => (
                    <button key={t} onClick={() => handleChange('moveType', t)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${form.moveType === t ? 'bg-ink text-ivory' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleSaveQuote} className="relative overflow-hidden group w-full mt-6 py-4 bg-ink text-ivory font-semibold rounded-xl hover:bg-black transition-all text-base">
              <span className="absolute inset-0 gradient-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative flex items-center justify-center gap-2 group-hover:text-ink transition-colors duration-500">
                <EditableText id="quote.cta" defaultText="Get Instant Quote" adminMode={adminMode} />
                <Icon name="arrowRight" size={16} />
              </span>
            </button>

            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {[{ icon: 'activity', id: 'quote.badge.a', d: 'Live carrier rates' }, { icon: 'camera', id: 'quote.badge.b', d: 'AI video survey' }, { icon: 'card', id: 'quote.badge.c', d: 'Pay & book online' }].map((f) => (
                <div key={f.id} className="flex items-center gap-1.5 text-xs text-muted">
                  <Icon name={f.icon as any} size={14} className="text-gold" />
                  <EditableText id={f.id} defaultText={f.d} adminMode={adminMode} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="space-y-6">
            <div className="bg-ink rounded-3xl p-6 text-ivory">
              <div className="text-sm text-ivory/50 mb-2">Estimated Cost</div>
              <div className="font-display text-4xl mb-1 animate-counter">{estimate ? `$${estimate.toLocaleString()}` : '—'}</div>
              <div className="text-sm text-ivory/50 mb-6">{estimate ? 'Based on your selections' : 'Fill in the form to see estimate'}</div>
              {estimate && (
                <div className="space-y-3 pt-4 border-t border-ivory/15">
                  {[{ label: 'International Freight', pct: 45 }, { label: 'Origin Packing', pct: 20 }, { label: 'Destination Delivery', pct: 15 }, { label: 'Customs Clearance', pct: 12 }, { label: 'Insurance', pct: 8 }].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm"><span className="text-ivory/50">{item.label}</span><span className="font-medium">${Math.round(estimate * item.pct / 100).toLocaleString()}</span></div>
                  ))}
                </div>
              )}
            </div>
            {[{ icon: 'lock', id: 'quote.trust.a', title: '14-Day Price Lock', desc: 'Your quote is guaranteed' }, { icon: 'shield', id: 'quote.trust.b', title: 'Fixed Pricing', desc: 'No hidden fees or surcharges' }, { icon: 'star', id: 'quote.trust.c', title: 'Licensed Movers', desc: 'FMC & FIDI certified' }].map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-ink/8">
                <span className="w-10 h-10 rounded-xl gradient-gold text-ink flex items-center justify-center flex-shrink-0"><Icon name={item.icon as any} size={18} /></span>
                <div>
                  <div className="text-sm font-semibold text-ink">
                    <EditableText id={`${item.id}.title`} defaultText={item.title} adminMode={adminMode} />
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    <EditableText id={`${item.id}.desc`} defaultText={item.desc} adminMode={adminMode} />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Quote" size="md">
        {editItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">From</label><input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">To</label><input value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setEditItem(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleSaveEdit} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Quote" message="Are you sure you want to delete this saved quote?" />
    </section>
  );
}
