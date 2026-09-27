import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { useCounter } from '../hooks/useCounter';
import { useCollection } from '../store/SiteDataContext';
import { generateId } from '../store/useStore';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import CrudActions from './ui/CrudActions';
import AddButton from './ui/AddButton';
import Icon, { ICON_OPTIONS, type IconName } from './ui/Icon';
import EditableText from './ui/EditableText';

interface StatItem {
  id: string;
  icon: IconName;
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  displayValue?: string;
}

const initialStats: StatItem[] = [
  { id: 'st1', icon: 'users', value: 2108, decimals: 0, suffix: '+', label: 'Families Moved' },
  { id: 'st2', icon: 'star', value: 4.94, decimals: 2, suffix: '', label: 'Review Rating' },
  { id: 'st3', icon: 'clock', value: 98.7, decimals: 1, suffix: '%', label: 'On-Time Delivery' },
  { id: 'st4', icon: 'anchor', value: 14, decimals: 0, suffix: '', label: 'US Ports Served' },
  { id: 'st5', icon: 'shield', value: 0, decimals: 0, suffix: '', label: 'Hidden Fees', displayValue: '$0' },
  { id: 'st6', icon: 'sparkle', value: 4, decimals: 0, suffix: 'hrs', label: 'Avg Quote Turnaround' },
];

function StatCard({ stat, inView, index, adminMode, onEdit, onDelete }: { stat: StatItem; inView: boolean; index: number; adminMode: boolean; onEdit: () => void; onDelete: () => void }) {
  const count = useCounter(stat.value, 2500, inView, stat.decimals);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative text-center p-6 rounded-3xl bg-ivory/[0.06] backdrop-blur-sm border border-ivory/10 hover:bg-ivory/[0.1] transition-all"
    >
      {adminMode && <CrudActions compact onEdit={onEdit} onDelete={onDelete} className="absolute top-2 right-2 z-10" />}
      <div className="w-11 h-11 rounded-2xl gradient-gold text-ink flex items-center justify-center mx-auto mb-3">
        <Icon name={stat.icon} size={20} />
      </div>
      <div className="font-display text-3xl sm:text-4xl text-ivory mb-1 animate-counter">
        {stat.displayValue ? stat.displayValue : `${count}${stat.suffix}`}
      </div>
      <div className="text-sm text-ivory/50">{stat.label}</div>
    </motion.div>
  );
}

interface Props { adminMode?: boolean; onToast?: (msg: string, type: 'success' | 'error' | 'info') => void; }

export default function Stats({ adminMode = false, onToast = () => {} }: Props) {
  const { ref, inView } = useAnimateOnScroll();
  const { items, create, update, remove } = useCollection<StatItem>('site_stats', initialStats);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<StatItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<{ icon: IconName; value: number; decimals: number; suffix: string; label: string; displayValue: string }>({ icon: 'star', value: 0, decimals: 0, suffix: '', label: '', displayValue: '' });

  const openCreate = () => { setEditItem(null); setForm({ icon: 'star', value: 0, decimals: 0, suffix: '', label: '', displayValue: '' }); setModalOpen(true); };
  const openEdit = (s: StatItem) => { setEditItem(s); setForm({ icon: s.icon, value: s.value, decimals: s.decimals, suffix: s.suffix, label: s.label, displayValue: s.displayValue || '' }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.label.trim()) return;
    const payload = { icon: form.icon, value: form.value, decimals: form.decimals, suffix: form.suffix, label: form.label, displayValue: form.displayValue || undefined };
    if (editItem) { update(editItem.id, payload); onToast('Stat updated', 'success'); }
    else { create({ id: generateId('stat'), ...payload }); onToast('Stat added', 'success'); }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) { remove(deleteId); onToast('Stat deleted', 'error'); setDeleteId(null); } };

  return (
    <section className="py-20 lg:py-32 bg-ink relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/6 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold-light font-semibold mb-4">
            <EditableText id="stats.eyebrow" defaultText="Proven Record" adminMode={adminMode} />
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ivory mb-4 max-w-3xl mx-auto">
            <EditableText id="stats.heading" defaultText="The kind of operating record you can plan a life around" adminMode={adminMode} multiline />
          </h2>
          <p className="text-lg text-ivory/50 max-w-2xl mx-auto">
            <EditableText id="stats.sub" defaultText="Numbers that speak louder than promises" adminMode={adminMode} />
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {items.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} inView={inView} index={i} adminMode={adminMode} onEdit={() => openEdit(stat)} onDelete={() => setDeleteId(stat.id)} />
          ))}
          {adminMode && <AddButton onClick={openCreate} label="Add Stat" className="min-h-[160px] justify-center" />}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Stat' : 'Add Stat'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <div className="grid grid-cols-8 gap-1.5 max-h-40 overflow-y-auto p-1 border border-gray-200 rounded-xl">
              {ICON_OPTIONS.map((opt) => (
                <button key={opt.name} type="button" title={opt.label} onClick={() => setForm({ ...form, icon: opt.name })} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${form.icon === opt.name ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                  <Icon name={opt.name} size={16} />
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Value</label><input type="number" step="any" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Decimals</label><input type="number" min={0} max={2} value={form.decimals} onChange={(e) => setForm({ ...form, decimals: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Suffix (e.g. %, +, hrs)</label><input value={form.suffix} onChange={(e) => setForm({ ...form, suffix: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Label</label><input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Custom Display Value (optional, overrides number)</label><input value={form.displayValue} onChange={(e) => setForm({ ...form, displayValue: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="e.g. $0" /></div>
          <div className="flex gap-3 justify-end"><button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button><button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editItem ? 'Save' : 'Add'}</button></div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Stat" message="Delete this stat?" />
    </section>
  );
}
