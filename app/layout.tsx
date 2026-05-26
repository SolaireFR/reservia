import "./globals.css";
import React from "react";
import Link from "next/link";
import Navigation from "../components/Navigation";
import { AuthProvider } from "../components/AuthProvider";

export const metadata = {
  title: "Reservia",
  description: "Plateforme de réservation de voyages",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <header className="border-b border-border bg-card p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            <Link href="/" className="text-2xl tracking-tight text-primary font-bold">Reservia</Link>
            <Navigation />
          </header>

          <main className="flex-grow w-full">
            {children}
          </main>

          <footer className="border-t border-border bg-card p-6 text-center text-secondary">
            <p>&copy; {new Date().getFullYear()} Reservia. Tous droits réservés.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}