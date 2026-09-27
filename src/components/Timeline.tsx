import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { useCollection } from '../store/SiteDataContext';
import { generateId } from '../store/useStore';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import CrudActions from './ui/CrudActions';
import AddButton from './ui/AddButton';
import Icon, { ICON_OPTIONS, type IconName } from './ui/Icon';
import EditableText from './ui/EditableText';

interface TimelineItem {
  id: string;
  time: string;
  title: string;
  desc: string;
  icon: IconName;
}

const initialTimeline: TimelineItem[] = [
  { id: 't1', time: 'T-12 Weeks', title: 'Quote & Planning', desc: 'Receive your detailed quote and begin planning your relocation timeline. We assign a dedicated move manager who will coordinate every aspect of your move.', icon: 'doc' },
  { id: 't2', time: 'T-8 Weeks', title: 'Paperwork', desc: 'Complete all necessary documentation including customs forms, insurance applications, shipping manifests, and visa-related paperwork. Our team guides you through every form.', icon: 'clipboard' },
  { id: 't3', time: 'T-4 Weeks', title: 'Downsizing', desc: "Decide what to bring, sell, donate, or store. We provide downsizing consultation and connect you with local services for items you won't be shipping.", icon: 'layers' },
  { id: 't4', time: 'T-1 Week', title: 'Packing', desc: 'Our professional packing crew arrives with export-grade materials. Every item is inventoried, wrapped, and packed according to international shipping standards.', icon: 'package' },
  { id: 't5', time: 'T+2 Days', title: 'Transit Begins', desc: 'Your shipment departs Singapore. Track your belongings in real-time through our online portal. Sea freight takes 20–35 days; air freight just 5–7 days.', icon: 'anchor' },
  { id: 't6', time: 'T+4 Weeks', title: 'Move-In Day', desc: 'Your belongings clear US customs and are delivered to your new home. Our team unpacks, assembles furniture, and removes all packaging materials.', icon: 'home' },
];

interface Props { adminMode: boolean; onToast: (msg: string, type: 'success' | 'error' | 'info') => void; }

export default function Timeline({ adminMode, onToast }: Props) {
  const { ref, inView } = useAnimateOnScroll();
  const { items, create, update, remove } = useCollection<TimelineItem>('site_timeline', initialTimeline);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<TimelineItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<{ time: string; title: string; desc: string; icon: IconName }>({ time: '', title: '', desc: '', icon: 'doc' });

  const openCreate = () => { setEditItem(null); setForm({ time: '', title: '', desc: '', icon: 'doc' }); setModalOpen(true); };
  const openEdit = (item: TimelineItem) => { setEditItem(item); setForm({ time: item.time, title: item.title, desc: item.desc, icon: item.icon }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editItem) {
      update(editItem.id, form);
      onToast(`"${form.title}" updated`, 'success');
    } else {
      create({ id: generateId('tl'), ...form });
      onToast(`"${form.title}" added to timeline`, 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) { remove(deleteId); onToast('Timeline item deleted', 'error'); setDeleteId(null); } };

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-semibold mb-4">
            <EditableText id="timeline.eyebrow" defaultText="Countdown to Move Day" adminMode={adminMode} />
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">
            <EditableText id="timeline.heading" defaultText="How a move from Singapore actually unfolds" adminMode={adminMode} />
          </h2>
          <p className="text-lg text-muted">
            <EditableText id="timeline.sub" defaultText="Click each milestone to learn more" adminMode={adminMode} />
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-ink/20 to-gold hidden sm:block" />

          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className={`relative sm:pl-16 p-5 rounded-2xl border transition-all duration-300 ${expanded === item.id ? 'bg-ivory border-ink/10 shadow-sm' : 'bg-white border-ink/8 hover:border-ink/15'}`}>
                  <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-white border-2 border-gold items-center justify-center hidden sm:flex">
                    <div className={`w-2 h-2 rounded-full transition-colors ${expanded === item.id ? 'bg-gold' : 'bg-ink/20'}`} />
                  </div>

                  <div className="flex items-center justify-between">
                    <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="flex items-center gap-3 flex-1 text-left">
                      <span className="w-10 h-10 rounded-xl bg-ivory border border-gold/30 text-gold flex items-center justify-center flex-shrink-0">
                        <Icon name={item.icon} size={18} />
                      </span>
                      <div>
                        <div className="text-xs font-bold text-gold uppercase tracking-wider">{item.time}</div>
                        <div className="font-display text-base text-ink">{item.title}</div>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      {adminMode && <CrudActions onEdit={() => openEdit(item)} onDelete={() => setDeleteId(item.id)} compact />}
                      <motion.button animate={{ rotate: expanded === item.id ? 180 : 0 }} onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="text-muted flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </motion.button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expanded === item.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <p className="mt-3 text-sm text-muted leading-relaxed sm:ml-12">{item.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {adminMode && <AddButton onClick={openCreate} label="Add Timeline Step" className="mt-6 w-full justify-center" />}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Timeline Step' : 'Add Timeline Step'}>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Label</label>
            <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="T-8 Weeks" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Step title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none" placeholder="Detailed description..." />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">{editItem ? 'Save Changes' : 'Add Step'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Timeline Step" message="Are you sure? This action cannot be undone." />
    </section>
  );
}
