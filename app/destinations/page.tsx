"use client";

import { Destination } from "@/utils/services/destination.service";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    fetch('/api/destinations')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDestinations(data);
        }
      })
      .catch(err => console.error("Erreur de récupération :", err));
  }, []);

  // Sécurité ajoutée avec le ?. pour éviter les erreurs si un champ est null
  const filtered = destinations.filter(d => 
    d.name?.toLowerCase().includes(search.toLowerCase()) || 
    d.country?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-primary mb-8">Nos Destinations</h1>
      
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Rechercher par destination ou pays..." 
          className="p-3 w-full border border-border bg-card text-foreground rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(dest => (
          <div key={dest.id} className="border border-border rounded-lg overflow-hidden bg-card shadow hover:shadow-lg transition-shadow flex flex-col justify-between">
            <div>
              <div className="relative h-48 w-full">
                {dest.image ? (
                  <Image 
                    src={dest.image} 
                    alt={dest.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                    className="object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">Pas d image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-foreground">{dest.name}</h3>
                <p className="text-sm text-secondary mb-2">{dest.country}</p>
                <p className="text-foreground line-clamp-2">{dest.description}</p>
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-between items-center bg-background">
              <span className="text-lg font-bold text-accent">{dest.price}€</span>
              <Link href={`/destinations/${dest.id}`} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
                Voir plus
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <p className="text-center text-secondary py-10">Aucune destination trouvée.</p>
      )}
    </div>
  );
}