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

interface BreakdownItem { id: string; label: string; amount: number; color: string; }
interface StepItem { id: string; label: string; day: string; icon: IconName; }

const barColors = ['bg-amber-500', 'bg-stone-600', 'bg-yellow-700', 'bg-neutral-600', 'bg-gold'];

const seedItems: BreakdownItem[] = [
  { id: 'b1', label: 'International Freight', amount: 2250, color: barColors[0] },
  { id: 'b2', label: 'Origin Packing', amount: 1000, color: barColors[1] },
  { id: 'b3', label: 'Destination Delivery', amount: 750, color: barColors[2] },
  { id: 'b4', label: 'Customs Clearance', amount: 600, color: barColors[3] },
  { id: 'b5', label: 'Insurance', amount: 400, color: barColors[4] },
];

const seedSteps: StepItem[] = [
  { id: 'st1', label: 'Survey', day: 'Day 1', icon: 'camera' },
  { id: 'st2', label: 'Packing', day: 'Day 3–5', icon: 'package' },
  { id: 'st3', label: 'Customs Docs', day: 'Day 6–7', icon: 'doc' },
  { id: 'st4', label: 'Transit', day: 'Day 7–30', icon: 'anchor' },
  { id: 'st5', label: 'Clearance', day: 'Day 30–32', icon: 'shield' },
  { id: 'st6', label: 'Delivery', day: 'Day 33–35', icon: 'home' },
];

interface Props { adminMode?: boolean; onToast?: (msg: string, type: 'success' | 'error' | 'info') => void; }

export default function EstimateBreakdown({ adminMode = false, onToast = () => {} }: Props) {
  const { ref, inView } = useAnimateOnScroll();
  const items = useCollection<BreakdownItem>('site_breakdown_items', seedItems);
  const steps = useCollection<StepItem>('site_breakdown_steps', seedSteps);

  // Items CRUD
  const [itemModal, setItemModal] = useState(false);
  const [editItem, setEditItem] = useState<BreakdownItem | null>(null);
  const [itemDeleteId, setItemDeleteId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({ label: '', amount: 0 });

  // Steps CRUD
  const [stepModal, setStepModal] = useState(false);
  const [editStep, setEditStep] = useState<StepItem | null>(null);
  const [stepDeleteId, setStepDeleteId] = useState<string | null>(null);
  const [stepForm, setStepForm] = useState<{ label: string; day: string; icon: IconName }>({ label: '', day: '', icon: 'doc' });

  const total = items.items.reduce((s, i) => s + i.amount, 0);
  const max = Math.max(...items.items.map((i) => i.amount), 1);

  // ─── Items handlers ───
  const saveItem = () => {
    if (!itemForm.label.trim()) return;
    if (editItem) { items.update(editItem.id, itemForm); onToast('Line updated', 'success'); }
    else { items.create({ id: generateId('b'), ...itemForm, color: barColors[items.items.length % barColors.length] }); onToast('Line added', 'success'); }
    setItemModal(false);
  };

  // ─── Steps handlers ───
  const saveStep = () => {
    if (!stepForm.label.trim()) return;
    if (editStep) { steps.update(editStep.id, stepForm); onToast('Stage updated', 'success'); }
    else { steps.create({ id: generateId('st'), ...stepForm }); onToast('Stage added', 'success'); }
    setStepModal(false);
  };

  return (
    <section className="py-20 lg:py-32 bg-ivory">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-semibold mb-4">
            <EditableText id="breakdown.eyebrow" defaultText="Transparent Pricing" adminMode={adminMode} />
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">
            <EditableText id="breakdown.heading" defaultText="What your estimate includes" adminMode={adminMode} />
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            <EditableText id="breakdown.sub" defaultText="No hidden costs. Every dollar accounted for." adminMode={adminMode} />
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pricing card */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white rounded-3xl border border-ink/8 p-6 sm:p-8 shadow-sm">
            <div className="text-sm text-muted mb-1">
              <EditableText id="breakdown.total.label" defaultText="Sample Estimate" adminMode={adminMode} />
            </div>
            <div className="font-display text-5xl text-ink mb-6">${total.toLocaleString()}</div>

            <div className="space-y-4">
              {items.items.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }} className="relative group/line">
                  {adminMode && (
                    <CrudActions
                      compact
                      onEdit={() => { setEditItem(item); setItemForm({ label: item.label, amount: item.amount }); setItemModal(true); }}
                      onDelete={() => setItemDeleteId(item.id)}
                      className="absolute -top-1 right-0 z-10"
                    />
                  )}
                  <div className="flex justify-between text-sm mb-1 pr-16">
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <span className="font-semibold text-ink">${item.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-ink/6 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={inView ? { width: `${(item.amount / max) * 100}%` } : {}} transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }} className={`h-full rounded-full ${item.color}`} />
                  </div>
                </motion.div>
              ))}
            </div>

            {adminMode && <AddButton label="Add Line Item" onClick={() => { setEditItem(null); setItemForm({ label: '', amount: 0 }); setItemModal(true); }} className="mt-5 w-full justify-center" />}

            <div className="mt-6 pt-4 border-t border-ink/10 flex justify-between">
              <span className="text-base font-bold text-ink">Total</span>
              <span className="text-base font-bold text-ink">${total.toLocaleString()}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['14-Day Price Lock', 'Fixed Price', 'No Hidden Fees'].map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium">
                  <Icon name="lock" size={11} />
                  <EditableText id={`breakdown.tag.${i}`} defaultText={tag} adminMode={adminMode} />
                </span>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="bg-ink rounded-3xl p-6 sm:p-8 text-ivory">
            <h3 className="font-display text-lg mb-1">
              <EditableText id="breakdown.tl.heading" defaultText="Your Move Timeline" adminMode={adminMode} />
            </h3>
            <p className="text-sm text-ivory/50 mb-8">
              <EditableText id="breakdown.tl.sub" defaultText="From survey to front door" adminMode={adminMode} />
            </p>

            <div className="relative">
              <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-gold-light via-gold to-gold-light/30" />
              <div className="space-y-6">
                {steps.items.map((step, i) => (
                  <motion.div key={step.id} initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }} className="flex items-center gap-4 group/step relative">
                    <div className="w-10 h-10 rounded-full bg-ivory/10 border border-gold/30 flex items-center justify-center text-gold-light flex-shrink-0 relative z-10">
                      <Icon name={step.icon} size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{step.label}</div>
                      <div className="text-xs text-ivory/50">{step.day}</div>
                    </div>
                    {adminMode && (
                      <CrudActions
                        compact
                        onEdit={() => { setEditStep(step); setStepForm({ label: step.label, day: step.day, icon: step.icon }); setStepModal(true); }}
                        onDelete={() => setStepDeleteId(step.id)}
                        className="opacity-0 group-hover/step:opacity-100 transition-opacity"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {adminMode && stepForm !== null && <AddButton label="Add Stage" onClick={() => { setEditStep(null); setStepForm({ label: '', day: '', icon: 'doc' }); setStepModal(true); }} className="mt-6 w-full justify-center" />}

            <div className="mt-8 pt-6 border-t border-ivory/15 flex items-center justify-between text-sm">
              <span className="text-ivory/50">
                <EditableText id="breakdown.tl.note" defaultText="Total transit time" adminMode={adminMode} />
              </span>
              <span className="font-semibold text-ivory">
                <EditableText id="breakdown.tl.days" defaultText="~35 days" adminMode={adminMode} />
              </span>
            </div>

            <a href="#lead-form" className="block text-center mt-6 py-3 gradient-gold text-ink font-semibold rounded-xl hover:opacity-90 transition-all text-sm">
              <EditableText id="breakdown.tl.cta" defaultText="Start Your Move" adminMode={adminMode} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Item modal */}
      <Modal open={itemModal} onClose={() => setItemModal(false)} title={editItem ? 'Edit Line Item' : 'Add Line Item'} size="sm">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Label</label><input value={itemForm.label} onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label><input type="number" value={itemForm.amount} onChange={(e) => setItemForm({ ...itemForm, amount: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div className="flex gap-3 justify-end"><button onClick={() => setItemModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button><button onClick={saveItem} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editItem ? 'Save' : 'Add'}</button></div>
        </div>
      </Modal>
      <ConfirmDialog open={!!itemDeleteId} onClose={() => setItemDeleteId(null)} onConfirm={() => { if (itemDeleteId) { items.remove(itemDeleteId); onToast('Line deleted', 'error'); setItemDeleteId(null); } }} title="Delete Line" message="Delete this line item?" />

      {/* Step modal */}
      <Modal open={stepModal} onClose={() => setStepModal(false)} title={editStep ? 'Edit Stage' : 'Add Stage'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <div className="grid grid-cols-8 gap-1.5 max-h-32 overflow-y-auto p-1 border border-gray-200 rounded-xl">
              {ICON_OPTIONS.map((opt) => (
                <button key={opt.name} type="button" title={opt.label} onClick={() => setStepForm({ ...stepForm, icon: opt.name })} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${stepForm.icon === opt.name ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                  <Icon name={opt.name} size={16} />
                </button>
              ))}
            </div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Label</label><input value={stepForm.label} onChange={(e) => setStepForm({ ...stepForm, label: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Day range</label><input value={stepForm.day} onChange={(e) => setStepForm({ ...stepForm, day: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Day 3–5" /></div>
          <div className="flex gap-3 justify-end"><button onClick={() => setStepModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button><button onClick={saveStep} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editStep ? 'Save' : 'Add'}</button></div>
        </div>
      </Modal>
      <ConfirmDialog open={!!stepDeleteId} onClose={() => setStepDeleteId(null)} onConfirm={() => { if (stepDeleteId) { steps.remove(stepDeleteId); onToast('Stage deleted', 'error'); setStepDeleteId(null); } }} title="Delete Stage" message="Delete this timeline stage?" />
    </section>
  );
}
