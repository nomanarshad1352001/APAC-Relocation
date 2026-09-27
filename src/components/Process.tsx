import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { useCollection } from '../store/SiteDataContext';
import { generateId } from '../store/useStore';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import CrudActions from './ui/CrudActions';
import AddButton from './ui/AddButton';
import Icon, { ICON_OPTIONS, type IconName } from './ui/Icon';
import EditableText from './ui/EditableText';

interface ProcessItem {
  id: string;
  step: string;
  title: string;
  desc: string;
  features: string[];
  icon: IconName;
  color: string;
}

const colorPool = [
  'from-amber-500 to-amber-700',
  'from-stone-600 to-stone-800',
  'from-yellow-700 to-amber-900',
  'from-neutral-700 to-neutral-900',
  'from-gold to-amber-600',
  'from-gray-700 to-gray-900',
];

const initialSteps: ProcessItem[] = [
  { id: 'ps1', step: '01', title: 'Pre-Move Survey', desc: 'We assess your belongings and plan every detail before moving day.', features: ['Video survey', 'In-home survey', 'Inventory planning', 'Customs preparation'], icon: 'camera', color: colorPool[0] },
  { id: 'ps2', step: '02', title: 'Packing & Loading', desc: 'Professional packing with export-grade materials and digital tracking.', features: ['Export-grade cartons', 'Fragile crating', 'Digital inventory', 'Same-day loading'], icon: 'package', color: colorPool[1] },
  { id: 'ps3', step: '03', title: 'Freight & Customs', desc: 'We handle all shipping logistics and customs documentation.', features: ['Air Freight', 'FCL / LCL', 'Customs Clearance', 'ISF + AMS filing'], icon: 'anchor', color: colorPool[2] },
  { id: 'ps4', step: '04', title: 'Delivery & Unpacking', desc: 'White-glove delivery to your new American home, everything unpacked.', features: ['White-glove delivery', 'Furniture assembly', 'Debris removal', 'Concierge support'], icon: 'home', color: colorPool[3] },
];

interface Props { adminMode: boolean; onToast: (msg: string, type: 'success' | 'error' | 'info') => void; }

export default function Process({ adminMode, onToast }: Props) {
  const { ref, inView } = useAnimateOnScroll();
  const { items, create, update, remove } = useCollection<ProcessItem>('site_process', initialSteps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ProcessItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<{ title: string; desc: string; features: string; icon: IconName }>({ title: '', desc: '', features: '', icon: 'package' });

  const openCreate = () => { setEditItem(null); setForm({ title: '', desc: '', features: '', icon: 'package' }); setModalOpen(true); };
  const openEdit = (item: ProcessItem) => { setEditItem(item); setForm({ title: item.title, desc: item.desc, features: item.features.join(', '), icon: item.icon }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const featArr = form.features.split(',').map((f) => f.trim()).filter(Boolean);
    if (editItem) {
      update(editItem.id, { title: form.title, desc: form.desc, features: featArr, icon: form.icon });
      onToast(`"${form.title}" updated`, 'success');
    } else {
      const stepNum = String(items.length + 1).padStart(2, '0');
      create({ id: generateId('ps'), step: stepNum, title: form.title, desc: form.desc, features: featArr, icon: form.icon, color: colorPool[items.length % colorPool.length] });
      onToast(`"${form.title}" added`, 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) { remove(deleteId); onToast('Process step deleted', 'error'); setDeleteId(null); } };

  return (
    <section id="process" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-semibold mb-4">
            <EditableText id="process.eyebrow" defaultText="The Journey" adminMode={adminMode} />
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">
            <EditableText id="process.heading" defaultText="One team. One contract." adminMode={adminMode} />
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            <EditableText id="process.sub" defaultText="From your flat to your front door." adminMode={adminMode} />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((step, i) => (
            <motion.div key={step.id} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.15 }} className="group relative bg-ivory rounded-3xl p-6 border border-ink/8 hover:shadow-2xl hover:shadow-ink/10 transition-all duration-300">
              {adminMode && <CrudActions onEdit={() => openEdit(step)} onDelete={() => setDeleteId(step.id)} compact className="absolute top-3 right-3 z-10" />}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-5`}>
                <Icon name={step.icon} size={22} />
              </div>
              {i < items.length - 1 && <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-ink/15 z-10" />}
              <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Step {step.step}</div>
              <h3 className="font-display text-lg text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-muted mb-4">{step.desc}</p>
              <ul className="space-y-2">
                {step.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Icon name="check" size={14} className="text-gold flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {adminMode && <AddButton onClick={openCreate} label="Add Step" className="min-h-[280px] justify-center" />}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Process Step' : 'Add Process Step'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <div className="grid grid-cols-8 gap-1.5 max-h-40 overflow-y-auto p-1 border border-gray-200 rounded-xl">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  title={opt.label}
                  onClick={() => setForm({ ...form, icon: opt.name })}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${form.icon === opt.name ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <Icon name={opt.name} size={16} />
                </button>
              ))}
            </div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Step title" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none" placeholder="Description..." /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label><textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none" placeholder="Feature 1, Feature 2" /></div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">{editItem ? 'Save Changes' : 'Add Step'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Process Step" message="Are you sure? This action cannot be undone." />
    </section>
  );
}
