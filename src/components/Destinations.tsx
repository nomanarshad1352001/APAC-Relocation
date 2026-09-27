import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { useCollection } from '../store/SiteDataContext';
import { generateId } from '../store/useStore';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import CrudActions from './ui/CrudActions';
import AddButton from './ui/AddButton';
import Icon from './ui/Icon';
import EditableText from './ui/EditableText';

interface CityItem {
  id: string;
  name: string;
  state: string;
  avgCost: string;
  seaDays: string;
  airDays: string;
  neighborhoods: string[];
  climate: string;
  community: string;
  x: number;
  y: number;
}

const initialCities: CityItem[] = [
  { id: 'c1', name: 'San Francisco', state: 'CA', avgCost: '$5,200', seaDays: '25–30', airDays: '5–7', neighborhoods: ['Marina District', 'Pacific Heights', 'SoMa', 'Noe Valley'], climate: 'Mild Mediterranean – 15°C–20°C year-round', community: '~8,000 Singaporean families', x: 12, y: 42 },
  { id: 'c2', name: 'Seattle', state: 'WA', avgCost: '$4,800', seaDays: '22–28', airDays: '5–7', neighborhoods: ['Capitol Hill', 'Queen Anne', 'Ballard', 'Bellevue'], climate: 'Oceanic – mild, rainy winters', community: '~5,000 Singaporean families', x: 14, y: 22 },
  { id: 'c3', name: 'Los Angeles', state: 'CA', avgCost: '$4,900', seaDays: '23–30', airDays: '5–7', neighborhoods: ['Santa Monica', 'Pasadena', 'Irvine', 'Arcadia'], climate: 'Hot-summer Mediterranean – 18°C–30°C', community: '~12,000 Singaporean families', x: 13, y: 55 },
  { id: 'c4', name: 'Austin', state: 'TX', avgCost: '$4,200', seaDays: '28–35', airDays: '6–8', neighborhoods: ['Mueller', 'Westlake', 'Cedar Park', 'Round Rock'], climate: 'Humid subtropical – hot summers', community: '~3,000 Singaporean families', x: 42, y: 62 },
  { id: 'c5', name: 'Boston', state: 'MA', avgCost: '$5,800', seaDays: '30–38', airDays: '6–8', neighborhoods: ['Cambridge', 'Brookline', 'Newton', 'Back Bay'], climate: 'Continental – cold winters, warm summers', community: '~6,000 Singaporean families', x: 85, y: 28 },
  { id: 'c6', name: 'New York', state: 'NY', avgCost: '$6,200', seaDays: '30–38', airDays: '6–8', neighborhoods: ['Upper West Side', 'Brooklyn Heights', 'Jersey City', 'Westchester'], climate: 'Humid subtropical – four seasons', community: '~15,000 Singaporean families', x: 83, y: 32 },
];

interface Props { adminMode: boolean; onToast: (msg: string, type: 'success' | 'error' | 'info') => void; }

export default function Destinations({ adminMode, onToast }: Props) {
  const { ref, inView } = useAnimateOnScroll();
  const { items, create, update, remove } = useCollection<CityItem>('site_cities', initialCities);
  const [selectedId, setSelectedId] = useState('c1');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<CityItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', state: '', avgCost: '', seaDays: '', airDays: '', neighborhoods: '', climate: '', community: '', x: 50, y: 50 });

  const city = items.find((c) => c.id === selectedId) || items[0];

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', state: '', avgCost: '', seaDays: '', airDays: '', neighborhoods: '', climate: '', community: '', x: 50, y: 50 });
    setModalOpen(true);
  };

  const openEdit = (item: CityItem) => {
    setEditItem(item);
    setForm({ name: item.name, state: item.state, avgCost: item.avgCost, seaDays: item.seaDays, airDays: item.airDays, neighborhoods: item.neighborhoods.join(', '), climate: item.climate, community: item.community, x: item.x, y: item.y });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const hoods = form.neighborhoods.split(',').map((n) => n.trim()).filter(Boolean);
    if (editItem) {
      update(editItem.id, { ...form, neighborhoods: hoods });
      onToast(`"${form.name}" updated`, 'success');
    } else {
      const newId = generateId('city');
      create({ id: newId, ...form, neighborhoods: hoods });
      setSelectedId(newId);
      onToast(`"${form.name}" added`, 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      remove(deleteId);
      if (selectedId === deleteId && items.length > 1) setSelectedId(items.find((c) => c.id !== deleteId)?.id || '');
      onToast('City deleted', 'error');
      setDeleteId(null);
    }
  };

  return (
    <section id="destinations" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-semibold mb-4">
            <EditableText id="dest.eyebrow" defaultText="_DESTINATIONS_" adminMode={adminMode} />
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">
            <EditableText id="dest.heading" defaultText="Where APAC families land" adminMode={adminMode} />
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            <EditableText id="dest.sub" defaultText="Select a city to see transit times, costs, and community info" adminMode={adminMode} />
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="grid lg:grid-cols-5 gap-8">
          {/* Map */}
          <div className="lg:col-span-3 relative">
            <div className="relative bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100 min-h-[300px] sm:min-h-[400px]">
              <svg viewBox="0 0 100 80" className="w-full h-full opacity-10 absolute inset-0 p-8">
                <path d="M5,20 L10,15 L18,16 L25,12 L35,10 L42,12 L50,10 L55,8 L62,10 L70,12 L78,15 L85,18 L90,22 L92,28 L90,35 L88,40 L85,45 L82,48 L78,52 L75,55 L70,58 L65,60 L60,62 L55,63 L50,65 L45,65 L40,64 L35,62 L30,60 L25,58 L20,55 L15,50 L12,45 L10,40 L8,35 L6,28 Z" fill="currentColor" className="text-gray-400" />
              </svg>
              {items.map((c) => (
                <button key={c.id} onClick={() => setSelectedId(c.id)} className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
                  <motion.div animate={{ scale: selectedId === c.id ? 1.3 : 1 }} className={`w-4 h-4 rounded-full transition-colors shadow-lg ${selectedId === c.id ? 'bg-accent ring-4 ring-blue-200' : 'bg-gray-400 hover:bg-gray-600'}`} />
                  <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold transition-colors ${selectedId === c.id ? 'text-accent' : 'text-muted'}`}>{c.name}</div>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-4 lg:hidden">
              {items.map((c) => (
                <button key={c.id} onClick={() => setSelectedId(c.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedId === c.id ? 'bg-primary text-white' : 'bg-gray-100 text-muted hover:bg-gray-200'}`}>{c.name}</button>
              ))}
            </div>
            {adminMode && <AddButton onClick={openCreate} label="Add City" className="mt-4 w-full justify-center" />}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {city && (
              <AnimatePresence mode="wait">
                <motion.div key={city.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm relative">
                  {adminMode && <CrudActions onEdit={() => openEdit(city)} onDelete={() => setDeleteId(city.id)} compact className="absolute top-4 right-4 z-10" />}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-8 h-8 rounded-full gradient-gold text-ink flex items-center justify-center">
                      <Icon name="mapPin" size={16} />
                    </span>
                    <h3 className="font-display text-2xl text-primary">{city.name}</h3>
                  </div>
                  <div className="text-sm text-muted mb-6">{city.state}, United States</div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-3 rounded-xl bg-gray-50">
                      <div className="text-lg font-bold text-primary">{city.avgCost}</div>
                      <div className="text-[10px] text-muted">Avg. Cost</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-gray-50">
                      <div className="text-lg font-bold text-primary">{city.seaDays}</div>
                      <div className="text-[10px] text-muted">Sea Days</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-gray-50">
                      <div className="text-lg font-bold text-primary">{city.airDays}</div>
                      <div className="text-[10px] text-muted">Air Days</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-primary mb-2">Popular Neighborhoods</div>
                      <div className="flex flex-wrap gap-1.5">
                        {city.neighborhoods.map((n) => (
                          <span key={n} className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{n}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-primary mb-1">Climate</div>
                      <p className="text-xs text-muted">{city.climate}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-primary mb-1">SG Community</div>
                      <p className="text-xs text-muted">{city.community}</p>
                    </div>
                  </div>
                  <a href="#quote" className="mt-6 flex items-center justify-center gap-2 text-center py-3 bg-primary text-white font-semibold rounded-xl hover:bg-gray-800 transition-all text-sm">
                    Get {city.name} Quote
                    <Icon name="arrowRight" size={14} />
                  </a>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit City' : 'Add City'} size="lg">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="City name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="CA" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Average Cost</label>
            <input value={form.avgCost} onChange={(e) => setForm({ ...form, avgCost: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="$5,200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sea Days</label>
            <input value={form.seaDays} onChange={(e) => setForm({ ...form, seaDays: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="25–30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Air Days</label>
            <input value={form.airDays} onChange={(e) => setForm({ ...form, airDays: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="5–7" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Community Size</label>
            <input value={form.community} onChange={(e) => setForm({ ...form, community: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="~8,000 families" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Neighborhoods (comma separated)</label>
            <input value={form.neighborhoods} onChange={(e) => setForm({ ...form, neighborhoods: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Marina District, Pacific Heights" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Climate</label>
            <input value={form.climate} onChange={(e) => setForm({ ...form, climate: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Mild Mediterranean" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Map X Position (%)</label>
            <input type="number" min={0} max={100} value={form.x} onChange={(e) => setForm({ ...form, x: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Map Y Position (%)</label>
            <input type="number" min={0} max={100} value={form.y} onChange={(e) => setForm({ ...form, y: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">{editItem ? 'Save Changes' : 'Add City'}</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete City" message="Are you sure you want to remove this destination? This action cannot be undone." />
    </section>
  );
}
