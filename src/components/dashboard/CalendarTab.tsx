import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCollection } from '../../store/SiteDataContext';
import { generateId } from '../../store/useStore';
import { seedCalendar, type CalendarEvent } from '../../store/dashboardData';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import Icon from '../ui/Icon';

const typeColor: Record<string, { bg: string; text: string; dot: string }> = {
  survey: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  packing: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  delivery: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  meeting: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  followup: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
};

const typeOpts: CalendarEvent['type'][] = ['survey', 'packing', 'delivery', 'meeting', 'followup'];

export default function CalendarTab() {
  const { items, create, update, remove } = useCollection<CalendarEvent>('dash_calendar', seedCalendar);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<CalendarEvent | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', date: '', time: '', type: 'survey' as CalendarEvent['type'], client: '', notes: '' });

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));

  const openCreate = () => { setEditItem(null); setForm({ title: '', date: '', time: '', type: 'survey', client: '', notes: '' }); setModalOpen(true); };
  const openEdit = (ev: CalendarEvent) => { setEditItem(ev); setForm({ title: ev.title, date: ev.date, time: ev.time, type: ev.type, client: ev.client, notes: ev.notes }); setModalOpen(true); };
  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editItem) { update(editItem.id, form); } else { create({ id: generateId('ev'), ...form }); }
    setModalOpen(false);
  };
  const handleDelete = () => { if (deleteId) { remove(deleteId); setDeleteId(null); } };

  // Group by date
  const grouped = sorted.reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
    (acc[ev.date] = acc[ev.date] || []).push(ev);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-900">Schedule</h2><p className="text-sm text-gray-500">{items.length} events</p></div>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Event
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {typeOpts.map((t) => (
          <div key={t} className="flex items-center gap-1.5 text-xs"><span className={`w-2.5 h-2.5 rounded-full ${typeColor[t].dot}`} /><span className="capitalize text-gray-600">{t}</span></div>
        ))}
      </div>

      {/* Event List */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([date, events]) => (
          <div key={date}>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div className="space-y-2">
              {events.map((ev, i) => {
                const tc = typeColor[ev.type] || typeColor.meeting;
                return (
                  <motion.div key={ev.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className={`${tc.bg} rounded-xl p-4 flex items-center gap-4 group hover:shadow-md transition-all`}>
                    <div className={`w-1 h-12 rounded-full ${tc.dot} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold ${tc.text}`}>{ev.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{ev.time}{ev.client && ` · ${ev.client}`}</div>
                      {ev.notes && <div className="text-[10px] text-gray-400 mt-0.5">{ev.notes}</div>}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button onClick={() => openEdit(ev)} className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center hover:bg-white shadow-sm text-blue-600" title="Edit"><Icon name="pencil" size={13} /></button>
                      <button onClick={() => setDeleteId(ev.id)} className="w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center hover:bg-white shadow-sm text-red-600" title="Delete"><Icon name="trash" size={13} /></button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Event' : 'New Event'} size="sm">
        <div className="space-y-4">
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Time</label><input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="10:00 AM" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CalendarEvent['type'] })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm">{typeOpts.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Client</label><input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          </div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none" /></div>
          <div className="flex gap-3 justify-end"><button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button><button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editItem ? 'Save' : 'Create'}</button></div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Event" message="Delete this event?" />
    </div>
  );
}
