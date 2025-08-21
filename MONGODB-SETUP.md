# 🍃 Configuration MongoDB pour Fixer API

## 🎯 État Actuel

✅ **Code MongoDB prêt** - Tous les fichiers créés  
✅ **API fonctionnelle** - Mode mémoire actif  
⚠️ **Mongoose à installer** - `npm install mongoose`  
⏳ **MongoDB à configurer** - Options ci-dessous  

## 🚀 OPTION RECOMMANDÉE: MongoDB Atlas (Cloud)

### **Étape 1: Créer un compte gratuit** (5 minutes)

1. **Aller sur** https://www.mongodb.com/atlas
2. **S'inscrire** avec Google ou email
3. **Sélectionner** "Shared" (gratuit - 512MB)
4. **Choisir** AWS / N.Virginia (us-east-1)
5. **Nommer** le cluster: `fixer`

### **Étape 2: Configurer l'accès** (3 minutes)

1. **Database Access** → Create User
   - Username: `fixer_user`
   - Password: `mySecurePassword123` (noter ce mot de passe)
   - Built-in Role: `Atlas admin`

2. **Network Access** → Add IP Address
   - Cliquer `Allow access from anywhere` (0.0.0.0/0)
   - Ou votre IP spécifique pour plus de sécurité

### **Étape 3: Récupérer l'URI** (1 minute)

1. **Clusters** → Cliquer `Connect`
2. **Choisir** "Connect your application"
3. **Copier** l'URI (ressemble à):
   ```
   mongodb+srv://fixer_user:mySecurePassword123@fixer.xxxxx.mongodb.net/fixer
   ```

### **Étape 4: Configurer l'API** (1 minute)

Modifier le fichier `.env`:
```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# Remplacer par votre URI MongoDB Atlas
MONGODB_URI=mongodb+srv://fixer_user:mySecurePassword123@fixer.xxxxx.mongodb.net/fixer

JWT_SECRET=votre_secret_jwt_super_securise_ici
API_VERSION=1.0.0
```

## 🔧 Installation Complète

### **1. Installer Mongoose**
```bash
cd "c:\Users\pasca\Documents Local\GitHub\Portfolio-API"
npm install mongoose --save
```

### **2. Vérifier l'installation**
```bash
node -e "require('mongoose'); console.log('Mongoose OK');"
```

### **3. Démarrer le serveur**
```bash
npm run dev
```

### **4. Vérifier MongoDB**
```bash
# Dans le navigateur:
http://localhost:3000/api/company-mongo/health
```

## ✨ Fonctionnalités MongoDB Ajoutées

### **Nouveaux Endpoints** (`/api/company-mongo/`)

| Endpoint | Fonctionnalité MongoDB |
|----------|------------------------|
| `GET /health` | ✅ État connexion MongoDB |
| `GET /db-info` | ✅ Compteurs collections |
| `GET /` | ✅ Infos avec calculs auto |
| `GET /employees?page=2&limit=5` | ✅ **Pagination** |
| `GET /employees/:id` | ✅ Employé + **ses projets** |
| `GET /projects` | ✅ **Relations populées** |
| `GET /departments` | ✅ Manager + **compteurs** |
| `GET /stats` | ✅ **Agrégations** MongoDB |
| `GET /search?query=js&type=employees` | ✅ **Recherche avancée** |

### **Avantages par rapport à la mémoire**

🆚 **Mémoire** vs **MongoDB**

| Fonctionnalité | Mémoire | MongoDB |
|---------------|---------|---------|
| **Vitesse** | ⚡ Très rapide | 🐌 Plus lent |
| **Relations** | ❌ Manuelles | ✅ Automatiques |
| **Pagination** | ❌ Non | ✅ Intégrée |
| **Recherche** | ❌ Basique | ✅ Regex/Filtres |
| **Validation** | ❌ Manuelle | ✅ Automatique |
| **Statistiques** | ❌ Calculs manuels | ✅ Agrégations |
| **Persistance** | ❌ Redémarrage = perte | ✅ Données sauvées |

## 🧪 Tests Disponibles

### **1. Interface Web**
```bash
# Ouvrir dans le navigateur:
file:///c:/Users/pasca/Documents%20Local/GitHub/Portfolio-API/test-mongodb-compare.html
```

### **2. Tests automatisés**
```bash
node test-mongodb.js
```

### **3. Comparaison API**
- **Mémoire**: `http://localhost:3000/api/company/*`
- **MongoDB**: `http://localhost:3000/api/company-mongo/*`

## 🐛 Résolution de Problèmes

### **Mongoose non trouvé**
```bash
npm install mongoose --save
npm audit fix
```

### **Connexion MongoDB échoue**
1. Vérifier l'URI dans `.env`
2. Vérifier Network Access (0.0.0.0/0)
3. Vérifier le mot de passe utilisateur

### **Port 3000 occupé**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### **Serveur ne démarre pas**
```bash
# Redémarrer proprement
npm run dev
```

## � Exemple d'utilisation MongoDB

### **1. Pagination**
```javascript
// Récupérer page 2, 5 employés par page, département IT
fetch('/api/company-mongo/employees?page=2&limit=5&department=IT')
  .then(res => res.json())
  .then(data => console.log(data.pagination))
```

### **2. Relations automatiques**
```javascript
// Employé avec ses projets automatiquement liés
fetch('/api/company-mongo/employees/[ID]')
  .then(res => res.json())
  .then(data => console.log(data.data.projects))
```

### **3. Recherche avancée**
```javascript
// Rechercher "JavaScript" seulement dans les employés
fetch('/api/company-mongo/search?query=JavaScript&type=employees')
  .then(res => res.json())
  .then(data => console.log(data.data.employees))
```

### **4. Statistiques calculées**
```javascript
// Statistiques en temps réel depuis MongoDB
fetch('/api/company-mongo/stats')
  .then(res => res.json())
  .then(data => {
    console.log('Salaire moyen:', data.data.employees.salary.avgSalary);
    console.log('Top compétences:', data.data.skills.top);
  })
```

## 🎯 Prochaines étapes

1. **✅ Installer Mongoose** - `npm install mongoose`
2. **✅ Configurer MongoDB Atlas** - URI dans .env  
3. **🔄 Tester** - Interface web ou automatisé
4. **� Développer** - Utiliser les nouvelles fonctionnalités

**Votre API MongoDB est prête à être configurée ! 🍃**

---

💡 **Conseil**: Commencez avec MongoDB Atlas (cloud) - c'est plus simple que l'installation locale et gratuit jusqu'à 512MB.
