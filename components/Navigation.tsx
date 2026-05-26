"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname?.startsWith(path) && (path !== "/" || pathname === "/");
  };

  const linkClass = (path: string) => `
    transition-colors font-medium
    ${isActive(path) ? "text-primary" : "text-foreground hover:text-primary"}
  `;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6 items-center">
        <Link href="/" className={linkClass("/")}>Accueil</Link>
        <Link href="/destinations" className={linkClass("/destinations")}>Destinations</Link>
        
        {user ? (
          <>
            <Link href="/account" className={linkClass("/account")}>Mon compte</Link>
            {user.role === "admin" && (
              <Link href="/admin" className={linkClass("/admin")}>Admin</Link>
            )}
            <button onClick={logout} className="bg-red-500 text-white hover:bg-red-600 transition-colors px-4 py-2 rounded-md font-bold">
              Déconnexion
            </button>
          </>
        ) : (
          <Link href="/login" className="bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-md font-bold">
            Connexion
          </Link>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 text-foreground"
        onClick={toggleMenu}
        aria-label="Ouvrir le menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
        </svg>
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-card border-b border-border shadow-lg p-4 flex flex-col space-y-4 md:hidden z-50">
          <Link href="/" className={linkClass("/")} onClick={closeMenu}>Accueil</Link>
          <Link href="/destinations" className={linkClass("/destinations")} onClick={closeMenu}>Destinations</Link>
          
          {user ? (
            <>
              <Link href="/account" className={linkClass("/account")} onClick={closeMenu}>Mon compte</Link>
              {user.role === "admin" && (
                <Link href="/admin" className={linkClass("/admin")} onClick={closeMenu}>Admin</Link>
              )}
              <button onClick={() => { logout(); closeMenu(); }} className="bg-red-500 text-white text-center hover:bg-red-600 transition-colors px-4 py-2 rounded-md font-bold">
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-primary text-white text-center hover:bg-primary/90 transition-colors px-4 py-2 rounded-md font-bold" onClick={closeMenu}>
              Connexion
            </Link>
          )}
        </div>
      )}
    </>
  );
}