/**
 * Middleware de gestion d'erreurs globales
 */

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log de l'erreur pour le développement
    console.error('🚨 Erreur:', err);

    // Erreur de validation Mongoose (si vous utilisez MongoDB)
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = {
            message,
            statusCode: 400
        };
    }

    // Erreur de duplication (MongoDB)
    if (err.code === 11000) {
        const message = 'Ressource dupliquée';
        error = {
            message,
            statusCode: 400
        };
    }

    // Erreur de cast (MongoDB ObjectId invalide)
    if (err.name === 'CastError') {
        const message = 'Ressource non trouvée';
        error = {
            message,
            statusCode: 404
        };
    }

    // Erreur de syntaxe JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'JSON invalide dans la requête'
        });
    }

    // Erreur de limite de taille
    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            success: false,
            message: 'Taille de la requête trop importante'
        });
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erreur serveur interne',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
