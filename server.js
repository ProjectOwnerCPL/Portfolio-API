const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import conditionnel de MongoDB
let connectDB, seedDatabase, companyMongoRoutes;
try {
  const mongoConfig = require('./config/mongodb');
  connectDB = mongoConfig.connectDB;
  seedDatabase = mongoConfig.seedDatabase;
  companyMongoRoutes = require('./routes/companyMongo');
  console.log('✅ MongoDB détecté - Fonctionnalités MongoDB disponibles');
} catch (error) {
  console.log('⚠️  MongoDB non disponible - Utilisation des données en mémoire uniquement');
  console.log('💡 Pour activer MongoDB: npm install mongoose');
}

// Import des routes
const portfolioRoutes = require('./routes/portfolio');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');
const companyRoutes = require('./routes/company'); // Données en mémoire

// Import des middlewares
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4200', process.env.FRONTEND_URL || '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limitation du taux de requêtes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite de 100 requêtes par IP par fenêtre
    message: 'Trop de requêtes depuis cette IP, réessayez plus tard.'
});
app.use(limiter);

// Middleware de logging
app.use(morgan('combined'));

// Middleware pour parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route API info (déplacée après les fichiers statiques)
app.get('/api/info', (req, res) => {
    const hasMongoDb = !!companyMongoRoutes;
    res.json({
        message: 'Bienvenue sur l\'API Portfolio Fixer Solutions',
        version: '1.0.0',
        database: hasMongoDb ? 'MongoDB + Mémoire' : 'Mémoire uniquement',
        documentation: '/docs',
        endpoints: {
            portfolio: '/api/portfolio',
            projects: '/api/projects',
            contact: '/api/contact',
            company_memory: '/api/company',
            ...(hasMongoDb && { company_mongodb: '/api/company-mongo' })
        },
        guides: {
            memory: 'README-COMPANY.md',
            ...(hasMongoDb && { mongodb: 'MONGODB-SETUP.md' })
        },
        status: hasMongoDb ? 'MongoDB Ready' : 'Memory Only'
    });
});

// Route de santé pour diagnostiquer
app.get('/health', (req, res) => {
    const fs = require('fs');
    const staticPath = path.join(__dirname, 'dist/browser');
    const indexExists = fs.existsSync(path.join(__dirname, 'dist/browser/index.html'));
    
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        port: PORT,
        staticPath: staticPath,
        indexHtmlExists: indexExists,
        workingDirectory: __dirname,
        mongoConnected: !!companyMongoRoutes
    });
});

// Routes API (AVANT les fichiers statiques)
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/company', companyRoutes); // Données en mémoire

// Route MongoDB conditionnelle
if (companyMongoRoutes) {
  app.use('/api/company-mongo', companyMongoRoutes); // MongoDB
}

// Servir les fichiers statiques Angular (APRÈS les routes API)
const staticPath = path.join(__dirname, 'dist/browser');
console.log('📁 Tentative de servir les fichiers statiques depuis:', staticPath);
app.use(express.static(staticPath));

// Route de démonstration API (changée vers /demo)
app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'api-demo.html'));
});

// Route principale - Application Angular directement
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'dist/browser/index.html');
    console.log('📄 Tentative de servir index.html depuis:', indexPath);
    res.sendFile(indexPath);
});

// Route catch-all pour Angular (pour le routage SPA)
app.get('*', (req, res) => {
    // Vérifier que ce n'est pas une route API
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'dist/browser/index.html'));
});

// Middleware de gestion d'erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
const startServer = async () => {
    try {
        // Connexion à MongoDB si disponible
        if (connectDB && seedDatabase) {
            console.log('🍃 Tentative de connexion MongoDB...');
            await connectDB();
            await seedDatabase();
            console.log('✅ MongoDB initialisé avec succès');
        } else {
            console.log('💾 Mode données en mémoire uniquement');
        }
        
        // Démarrage du serveur Express
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Serveur démarré sur le port ${PORT}`);
            console.log(`📍 Environnement: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 API disponible sur: http://0.0.0.0:${PORT}`);
            
            if (connectDB) {
                console.log(`🗄️  Base de données: MongoDB + Données en mémoire`);
                console.log(`📊 Endpoints MongoDB: /api/company-mongo/*`);
            } else {
                console.log(`�️  Base de données: Mémoire uniquement`);
                console.log(`💡 Pour MongoDB: npm install mongoose`);
            }
            console.log(`�💾 Endpoints mémoire: /api/company/*`);
        });
    } catch (error) {
        console.error('❌ Erreur MongoDB, basculement en mode mémoire:', error.message);
        
        // Démarrage en mode mémoire seulement
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Serveur démarré sur le port ${PORT} (mode mémoire)`);
            console.log(`🌐 API disponible sur: http://0.0.0.0:${PORT}`);
            console.log(`💾 Endpoints disponibles: /api/company/*`);
        });
    }
};

startServer();

module.exports = app;
