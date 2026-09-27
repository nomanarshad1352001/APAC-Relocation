import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { useCollection } from '../store/SiteDataContext';
import { generateId } from '../store/useStore';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import CrudActions from './ui/CrudActions';
import AddButton from './ui/AddButton';
import Icon from './ui/Icon';
import EditableText from './ui/EditableText';

interface VisaItem {
  id: string;
  code: string;
  title: string;
  leadTime: string;
  govCost: string;
  cap: string;
  greenCard: string;
  requirements: string;
  color: string;
}

const colorPool = [
  'from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-emerald-500 to-emerald-600',
  'from-amber-500 to-amber-600', 'from-rose-500 to-rose-600', 'from-cyan-500 to-cyan-600',
  'from-indigo-500 to-indigo-600', 'from-pink-500 to-pink-600',
];

const initialVisas: VisaItem[] = [
  { id: 'v1', code: 'H-1B', title: 'Specialty Occupation', leadTime: '6–12 months', govCost: '$2,460+', cap: '85,000/year', greenCard: 'Yes (EB-2/EB-3)', requirements: "Bachelor's degree or higher in a specialty field, employer sponsorship, labor condition application", color: colorPool[0] },
  { id: 'v2', code: 'L-1A / L-1B', title: 'Intra-Company Transfer', leadTime: '2–6 months', govCost: '$1,385+', cap: 'No cap', greenCard: 'Yes (EB-1C)', requirements: '1 year employment with the company abroad, managerial/executive (L-1A) or specialized knowledge (L-1B)', color: colorPool[1] },
  { id: 'v3', code: 'O-1', title: 'Extraordinary Ability', leadTime: '2–4 months', govCost: '$1,055+', cap: 'No cap', greenCard: 'Yes (EB-1A)', requirements: 'Extraordinary ability in sciences, arts, education, business, or athletics with sustained acclaim', color: colorPool[2] },
  { id: 'v4', code: 'EB-5', title: 'Investor Green Card', leadTime: '24–36 months', govCost: '$11,160+', cap: '10,000/year', greenCard: 'Direct', requirements: 'Investment of $1,050,000 (or $800,000 in TEA) creating 10+ full-time jobs', color: colorPool[3] },
  { id: 'v5', code: 'E-2', title: 'Treaty Investor', leadTime: '2–4 months', govCost: '$695+', cap: 'No cap', greenCard: 'No direct path', requirements: 'Substantial investment in a US business, treaty country nationality (Singapore qualifies)', color: colorPool[4] },
  { id: 'v6', code: 'F-1', title: 'Student Visa', leadTime: '2–3 months', govCost: '$510+', cap: 'No cap', greenCard: 'Via OPT → H-1B', requirements: 'Acceptance to SEVP-certified school, proof of funds, intent to return', color: colorPool[5] },
  { id: 'v7', code: 'EB-1A', title: 'Extraordinary Ability GC', leadTime: '12–18 months', govCost: '$2,440+', cap: '~40,000/year', greenCard: 'Direct', requirements: 'Sustained national or international acclaim in field, no employer sponsorship needed', color: colorPool[6] },
  { id: 'v8', code: 'IR/CR-1', title: 'Spouse of US Citizen', leadTime: '12–24 months', govCost: '$1,200+', cap: 'No cap', greenCard: 'Direct', requirements: 'Marriage to US citizen, bona fide relationship, financial sponsorship (I-864)', color: colorPool[7] },
];

interface Props { adminMode: boolean; onToast: (msg: string, type: 'success' | 'error' | 'info') => void; }

export default function VisaOptions({ adminMode, onToast }: Props) {
  const { ref, inView } = useAnimateOnScroll();
  const { items, create, update, remove } = useCollection<VisaItem>('site_visas', initialVisas);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<VisaItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ code: '', title: '', leadTime: '', govCost: '', cap: '', greenCard: '', requirements: '' });

  const openCreate = () => { setEditItem(null); setForm({ code: '', title: '', leadTime: '', govCost: '', cap: '', greenCard: '', requirements: '' }); setModalOpen(true); };
  const openEdit = (item: VisaItem) => { setEditItem(item); setForm({ code: item.code, title: item.title, leadTime: item.leadTime, govCost: item.govCost, cap: item.cap, greenCard: item.greenCard, requirements: item.requirements }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.code.trim()) return;
    if (editItem) {
      update(editItem.id, form);
      onToast(`"${form.code}" updated`, 'success');
    } else {
      create({ id: generateId('visa'), ...form, color: colorPool[items.length % colorPool.length] });
      onToast(`"${form.code}" added`, 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) { remove(deleteId); onToast('Visa type deleted', 'error'); setDeleteId(null); } };

  return (
    <section id="visas" className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-semibold mb-4">
            <EditableText id="visas.eyebrow" defaultText="Immigration Guide" adminMode={adminMode} />
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">
            <EditableText id="visas.heading" defaultText="Pick a path." adminMode={adminMode} />
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            <EditableText id="visas.sub" defaultText="Understanding your visa type helps us plan your move timeline." adminMode={adminMode} />
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((visa, i) => (
            <motion.div key={visa.id} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }} className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 overflow-hidden flex flex-col">
              <div className={`h-1.5 bg-gradient-to-r ${visa.color}`} />
              <div className="p-5 flex-1 flex flex-col">
                {adminMode && <CrudActions onEdit={() => openEdit(visa)} onDelete={() => setDeleteId(visa.id)} compact className="absolute top-3 right-3 z-10" />}
                <div className="flex items-start justify-between mb-3">
                  <div><div className="text-lg font-bold text-primary">{visa.code}</div><div className="text-xs text-muted">{visa.title}</div></div>
                </div>
                <div className="space-y-2 flex-1">
                  {[{ l: 'Lead Time', v: visa.leadTime }, { l: "Gov't Cost", v: visa.govCost }, { l: 'Cap', v: visa.cap }, { l: 'Green Card', v: visa.greenCard }].map((r) => (
                    <div key={r.l} className="flex justify-between text-xs"><span className="text-muted">{r.l}</span><span className="font-medium text-primary">{r.v}</span></div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100"><p className="text-xs text-muted leading-relaxed line-clamp-3">{visa.requirements}</p></div>
                <a href="#quote" className="mt-4 flex items-center justify-center gap-1.5 text-center py-2.5 bg-gray-50 text-primary text-xs font-semibold rounded-xl hover:bg-gray-100 transition-colors group-hover:bg-primary group-hover:text-white">
                  Plan My {visa.code} Move
                  <Icon name="arrowRight" size={12} />
                </a>
              </div>
            </motion.div>
          ))}

          {adminMode && (
            <AddButton onClick={openCreate} label="Add Visa Type" className="min-h-[280px] justify-center" />
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Visa Type' : 'Add Visa Type'} size="md">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Visa Code</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="H-1B" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Specialty Occupation" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Lead Time</label><input value={form.leadTime} onChange={(e) => setForm({ ...form, leadTime: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="6–12 months" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Gov't Cost</label><input value={form.govCost} onChange={(e) => setForm({ ...form, govCost: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="$2,460+" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Cap</label><input value={form.cap} onChange={(e) => setForm({ ...form, cap: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="85,000/year" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Green Card Path</label><input value={form.greenCard} onChange={(e) => setForm({ ...form, greenCard: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Yes (EB-2/EB-3)" /></div>
          <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label><textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none" placeholder="Key requirements..." /></div>
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">{editItem ? 'Save Changes' : 'Add Visa Type'}</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Visa Type" message="Are you sure? This action cannot be undone." />
    </section>
  );
}
