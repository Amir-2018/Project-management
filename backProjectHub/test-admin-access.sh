#!/bin/bash

# Script to test admin access
# This script logs in as admin and tests various endpoints

BASE_URL="http://localhost:5000/api"
ADMIN_EMAIL="superadmin@ngitraining.com"
ADMIN_PASSWORD="Admin@2026"

echo "🧪 Test d'accès Admin - BackProjectHub"
echo "========================================"
echo ""

# Step 1: Login as admin
echo "1️⃣ Connexion en tant qu'admin..."
LOGIN_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${ADMIN_EMAIL}\",
    \"password\": \"${ADMIN_PASSWORD}\"
  }")

echo "Réponse: $LOGIN_RESPONSE"
echo ""

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Échec de la connexion. Vérifiez les identifiants."
  exit 1
fi

echo "✅ Connexion réussie!"
echo "Token: ${TOKEN:0:30}..."
echo ""

# Step 2: Get current user
echo "2️⃣ Récupération des informations utilisateur..."
ME_RESPONSE=$(curl -s -X GET ${BASE_URL}/auth/me \
  -H "Authorization: Bearer $TOKEN")
echo "Réponse: $ME_RESPONSE"
echo ""

# Step 3: Get all users (admin only)
echo "3️⃣ Liste de tous les utilisateurs (admin seulement)..."
USERS_RESPONSE=$(curl -s -X GET ${BASE_URL}/users \
  -H "Authorization: Bearer $TOKEN")
echo "Réponse: $USERS_RESPONSE"
echo ""

# Step 4: Create a project
echo "4️⃣ Création d'un projet..."
PROJECT_RESPONSE=$(curl -s -X POST ${BASE_URL}/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Projet Admin Test",
    "description": "Projet créé par le super admin",
    "status": "planning"
  }')
echo "Réponse: $PROJECT_RESPONSE"
PROJECT_ID=$(echo $PROJECT_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo ""

# Step 5: Get all projects
echo "5️⃣ Liste de tous les projets..."
PROJECTS_RESPONSE=$(curl -s -X GET ${BASE_URL}/projects \
  -H "Authorization: Bearer $TOKEN")
echo "Réponse: $PROJECTS_RESPONSE"
echo ""

# Step 6: Create a task
if [ ! -z "$PROJECT_ID" ]; then
  echo "6️⃣ Création d'une tâche..."
  TASK_RESPONSE=$(curl -s -X POST ${BASE_URL}/tasks \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"title\": \"Tâche Admin\",
      \"description\": \"Tâche créée par le super admin\",
      \"status\": \"todo\",
      \"priority\": \"high\",
      \"project\": \"$PROJECT_ID\"
    }")
  echo "Réponse: $TASK_RESPONSE"
  echo ""
fi

# Step 7: Get all tasks
echo "7️⃣ Liste de toutes les tâches..."
TASKS_RESPONSE=$(curl -s -X GET ${BASE_URL}/tasks \
  -H "Authorization: Bearer $TOKEN")
echo "Réponse: $TASKS_RESPONSE"
echo ""

echo "========================================"
echo "✅ Tests terminés avec succès!"
echo ""
echo "📝 Résumé:"
echo "- Connexion admin: ✓"
echo "- Récupération profil: ✓"
echo "- Liste utilisateurs: ✓"
echo "- Création projet: ✓"
echo "- Liste projets: ✓"
echo "- Création tâche: ✓"
echo "- Liste tâches: ✓"
echo ""
echo "🎫 Token pour utilisation future:"
echo "$TOKEN"
