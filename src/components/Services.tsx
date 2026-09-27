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

interface ServiceItem {
  id: string;
  icon: IconName;
  title: string;
  features: string[];
  color: string;
}

const colors = [
  'from-amber-500 to-amber-700',
  'from-stone-600 to-stone-800',
  'from-yellow-700 to-amber-900',
  'from-neutral-700 to-neutral-900',
  'from-gray-700 to-gray-900',
  'from-amber-600 to-yellow-800',
  'from-stone-500 to-neutral-700',
  'from-yellow-600 to-amber-700',
];

const initialServices: ServiceItem[] = [
  { id: 's1', icon: 'package', title: 'Professional Packing', features: ['Export-grade materials', 'Inventory documentation'], color: colors[0] },
  { id: 's2', icon: 'anchor', title: 'Sea & Air Freight', features: ['FCL', 'LCL', 'Air Cargo'], color: colors[1] },
  { id: 's3', icon: 'shield', title: 'US Customs Clearance', features: ['Documentation support', 'Duty exemption guidance'], color: colors[2] },
  { id: 's4', icon: 'home', title: 'Door-to-Door Delivery', features: ['Real-time tracking', 'Final-mile delivery'], color: colors[3] },
  { id: 's5', icon: 'lock', title: 'Marine Insurance', features: ['Full coverage', 'A-rated insurers'], color: colors[4] },
  { id: 's6', icon: 'car', title: 'Vehicle Shipping', features: ['Cars & Motorcycles', 'EPA & DOT compliance'], color: colors[5] },
];

interface Props { adminMode: boolean; onToast: (msg: string, type: 'success' | 'error' | 'info') => void; }

export default function Services({ adminMode, onToast }: Props) {
  const { ref, inView } = useAnimateOnScroll();
  const { items, create, update, remove } = useCollection<ServiceItem>('site_services', initialServices);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ServiceItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<{ icon: IconName; title: string; features: string }>({ icon: 'package', title: '', features: '' });

  const openCreate = () => { setEditItem(null); setForm({ icon: 'package', title: '', features: '' }); setModalOpen(true); };
  const openEdit = (item: ServiceItem) => { setEditItem(item); setForm({ icon: item.icon, title: item.title, features: item.features.join(', ') }); setModalOpen(true); };

  const handleSave = () => {
    const featArr = form.features.split(',').map((f) => f.trim()).filter(Boolean);
    if (!form.title.trim()) return;
    if (editItem) {
      update(editItem.id, { icon: form.icon, title: form.title, features: featArr });
      onToast(`"${form.title}" updated`, 'success');
    } else {
      create({ id: generateId('svc'), icon: form.icon, title: form.title, features: featArr, color: colors[items.length % colors.length] });
      onToast(`"${form.title}" created`, 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      const item = items.find((i) => i.id === deleteId);
      remove(deleteId);
      onToast(`"${item?.title}" deleted`, 'error');
      setDeleteId(null);
    }
  };

  return (
    <section id="services" className="py-20 lg:py-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-semibold mb-4">
            <EditableText id="services.eyebrow" defaultText="Our Expertise" adminMode={adminMode} />
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">
            <EditableText id="services.heading" defaultText="International moving services to the USA" adminMode={adminMode} />
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            <EditableText id="services.sub" defaultText="Everything you need for a seamless relocation, handled by one team." adminMode={adminMode} />
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} className="group relative bg-white rounded-3xl p-7 border border-ink/8 hover:shadow-2xl hover:shadow-ink/10 transition-all duration-300">
              {adminMode && <CrudActions onEdit={() => openEdit(s)} onDelete={() => setDeleteId(s.id)} compact className="absolute top-3 right-3 z-10" />}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                <Icon name={s.icon} size={24} />
              </div>
              <h3 className="font-display text-lg text-ink mb-3">{s.title}</h3>
              <ul className="space-y-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted">
                    <Icon name="check" size={14} className="text-gold flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {adminMode && <AddButton onClick={openCreate} label="Add Service" className="min-h-[200px] justify-center" />}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.6 }} className="text-center mt-12">
          <a href="#quote" className="inline-flex items-center px-8 py-4 bg-ink text-ivory font-semibold rounded-full hover:bg-black transition-all shadow-lg shadow-ink/20">
            <EditableText id="services.cta" defaultText="Get Started with a Quote" adminMode={adminMode} />
            <Icon name="arrowRight" size={16} className="ml-2" />
          </a>
        </motion.div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Service' : 'Add Service'}>
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
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Service name" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label><textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none" placeholder="Feature 1, Feature 2, Feature 3" /></div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">{editItem ? 'Save Changes' : 'Create Service'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Service" message="Are you sure you want to delete this service? This action cannot be undone." />
    </section>
  );
}
