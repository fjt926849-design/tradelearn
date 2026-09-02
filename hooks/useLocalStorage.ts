"use client";

import { useState, useCallback, useEffect } from "react";
import { ensureProgressMigrationSnapshot } from "@/lib/progressMigration";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    ensureProgressMigrationSnapshot();
  }, []);

  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) setStoredValue(JSON.parse(item) as T);
      } catch {
        // Keep the in-memory value when storage is unavailable or malformed.
      }
    };

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("tradelearn-progress-updated", syncFromStorage);
    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("tradelearn-progress-updated", syncFromStorage);
    };
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue));
          window.dispatchEvent(new Event("tradelearn-progress-updated"));
        } catch {
          // localStorage full or inaccessible
        }
        return newValue;
      });
    },
    [key]
  );

  return [storedValue, setValue] as const;
}
