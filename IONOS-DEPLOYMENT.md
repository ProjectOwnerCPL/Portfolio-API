# Guide de Déploiement Ionos - Portfolio API Fixer Solutions

## 📋 Prérequis Ionos

### Option 1: Hébergement Web avec Node.js
- Package Ionos avec support Node.js
- Accès SSH/FTP
- Gestionnaire de processus (PM2 recommandé)

### Option 2: Serveur VPS/Cloud
- Serveur virtuel avec accès root
- Installation Node.js manuelle possible

## 🚀 Étapes de Déploiement

### 1. Préparer les Fichiers
```bash
# Build de production Angular
npm run ng-build

# Créer un package de déploiement
# Inclure: server.js, package.json, tous les dossiers sauf node_modules
```

### 2. Variables d'Environnement
Créer un fichier `.env` sur le serveur :
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://AdminCPL:Admin404@fixer.xmg9ryb.mongodb.net/fixer
FRONTEND_URL=https://tondomaine.ionos.fr
```

### 3. Configuration Express pour Production
```javascript
// Dans server.js - déjà configuré
const PORT = process.env.PORT || 3000;

// CORS configuré pour production
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'https://tondomaine.ionos.fr'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 4. Upload sur Ionos
```bash
# Via FTP/SFTP
- Uploader tous les fichiers sauf node_modules
- Conserver la structure des dossiers

# Via SSH (si disponible)
rsync -av --exclude node_modules ./ user@tonserveur:/path/to/app/
```

### 5. Installation sur le Serveur
```bash
# Se connecter au serveur Ionos (SSH)
cd /path/to/your/app

# Installer les dépendances
npm install --production

# Installer PM2 (gestionnaire de processus)
npm install -g pm2

# Lancer l'application
pm2 start server.js --name "fixer-api"
pm2 save
pm2 startup
```

### 6. Configuration Domaine
- Pointer ton domaine/sous-domaine vers le serveur
- Configurer les DNS chez Ionos
- Exemple: `api.tonsite.com` → serveur Ionos

## 🔧 Configurations Spécifiques Ionos

### Web Hosting Standard (sans Node.js)
Si ton package ne supporte pas Node.js :
- Héberger seulement les **fichiers statiques**
- api-demo.html, Angular build, documentation
- Utiliser une API externe (Heroku, Vercel) pour la logique Node.js

### Web Hosting avec Node.js
```javascript
// server.js - ajustements pour Ionos
const PORT = process.env.PORT || 8080; // Port imposé par Ionos parfois

// Chemin absolu pour les fichiers statiques
app.use(express.static(path.join(__dirname, 'dist/browser')));
```

## 🌐 Structure de Déploiement Recommandée

### Option A: Tout sur Ionos (avec Node.js)
```
https://tonsite.ionos.fr/
├── / → Page de démonstration (api-demo.html)
├── /angular → Interface Angular
├── /docs → Documentation
├── /api/* → Toutes les routes API
└── Serveur Express + MongoDB Atlas
```

### Option B: Hybride (Ionos + API externe)
```
Ionos (fichiers statiques):
├── api-demo.html (modifié pour pointer vers API externe)
├── Angular build
└── Documentation

API externe (Heroku/Railway/Render):
└── Serveur Express + MongoDB Atlas
```

## ✅ Checklist de Déploiement

- [ ] Vérifier support Node.js sur package Ionos
- [ ] Créer fichier .env avec variables de production
- [ ] Build Angular en mode production
- [ ] Tester MongoDB Atlas depuis serveur de production
- [ ] Configurer domaine/sous-domaine
- [ ] Installer PM2 pour gestion processus
- [ ] Configurer HTTPS (SSL) si nécessaire
- [ ] Tester tous les endpoints en production

## 🆘 Solutions de Secours

### Si Node.js non supporté sur Ionos:
1. **Vercel** (gratuit) pour l'API Node.js
2. **Railway** (gratuit avec limite) 
3. **Render** (gratuit avec limite)
4. **Heroku** (payant mais stable)

### Configuration API externe:
```javascript
// Dans api-demo.html, changer:
const API_BASE = 'https://ton-api.vercel.app';
// au lieu de:
const API_BASE = '';
```

---

**Recommandation:** Commence par vérifier si ton package Ionos supporte Node.js. Si oui, tu peux tout héberger sur Ionos. Sinon, utilise Ionos pour les fichiers statiques et une plateforme comme Vercel pour l'API.
