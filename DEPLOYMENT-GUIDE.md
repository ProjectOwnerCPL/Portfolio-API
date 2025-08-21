# 🌐 Guide de Déploiement - API Fixer Solutions

## 🚀 Déploiement sur cpl-labs.com

### Préparatifs pour le déploiement

#### 1. Préparer les variables d'environnement pour production
```bash
# Créer un fichier .env.production
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://AdminCPL:Admin404@fixer.xmg9ryb.mongodb.net/fixer?retryWrites=true&w=majority
FRONTEND_URL=https://cpl-labs.com
```

#### 2. Modifier server.js pour la production
```javascript
// Ajouter avant app.listen()
app.use(express.static(path.join(__dirname, 'public')));

// CORS pour production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://cpl-labs.com', 'https://www.cpl-labs.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
};

app.use(cors(corsOptions));
```

#### 3. Scripts package.json pour production
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "prod": "NODE_ENV=production node server.js",
    "build": "npm install --production"
  }
}
```

## 🔧 Méthodes de déploiement

### A. Upload FTP/cPanel (Recommandé pour cpl-labs.com)

#### Étapes:
1. **Compresser votre projet**
   ```bash
   # Exclure node_modules et .env
   zip -r fixer-api.zip . -x "node_modules/*" ".env" "*.git*"
   ```

2. **Uploader via cPanel File Manager**
   - Connectez-vous à cpl-labs.com/cpanel
   - File Manager > public_html
   - Créer dossier: `/api` ou `/fixer-api`
   - Upload et extraire fixer-api.zip

3. **Installer les dépendances**
   ```bash
   # Via Terminal cPanel ou SSH
   cd /home/username/public_html/fixer-api
   npm install --production
   ```

4. **Configurer .env production**
   ```bash
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=mongodb+srv://AdminCPL:Admin404@fixer.xmg9ryb.mongodb.net/fixer?retryWrites=true&w=majority
   ```

5. **Démarrer avec PM2 (recommandé)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "fixer-api"
   pm2 startup
   pm2 save
   ```

### B. Subdomain setup
- Créer subdomain: `api.cpl-labs.com`
- Pointer vers `/public_html/fixer-api`
- SSL automatique via cPanel

## 🌐 Pages de test pour production

### Page de test universelle (fonctionne partout)
```html
<!-- test-api-production.html -->
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Test API Fixer - Production</title>
    <style>
        body { font-family: Arial; padding: 20px; }
        .endpoint { margin: 20px 0; padding: 15px; border: 1px solid #ccc; }
        .test-btn { background: #007bff; color: white; padding: 10px; border: none; cursor: pointer; }
        .result { background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .error { background: #f8d7da; border-color: #f5c6cb; }
        .success { background: #d4edda; border-color: #c3e6cb; }
    </style>
</head>
<body>
    <h1>🚀 API Fixer Solutions - Test Production</h1>
    
    <div class="endpoint">
        <h3>🏢 Info Compagnie</h3>
        <button class="test-btn" onclick="testEndpoint('info', 'https://cpl-labs.com/fixer-api/api/company-mongo/info')">
            Tester GET /info
        </button>
        <div id="result-info" class="result"></div>
    </div>
    
    <div class="endpoint">
        <h3>👥 Employés</h3>
        <button class="test-btn" onclick="testEndpoint('employees', 'https://cpl-labs.com/fixer-api/api/company-mongo/employees')">
            Tester GET /employees
        </button>
        <div id="result-employees" class="result"></div>
    </div>
    
    <div class="endpoint">
        <h3>📋 Projets</h3>
        <button class="test-btn" onclick="testEndpoint('projects', 'https://cpl-labs.com/fixer-api/api/company-mongo/projects')">
            Tester GET /projects
        </button>
        <div id="result-projects" class="result"></div>
    </div>
    
    <div class="endpoint">
        <h3>➕ Créer Employé (POST)</h3>
        <div>
            <input type="text" id="firstName" placeholder="Prénom" value="Test">
            <input type="text" id="lastName" placeholder="Nom" value="User">
            <input type="email" id="email" placeholder="Email" value="test@fixer.com">
            <select id="department">
                <option value="Développement">Développement</option>
                <option value="Design">Design</option>
                <option value="IT">IT</option>
                <option value="Management">Management</option>
            </select>
            <input type="number" id="salary" placeholder="Salaire" value="75000">
        </div>
        <button class="test-btn" onclick="createEmployee()">Créer Employé</button>
        <div id="result-create" class="result"></div>
    </div>

    <script>
        const API_BASE = 'https://cpl-labs.com/fixer-api'; // Changez selon votre URL
        
        async function testEndpoint(id, url) {
            const resultDiv = document.getElementById(`result-${id}`);
            resultDiv.innerHTML = '⏳ Chargement...';
            
            try {
                const response = await fetch(url);
                const data = await response.json();
                
                resultDiv.className = response.ok ? 'result success' : 'result error';
                resultDiv.innerHTML = `
                    <strong>Status:</strong> ${response.status}<br>
                    <strong>Réponse:</strong><br>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            } catch (error) {
                resultDiv.className = 'result error';
                resultDiv.innerHTML = `❌ Erreur: ${error.message}`;
            }
        }
        
        async function createEmployee() {
            const resultDiv = document.getElementById('result-create');
            resultDiv.innerHTML = '⏳ Création...';
            
            const employeeData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                department: document.getElementById('department').value,
                position: "Test Position",
                salary: parseInt(document.getElementById('salary').value)
            };
            
            try {
                const response = await fetch(`${API_BASE}/api/company-mongo/employees`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(employeeData)
                });
                
                const data = await response.json();
                
                resultDiv.className = response.ok ? 'result success' : 'result error';
                resultDiv.innerHTML = `
                    <strong>Status:</strong> ${response.status}<br>
                    <strong>Réponse:</strong><br>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            } catch (error) {
                resultDiv.className = 'result error';
                resultDiv.innerHTML = `❌ Erreur: ${error.message}`;
            }
        }
    </script>
</body>
</html>
```

## 📋 Checklist de déploiement

### Avant déploiement:
- [ ] Variables d'environnement configurées
- [ ] CORS configuré pour production
- [ ] Tests locaux OK
- [ ] MongoDB Atlas accessible

### Après déploiement:
- [ ] API accessible via URL publique
- [ ] Tous endpoints fonctionnent
- [ ] CORS autorise votre domaine
- [ ] SSL/HTTPS activé
- [ ] PM2 ou équivalent configuré

## 🔧 URLs après déploiement

### Si déployé sur cpl-labs.com/fixer-api:
- API Base: `https://cpl-labs.com/fixer-api`
- Documentation: `https://cpl-labs.com/fixer-api/docs`
- Employés: `https://cpl-labs.com/fixer-api/api/company-mongo/employees`

### Si subdomain api.cpl-labs.com:
- API Base: `https://api.cpl-labs.com`
- Documentation: `https://api.cpl-labs.com/docs`
- Employés: `https://api.cpl-labs.com/api/company-mongo/employees`

## 🚨 Problèmes courants

### CORS Error
```javascript
// Ajouter à server.js
app.use(cors({
  origin: ['https://cpl-labs.com', 'https://www.cpl-labs.com']
}));
```

### Port déjà utilisé
```bash
# Trouver et tuer le processus
lsof -i :3001
kill -9 [PID]
```

### MongoDB connection timeout
- Vérifier IP whitelist MongoDB Atlas
- Ajouter IP du serveur cpl-labs.com

## 💡 Alternative: Services cloud gratuits

### Vercel (Recommandé)
1. `npm i -g vercel`
2. `vercel login`
3. `vercel --prod`
4. URL automatique: `https://fixer-api-xxx.vercel.app`

### Railway
1. Connecter GitHub repo
2. Deploy automatique
3. Variables d'env via dashboard

### Heroku (Plan gratuit limité)
1. `heroku create fixer-api`
2. `git push heroku main`
3. `heroku config:set MONGODB_URI=...`
