import { useState } from 'react';
import Modal from './Modal';
import Icon from './Icon';
import { useSiteContent } from '../../store/siteContent';

interface EditableTextProps {
  /** Unique registry key, e.g. "hero.headline" */
  id: string;
  /** Default text shown before first edit */
  defaultText: string;
  /** Show edit affordance (admin mode) */
  adminMode?: boolean;
  className?: string;
  /** Use textarea in the editor */
  multiline?: boolean;
  /** Editor dialog title */
  label?: string;
}

/**
 * Inline-editable text. In admin mode, hovering reveals a gold pencil —
 * clicking opens a modal editor. Saved into the global site-content store
 * (persisted to localStorage).
 */
export default function EditableText({
  id,
  defaultText,
  adminMode = false,
  className = '',
  multiline = false,
  label,
}: EditableTextProps) {
  const { get, set } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const value = get(id, defaultText);

  const openEditor = () => {
    setDraft(value);
    setOpen(true);
  };

  const save = () => {
    set(id, draft.trim() || defaultText);
    setOpen(false);
  };

  return (
    <span className={`relative inline group/et ${className}`}>
      {value}
      {adminMode && (
        <button
          type="button"
          onClick={openEditor}
          aria-label={`Edit ${label || id}`}
          className="inline-flex items-center justify-center align-middle ml-2 w-6 h-6 rounded-full gradient-gold text-ink opacity-0 group-hover/et:opacity-100 focus:opacity-100 transition-opacity duration-200 hover:scale-110 shadow-md"
        >
          <Icon name="pencil" size={11} />
        </button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={label || 'Edit text'} size="sm">
        <div className="space-y-4">
          {multiline ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm resize-none"
              autoFocus
            />
          ) : (
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && save()}
            />
          )}
          <div className="flex items-center justify-between">
            <button
              onClick={() => { set(id, defaultText); setOpen(false); }}
              className="text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              Reset to default
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="px-6 py-2 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-black transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </span>
  );
}
