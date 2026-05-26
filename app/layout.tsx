import "./globals.css";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Reservia",
  description: "Plateforme de réservation de voyages",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <header className="border-b border-border bg-card p-4 flex items-center justify-between">
          <Link href="/" className="text-2xl tracking-tight text-primary font-bold">Reservia</Link>
          <nav className="space-x-4">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <Link href="/destinations" className="hover:text-primary transition-colors">Destinations</Link>
            <Link href="/account" className="hover:text-primary transition-colors">Mon compte</Link>
            <Link href="/login" className="hover:text-primary transition-colors bg-primary text-white px-3 py-1 rounded">Connexion</Link>
          </nav>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="border-t border-border bg-card p-6 text-center text-secondary">
          <p>&copy; {new Date().getFullYear()} Reservia. Tous droits réservés.</p>
        </footer>
      </body>
    </html>
  );
}