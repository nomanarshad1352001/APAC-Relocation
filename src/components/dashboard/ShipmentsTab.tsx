import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCollection } from '../../store/SiteDataContext';
import { generateId } from '../../store/useStore';
import { seedShipments, type Shipment } from '../../store/dashboardData';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import Icon, { type IconName } from '../ui/Icon';

const statuses: { key: Shipment['status']; label: string; color: string; icon: IconName }[] = [
  { key: 'survey', label: 'Survey', color: 'border-blue-300 bg-blue-50', icon: 'clipboard' },
  { key: 'packing', label: 'Packing', color: 'border-amber-300 bg-amber-50', icon: 'package' },
  { key: 'in-transit', label: 'In Transit', color: 'border-purple-300 bg-purple-50', icon: 'anchor' },
  { key: 'customs', label: 'Customs', color: 'border-orange-300 bg-orange-50', icon: 'shield' },
  { key: 'delivered', label: 'Delivered', color: 'border-green-300 bg-green-50', icon: 'check' },
];

const badgeColor: Record<string, string> = {
  survey: 'bg-blue-100 text-blue-700',
  packing: 'bg-amber-100 text-amber-700',
  'in-transit': 'bg-purple-100 text-purple-700',
  customs: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
};

const emptyForm = { clientName: '', origin: 'Singapore', destination: '', status: 'survey' as Shipment['status'], mode: 'sea' as Shipment['mode'], volume: '', value: 0, eta: '', departDate: '', notes: '' };

export default function ShipmentsTab() {
  const { items, create, update, remove } = useCollection<Shipment>('dash_shipments', seedShipments);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Shipment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<Shipment | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => { setEditItem(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (s: Shipment) => { setEditItem(s); setForm({ clientName: s.clientName, origin: s.origin, destination: s.destination, status: s.status, mode: s.mode, volume: s.volume, value: s.value, eta: s.eta, departDate: s.departDate, notes: s.notes }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.clientName.trim()) return;
    if (editItem) {
      update(editItem.id, { ...form, progress: editItem.progress });
    } else {
      create({ id: generateId('sh'), ...form, trackingCode: `APAC-2026-${String(items.length + 150).padStart(4, '0')}`, progress: form.status === 'survey' ? 5 : form.status === 'packing' ? 25 : form.status === 'in-transit' ? 50 : form.status === 'customs' ? 85 : 100 });
    }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) { remove(deleteId); setDeleteId(null); } };

  const moveStatus = (id: string, newStatus: Shipment['status']) => {
    const prog = newStatus === 'survey' ? 5 : newStatus === 'packing' ? 25 : newStatus === 'in-transit' ? 50 : newStatus === 'customs' ? 85 : 100;
    update(id, { status: newStatus, progress: prog });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Shipment Pipeline</h2>
          <p className="text-sm text-gray-500">{items.length} total shipments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Kanban</button>
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>List</button>
          </div>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Shipment
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statuses.map((col) => {
            const colItems = items.filter((s) => s.status === col.key);
            return (
              <div key={col.key} className={`rounded-2xl border-2 ${col.color} p-3 kanban-col`}>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="text-gray-600"><Icon name={col.icon} size={14} /></span>
                  <span className="text-xs font-bold text-gray-700 uppercase">{col.label}</span>
                  <span className="ml-auto text-xs font-bold text-gray-500 bg-white rounded-full w-5 h-5 flex items-center justify-center">{colItems.length}</span>
                </div>
                <div className="space-y-2">
                  {colItems.map((s) => (
                    <motion.div key={s.id} layout className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setDetailItem(s)}>
                      <div className="text-xs font-bold text-gray-900 mb-1">{s.clientName}</div>
                      <div className="text-[10px] text-gray-500 mb-2">{s.destination}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">{s.trackingCode}</span>
                        <span className="text-[10px] font-bold text-gray-700">${s.value.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-1 bg-gray-100 rounded-full mt-2">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.progress}%` }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Tracking</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Route</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">ETA</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Value</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr></thead>
              <tbody>{items.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4"><span className="text-xs font-mono font-semibold text-blue-600">{s.trackingCode}</span></td>
                  <td className="py-3 px-4 text-xs font-semibold text-gray-900">{s.clientName}</td>
                  <td className="py-3 px-4 text-xs text-gray-600 hidden md:table-cell">{s.origin} → {s.destination}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeColor[s.status]}`}>{s.status}</span></td>
                  <td className="py-3 px-4 text-xs text-gray-600 hidden sm:table-cell">{s.eta}</td>
                  <td className="py-3 px-4 text-right text-xs font-semibold">${s.value.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setDetailItem(s)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500" title="View"><Icon name="eye" size={13} /></button>
                      <button onClick={() => openEdit(s)} className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center hover:bg-blue-200 text-blue-600" title="Edit"><Icon name="pencil" size={13} /></button>
                      <button onClick={() => setDeleteId(s.id)} className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center hover:bg-red-200 text-red-600" title="Delete"><Icon name="trash" size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!detailItem} onClose={() => setDetailItem(null)} title={detailItem ? `Shipment — ${detailItem.trackingCode}` : ''} size="lg">
        {detailItem && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[{ l: 'Client', v: detailItem.clientName }, { l: 'Route', v: `${detailItem.origin} → ${detailItem.destination}` }, { l: 'Mode', v: detailItem.mode.toUpperCase() }, { l: 'Volume', v: detailItem.volume }, { l: 'Value', v: `$${detailItem.value.toLocaleString()}` }, { l: 'ETA', v: detailItem.eta }, { l: 'Departed', v: detailItem.departDate || '—' }].map((r) => (
                <div key={r.l}><div className="text-[10px] text-gray-500 uppercase font-semibold">{r.l}</div><div className="text-sm font-semibold text-gray-900">{r.v}</div></div>
              ))}
            </div>
            <div>
              <div className="text-[10px] text-gray-500 uppercase font-semibold mb-2">Progress</div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all" style={{ width: `${detailItem.progress}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-1"><span>0%</span><span className="font-bold text-gray-700">{detailItem.progress}%</span><span>100%</span></div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 uppercase font-semibold mb-2">Update Status</div>
              <div className="flex flex-wrap gap-2">
                {statuses.map((st) => (
                  <button key={st.key} onClick={() => { moveStatus(detailItem.id, st.key); setDetailItem({ ...detailItem, status: st.key }); }} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${detailItem.status === st.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}><Icon name={st.icon} size={12} />{st.label}</button>
                ))}
              </div>
            </div>
            {detailItem.notes && <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Notes</div><p className="text-sm text-gray-700">{detailItem.notes}</p></div>}
            <div className="flex gap-2 pt-2">
              <button onClick={() => { openEdit(detailItem); setDetailItem(null); }} className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">Edit Shipment</button>
              <button onClick={() => { setDeleteId(detailItem.id); setDetailItem(null); }} className="px-4 py-2.5 bg-red-100 text-red-700 text-sm font-semibold rounded-xl hover:bg-red-200 transition-colors">Delete</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Shipment' : 'New Shipment'} size="lg">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Client Name</label><input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Origin</label><input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Destination</label><input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Shipment['status'] })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm"><option value="survey">Survey</option><option value="packing">Packing</option><option value="in-transit">In Transit</option><option value="customs">Customs</option><option value="delivered">Delivered</option></select></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Mode</label><select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as Shipment['mode'] })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm"><option value="sea">Sea</option><option value="air">Air</option><option value="combo">Combo</option></select></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Volume</label><input value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="2 Bedroom" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Value ($)</label><input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">ETA</label><input value={form.eta} onChange={(e) => setForm({ ...form, eta: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Feb 14, 2026" /></div>
          <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none" /></div>
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editItem ? 'Save Changes' : 'Create Shipment'}</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Shipment" message="Are you sure you want to delete this shipment? This action cannot be undone." />
    </div>
  );
}
