import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCollection } from '../../store/SiteDataContext';
import { generateId } from '../../store/useStore';
import { seedInvoices, type Invoice } from '../../store/dashboardData';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import Icon, { type IconName } from '../ui/Icon';

const statusBadge: Record<string, string> = { draft: 'bg-gray-100 text-gray-700', sent: 'bg-blue-100 text-blue-700', paid: 'bg-green-100 text-green-700', overdue: 'bg-red-100 text-red-700' };

export default function InvoicesTab() {
  const { items, create, update, remove } = useCollection<Invoice>('dash_invoices', seedInvoices);
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Invoice | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<Invoice | null>(null);
  const [form, setForm] = useState({ clientName: '', clientEmail: '', itemsText: '', total: 0, status: 'draft' as Invoice['status'], dueDate: '', notes: '' });

  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter);

  const openCreate = () => { setEditItem(null); setForm({ clientName: '', clientEmail: '', itemsText: '', total: 0, status: 'draft', dueDate: '', notes: '' }); setModalOpen(true); };
  const openEdit = (inv: Invoice) => { setEditItem(inv); setForm({ clientName: inv.clientName, clientEmail: inv.clientEmail, itemsText: inv.items.map((i) => `${i.desc}: $${i.rate}`).join('\n'), total: inv.total, status: inv.status, dueDate: inv.dueDate, notes: inv.notes }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.clientName.trim()) return;
    const lineItems = form.itemsText.split('\n').filter(Boolean).map((line) => {
      const [desc, rate] = line.split(':').map((s) => s.trim());
      return { desc: desc || 'Service', qty: 1, rate: parseFloat(rate?.replace('$', '') || '0') || 0 };
    });
    const total = lineItems.reduce((sum, li) => sum + li.rate * li.qty, 0) || form.total;
    if (editItem) {
      update(editItem.id, { clientName: form.clientName, clientEmail: form.clientEmail, items: lineItems, total, status: form.status, dueDate: form.dueDate, notes: form.notes });
    } else {
      create({ id: generateId('inv'), invoiceNo: `INV-2026-${String(items.length + 6).padStart(3, '0')}`, clientName: form.clientName, clientEmail: form.clientEmail, items: lineItems, total, status: form.status, issueDate: new Date().toISOString().slice(0, 10), dueDate: form.dueDate, notes: form.notes });
    }
    setModalOpen(false);
  };

  const handleDelete = () => { if (deleteId) { remove(deleteId); setDeleteId(null); } };

  const totalRevenue = items.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalOutstanding = items.filter((i) => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { l: 'Total Invoices', v: items.length, c: 'money' as IconName },
          { l: 'Revenue Collected', v: `$${totalRevenue.toLocaleString()}`, c: 'check' as IconName },
          { l: 'Outstanding', v: `$${totalOutstanding.toLocaleString()}`, c: 'clock' as IconName },
          { l: 'Overdue', v: items.filter((i) => i.status === 'overdue').length, c: 'bell' as IconName },
        ]).map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center mb-2"><Icon name={s.c} size={16} /></div>
            <div className="text-xl font-bold text-gray-900">{s.v}</div>
            <div className="text-xs text-gray-500">{s.l}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          {['all', 'draft', 'sent', 'paid', 'overdue'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Invoice</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Client</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Issued</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Due</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody>{filtered.map((inv) => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4"><span className="text-xs font-mono font-bold text-blue-600 cursor-pointer hover:underline" onClick={() => setDetailItem(inv)}>{inv.invoiceNo}</span></td>
                <td className="py-3 px-4 text-xs font-semibold text-gray-900">{inv.clientName}</td>
                <td className="py-3 px-4 text-xs text-gray-600 hidden sm:table-cell">{inv.issueDate}</td>
                <td className="py-3 px-4 text-xs text-gray-600 hidden md:table-cell">{inv.dueDate}</td>
                <td className="py-3 px-4">
                  <select value={inv.status} onChange={(e) => update(inv.id, { status: e.target.value as Invoice['status'] })} className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border-0 cursor-pointer ${statusBadge[inv.status]}`}>
                    <option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-right text-xs font-bold text-gray-900">${inv.total.toLocaleString()}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setDetailItem(inv)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500" title="View"><Icon name="eye" size={13} /></button>
                    <button onClick={() => openEdit(inv)} className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center hover:bg-blue-200 text-blue-600" title="Edit"><Icon name="pencil" size={13} /></button>
                    <button onClick={() => setDeleteId(inv.id)} className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center hover:bg-red-200 text-red-600" title="Delete"><Icon name="trash" size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail */}
      <Modal open={!!detailItem} onClose={() => setDetailItem(null)} title={detailItem ? detailItem.invoiceNo : ''} size="md">
        {detailItem && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div><div className="text-xs text-gray-500">Bill To</div><div className="font-bold text-gray-900">{detailItem.clientName}</div><div className="text-xs text-gray-500">{detailItem.clientEmail}</div></div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusBadge[detailItem.status]}`}>{detailItem.status}</span>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50"><th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Item</th><th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Amount</th></tr></thead>
                <tbody>{detailItem.items.map((li, i) => (
                  <tr key={i} className="border-t border-gray-100"><td className="py-2 px-3 text-xs text-gray-700">{li.desc}</td><td className="py-2 px-3 text-right text-xs font-semibold">${li.rate.toLocaleString()}</td></tr>
                ))}</tbody>
                <tfoot><tr className="border-t-2 border-gray-200 bg-gray-50"><td className="py-2 px-3 text-sm font-bold">Total</td><td className="py-2 px-3 text-right text-sm font-bold">${detailItem.total.toLocaleString()}</td></tr></tfoot>
              </table>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs"><div><span className="text-gray-500">Issued:</span> <span className="font-semibold">{detailItem.issueDate}</span></div><div><span className="text-gray-500">Due:</span> <span className="font-semibold">{detailItem.dueDate}</span></div></div>
          </div>
        )}
      </Modal>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Invoice' : 'New Invoice'} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Client Name</label><input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Client Email</label><input value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          </div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Line Items (one per line, format: Description: $Amount)</label><textarea value={form.itemsText} onChange={(e) => setForm({ ...form, itemsText: e.target.value })} rows={5} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-mono resize-none" placeholder={'Sea Freight: $2500\nPacking: $1000\nInsurance: $500'} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Invoice['status'] })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm"><option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option></select></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editItem ? 'Save' : 'Create Invoice'}</button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Invoice" message="This will permanently delete this invoice." />
    </div>
  );
}
