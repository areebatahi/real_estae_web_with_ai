import { createContext, useContext, useMemo, useState } from "react";

const CompareContext = createContext(null);
const MAX_COMPARE = 4;

export function CompareProvider({ children }) {
  const [compareIds, setCompareIds] = useState([]);

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const clearCompare = () => setCompareIds([]);
  const isComparing = (id) => compareIds.includes(id);

  const value = useMemo(
    () => ({ compareIds, toggleCompare, clearCompare, isComparing, maxCompare: MAX_COMPARE }),
    [compareIds]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
};
