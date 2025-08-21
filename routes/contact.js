const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getAllMessages,
    getMessageById,
    markAsRead,
    deleteMessage,
    getContactStats
} = require('../controllers/contactController');

// Middleware de validation pour les messages
const validateMessage = (req, res, next) => {
    const { name, email, message } = req.body;
    
    // Validation du nom
    if (!name || name.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: "Le nom doit contenir au moins 2 caractères"
        });
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Adresse email invalide"
        });
    }
    
    // Validation du message
    if (!message || message.trim().length < 10) {
        return res.status(400).json({
            success: false,
            message: "Le message doit contenir au moins 10 caractères"
        });
    }
    
    // Protection contre les messages trop longs
    if (message.length > 5000) {
        return res.status(400).json({
            success: false,
            message: "Le message ne peut pas dépasser 5000 caractères"
        });
    }
    
    next();
};

// Middleware de validation des paramètres d'ID
const validateId = (req, res, next) => {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            success: false,
            message: "ID de message invalide"
        });
    }
    
    next();
};

// Middleware de limitation de taux pour l'envoi de messages
const contactRateLimit = (req, res, next) => {
    // En production, implémenter une vraie limitation basée sur IP/session
    // Pour la démo, on accepte tous les messages
    next();
};

/**
 * @route POST /api/contact
 * @desc Envoyer un nouveau message de contact
 * @access Public
 */
router.post('/', contactRateLimit, validateMessage, sendMessage);

/**
 * @route GET /api/contact/stats
 * @desc Récupérer les statistiques des messages
 * @access Private (nécessiterait une authentification en production)
 */
router.get('/stats', getContactStats);

/**
 * @route GET /api/contact
 * @desc Récupérer tous les messages de contact
 * @access Private (nécessiterait une authentification en production)
 * @query status - Filtrer par statut (nouveau, lu)
 * @query limit - Limiter le nombre de résultats
 */
router.get('/', getAllMessages);

/**
 * @route GET /api/contact/:id
 * @desc Récupérer un message spécifique par ID
 * @access Private (nécessiterait une authentification en production)
 */
router.get('/:id', validateId, getMessageById);

/**
 * @route PATCH /api/contact/:id/read
 * @desc Marquer un message comme lu
 * @access Private (nécessiterait une authentification en production)
 */
router.patch('/:id/read', validateId, markAsRead);

/**
 * @route DELETE /api/contact/:id
 * @desc Supprimer un message
 * @access Private (nécessiterait une authentification en production)
 */
router.delete('/:id', validateId, deleteMessage);

module.exports = router;
