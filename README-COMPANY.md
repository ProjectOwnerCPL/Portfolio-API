# 🏢 API Portfolio avec Base de Données Compagnie Fictive

Une API REST complète pour gérer les données d'une compagnie fictive "Fixer Solutions" avec employés, projets, départements et données financières.

## 🚀 Démarrage Rapide

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Démarrer en production
npm start
```

## 📋 Endpoints Disponibles

### 🏢 **Informations Générales de la Compagnie**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/company` | Informations générales de la compagnie |
| GET | `/api/company/stats` | Statistiques complètes |
| GET | `/api/company/financial` | Données financières |

**Exemple de réponse `/api/company` :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Fixer Solutions",
    "founded": "2018",
    "industry": "Technologie",
    "location": "Montreal, Quebec",
    "employees": 150,
    "website": "www.fixer-solutions.com",
    "description": "Entreprise spécialisée dans le développement de solutions logicielles innovantes"
  }
}
```

### 👥 **Employés**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/company/employees` | Tous les employés |
| GET | `/api/company/employees/:id` | Employé par ID |
| GET | `/api/company/employees/department/:department` | Employés par département |

**Exemple de réponse `/api/company/employees` :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "firstName": "Marie",
      "lastName": "Dubois",
      "position": "Directrice Technique",
      "department": "IT",
      "email": "marie.dubois@fixer.com",
      "hireDate": "2019-03-15",
      "salary": 95000,
      "skills": ["JavaScript", "Python", "Architecture", "Leadership"]
    }
  ],
  "total": 5
}
```

### 📊 **Projets**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/company/projects` | Tous les projets |
| GET | `/api/company/projects/:id` | Projet par ID (avec détails équipe) |
| GET | `/api/company/projects/status/:status` | Projets par statut |

**Statuts disponibles :** `Terminé`, `En cours`, `En planification`

**Exemple de réponse `/api/company/projects/1` :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Plateforme E-commerce",
    "description": "Développement d'une plateforme e-commerce complète",
    "status": "Terminé",
    "budget": 250000,
    "clientName": "Retail Plus Inc.",
    "technologies": ["React", "Node.js", "PostgreSQL", "Stripe API"],
    "teamDetails": [
      {
        "id": 1,
        "name": "Marie Dubois",
        "position": "Directrice Technique"
      }
    ]
  }
}
```

### 🏢 **Départements**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/company/departments` | Tous les départements |

### 🔍 **Recherche**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/company/search?query=terme` | Recherche globale |

**Exemple de recherche :** `/api/company/search?query=javascript`
```json
{
  "success": true,
  "data": {
    "employees": [...], // Employés avec compétence JavaScript
    "projects": [...],  // Projets utilisant JavaScript
    "departments": [...],
    "totalResults": 5
  },
  "searchTerm": "javascript"
}
```

## 📈 **Exemples d'utilisation**

### 1. **Obtenir toutes les statistiques**
```bash
curl http://localhost:3000/api/company/stats
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "totalEmployees": 5,
    "totalProjects": 3,
    "activeProjects": 1,
    "completedProjects": 1,
    "totalDepartments": 5,
    "averageSalary": 77000,
    "totalBudget": 830000,
    "companyAge": 7,
    "topSkills": [
      { "skill": "JavaScript", "count": 2 },
      { "skill": "Python", "count": 2 }
    ]
  }
}
```

### 2. **Obtenir les employés du département IT**
```bash
curl http://localhost:3000/api/company/employees/department/IT
```

### 3. **Obtenir les projets en cours**
```bash
curl http://localhost:3000/api/company/projects/status/En%20cours
```

### 4. **Rechercher par compétence**
```bash
curl "http://localhost:3000/api/company/search?query=React"
```

## 🛠️ **Structure des Données**

### **Employé**
```javascript
{
  id: Number,
  firstName: String,
  lastName: String,
  position: String,
  department: String,
  email: String,
  phone: String,
  hireDate: String,
  salary: Number,
  skills: Array<String>
}
```

### **Projet**
```javascript
{
  id: Number,
  name: String,
  description: String,
  status: String,
  startDate: String,
  endDate: String,
  budget: Number,
  clientName: String,
  teamMembers: Array<Number>,
  technologies: Array<String>
}
```

### **Département**
```javascript
{
  id: Number,
  name: String,
  manager: String,
  employeeCount: Number,
  budget: Number,
  description: String
}
```

## 🔧 **Options Avancées**

### **Passer à une vraie base de données**

Si vous voulez utiliser une vraie base de données, voici les options :

#### **Option 1: SQLite (Simple)**
```bash
npm install sqlite3 sequelize
```

#### **Option 2: MongoDB (NoSQL)**
```bash
npm install mongoose
```

#### **Option 3: PostgreSQL (Relationnel)**
```bash
npm install pg sequelize
```

### **Ajouter l'authentification**
```bash
npm install jsonwebtoken bcryptjs
```

### **Ajouter la validation**
```bash
npm install joi express-validator
```

## 📦 **Données Fictives Incluses**

- **5 employés** avec compétences et salaires
- **3 projets** (terminé, en cours, planification)
- **5 départements** avec budgets
- **Données financières** complètes 2023
- **Informations compagnie** détaillées

## 🌐 **Tests des Endpoints**

Testez votre API avec ces commandes :

```bash
# Informations de base
curl http://localhost:3000/api/company

# Tous les employés
curl http://localhost:3000/api/company/employees

# Projets en cours
curl http://localhost:3000/api/company/projects/status/En%20cours

# Statistiques complètes
curl http://localhost:3000/api/company/stats

# Recherche
curl "http://localhost:3000/api/company/search?query=Marie"
```

## 🎯 **Fonctionnalités**

✅ **API REST complète**  
✅ **Base de données en mémoire**  
✅ **Recherche globale**  
✅ **Statistiques automatiques**  
✅ **Validation des paramètres**  
✅ **Gestion d'erreurs**  
✅ **Documentation complète**  
✅ **Données réalistes**  

L'API est prête à être étendue avec une vraie base de données et des fonctionnalités avancées !
