"use client";

import { useEffect, useState } from "react";
import { Booking } from "../../utils/services/booking.service";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, loading: userLoading, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchBookings();
    }
  }, [user, userLoading, router]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        setBookings(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBookings();
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("ATTENTION : Cette action est irréversible. Toutes vos données s'effaceront. Continuer ?")) {
      const res = await fetch("/api/auth/delete", { method: "DELETE" });
      if (res.ok) {
        logout(); // cleans the context and redirects
      }
    }
  };

  if (userLoading || !user) {
    return <div className="p-10 text-center">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold text-primary mb-8">Mon Compte</h1>

      <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-10">
        <h2 className="text-xl font-bold mb-4">Mes Informations</h2>
        <p><strong>Nom:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rôle:</strong> {user.role === 'admin' ? 'Administrateur' : 'Utilisateur standard'}</p>
        
        <div className="mt-6 pt-4 border-t border-border flex gap-4">
          <button onClick={logout} className="text-secondary hover:text-foreground font-semibold">
            Se déconnecter
          </button>
          <button onClick={handleDeleteAccount} className="text-red-500 hover:text-red-700 font-semibold">
            Supprimer mon compte
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-6">Mes Réservations</h2>

      {loading ? (
        <p>Chargement de vos réservations...</p>
      ) : bookings.length === 0 ? (
        <p className="text-secondary">Vous n'avez aucune réservation pour le moment. <Link href="/destinations" className="text-primary underline">Explorer les destinations</Link></p>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="border border-border p-4 rounded bg-card flex justify-between items-center">
              <div>
                <p className="font-bold">Destination ID : {booking.destinationId}</p>
                <p className="text-secondary">Date : {new Date(booking.date).toLocaleDateString('fr-FR')}</p>
                <p>Personnes : {booking.guests}</p>
                <p className="font-semibold text-primary">Total : {booking.totalPrice}€</p>
              </div>
              <button 
                onClick={() => handleCancel(booking.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
              >
                Annuler
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}