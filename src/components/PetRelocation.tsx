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

const PET_HERO = 'https://images.pexels.com/photos/29040688/pexels-photo-29040688.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200';

interface PetItem {
  id: string;
  photo: string;
  label: string;
  cost: string;
}

const initialPets: PetItem[] = [
  { id: 'p1', photo: 'https://images.pexels.com/photos/10096129/pexels-photo-10096129.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', label: 'Dogs', cost: '$2,800' },
  { id: 'p2', photo: 'https://images.pexels.com/photos/38313609/pexels-photo-38313609.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', label: 'Cats', cost: '$2,200' },
  { id: 'p3', photo: 'https://images.pexels.com/photos/36947831/pexels-photo-36947831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', label: 'Birds', cost: '$1,800' },
  { id: 'p4', photo: 'https://images.pexels.com/photos/19904640/pexels-photo-19904640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', label: 'Rabbits', cost: '$1,600' },
];

interface EstimateRow { id: string; label: string; amount: number; }
const seedEstimateRows: EstimateRow[] = [
  { id: 'e1', label: 'Golden Retriever (25kg) — flight', amount: 3200 },
  { id: 'e2', label: 'IATA-compliant crate', amount: 450 },
  { id: 'e3', label: 'Vet documentation', amount: 180 },
  { id: 'e4', label: 'USDA endorsement', amount: 120 },
];

const DEFAULT_FEATURES = ['IATA Certification', 'USDA Endorsements', 'Custom Travel Crates', 'Rabies Documentation'];

interface Props { adminMode: boolean; onToast: (msg: string, type: 'success' | 'error' | 'info') => void; }

export default function PetRelocation({ adminMode, onToast }: Props) {
  const { ref, inView } = useAnimateOnScroll();
  const pets = useCollection<PetItem>('site_pets', initialPets);
  const rows = useCollection<EstimateRow>('site_pet_estimate', seedEstimateRows);
  const total = rows.items.reduce((s, r) => s + r.amount, 0);

  // Pet CRUD
  const [petModal, setPetModal] = useState(false);
  const [editPet, setEditPet] = useState<PetItem | null>(null);
  const [petDeleteId, setPetDeleteId] = useState<string | null>(null);
  const [petForm, setPetForm] = useState({ photo: '', label: '', cost: '' });

  const savePet = () => {
    if (!petForm.label.trim()) return;
    const photo = petForm.photo.trim() || PET_HERO;
    if (editPet) { pets.update(editPet.id, { ...petForm, photo }); onToast(`"${petForm.label}" updated`, 'success'); }
    else { pets.create({ id: generateId('pet'), ...petForm, photo }); onToast(`"${petForm.label}" added`, 'success'); }
    setPetModal(false);
  };

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div ref={ref} initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
            <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-semibold mb-4">
              <EditableText id="pets.eyebrow" defaultText="Pet Travel Concierge" adminMode={adminMode} />
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">
              <EditableText id="pets.heading" defaultText="The whole family flies." adminMode={adminMode} />
            </h2>
            <p className="text-lg text-muted mb-8">
              <EditableText id="pets.sub" defaultText="We've moved 2,400+ pets with zero incidents since 2019. Your fur family is in safe hands." adminMode={adminMode} multiline />
            </p>

            {/* Pet cards with real photos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {pets.items.map((pet) => (
                <div key={pet.id} className="relative bg-ivory rounded-2xl overflow-hidden border border-ink/8 text-center hover:shadow-xl transition-shadow group/pet">
                  {adminMode && (
                    <CrudActions
                      compact
                      onEdit={() => { setEditPet(pet); setPetForm({ photo: pet.photo, label: pet.label, cost: pet.cost }); setPetModal(true); }}
                      onDelete={() => setPetDeleteId(pet.id)}
                      className="absolute top-2 right-2 z-10"
                    />
                  )}
                  <div className="relative h-24 overflow-hidden">
                    <img src={pet.photo} alt={pet.label} className="w-full h-full object-cover group-hover/pet:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold text-ink">{pet.label}</div>
                    <div className="text-xs text-muted mt-0.5">from {pet.cost}</div>
                  </div>
                </div>
              ))}
            </div>
            {adminMode && <AddButton onClick={() => { setEditPet(null); setPetForm({ photo: '', label: '', cost: '' }); setPetModal(true); }} label="Add Pet Type" className="mb-8 w-full justify-center" />}
            {!adminMode && <div className="mb-8" />}

            <div className="grid grid-cols-2 gap-3 mb-8">
              {DEFAULT_FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <Icon name="check" size={14} className="text-gold flex-shrink-0" />
                  <EditableText id={`pets.feature.${i}`} defaultText={f} adminMode={adminMode} />
                </div>
              ))}
            </div>

            <div className="flex gap-8 mb-8">
              <div>
                <div className="font-display text-3xl text-ink">
                  <EditableText id="pets.stat.a.value" defaultText="2,400+" adminMode={adminMode} />
                </div>
                <div className="text-sm text-muted">
                  <EditableText id="pets.stat.a.label" defaultText="Pets moved" adminMode={adminMode} />
                </div>
              </div>
              <div>
                <div className="font-display text-3xl text-gold">
                  <EditableText id="pets.stat.b.value" defaultText="0" adminMode={adminMode} />
                </div>
                <div className="text-sm text-muted">
                  <EditableText id="pets.stat.b.label" defaultText="Incidents since 2019" adminMode={adminMode} />
                </div>
              </div>
            </div>

            {/* Editable estimate card */}
            <div className="bg-ivory rounded-2xl border border-ink/8 p-5">
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                <EditableText id="pets.estimate.label" defaultText="Example Pet Relocation Estimate" adminMode={adminMode} />
              </div>
              <div className="space-y-2 text-sm">
                {rows.items.map((r) => (
                  <div key={r.id} className="flex justify-between items-center group/row relative">
                    <span className="text-muted pr-4">{r.label}</span>
                    <span className="font-semibold text-ink flex items-center gap-2">
                      ${r.amount.toLocaleString()}
                      {adminMode && (
                        <CrudActions
                          compact
                          onEdit={() => {
                            const newLabel = window.prompt('Edit label', r.label);
                            if (newLabel !== null) { rows.update(r.id, { label: newLabel }); onToast('Row updated', 'success'); }
                            const newAmount = window.prompt('Edit amount ($)', String(r.amount));
                            if (newAmount !== null && !isNaN(Number(newAmount))) { rows.update(r.id, { amount: Number(newAmount) }); onToast('Amount updated', 'success'); }
                          }}
                          onDelete={() => { rows.remove(r.id); onToast('Row deleted', 'error'); }}
                        />
                      )}
                    </span>
                  </div>
                ))}
                {adminMode && (
                  <button
                    onClick={() => {
                      const label = window.prompt('Line item label');
                      if (!label) return;
                      const amount = window.prompt('Amount ($)', '500');
                      if (!amount || isNaN(Number(amount))) return;
                      rows.create({ id: generateId('e'), label, amount: Number(amount) });
                      onToast('Line added', 'success');
                    }}
                    className="text-xs text-gold font-semibold hover:underline"
                  >
                    + Add line item
                  </button>
                )}
                <div className="border-t border-ink/10 pt-2 flex justify-between font-bold text-ink">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-ink/20">
              <img src={PET_HERO} alt="Golden Retriever in a travel crate" className="w-full h-[400px] lg:h-[580px] object-cover" loading="lazy" />
              <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-ink">
                    <Icon name="paw" size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink">
                      <EditableText id="pets.card.title" defaultText="IATA Certified Transport" adminMode={adminMode} />
                    </div>
                    <div className="text-xs text-muted">
                      <EditableText id="pets.card.sub" defaultText="Climate-controlled cabin, vet-approved crates" adminMode={adminMode} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pet modal */}
      <Modal open={petModal} onClose={() => setPetModal(false)} title={editPet ? 'Edit Pet Type' : 'Add Pet Type'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Photo URL (Pexels / Unsplash)</label>
            <input value={petForm.photo} onChange={(e) => setPetForm({ ...petForm, photo: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="https://images.pexels.com/..." />
            {petForm.photo && <img src={petForm.photo} alt="Preview" className="mt-2 w-full h-28 object-cover rounded-xl" />}
          </div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Pet Type</label><input value={petForm.label} onChange={(e) => setPetForm({ ...petForm, label: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Dogs" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Starting Cost</label><input value={petForm.cost} onChange={(e) => setPetForm({ ...petForm, cost: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="$2,800" /></div>
          <div className="flex gap-3 justify-end"><button onClick={() => setPetModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button><button onClick={savePet} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editPet ? 'Save' : 'Add'}</button></div>
        </div>
      </Modal>
      <ConfirmDialog open={!!petDeleteId} onClose={() => setPetDeleteId(null)} onConfirm={() => { if (petDeleteId) { pets.remove(petDeleteId); onToast('Pet type deleted', 'error'); setPetDeleteId(null); } }} title="Delete Pet Type" message="Are you sure? This action cannot be undone." />
    </section>
  );
}
