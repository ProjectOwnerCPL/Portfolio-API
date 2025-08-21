# 📮 Guide pour tester les requêtes POST - Fixer Solutions API

## 🚀 Méthode 1: Postman (Recommandé)

### Installation
1. Téléchargez Postman: https://www.postman.com/downloads/
2. Installez et ouvrez Postman

### Créer un nouvel employé
```
URL: http://localhost:3000/api/company-mongo/employees
Method: POST
Headers: Content-Type: application/json

Body (raw, JSON):
{
  "firstName": "Julie",
  "lastName": "Moreau",
  "position": "Spécialiste Marketing",
  "department": "Management",
  "email": "julie.moreau@fixer.com",
  "phone": "+1-514-555-0106",
  "salary": 70000,
  "skills": ["SEO", "Social Media", "Analytics", "Content Marketing"]
}
```

### Créer un nouveau projet
```
URL: http://localhost:3000/api/company-mongo/projects
Method: POST
Headers: Content-Type: application/json

Body (raw, JSON):
{
  "name": "Application de Gestion RH",
  "description": "Système de gestion des ressources humaines",
  "status": "En planification",
  "startDate": "2024-03-01",
  "endDate": "2024-08-30",
  "budget": 300000,
  "clientName": "Fixer Internal",
  "technologies": ["React", "Node.js", "PostgreSQL", "Docker"]
}
```

### Créer un nouveau département
```
URL: http://localhost:3000/api/company-mongo/departments
Method: POST
Headers: Content-Type: application/json

Body (raw, JSON):
{
  "name": "R&D",
  "manager": "Innovation Director",
  "employeeCount": 3,
  "budget": 450000,
  "description": "Recherche et Développement de nouvelles technologies"
}
```

## 🌐 Méthode 2: Interface Web (Browser)
Ouvrez: http://localhost:3000/post-test.html

## ⚡ Méthode 3: cURL (Terminal/CMD)

### Créer un employé
```bash
curl -X POST http://localhost:3000/api/company-mongo/employees \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Alex\",
    \"lastName\": \"Tremblay\",
    \"position\": \"Développeur Backend\",
    \"department\": \"Développement\",
    \"email\": \"alex.tremblay@fixer.com\",
    \"salary\": 92000,
    \"skills\": [\"Python\", \"Django\", \"PostgreSQL\", \"Redis\"]
  }"
```

### Créer un projet
```bash
curl -X POST http://localhost:3000/api/company-mongo/projects \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Plateforme IoT\",
    \"description\": \"Plateforme de gestion d'objets connectés\",
    \"status\": \"En cours\",
    \"budget\": 500000,
    \"clientName\": \"TechConnect Inc\"
  }"
```

## 🔧 Méthode 4: PowerShell

### Créer un employé
```powershell
$body = @{
    firstName = "Sarah"
    lastName = "Lemieux"
    position = "Analyste de Données"
    department = "Analytics"
    email = "sarah.lemieux@fixer.com"
    salary = 88000
    skills = @("Python", "R", "Tableau", "SQL")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/company-mongo/employees" -Method POST -Body $body -ContentType "application/json"
```

## ✅ Validation des champs requis

### Pour les employés:
- ✅ firstName (requis)
- ✅ lastName (requis)  
- ✅ position (requis)
- ✅ department (requis): "IT", "Développement", "Design", "Analytics", "Management"
- ✅ email (requis, unique)
- ✅ salary (requis, entre 30,000 et 200,000)
- phone (optionnel)
- skills (optionnel, array)

### Pour les projets:
- ✅ name (requis)
- ✅ description (requis)
- status (défaut: "En planification")
- budget (optionnel)
- clientName (optionnel)
- technologies (optionnel, array)

### Pour les départements:
- ✅ name (requis)
- manager (optionnel)
- employeeCount (défaut: 0)
- budget (optionnel)
- description (optionnel)

## 🐛 Erreurs communes

### 400 Bad Request
- Champs requis manquants
- Email déjà existant
- Département invalide
- Salaire hors limites

### 500 Server Error  
- Erreur de connexion MongoDB
- Données malformées

## 📊 Réponses attendues

### Succès (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "firstName": "Julie",
    "lastName": "Moreau",
    // ... autres champs
  },
  "message": "Employé créé avec succès"
}
```

### Erreur (400 Bad Request)
```json
{
  "success": false,
  "message": "Erreur lors de la création de l'employé",
  "error": "Le prénom est requis"
}
```
