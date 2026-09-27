import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCollection } from '../../store/SiteDataContext';
import { generateId } from '../../store/useStore';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import Icon from '../ui/Icon';

/**
 * Website CMS — manages every public-site collection directly from
 * the dashboard. Edits dispatch into the shared SiteDataContext, so
 * the landing page updates instantly (and persists to localStorage).
 */

type FieldType = 'text' | 'textarea' | 'list' | 'number';

interface FieldDef { key: string; label: string; type: FieldType; }
interface CollectionDef {
  key: string;
  title: string;
  singular: string;
  fields: FieldDef[];
  titleOf: (item: any) => string;
  subtitleOf?: (item: any) => string;
}

const COLLECTIONS: CollectionDef[] = [
  { key: 'site_services', title: 'Service Cards', singular: 'Service', fields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'features', label: 'Features (comma separated)', type: 'list' }], titleOf: (i) => i.title, subtitleOf: (i) => (i.features || []).join(' · ') },
  { key: 'site_process', title: 'Process Steps', singular: 'Step', fields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'desc', label: 'Description', type: 'textarea' }, { key: 'features', label: 'Features (comma separated)', type: 'list' }], titleOf: (i) => `Step ${i.step} — ${i.title}` },
  { key: 'site_timeline', title: 'Move Timeline', singular: 'Milestone', fields: [{ key: 'time', label: 'Time Label', type: 'text' }, { key: 'title', label: 'Title', type: 'text' }, { key: 'desc', label: 'Description', type: 'textarea' }], titleOf: (i) => `${i.time} — ${i.title}` },
  { key: 'site_faqs', title: 'FAQs', singular: 'FAQ', fields: [{ key: 'q', label: 'Question', type: 'text' }, { key: 'a', label: 'Answer', type: 'textarea' }], titleOf: (i) => i.q },
  { key: 'site_visas', title: 'Visa Types', singular: 'Visa', fields: [{ key: 'code', label: 'Code', type: 'text' }, { key: 'title', label: 'Title', type: 'text' }, { key: 'leadTime', label: 'Lead Time', type: 'text' }, { key: 'govCost', label: "Gov't Cost", type: 'text' }, { key: 'cap', label: 'Cap', type: 'text' }, { key: 'greenCard', label: 'Green Card Path', type: 'text' }, { key: 'requirements', label: 'Requirements', type: 'textarea' }], titleOf: (i) => i.code, subtitleOf: (i) => i.title },
  { key: 'site_cities', title: 'Destination Cities', singular: 'City', fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'avgCost', label: 'Avg Cost', type: 'text' }, { key: 'seaDays', label: 'Sea Days', type: 'text' }, { key: 'airDays', label: 'Air Days', type: 'text' }, { key: 'climate', label: 'Climate', type: 'text' }, { key: 'community', label: 'Community', type: 'text' }], titleOf: (i) => i.name, subtitleOf: (i) => i.avgCost },
  { key: 'site_pets', title: 'Pet Types', singular: 'Pet Type', fields: [{ key: 'label', label: 'Label', type: 'text' }, { key: 'cost', label: 'Starting Cost', type: 'text' }, { key: 'photo', label: 'Photo URL', type: 'text' }], titleOf: (i) => i.label, subtitleOf: (i) => i.cost },
  { key: 'site_contacts', title: 'Contact Methods', singular: 'Contact', fields: [{ key: 'label', label: 'Label', type: 'text' }, { key: 'value', label: 'Value', type: 'text' }, { key: 'href', label: 'Link URL', type: 'text' }], titleOf: (i) => i.label, subtitleOf: (i) => i.value },
  { key: 'site_stats', title: 'Company Stats', singular: 'Stat', fields: [{ key: 'label', label: 'Label', type: 'text' }, { key: 'value', label: 'Value', type: 'number' }, { key: 'suffix', label: 'Suffix', type: 'text' }], titleOf: (i) => `${i.value}${i.suffix}`, subtitleOf: (i) => i.label },
];

function CollectionManager({ def }: { def: CollectionDef }) {
  const { items, create, update, remove } = useCollection<any>(def.key, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const openCreate = () => {
    setEditing(null);
    setDraft(Object.fromEntries(def.fields.map((f) => [f.key, ''])));
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setDraft(
      Object.fromEntries(
        def.fields.map((f) => [
          f.key,
          f.type === 'list' ? (Array.isArray(item[f.key]) ? item[f.key].join(', ') : '') : String(item[f.key] ?? ''),
        ])
      )
    );
    setModalOpen(true);
  };

  const save = () => {
    const payload: Record<string, unknown> = {};
    def.fields.forEach((f) => {
      const raw = draft[f.key] ?? '';
      if (f.type === 'list') payload[f.key] = raw.split(',').map((s) => s.trim()).filter(Boolean);
      else if (f.type === 'number') payload[f.key] = Number(raw) || 0;
      else payload[f.key] = raw;
    });
    if (editing) update(editing.id, payload);
    else create({ id: generateId(def.key), ...(editing || {}), ...payload });
    setModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center"><Icon name="layers" size={14} /></span>
          <div>
            <h3 className="text-sm font-bold text-gray-900">{def.title}</h3>
            <p className="text-[10px] text-gray-500">{items.length} live on site</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-black transition-colors">
          <Icon name="plus" size={12} /> Add {def.singular}
        </button>
      </div>

      <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
        {items.length === 0 && (
          <p className="px-5 py-6 text-xs text-gray-400 text-center">No items yet — add the first one.</p>
        )}
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center gap-3 px-5 py-3 group hover:bg-gray-50 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{def.titleOf(item)}</div>
              {def.subtitleOf && <div className="text-[11px] text-gray-500 truncate">{def.subtitleOf(item)}</div>}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(item)} className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200" title="Edit"><Icon name="pencil" size={12} /></button>
              <button onClick={() => setDeleteId(item.id)} className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200" title="Delete"><Icon name="trash" size={12} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit ${def.singular}` : `Add ${def.singular}`} size="md">
        <div className="space-y-4">
          {def.fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
              {f.type === 'textarea' || f.type === 'list' ? (
                <textarea
                  value={draft[f.key] ?? ''}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                  rows={f.type === 'list' ? 2 : 4}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none"
                />
              ) : (
                <input
                  type={f.type === 'number' ? 'number' : 'text'}
                  value={draft[f.key] ?? ''}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm"
                />
              )}
            </div>
          ))}
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
            <button onClick={save} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editing ? 'Save Changes' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { remove(deleteId); setDeleteId(null); } }}
        title={`Delete ${def.singular}`}
        message="This will immediately remove it from the live website."
      />
    </div>
  );
}

export default function WebsiteTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Website CMS</h2>
          <p className="text-sm text-gray-500">Every change here is pushed to the live site instantly — no deploys needed.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-xs font-medium text-emerald-700">Live sync active</span>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {COLLECTIONS.map((def, i) => (
          <motion.div key={def.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <CollectionManager def={def} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
