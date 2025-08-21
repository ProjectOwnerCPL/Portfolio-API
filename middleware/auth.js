/**
 * Middleware d'authentification simple (pour la démo)
 * En production, utiliser JWT ou OAuth
 */

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Token d\'authentification requis'
        });
    }
    
    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    // Pour la démo, on accepte un token simple
    // En production, vérifier un vrai JWT
    if (token !== process.env.ADMIN_TOKEN && token !== 'demo-admin-token') {
        return res.status(401).json({
            success: false,
            message: 'Token invalide'
        });
    }
    
    // Ajouter les informations de l'utilisateur à la requête
    req.user = {
        id: 'admin',
        role: 'admin'
    };
    
    next();
};

/**
 * Middleware pour vérifier les permissions admin
 */
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Accès refusé: permissions administrateur requises'
        });
    }
    
    next();
};

module.exports = {
    authenticate,
    requireAdmin
};
