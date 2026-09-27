import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/**
 * Global editable site content store.
 * Every EditableText on the site reads/writes into this registry keyed by id.
 * Persisted to localStorage so edits survive reloads.
 */

const STORAGE_KEY = 'apac_site_content_v1';

interface SiteContentApi {
  get: (id: string, fallback: string) => string;
  set: (id: string, value: string) => void;
}

const SiteContentContext = createContext<SiteContentApi | null>(null);

function loadInitial(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<Record<string, string>>(loadInitial);

  const get = useCallback(
    (id: string, fallback: string) => values[id] ?? fallback,
    [values]
  );

  const set = useCallback((id: string, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [id]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <SiteContentContext.Provider value={{ get, set }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent(): SiteContentApi {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    // Safe fallback if used outside provider — behaves read-only.
    return { get: (_id, fallback) => fallback, set: () => {} };
  }
  return ctx;
}
