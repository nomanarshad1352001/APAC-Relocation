import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCollection } from '../../store/SiteDataContext';
import { generateId } from '../../store/useStore';
import { seedTeam, type TeamMember } from '../../store/dashboardData';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import Icon from '../ui/Icon';

const statusDot: Record<string, string> = { active: 'bg-green-500', away: 'bg-amber-500', offline: 'bg-gray-400' };

export default function TeamTab() {
  const { items, create, update, remove } = useCollection<TeamMember>('dash_team', seedTeam);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<TeamMember | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', role: '', email: '', department: '', status: 'active' as TeamMember['status'], activeMoves: 0 });

  const openCreate = () => { setEditItem(null); setForm({ name: '', role: '', email: '', department: '', status: 'active', activeMoves: 0 }); setModalOpen(true); };
  const openEdit = (m: TeamMember) => { setEditItem(m); setForm({ name: m.name, role: m.role, email: m.email, department: m.department, status: m.status, activeMoves: m.activeMoves }); setModalOpen(true); };
  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editItem) { update(editItem.id, form); } else { create({ id: generateId('tm'), ...form, avatar: form.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2), joinDate: new Date().toISOString().slice(0, 10) }); }
    setModalOpen(false);
  };
  const handleDelete = () => { if (deleteId) { remove(deleteId); setDeleteId(null); } };

  const departments = [...new Set(items.map((m) => m.department))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-900">Team</h2><p className="text-sm text-gray-500">{items.length} members · {items.filter((m) => m.status === 'active').length} active</p></div>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Member
        </button>
      </div>

      {departments.map((dept) => (
        <div key={dept}>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{dept}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.filter((m) => m.department === dept).map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">{m.avatar}</div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${statusDot[m.status]}`} />
                    </div>
                    <div><div className="text-sm font-bold text-gray-900">{m.name}</div><div className="text-xs text-gray-500">{m.role}</div></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600"><Icon name="mail" size={13} className="text-gray-400 flex-shrink-0" />{m.email}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-600"><Icon name="calendar" size={13} className="text-gray-400 flex-shrink-0" />Joined {m.joinDate}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-600"><Icon name="package" size={13} className="text-gray-400 flex-shrink-0" />{m.activeMoves} active moves</div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(m)} className="flex-1 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-200">Edit</button>
                  <button onClick={() => update(m.id, { status: m.status === 'active' ? 'away' : 'active' })} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200">{m.status === 'active' ? 'Set Away' : 'Set Active'}</button>
                  <button onClick={() => setDeleteId(m.id)} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200">Remove</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Member' : 'Add Member'} size="sm">
        <div className="space-y-4">
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Role</label><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Department</label><input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Operations" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Active Moves</label><input type="number" value={form.activeMoves} onChange={(e) => setForm({ ...form, activeMoves: Number(e.target.value) })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div>
          <div className="flex gap-3 justify-end"><button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button><button onClick={handleSave} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editItem ? 'Save' : 'Add'}</button></div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Remove Member" message="Remove this team member?" />
    </div>
  );
}
