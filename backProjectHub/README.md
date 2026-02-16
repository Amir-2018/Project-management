# BackProjectHub API

Backend API pour la gestion de projets avec authentification JWT et MongoDB.

## Fonctionnalités

- ✅ Authentification JWT
- ✅ Gestion des utilisateurs (CRUD)
- ✅ Gestion des projets (CRUD)
- ✅ Gestion des tâches (CRUD)
- ✅ Autorisation basée sur les rôles
- ✅ Connexion MongoDB
- ✅ Validation des données
- ✅ Gestion des erreurs

## Installation

1. Installer les dépendances:
```bash
npm install
```

2. Créer un fichier `.env` basé sur `.env.example`:
```bash
cp .env.example .env
```

3. Configurer les variables d'environnement dans `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/backprojecthub
JWT_SECRET=votre_secret_jwt_ici
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Créer un nouveau compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Obtenir l'utilisateur connecté (protégé)

### Users
- `GET /api/users` - Liste des utilisateurs (admin)
- `GET /api/users/:id` - Détails d'un utilisateur (protégé)
- `PUT /api/users/:id` - Modifier un utilisateur (protégé)
- `DELETE /api/users/:id` - Supprimer un utilisateur (admin)

### Projects
- `GET /api/projects` - Liste des projets (protégé)
- `GET /api/projects/:id` - Détails d'un projet (protégé)
- `POST /api/projects` - Créer un projet (protégé)
- `PUT /api/projects/:id` - Modifier un projet (protégé)
- `DELETE /api/projects/:id` - Supprimer un projet (protégé)
- `POST /api/projects/:id/members` - Ajouter un membre (protégé)
- `DELETE /api/projects/:id/members/:userId` - Retirer un membre (protégé)

### Tasks
- `GET /api/tasks` - Liste des tâches (protégé)
- `GET /api/tasks/:id` - Détails d'une tâche (protégé)
- `POST /api/tasks` - Créer une tâche (protégé)
- `PUT /api/tasks/:id` - Modifier une tâche (protégé)
- `DELETE /api/tasks/:id` - Supprimer une tâche (protégé)

## Modèles de données

### User
- name (String, requis)
- email (String, requis, unique)
- password (String, requis, hashé)
- role (String: 'admin', 'manager', 'member')

### Project
- name (String, requis)
- description (String)
- status (String: 'planning', 'in-progress', 'completed', 'on-hold')
- owner (ObjectId, ref: User)
- members (Array of ObjectId, ref: User)
- startDate (Date)
- endDate (Date)

### Task
- title (String, requis)
- description (String)
- status (String: 'todo', 'in-progress', 'review', 'completed')
- priority (String: 'low', 'medium', 'high', 'urgent')
- project (ObjectId, ref: Project)
- assignedTo (ObjectId, ref: User)
- dueDate (Date)

## Authentification

Toutes les routes protégées nécessitent un token JWT dans le header:
```
Authorization: Bearer <token>
```

## Structure du projet

```
backProjectHub/
├── src/
│   ├── config/          # Configuration (DB, JWT)
│   ├── models/          # Modèles Mongoose
│   ├── controllers/     # Logique métier
│   ├── middleware/      # Middleware (auth, errors)
│   ├── routes/          # Routes API
│   └── app.js          # Configuration Express
├── .env.example        # Template variables d'environnement
├── server.js           # Point d'entrée
└── package.json        # Dépendances
```
