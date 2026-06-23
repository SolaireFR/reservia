"use client";

import { useEffect, useState } from "react";

interface Props {
  destinationId: string;
  initialDates: string[];
}

export default function ManageDates({ destinationId, initialDates }: Props) {
  const [dates, setDates] = useState<string[]>(initialDates || []);
  const [newDate, setNewDate] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => setUserRole(data.user?.role || null))
      .catch(() => setUserRole(null));
  }, []);

  const isManager = userRole === 'admin' || userRole === `manager-${destinationId}`;
  if (!isManager) return null;

  async function saveChanges(add: string[], remove: string[]) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/destinations/${destinationId}/dates`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addDates: add, removeDates: remove })
      });
      const updated = await res.json();
      if (res.ok) setDates(updated.availableDates || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    if (!newDate) return;
    if (!dates.includes(newDate)) {
      setDates(prev => [...prev, newDate]);
      saveChanges([newDate], []);
      setNewDate('');
    }
  }

  function handleRemove(d: string) {
    setDates(prev => prev.filter(x => x !== d));
    saveChanges([], [d]);
  }

  return (
    <div className="mt-6 p-4 border border-border rounded bg-background">
      <h3 className="text-lg font-semibold mb-3">Gérer les disponibilités</h3>
      <div className="flex gap-2 mb-3">
        <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="p-2 border rounded w-full" />
        <button onClick={handleAdd} disabled={loading} className="px-4 py-2 bg-primary text-white rounded">Ajouter</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {dates.length === 0 && <div className="text-sm text-secondary">Aucune date configurée.</div>}
        {dates.map(d => (
          <div key={d} className="px-3 py-1 bg-card border border-border rounded flex items-center gap-2">
            <span className="text-sm">{d}</span>
            <button onClick={() => handleRemove(d)} className="text-xs text-red-600">Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}
