README de l'application Reservia

Cette documentation rapide présente la structure du projet, les pages principales, les services et autres éléments importants. Le but est d'aider un développeur à se repérer rapidement.

Démarrage

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000

Structure principale

- **app/** : dossier principal Next.js (routage basé sur les fichiers)
	- `page.tsx` : page d'accueil
	- `layout.tsx`, `globals.css` : layout global et styles
	- `account/page.tsx` : page compte utilisateur
	- `admin/page.tsx` : interface admin
	- `login/page.tsx` : page de connexion
	- `destinations/page.tsx` : liste des destinations
	- `destinations/[id]/page.tsx` : page de détail d'une destination
	- `destinations/[id]/BookingForm.tsx` : formulaire de réservation (composant)
	- `destinations/[id]/ManageDates.tsx` : gestion des dates (composant)

- **app/api/** : routes API (serverless)
	- `auth/` : endpoints d'authentification (`login`, `logout`, `register`, `me`, `delete`)
	- `bookings/route.ts` : endpoints pour les réservations
	- `destinations/` : endpoints pour gérer les destinations (liste, détail, dates)
	- `medias/[filename]/route.ts` : endpoint pour servir les médias
	- `admin/` : endpoints admin (`bookings`, `destinations`, `users`)

- **components/** : composants réutilisables
	- `Navigation.tsx` : barre de navigation
	- `AuthProvider.tsx` : provider d'authentification

- **utils/services/** : services (logique d'accès aux données)
	- `db.service.ts` : abstraction des opérations sur la base (fichier `data/db.json` en développement)
	- `destination.service.ts` : logique métier pour les destinations
	- `booking.service.ts` : logique métier pour les réservations

- **data/**
	- `db.json` : base de données mock pour le développement
	- `medias/` : médias utilisés localement

- **public/** : fichiers statiques servis directement

- **next.config.ts**, **tsconfig.json**, **package.json** : configuration du projet

Comment parcourir le code

- Pages frontend : ouvrir les fichiers dans `app/` pour comprendre le rendu et les composants utilisés.
- API : regarder `app/api/` pour comprendre les endpoints et la logique côté serveur.
- Services : `utils/services/` centralise la logique métier et l'accès aux données — utile pour écrire des tests ou réutiliser la logique côté serveur et cliente.

Bonnes pratiques

- Mettre les composants réutilisables dans `components/`.
- Documenter les nouveaux endpoints et services en ajoutant un court commentaire JSDoc.

Besoin d'aide ?

Si tu veux, je peux :
- Générer un fichier Markdown plus détaillé pour un dossier spécifique.
- Ajouter des commentaires JSDoc dans les services.
- Lister tous les fichiers d'un dossier précis.

Où trouver les bonnes pratiques dans ce projet

Voici pour chaque point demandé où regarder dans le code et des indications concrètes pour les appliquer.

- **SSR / SSG / ISR** : voir [app/page.tsx](app/page.tsx#L1) (usage `export const revalidate = 3600` pour ISR) et les pages sous `app/` (Server Components par défaut). Utilise `revalidate` pour ISR, `fetch` côté serveur pour SSR, et Client Components pour les interactions côté client.

- **Créer et consommer des API routes** : routes dans `app/api/` (ex : [app/api/destinations/route.ts](app/api/destinations/route.ts#L1), [app/api/bookings/route.ts](app/api/bookings/route.ts#L1)). Les pages consomment ces routes via `fetch('/api/...')` (voir [app/destinations/page.tsx](app/destinations/page.tsx#L1), [app/admin/page.tsx](app/admin/page.tsx#L37)). Centralise les appels si nécessaire dans `utils/services`.

- **Gérer une base de données** : abstraction dans `utils/services/db.service.ts` (gestion `readDB`/`writeDB`, variable `MONGODB_URI`). `docker-compose.yml` inclut un service Mongo pour dev. Pour production, utiliser Mongo/Prisma/Mongoose et stocker l'URI en `MONGODB_URI`.

- **Authentification sécurisée** : API d'auth dans `app/api/auth/*` (login/register/me/logout/delete) et consommée par `components/AuthProvider.tsx`. Recommandation : stocker tokens en cookies HttpOnly, hacher les mots de passe (bcrypt), vérifier les sessions côté serveur et protéger les routes admin.

- **Structurer un projet professionnel** : la structure actuelle sépare `app/`, `app/api/`, `components/`, `utils/services/`, `data/`. Pour évoluer : ajouter `lib/` (helpers serveur), `hooks/`, `types/`, `tests/`, `docs/` et documenter conventions (naming, patterns).

- **Optimiser les performances** : le projet utilise `next/image` (ex : [app/page.tsx](app/page.tsx#L2)) et `next.config.ts` autorise les domaines d'images. Autres optimisations : pagination, lazy-loading, CDN pour `/api/medias`, headers `Cache-Control`, compression et préfetching.

- **Produire une UI/UX cohérente** : composants réutilisables dans `components/` (`Navigation.tsx`, `AuthProvider.tsx`). Proposer une bibliothèque de composants (Button, Form, Card), tokens CSS dans `globals.css`, et documentation (Storybook) pour maintenir la cohérence.

---
Fichier originel généré par `create-next-app`.
