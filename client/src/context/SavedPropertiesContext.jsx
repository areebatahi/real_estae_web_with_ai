import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SavedPropertiesContext = createContext(null);
const STORAGE_KEY = "le_saved_properties";

export function SavedPropertiesProvider({ children }) {
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSaved = (id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const isSaved = (id) => savedIds.includes(id);

  const value = useMemo(() => ({ savedIds, toggleSaved, isSaved }), [savedIds]);

  return <SavedPropertiesContext.Provider value={value}>{children}</SavedPropertiesContext.Provider>;
}

export const useSavedProperties = () => {
  const ctx = useContext(SavedPropertiesContext);
  if (!ctx) throw new Error("useSavedProperties must be used within SavedPropertiesProvider");
  return ctx;
};
