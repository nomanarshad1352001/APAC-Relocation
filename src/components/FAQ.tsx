import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { useCollection } from '../store/SiteDataContext';
import { generateId } from '../store/useStore';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import CrudActions from './ui/CrudActions';
import AddButton from './ui/AddButton';
import EditableText from './ui/EditableText';

interface FAQItem {
  id: string;
  q: string;
  a: string;
}

const initialFaqs: FAQItem[] = [
  { id: 'f1', q: 'How much does it cost to move from Singapore to the United States?', a: 'The cost varies depending on your move size, destination city, and service level. A typical household move ranges from $3,000 to $12,000 for sea freight, or $8,000–$25,000 for air freight. We provide fixed pricing with no hidden fees — your quote is your final price, guaranteed for 14 days.' },
  { id: 'f2', q: 'How long does a move take?', a: 'Sea freight takes 20–35 days depending on the destination port. Air freight takes 5–7 days. Door-to-door, including packing and delivery, plan for 6–8 weeks for sea freight or 2–3 weeks for air freight. We recommend starting the process 12 weeks before your move date.' },
  { id: 'f3', q: "What can't I ship?", a: 'Prohibited items include hazardous materials, perishable foods, live plants, firearms, narcotics, and certain chemicals. Some items like alcohol and medications have specific quantity limits or require special documentation. We provide a comprehensive restricted items list during your survey.' },
  { id: 'f4', q: 'Do I need to be present during packing?', a: "No, but we recommend it. If you can't be present, you can authorize a representative or use our video survey technology to oversee the process remotely. Our detailed digital inventory system ensures transparency." },
  { id: 'f5', q: 'Do you handle visas?', a: "We don't process visas directly, but we work closely with immigration attorneys and can connect you with trusted partners. Our move planning aligns with your visa timeline to ensure your belongings arrive when you do." },
  { id: 'f6', q: 'What insurance options exist?', a: 'We offer comprehensive marine transit insurance through A-rated insurers covering loss, damage, and delays. Options include full replacement value coverage or declared value coverage. All policies are door-to-door, covering your belongings from pickup to delivery.' },
  { id: 'f7', q: 'Can you store my belongings?', a: 'Yes. We offer short-term and long-term storage at both origin (Singapore) and destination (multiple US cities). Our facilities are climate-controlled, secure, and insured. Storage is billed monthly with no long-term commitment required.' },
  { id: 'f8', q: 'What if my move size changes?', a: "We understand plans change. If your inventory increases or decreases before packing day, we'll adjust your quote accordingly. Our 14-day price lock applies to the surveyed volume — any changes are communicated transparently before you commit." },
];

interface Props { adminMode: boolean; onToast: (msg: string, type: 'success' | 'error' | 'info') => void; }

export default function FAQ({ adminMode, onToast }: Props) {
  const { ref, inView } = useAnimateOnScroll();
  const { items, create, update, remove } = useCollection<FAQItem>('site_faqs', initialFaqs);
  const [open, setOpen] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<FAQItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ q: '', a: '' });

  const openCreate = () => { setEditItem(null); setForm({ q: '', a: '' }); setModalOpen(true); };
  const openEdit = (item: FAQItem) => { setEditItem(item); setForm({ q: item.q, a: item.a }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.q.trim() || !form.a.trim()) return;
    if (editItem) {
      update(editItem.id, { q: form.q, a: form.a });
      onToast('FAQ updated', 'success');
    } else {
      create({ id: generateId('faq'), q: form.q, a: form.a });
      onToast('FAQ created', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) { remove(deleteId); onToast('FAQ deleted', 'error'); setDeleteId(null); }
  };

  return (
    <section id="faq" className="py-20 lg:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-semibold mb-4">
            <EditableText id="faq.eyebrow" defaultText="Answers" adminMode={adminMode} />
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">
            <EditableText id="faq.heading" defaultText="Frequently asked questions" adminMode={adminMode} />
          </h2>
          <p className="text-lg text-muted">
            <EditableText id="faq.sub" defaultText="Everything you need to know about moving from Singapore to the USA" adminMode={adminMode} />
          </p>
        </motion.div>

        <div className="space-y-3">
          {items.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`rounded-2xl border transition-all duration-300 ${open === faq.id ? 'bg-gray-50 border-gray-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'}`}
            >
              <div className="flex items-start justify-between p-5">
                <button onClick={() => setOpen(open === faq.id ? null : faq.id)} className="flex-1 flex items-start justify-between text-left">
                  <span className="text-sm sm:text-base font-semibold text-primary pr-4">{faq.q}</span>
                  <motion.svg animate={{ rotate: open === faq.id ? 180 : 0 }} className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                {adminMode && <CrudActions onEdit={() => openEdit(faq)} onDelete={() => setDeleteId(faq.id)} compact className="ml-2 flex-shrink-0" />}
              </div>
              <AnimatePresence>
                {open === faq.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-muted leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {adminMode && <AddButton onClick={openCreate} label="Add FAQ" className="mt-6 w-full justify-center" />}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit FAQ' : 'Add FAQ'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <input value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Enter question..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
            <textarea value={form.a} onChange={(e) => setForm({ ...form, a: e.target.value })} rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none" placeholder="Enter answer..." />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">{editItem ? 'Save Changes' : 'Create FAQ'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete FAQ" message="Are you sure you want to delete this FAQ? This action cannot be undone." />
    </section>
  );
}
