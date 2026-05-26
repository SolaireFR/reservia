"use client";

import { Destination } from "@/utils/services/destination.service";
import { useState } from "react";

export default function BookingForm({ destination }: { destination: Destination }) {
  const [date, setDate] = useState(destination.availableDates[0] || "");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId: destination.id,
          date,
          guests,
          totalPrice: destination.price * guests
        })
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold text-green-500 mb-4">Réservation confirmée !</h3>
        <p className="text-foreground">Merci pour votre réservation pour {destination.name}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label className="block text-sm font-semibold mb-2 text-foreground">Date de départ</label>
        <select 
          className="w-full p-3 border border-border rounded bg-background text-foreground"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        >
          {destination.availableDates.map(d => (
            <option key={d} value={d}>{new Date(d).toLocaleDateString('fr-FR')}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-foreground">Nombre de personnes</label>
        <input 
          type="number" 
          min="1" 
          max="10" 
          className="w-full p-3 border border-border rounded bg-background text-foreground"
          value={guests}
          onChange={e => setGuests(Number(e.target.value))}
          required
        />
      </div>

      <div className="flex justify-between items-center py-4 border-t border-border mt-2">
        <span className="font-bold text-foreground">Prix Total</span>
        <span className="font-bold text-xl text-primary">{destination.price * guests}€</span>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary text-white font-bold py-4 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Chargement..." : "Confirmer la réservation"}
      </button>
    </form>
  );
}