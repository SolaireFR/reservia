"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }

      await refreshUser();
      router.push("/account");
    } catch {
      setError("Impossible de contacter le serveur.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-card p-8 rounded-lg shadow-lg border border-border w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-primary">
          {isLogin ? "Connexion" : "Créer un compte"}
        </h1>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold mb-1">Nom complet</label>
              <input 
                type="text" 
                required 
                className="w-full p-2 border border-border rounded bg-background"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full p-2 border border-border rounded bg-background"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Mot de passe</label>
            <input 
              type="password" 
              required 
              className="w-full p-2 border border-border rounded bg-background"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <button type="submit" className="bg-primary text-white font-bold py-2 rounded mt-2 hover:bg-primary/90">
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
        
        <p className="text-center text-sm text-secondary mt-6">
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="ml-2 text-primary font-bold hover:underline"
          >
            {isLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
}