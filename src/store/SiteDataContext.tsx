import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

/**
 * ─────────────────────────────────────────────────────────────────
 *  GLOBAL SITE DATA STORE
 *  One source of truth for every editable collection used by BOTH
 *  the public website and the admin dashboard. Any CRUD action —
 *  inline on the site, or inside the dashboard — dispatches into
 *  this single reducer, so changes reflect everywhere instantly.
 *  Persisted to localStorage (dummy persistence, no database).
 * ─────────────────────────────────────────────────────────────────
 */

const STORAGE_KEY = 'apac_site_data_v1';

type State = Record<string, unknown[]>;

interface BaseItem {
  id: string;
}

type Action =
  | { type: 'init'; key: string; seed: unknown[] }
  | { type: 'create'; key: string; item: BaseItem }
  | { type: 'update'; key: string; id: string; patch: Partial<BaseItem> }
  | { type: 'remove'; key: string; id: string };

function persist(state: State) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

function reducer(state: State, action: Action): State {
  let next: State;
  switch (action.type) {
    case 'init': {
      if (state[action.key] !== undefined) return state; // idempotent
      next = { ...state, [action.key]: action.seed };
      break;
    }
    case 'create': {
      const items = (state[action.key] as BaseItem[] | undefined) ?? [];
      next = { ...state, [action.key]: [...items, action.item] };
      break;
    }
    case 'update': {
      const items = (state[action.key] as BaseItem[] | undefined) ?? [];
      next = {
        ...state,
        [action.key]: items.map((i) => (i.id === action.id ? { ...i, ...action.patch } : i)),
      };
      break;
    }
    case 'remove': {
      const items = (state[action.key] as BaseItem[] | undefined) ?? [];
      next = { ...state, [action.key]: items.filter((i) => i.id !== action.id) };
      break;
    }
    default:
      return state;
  }
  persist(next);
  return next;
}

function loadInitial(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {};
}

const SiteDataContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export interface CollectionApi<T extends BaseItem> {
  items: T[];
  create: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
}

/**
 * Drop-in replacement for the local useCrud hook — same API,
 * but synced globally (and persisted). Passing the same key from
 * any component returns the same live collection.
 */
export function useCollection<T extends BaseItem>(key: string, seed: T[]): CollectionApi<T> {
  const ctx = useContext(SiteDataContext);
  const exists = ctx ? ctx.state[key] !== undefined : false;

  useEffect(() => {
    if (ctx && !exists) {
      ctx.dispatch({ type: 'init', key, seed: seed as unknown[] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const create = useCallback(
    (item: T) => ctx?.dispatch({ type: 'create', key, item }),
    [ctx, key]
  );
  const update = useCallback(
    (id: string, patch: Partial<T>) => ctx?.dispatch({ type: 'update', key, id, patch }),
    [ctx, key]
  );
  const remove = useCallback((id: string) => ctx?.dispatch({ type: 'remove', key, id }), [ctx, key]);

  const items = (ctx?.state[key] as T[] | undefined) ?? seed;
  return { items, create, update, remove };
}
