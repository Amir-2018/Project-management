# 🔐 Compte Admin - BackProjectHub

## ✅ Compte Super Admin Créé

Un compte administrateur a été créé avec succès dans la base de données MongoDB Atlas.

### 📋 Informations du Compte

| Champ | Valeur |
|-------|--------|
| **ID** | `699399d21d14da7469ea4512` |
| **Nom** | Super Admin |
| **Email** | `superadmin@ngitraining.com` |
| **Mot de passe** | `Admin@2026` |
| **Rôle** | admin |
| **Créé le** | 2026-02-16 22:27:30 |

### 🎫 Token JWT

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTM5OWQyMWQxNGRhNzQ2OWVhNDUxMiIsImlhdCI6MTc3MTI4MDg1NiwiZXhwIjoxNzcxODg1NjU2fQ.E7RBk7RMN04YEfWbSfQ8AgbSYpwKsRsIelAlS7IAhOU
```

**Expiration:** 7 jours

---

## 🧪 Tests d'Accès Réalisés

Tous les tests ont été effectués avec succès!

### 1. Connexion Admin ✅

**Requête:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@ngitraining.com",
    "password": "Admin@2026"
  }'
```

**Résultat:** ✅ Token JWT généré avec succès

---

### 2. Récupération du Profil ✅

**Requête:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

**Réponse:**
```json
{
  "_id": "699399d21d14da7469ea4512",
  "name": "Super Admin",
  "email": "superadmin@ngitraining.com",
  "role": "admin"
}
```

**Résultat:** ✅ Profil récupéré avec succès

---

### 3. Liste de Tous les Utilisateurs ✅

**Requête:**
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer <TOKEN>"
```

**Résultat:** ✅ 3 utilisateurs trouvés
- Test User (member)
- Admin User (admin)
- Super Admin (admin)

**Note:** Cette route est réservée aux administrateurs uniquement.

---

### 4. Création de Projet ✅

**Requête:**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Projet Admin Test",
    "description": "Projet créé par le super admin",
    "status": "planning"
  }'
```

**Réponse:**
```json
{
  "_id": "699399d92aadf5c3194c0781",
  "name": "Projet Admin Test",
  "description": "Projet créé par le super admin",
  "status": "planning",
  "owner": {
    "_id": "699399d21d14da7469ea4512",
    "name": "Super Admin",
    "email": "superadmin@ngitraining.com"
  },
  "members": [],
  "createdAt": "2026-02-16T22:27:37.581Z",
  "updatedAt": "2026-02-16T22:27:37.581Z"
}
```

**Résultat:** ✅ Projet créé avec le Super Admin comme propriétaire

---

### 5. Liste de Tous les Projets ✅

**Résultat:** ✅ 2 projets trouvés
- Projet Test (owner: Admin User)
- Projet Admin Test (owner: Super Admin)

---

### 6. Liste de Toutes les Tâches ✅

**Résultat:** ✅ 1 tâche trouvée
- Tâche de test (Projet Test)

---

## 📊 Résumé des Tests

| Test | Endpoint | Statut |
|------|----------|--------|
| Connexion | `POST /api/auth/login` | ✅ |
| Profil | `GET /api/auth/me` | ✅ |
| Liste utilisateurs | `GET /api/users` | ✅ |
| Création projet | `POST /api/projects` | ✅ |
| Liste projets | `GET /api/projects` | ✅ |
| Liste tâches | `GET /api/tasks` | ✅ |

**Taux de réussite: 100% (6/6)**

---

## 🚀 Utilisation

### Créer un Nouveau Compte Admin

```bash
node create-admin.js
```

Ce script:
- Vérifie si un admin existe déjà
- Crée un nouveau compte admin si nécessaire
- Génère un token JWT
- Affiche les commandes de test

### Tester l'Accès Admin

```bash
./test-admin-access.sh
```

Ce script teste automatiquement:
- Connexion
- Récupération du profil
- Liste des utilisateurs (admin only)
- Création de projet
- Liste des projets
- Création de tâche
- Liste des tâches

---

## 🔑 Identifiants Admin

**Email:** `superadmin@ngitraining.com`  
**Mot de passe:** `Admin@2026`

> [!WARNING]
> Changez le mot de passe en production pour plus de sécurité!

---

## 📝 Commandes Utiles

### Se connecter via API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@ngitraining.com",
    "password": "Admin@2026"
  }'
```

### Utiliser le token pour accéder aux ressources
```bash
TOKEN="votre_token_ici"

# Obtenir le profil
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Créer un projet
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mon Projet",
    "description": "Description",
    "status": "planning"
  }'
```

---

## 🎯 Privilèges Admin

En tant qu'administrateur, vous avez accès à:

✅ **Toutes les routes utilisateurs**
- Voir tous les utilisateurs
- Modifier n'importe quel utilisateur
- Supprimer des utilisateurs

✅ **Toutes les routes projets**
- Voir tous les projets (pas seulement les vôtres)
- Modifier n'importe quel projet
- Supprimer n'importe quel projet
- Gérer les membres de tous les projets

✅ **Toutes les routes tâches**
- Voir toutes les tâches
- Modifier n'importe quelle tâche
- Supprimer n'importe quelle tâche

---

## 🔒 Sécurité

### Recommandations

1. **Changez le mot de passe par défaut** en production
2. **Utilisez HTTPS** pour toutes les communications
3. **Stockez le token JWT de manière sécurisée** (localStorage, cookies httpOnly)
4. **Ne partagez jamais** vos identifiants admin
5. **Activez l'authentification à deux facteurs** (à implémenter)
6. **Surveillez les logs** d'accès admin

### Variables d'Environnement

Assurez-vous que `JWT_SECRET` dans `.env` est une clé forte et unique:

```env
JWT_SECRET=une_cle_tres_secrete_et_longue_minimum_32_caracteres
```

---

## 📚 Fichiers Créés

- [create-admin.js](file:///home/dev/camping/management/backProjectHub/create-admin.js) - Script de création du compte admin
- [test-admin-access.sh](file:///home/dev/camping/management/backProjectHub/test-admin-access.sh) - Script de test d'accès

---

## ✨ Prochaines Étapes

1. **Créer d'autres utilisateurs** avec différents rôles (manager, member)
2. **Tester les permissions** entre les différents rôles
3. **Implémenter la réinitialisation de mot de passe**
4. **Ajouter l'authentification à deux facteurs**
5. **Créer un dashboard admin** pour gérer les utilisateurs
