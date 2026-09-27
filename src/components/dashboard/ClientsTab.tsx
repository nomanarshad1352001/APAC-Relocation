import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCollection } from '../../store/SiteDataContext';
import { generateId } from '../../store/useStore';
import { seedClients, type Client } from '../../store/dashboardData';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import Icon from '../ui/Icon';

interface EnquiryItem {
  id: string; name: string; email: string; phone: string; from: string; to: string;
  date: string; size: string; notes: string; contactMethod: string; createdAt: string;
  status: 'new' | 'in-progress' | 'completed';
}
interface QuoteItem {
  id: string; from: string; to: string; date: string; moveType: string;
  name: string; email: string; phone: string; estimate: number; createdAt: string;
}

const enqStatusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
};

const statusOpts: Client['status'][] = ['lead', 'quoted', 'booked', 'active', 'completed'];
const statusBadge: Record<string, string> = { lead: 'bg-gray-100 text-gray-700', quoted: 'bg-amber-100 text-amber-700', booked: 'bg-blue-100 text-blue-700', active: 'bg-purple-100 text-purple-700', completed: 'bg-green-100 text-green-700' };
const emptyForm = { name: '', email: '', phone: '', company: '', origin: 'Singapore', destination: '', moveDate: '', status: 'lead' as Client['status'], value: 0, notes: '' };

export default function ClientsTab() {
  const { items, create, update, remove } = useCollection<Client>('dash_clients', seedClients);
  const siteEnquiries = useCollection<EnquiryItem>('site_enquiries', []);
  const siteQuotes = useCollection<QuoteItem>('site_quotes', []);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = items.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openCreate = () => { setEditItem(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (c: Client) => { setEditItem(c); setForm({ name: c.name, email: c.email, phone: c.phone, company: c.company, origin: c.origin, destination: c.destination, moveDate: c.moveDate, status: c.status, value: c.value, notes: c.notes }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editItem) {
      update(editItem.id, form);
    } else {
      create({ id: generateId('cl'), ...form, avatar: form.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2), createdAt: new Date().toISOString().slice(0, 10) });
    }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) { remove(deleteId); setDeleteId(null); } };

  const stats = [
    { label: 'Total Clients', value: items.length, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Moves', value: items.filter((c) => c.status === 'active').length, color: 'bg-purple-50 text-purple-600' },
    { label: 'New Leads', value: items.filter((c) => c.status === 'lead').length, color: 'bg-amber-50 text-amber-600' },
    { label: 'Pipeline Value', value: `$${items.reduce((sum, c) => sum + c.value, 0).toLocaleString()}`, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {['all', ...statusOpts].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..." className="flex-1 sm:w-56 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 flex items-center gap-2 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Client
          </button>
        </div>
      </div>

      {/* Client Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{c.avatar}</div>
                <div><div className="text-sm font-bold text-gray-900">{c.name}</div><div className="text-[10px] text-gray-500">{c.company}</div></div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusBadge[c.status]}`}>{c.status}</span>
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-600"><Icon name="mail" size={12} className="text-gray-400 flex-shrink-0" />{c.email}</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600"><Icon name="phone" size={12} className="text-gray-400 flex-shrink-0" />{c.phone}</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600"><Icon name="mapPin" size={12} className="text-gray-400 flex-shrink-0" />{c.origin} → {c.destination}</div>
              {c.moveDate && <div className="flex items-center gap-1.5 text-xs text-gray-600"><Icon name="calendar" size={12} className="text-gray-400 flex-shrink-0" />{c.moveDate}</div>}
            </div>
            {c.value > 0 && <div className="text-lg font-bold text-gray-900 mb-3">${c.value.toLocaleString()}</div>}
            {c.notes && <p className="text-[10px] text-gray-500 line-clamp-2 mb-3">{c.notes}</p>}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(c)} className="flex-1 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-200 transition-colors">Edit</button>
              <button onClick={() => setDeleteId(c.id)} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-gray-500"><div className="text-4xl mb-2">👥</div><p className="text-sm">No clients found</p></div>}

      {/* ─── Live Website Leads (synced from the public site) ─── */}
      {(siteEnquiries.items.length > 0 || siteQuotes.items.length > 0) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">Website Leads</h3>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" /> Live from website
            </span>
          </div>

          {siteEnquiries.items.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <Icon name="clipboard" size={14} className="text-gray-500" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Enquiries ({siteEnquiries.items.length})</span>
              </div>
              <div className="divide-y divide-gray-50">
                {siteEnquiries.items.map((e) => (
                  <div key={e.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3.5 group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{e.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${enqStatusColors[e.status] || enqStatusColors.new}`}>{e.status}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{e.email} · {e.phone}</div>
                      <div className="text-xs text-gray-500">{e.from} → {e.to || 'Undecided'} · {e.size || '—'} · {e.contactMethod}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <select
                        value={e.status}
                        onChange={(ev) => siteEnquiries.update(e.id, { status: ev.target.value as EnquiryItem['status'] })}
                        className="text-xs rounded-lg border border-gray-200 px-2 py-1.5 bg-gray-50"
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        onClick={() => create({
                          id: generateId('cl'), name: e.name, email: e.email, phone: e.phone, company: '',
                          origin: e.from, destination: e.to, moveDate: e.date, status: 'lead', value: 0,
                          avatar: e.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
                          notes: `Converted from website enquiry · ${e.size} · ${e.notes}`,
                          createdAt: new Date().toISOString().slice(0, 10),
                        })}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        + Convert
                      </button>
                      <button onClick={() => siteEnquiries.remove(e.id)} className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200" title="Delete">
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {siteQuotes.items.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <Icon name="money" size={14} className="text-gray-500" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Saved Quotes ({siteQuotes.items.length})</span>
              </div>
              <div className="divide-y divide-gray-50">
                {siteQuotes.items.map((q) => (
                  <div key={q.id} className="flex items-center gap-3 px-5 py-3.5 group">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900">{q.name} — {q.from} → {q.to}</div>
                      <div className="text-xs text-gray-500">{q.moveType} · ${q.estimate.toLocaleString()} · {q.createdAt}</div>
                    </div>
                    <button onClick={() => siteQuotes.remove(q.id)} className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" title="Delete">
                      <Icon name="trash" size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Client' : 'New Client'} size="lg">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Company</label><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Origin</label><input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Destination</label><input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Move Date</label><input type="date" value={form.moveDate} onChange={(e) => setForm({ ...form, moveDate: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Client['status'] })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm">{statusOpts.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Value ($)</label><input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none" /></div>
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editItem ? 'Save' : 'Create Client'}</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Client" message="This will permanently delete this client record." />
    </div>
  );
}
