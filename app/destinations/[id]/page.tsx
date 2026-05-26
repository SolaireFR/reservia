import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingForm from "./BookingForm";
import { getDestinationById } from "@/utils/services/destination.service";

// Force Dynamic (SSR) to ensure we always get up-to-date pricing and date availability
export const dynamic = 'force-dynamic';

export default async function DestinationDetailPage({ params }: { params: { id: string } }) {
  // Wait for params in NextJS 15 before using
  const { id } = await params;
  const dest = await getDestinationById(id);

  if (!dest) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <Link href="/destinations" className="text-secondary hover:text-primary mb-6 inline-block">&larr; Retour aux destinations</Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="relative h-96 w-full rounded-xl overflow-hidden shadow-lg">
            <Image src={dest.image} alt={dest.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
          </div>
          <div className="mt-8">
            <h1 className="text-4xl font-bold text-primary mb-2">{dest.name}</h1>
            <p className="text-xl text-secondary mb-6">{dest.country}</p>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">À propos</h2>
            <p className="text-foreground leading-relaxed">{dest.longDescription}</p>
          </div>
        </div>

        <div className="bg-card p-8 rounded-xl shadow-lg border border-border h-fit sticky top-10">
          <div className="mb-6 pb-6 border-b border-border">
            <span className="text-3xl font-bold text-accent">{dest.price}€</span>
            <span className="text-secondary"> / personne</span>
          </div>

          <BookingForm destination={dest} />
        </div>
      </div>
    </div>
  );
}