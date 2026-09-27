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

interface ContactItem {
  id: string;
  icon: IconName;
  label: string;
  value: string;
  href: string;
}

const initialContacts: ContactItem[] = [
  { id: 'ct1', icon: 'phone', label: 'Phone', value: '+65 6520 1914', href: 'tel:+6565201914' },
  { id: 'ct2', icon: 'mail', label: 'Email', value: 'contact@apacrelocation.com', href: 'mailto:contact@apacrelocation.com' },
  { id: 'ct3', icon: 'chat', label: 'WhatsApp', value: '+65 8023 0461', href: 'https://wa.me/6580230461' },
  { id: 'ct4', icon: 'clock', label: 'Response Time', value: 'Within 4 working hours', href: '' },
];

interface Props { adminMode: boolean; onToast: (msg: string, type: 'success' | 'error' | 'info') => void; }

export default function Contact({ adminMode, onToast }: Props) {
  const { ref, inView } = useAnimateOnScroll();
  const { items, create, update, remove } = useCollection<ContactItem>('site_contacts', initialContacts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ContactItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<{ icon: IconName; label: string; value: string; href: string }>({ icon: 'phone', label: '', value: '', href: '' });

  const openCreate = () => { setEditItem(null); setForm({ icon: 'phone', label: '', value: '', href: '' }); setModalOpen(true); };
  const openEdit = (item: ContactItem) => { setEditItem(item); setForm({ icon: item.icon, label: item.label, value: item.value, href: item.href }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.label.trim()) return;
    if (editItem) { update(editItem.id, form); onToast(`"${form.label}" updated`, 'success'); }
    else { create({ id: generateId('ct'), ...form }); onToast(`"${form.label}" added`, 'success'); }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) { remove(deleteId); onToast('Contact method deleted', 'error'); setDeleteId(null); } };

  return (
    <section id="contact" className="py-20 lg:py-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-semibold mb-4">
            <EditableText id="contact.eyebrow" defaultText="Concierge Desk" adminMode={adminMode} />
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">
            <EditableText id="contact.heading" defaultText="Speak to a move manager today" adminMode={adminMode} />
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            <EditableText id="contact.sub" defaultText="Our team is ready to help you plan your move from Singapore to the USA" adminMode={adminMode} />
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((info, i) => (
            <motion.div key={info.id} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="relative bg-white rounded-2xl p-6 border border-ink/8 hover:shadow-xl hover:shadow-ink/8 transition-all duration-300 text-center">
                {adminMode && <CrudActions onEdit={() => openEdit(info)} onDelete={() => setDeleteId(info.id)} compact className="absolute top-2 right-2 z-10" />}
                <div className="w-12 h-12 rounded-2xl gradient-gold text-ink flex items-center justify-center mx-auto mb-3">
                  <Icon name={info.icon} size={20} />
                </div>
                <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">{info.label}</div>
                {info.href ? (
                  <a href={info.href} className="text-sm font-bold text-ink hover:text-gold transition-colors break-all">{info.value}</a>
                ) : (
                  <div className="text-sm font-bold text-ink">{info.value}</div>
                )}
              </div>
            </motion.div>
          ))}
          {adminMode && <AddButton onClick={openCreate} label="Add Contact" className="min-h-[140px] justify-center" />}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Contact' : 'Add Contact'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Icon</label>
            <div className="grid grid-cols-8 gap-1.5 max-h-40 overflow-y-auto p-1 border border-gray-200 rounded-xl">
              {ICON_OPTIONS.map((opt) => (
                <button key={opt.name} type="button" title={opt.label} onClick={() => setForm({ ...form, icon: opt.name })} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${form.icon === opt.name ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                  <Icon name={opt.name} size={16} />
                </button>
              ))}
            </div>
          </div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Label</label><input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Phone" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Value</label><input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="+65 1234 5678" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Link URL (optional)</label><input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="tel:+6512345678" /></div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">{editItem ? 'Save Changes' : 'Add Contact'}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Contact" message="Are you sure? This action cannot be undone." />
    </section>
  );
}
