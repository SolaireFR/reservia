"use client";

import { useEffect, useState } from "react";
import { User } from "../../utils/services/db.service";
import { Destination } from "../../utils/services/destination.service";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import { Booking } from "@/utils/services/booking.service";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    } else if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      const [usersRes, destRes, booksRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/destinations"),
        fetch('/api/admin/bookings')
      ]);
      
      if (usersRes.ok) setUsers(await usersRes.json());
      if (destRes.ok) setDestinations(await destRes.json());
      if (booksRes.ok) setBookings(await booksRes.json());
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Supprimer cet utilisateur et toutes ses réservations ?")) {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    }
  };

  const handleDeleteDestination = async (id: string) => {
    if (confirm("Supprimer cette destination et toutes ses réservations ?")) {
      const res = await fetch(`/api/admin/destinations/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    }
  };

  const handleCreateDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('country', country);
    formData.append('price', price);
    formData.append('description', description);
    if (image) formData.append('image', image);

    const res = await fetch('/api/admin/destinations', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      alert("Destination créée avec succès !");
      setName(''); setCountry(''); setPrice(''); setDescription(''); setImage(null);
      fetchData();
    } else {
      alert("Erreur lors de la création.");
    }
  };

  if (authLoading || loading) return <p className="p-10 text-center">Chargement...</p>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-6xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8 text-primary">Panneau d`administration</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Gestion des Utilisateurs</h2>
        <div className="space-y-4">
          {users.map(u => (
            <div key={u.id} className="border border-border p-4 rounded flex justify-between items-center bg-card">
              <div>
                <p><strong>ID:</strong> {u.id}</p>
                <p><strong>Nom:</strong> {u.name}</p>
                <p><strong>Email:</strong> {u.email}</p>
                <p><strong>Rôle:</strong> {u.role}</p>
              </div>
              {u.id !== user.id && ( // Prevent admin from deleting themselves here
                <button 
                  onClick={() => handleDeleteUser(u.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Créer une Destination</h2>
        <form onSubmit={handleCreateDestination} className="bg-card p-6 border border-border rounded shadow-sm mb-10 space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Nom</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-border p-2 rounded bg-background" placeholder="Ex: Villa Paradis" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Pays</label>
            <input required type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full border border-border p-2 rounded bg-background" placeholder="Ex: Indonésie" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Prix/Nuit</label>
              <input required type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-border p-2 rounded bg-background" />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Description courte</label>
              <input required type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-border p-2 rounded bg-background" />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Image</label>
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="w-full border border-border p-2 rounded bg-background" />
          </div>
          <button type="submit" className="bg-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded">
            Créer la destination
          </button>
        </form>

        <h2 className="text-xl font-bold mb-4">Destinations Existantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map(d => (
            <div key={d.id} className="border border-border p-4 rounded bg-card flex flex-col justify-between">
              <div>
                <h3 className="font-bold">{d.description}</h3>
                <p className="text-sm text-secondary">{d.country}</p>
                <p className="text-primary font-bold mt-2">{d.price}€ / nuit</p>
              </div>
              <button 
                onClick={() => handleDeleteDestination(d.id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded w-full"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </section>
      
      <div className="bg-card p-6 border border-border mt-8 rounded shadow-sm">
        <h2 className="text-xl font-bold mb-4">Toutes les réservations</h2>
        {bookings.length === 0 ? (
          <p>Aucune réservation sur la plateforme.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2">ID</th>
                <th className="p-2">Utilisateur</th>
                <th className="p-2">Destination</th>
                <th className="p-2">Date</th>
                <th className="p-2">Personnes</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b border-border text-sm">
                  <td className="p-2 text-secondary">{b.id}</td>
                  <td className="p-2">{b.userId}</td>
                  <td className="p-2">{b.destinationId}</td>
                  <td className="p-2">{b.date}</td>
                  <td className="p-2">{b.guests}</td>
                  <td className="p-2 font-bold">{b.totalPrice}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
