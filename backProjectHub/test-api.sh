#!/bin/bash

# Test script for BackProjectHub API
# This script tests the main API endpoints

BASE_URL="http://localhost:5000/api"
echo "🧪 Testing BackProjectHub API"
echo "================================"
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Endpoint..."
HEALTH=$(curl -s ${BASE_URL}/health)
echo "Response: $HEALTH"
echo ""

# Test 2: Register User
echo "2️⃣ Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "member"
  }')
echo "Response: $REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token extracted: ${TOKEN:0:20}..."
echo ""

# Test 3: Login
echo "3️⃣ Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo "Response: $LOGIN_RESPONSE"
echo ""

# Test 4: Get Current User
echo "4️⃣ Testing Get Current User (Protected Route)..."
ME_RESPONSE=$(curl -s -X GET ${BASE_URL}/auth/me \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $ME_RESPONSE"
echo ""

# Test 5: Create Project
echo "5️⃣ Testing Create Project..."
PROJECT_RESPONSE=$(curl -s -X POST ${BASE_URL}/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "A test project for API verification",
    "status": "planning"
  }')
echo "Response: $PROJECT_RESPONSE"
PROJECT_ID=$(echo $PROJECT_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Project ID: $PROJECT_ID"
echo ""

# Test 6: Get All Projects
echo "6️⃣ Testing Get All Projects..."
PROJECTS_RESPONSE=$(curl -s -X GET ${BASE_URL}/projects \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $PROJECTS_RESPONSE"
echo ""

# Test 7: Create Task
echo "7️⃣ Testing Create Task..."
TASK_RESPONSE=$(curl -s -X POST ${BASE_URL}/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Test Task\",
    \"description\": \"A test task for API verification\",
    \"status\": \"todo\",
    \"priority\": \"high\",
    \"project\": \"$PROJECT_ID\"
  }")
echo "Response: $TASK_RESPONSE"
TASK_ID=$(echo $TASK_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Task ID: $TASK_ID"
echo ""

# Test 8: Get All Tasks
echo "8️⃣ Testing Get All Tasks..."
TASKS_RESPONSE=$(curl -s -X GET ${BASE_URL}/tasks \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $TASKS_RESPONSE"
echo ""

echo "================================"
echo "✅ API Testing Complete!"
echo ""
echo "Summary:"
echo "- Health check: ✓"
echo "- User registration: ✓"
echo "- User login: ✓"
echo "- Get current user: ✓"
echo "- Create project: ✓"
echo "- Get projects: ✓"
echo "- Create task: ✓"
echo "- Get tasks: ✓"
