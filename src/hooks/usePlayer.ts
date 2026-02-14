import { useState, useEffect, useCallback } from "react";
import type { Kid } from "@/types";

const STORAGE_KEY = "jagoan_puasa_kid_id";
const KIDS_STORAGE = "jagoan_puasa_kids";

function loadKids(): Kid[] {
  try {
    const data = localStorage.getItem(KIDS_STORAGE);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveKids(kids: Kid[]) {
  localStorage.setItem(KIDS_STORAGE, JSON.stringify(kids));
}

export function usePlayer() {
  const [player, setPlayer] = useState<Kid | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (savedId) {
      const kids = loadKids();
      const found = kids.find((k) => k.id === savedId);
      if (found) setPlayer(found);
    }
    setLoading(false);
  }, []);

  const login = useCallback((name: string) => {
    const kids = loadKids();
    const trimmed = name.trim();
    const existing = kids.find((k) => k.name.toLowerCase() === trimmed.toLowerCase());

    if (existing) {
      localStorage.setItem(STORAGE_KEY, existing.id);
      setPlayer(existing);
      return existing;
    }

    const newKid: Kid = {
      id: Date.now().toString(),
      name: trimmed,
      points: 0,
      avatar: "🧒",
    };
    const updated = [...kids, newKid];
    saveKids(updated);
    localStorage.setItem(STORAGE_KEY, newKid.id);
    setPlayer(newKid);
    return newKid;
  }, []);

  const addPoints = useCallback((pts: number) => {
    setPlayer((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, points: prev.points + pts };
      const kids = loadKids().map((k) => (k.id === updated.id ? updated : k));
      saveKids(kids);
      return updated;
    });
  }, []);

  const spendPoints = useCallback((pts: number): boolean => {
    let success = false;
    setPlayer((prev) => {
      if (!prev || prev.points < pts) return prev;
      success = true;
      const updated = { ...prev, points: prev.points - pts };
      const kids = loadKids().map((k) => (k.id === updated.id ? updated : k));
      saveKids(kids);
      return updated;
    });
    return success;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPlayer(null);
  }, []);

  return { player, loading, login, addPoints, spendPoints, logout };
}
