const express = require('express');
const router = express.Router();
const {
    getPortfolio,
    getProfile,
    getSkills,
    getExperience,
    updateProfile
} = require('../controllers/portfolioController');

// Middleware de validation pour les mises à jour
const validateProfileUpdate = (req, res, next) => {
    const allowedFields = ['name', 'title', 'bio', 'email', 'phone', 'location', 'avatar', 'socialLinks'];
    const updates = Object.keys(req.body);
    const invalidFields = updates.filter(field => !allowedFields.includes(field));
    
    if (invalidFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Champs non autorisés: ${invalidFields.join(', ')}`
        });
    }
    
    next();
};

/**
 * @route GET /api/portfolio
 * @desc Récupérer toutes les informations du portfolio
 * @access Public
 */
router.get('/', getPortfolio);

/**
 * @route GET /api/portfolio/profile
 * @desc Récupérer le profil personnel
 * @access Public
 */
router.get('/profile', getProfile);

/**
 * @route GET /api/portfolio/skills
 * @desc Récupérer les compétences
 * @access Public
 */
router.get('/skills', getSkills);

/**
 * @route GET /api/portfolio/experience
 * @desc Récupérer l'expérience professionnelle
 * @access Public
 */
router.get('/experience', getExperience);

/**
 * @route PUT /api/portfolio/profile
 * @desc Mettre à jour le profil personnel
 * @access Private (nécessiterait une authentification en production)
 */
router.put('/profile', validateProfileUpdate, updateProfile);

module.exports = router;
