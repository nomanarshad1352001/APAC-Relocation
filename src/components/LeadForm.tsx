import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { useCollection } from '../store/SiteDataContext';
import { generateId } from '../store/useStore';
import Modal from './ui/Modal';
import ConfirmDialog from './ui/ConfirmDialog';
import CrudActions from './ui/CrudActions';
import Icon from './ui/Icon';
import EditableText from './ui/EditableText';

interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  from: string;
  to: string;
  date: string;
  size: string;
  notes: string;
  contactMethod: string;
  createdAt: string;
  status: 'new' | 'in-progress' | 'completed';
}

const homeSizes = ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4 Bedroom', '5+ Bedroom', 'Office'];
const contactMethods = ['Email', 'Phone', 'WhatsApp', 'Video Call'];
const statusColors: Record<string, string> = { 'new': 'bg-blue-100 text-blue-700', 'in-progress': 'bg-amber-100 text-amber-700', 'completed': 'bg-green-100 text-green-700' };

interface Props { adminMode: boolean; onToast: (msg: string, type: 'success' | 'error' | 'info') => void; }

export default function LeadForm({ adminMode, onToast }: Props) {
  const { ref, inView } = useAnimateOnScroll();
  const { items: enquiries, create, update, remove } = useCollection<EnquiryItem>('site_enquiries', []);
  const [showPanel, setShowPanel] = useState(false);
  const [editItem, setEditItem] = useState<EnquiryItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<EnquiryItem | null>(null);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', from: 'Singapore', to: '', date: '', size: '', notes: '', contactMethod: 'Email',
  });

  const handleChange = (field: string, value: string) => { setForm({ ...form, [field]: value }); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEnquiry: EnquiryItem = {
      id: generateId('enq'),
      ...form,
      createdAt: new Date().toLocaleString(),
      status: 'new',
    };
    create(newEnquiry);
    onToast('Enquiry submitted successfully!', 'success');
    setForm({ name: '', email: '', phone: '', from: 'Singapore', to: '', date: '', size: '', notes: '', contactMethod: 'Email' });
  };

  const openEdit = (item: EnquiryItem) => {
    setEditItem(item);
    setForm({ name: item.name, email: item.email, phone: item.phone, from: item.from, to: item.to, date: item.date, size: item.size, notes: item.notes, contactMethod: item.contactMethod });
  };

  const handleSaveEdit = () => {
    if (editItem) {
      update(editItem.id, { ...form });
      onToast('Enquiry updated', 'success');
      setEditItem(null);
    }
  };

  const handleDelete = () => {
    if (deleteId) { remove(deleteId); onToast('Enquiry deleted', 'error'); setDeleteId(null); }
  };

  const handleStatusChange = (id: string, status: EnquiryItem['status']) => {
    update(id, { status });
    onToast(`Status updated to ${status}`, 'info');
  };

  return (
    <section id="lead-form" className="py-20 lg:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold font-semibold mb-4">
            <EditableText id="lead.eyebrow" defaultText="Start Your Journey" adminMode={adminMode} />
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">
            <EditableText id="lead.heading" defaultText="Ready to get started?" adminMode={adminMode} />
          </h2>
          <p className="text-lg text-muted">
            <EditableText id="lead.sub" defaultText="Fill out the form below and a dedicated move manager will be in touch." adminMode={adminMode} />
          </p>
          {adminMode && enquiries.length > 0 && (
            <button onClick={() => setShowPanel(!showPanel)} className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-ivory text-sm font-semibold hover:bg-black transition-colors">
              <Icon name="clipboard" size={14} />
              View Enquiries ({enquiries.length})
            </button>
          )}
        </motion.div>

        {/* Admin Enquiries Panel */}
        <AnimatePresence>
          {adminMode && showPanel && enquiries.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
              <div className="bg-gold/10 border border-gold/30 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-ink flex items-center gap-2">
                    <Icon name="clipboard" size={16} className="text-gold" /> Submitted Enquiries
                  </h3>
                  <span className="text-xs text-gold font-medium bg-gold/20 px-2 py-1 rounded-full">{enquiries.length} total</span>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {enquiries.map((enq) => (
                    <div key={enq.id} className="bg-white rounded-xl p-4 border border-amber-100 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-primary">{enq.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[enq.status]}`}>{enq.status}</span>
                        </div>
                        <div className="text-xs text-muted mt-0.5">{enq.email} • {enq.phone}</div>
                        <div className="text-xs text-muted">{enq.from} → {enq.to || 'TBD'} • {enq.size || 'TBD'} • {enq.date || 'TBD'}</div>
                        <div className="text-[10px] text-gray-400 mt-1">{enq.createdAt}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <select value={enq.status} onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryItem['status'])} className="text-xs rounded-lg border border-gray-200 px-2 py-1.5 bg-gray-50">
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button onClick={() => setViewItem(enq)} className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors" title="View">
                          <Icon name="eye" size={14} />
                        </button>
                        <CrudActions onEdit={() => openEdit(enq)} onDelete={() => setDeleteId(enq.id)} compact />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input required type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input required type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input required type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="+65 XXXX XXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Moving From</label>
              <input type="text" value={form.from} onChange={(e) => handleChange('from', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Moving To</label>
              <select value={form.to} onChange={(e) => handleChange('to', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm">
                <option value="">Select destination</option>
                <option>San Francisco</option><option>New York</option><option>Los Angeles</option><option>Seattle</option><option>Austin</option><option>Boston</option><option>Other US City</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Move Date</label>
              <input type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Home Size</label>
              <select value={form.size} onChange={(e) => handleChange('size', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm">
                <option value="">Select size</option>
                {homeSizes.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact</label>
              <div className="flex flex-wrap gap-2">
                {contactMethods.map((m) => (
                  <button key={m} type="button" onClick={() => handleChange('contactMethod', m)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${form.contactMethod === m ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{m}</button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none" placeholder="Tell us about your move..." />
            </div>
          </div>
          <button type="submit" className="w-full mt-6 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-black/10 text-base">Send Enquiry →</button>
          <p className="text-xs text-muted text-center mt-4">By submitting, you agree to our privacy policy. We'll respond within 4 working hours.</p>
        </motion.form>
      </div>

      {/* View Enquiry Modal */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Enquiry Details" size="md">
        {viewItem && (
          <div className="space-y-3 text-sm">
            {[
              { l: 'Name', v: viewItem.name }, { l: 'Email', v: viewItem.email }, { l: 'Phone', v: viewItem.phone },
              { l: 'From', v: viewItem.from }, { l: 'To', v: viewItem.to || '—' }, { l: 'Date', v: viewItem.date || '—' },
              { l: 'Size', v: viewItem.size || '—' }, { l: 'Contact', v: viewItem.contactMethod }, { l: 'Status', v: viewItem.status },
              { l: 'Submitted', v: viewItem.createdAt }, { l: 'Notes', v: viewItem.notes || '—' },
            ].map((r) => (
              <div key={r.l} className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-muted font-medium">{r.l}</span>
                <span className="text-primary font-semibold text-right max-w-[60%]">{r.v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Edit Enquiry Modal */}
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Enquiry" size="md">
        {editItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Move To</label><input value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none" /></div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setEditItem(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleSaveEdit} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Enquiry" message="Are you sure you want to delete this enquiry? This action cannot be undone." />
    </section>
  );
}
