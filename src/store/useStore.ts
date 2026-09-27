import { useState, useCallback } from 'react';

// ─── Generic CRUD hook ───
export function useCrud<T extends { id: string }>(initialData: T[]) {
  const [items, setItems] = useState<T[]>(initialData);

  const create = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const read = useCallback((id: string) => {
    return items.find((i) => i.id === id);
  }, [items]);

  const update = useCallback((id: string, updates: Partial<T>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const reorder = useCallback((fromIndex: number, toIndex: number) => {
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  return { items, setItems, create, read, update, remove, reorder };
}

// ─── ID generator ───
let _counter = 0;
export function generateId(prefix = 'item') {
  _counter += 1;
  return `${prefix}_${Date.now()}_${_counter}`;
}
