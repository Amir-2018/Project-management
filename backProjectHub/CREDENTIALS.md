# 🔑 Identifiants BackProjectHub

## 📧 Compte Super Admin

**Email:** `superadmin@ngitraining.com`  
**Mot de passe:** `Admin@2026`  
**Rôle:** admin  
**ID:** `699399d21d14da7469ea4512`

## 🎫 Token JWT Actuel

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTM5OWQyMWQxNGRhNzQ2OWVhNDUxMiIsImlhdCI6MTc3MTI4MDg1NiwiZXhwIjoxNzcxODg1NjU2fQ.E7RBk7RMN04YEfWbSfQ8AgbSYpwKsRsIelAlS7IAhOU
```

**Expire le:** 2026-02-23 (7 jours)

## 🌐 URLs

**Base URL:** `http://localhost:5000/api`  
**Health Check:** `http://localhost:5000/api/health`

## 🗄️ MongoDB Atlas

**URI:** `mongodb+srv://Mriou:amir169114@ngitraining.xf3cc.mongodb.net/NgiTraining`  
**Database:** `NgiTraining`  
**Cluster:** `ngitraining-shard-00-00.xf3cc.mongodb.net`

## 🚀 Commandes Rapides

### Démarrer le serveur
```bash
cd /home/dev/camping/management/backProjectHub
npm run dev
```

### Se connecter
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@ngitraining.com",
    "password": "Admin@2026"
  }'
```

### Créer un nouveau compte admin
```bash
node create-admin.js
```

### Tester l'accès admin
```bash
./test-admin-access.sh
```

## 📝 Autres Comptes de Test

### Admin User
- **Email:** `admin@ngitraining.com`
- **Mot de passe:** `admin123`
- **Rôle:** admin

### Test User
- **Email:** `test@example.com`
- **Mot de passe:** `password123`
- **Rôle:** member

---

> [!WARNING]
> **IMPORTANT:** Ces identifiants sont pour le développement uniquement.  
> Changez-les en production!
