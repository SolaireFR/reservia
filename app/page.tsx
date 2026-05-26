import { getDestinations } from "@/utils/services/destination.service";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600; // ISR: revalidate every hour

export default async function HomePage() {
  const popularDestinations = await getDestinations();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center">
        <Image
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80"
          alt="Hero Voyage"
          fill
          className="object-cover -z-10 brightness-50"
          priority
        />
        <div className="text-white p-4">
          <h1 className="text-5xl font-bold mb-4">Découvrez le monde avec Reservia</h1>
          <p className="text-xl mb-8">Votre prochaine aventure vous attend. Trouvez la destination de vos rêves.</p>
          
          {/* Search Bar (Simulated UI) */}
          <div className="bg-card p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center shadow-lg w-full max-w-3xl mx-auto">
            <input type="text" placeholder="Où allez-vous ?" className="flex-1 p-3 rounded border border-border text-foreground w-full" />
            <input type="date" className="p-3 rounded border border-border text-foreground w-full md:w-auto" />
            <button className="bg-primary hover:bg-primary/90 text-white font-bold p-3 rounded w-full md:w-auto transition-colors">Rechercher</button>
          </div>
        </div>
      </section>

      {/* Destinations Populaires */}
      <section className="p-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-primary">Destinations Populaires</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.slice(0, 3).map(dest => (
            <div key={dest.id} className="border border-border rounded-lg overflow-hidden bg-card shadow hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full">
                <Image src={dest.image} alt={dest.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-foreground">{dest.name}</h3>
                <p className="text-sm text-secondary mb-2">{dest.country}</p>
                <p className="text-foreground line-clamp-2 mb-4">{dest.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-accent">À partir de {dest.price}€</span>
                  <Link href={`/destinations/${dest.id}`} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
                    Voir plus
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
           <Link href="/destinations" className="text-primary font-bold hover:underline">Voir toutes les destinations &rarr;</Link>
        </div>
      </section>
    </div>
  );
}
