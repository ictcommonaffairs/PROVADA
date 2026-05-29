import { useEffect, useState } from 'react';
import { APPS_SCRIPT_URL } from './data';

export type TakenSet = Set<string>; // key = `${person}|${dayIso}|${time}`

type Bookings = { person: string; dayIso: string; time: string };

type UseAvailability = {
  taken: TakenSet;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function slotKey(person: string, dayIso: string, time: string): string {
  return `${person}|${dayIso}|${time}`;
}

export function useAvailability(): UseAvailability {
  const [taken, setTaken] = useState<TakenSet>(new Set());
  const [loading, setLoading] = useState<boolean>(Boolean(APPS_SCRIPT_URL));
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!APPS_SCRIPT_URL) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(APPS_SCRIPT_URL, { method: 'GET' })
      .then((r) => {
        if (!r.ok) throw new Error(`status ${r.status}`);
        return r.json();
      })
      .then((data: { bookings?: Bookings[] }) => {
        if (cancelled) return;
        const set: TakenSet = new Set();
        for (const b of data.bookings ?? []) {
          set.add(slotKey(b.person, b.dayIso, b.time));
        }
        setTaken(set);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return {
    taken,
    loading,
    error,
    reload: () => setTick((t) => t + 1),
  };
}
