const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getCategories
} = require('../controllers/projectsController');

// Middleware de validation pour la création de projets
const validateProject = (req, res, next) => {
    const { title, description, technologies, category } = req.body;
    
    if (!title || title.trim().length < 3) {
        return res.status(400).json({
            success: false,
            message: "Le titre doit contenir au moins 3 caractères"
        });
    }
    
    if (!description || description.trim().length < 10) {
        return res.status(400).json({
            success: false,
            message: "La description doit contenir au moins 10 caractères"
        });
    }
    
    if (!technologies || (Array.isArray(technologies) && technologies.length === 0)) {
        return res.status(400).json({
            success: false,
            message: "Au moins une technologie doit être spécifiée"
        });
    }
    
    if (!category || category.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "La catégorie est requise"
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
            message: "ID de projet invalide"
        });
    }
    
    next();
};

/**
 * @route GET /api/projects
 * @desc Récupérer tous les projets avec filtres optionnels
 * @access Public
 * @query category - Filtrer par catégorie
 * @query status - Filtrer par statut (En cours, Terminé)
 * @query featured - Afficher seulement les projets mis en avant (true/false)
 */
router.get('/', getAllProjects);

/**
 * @route GET /api/projects/categories
 * @desc Récupérer toutes les catégories de projets
 * @access Public
 */
router.get('/categories', getCategories);

/**
 * @route GET /api/projects/:id
 * @desc Récupérer un projet spécifique par ID
 * @access Public
 */
router.get('/:id', validateId, getProjectById);

/**
 * @route POST /api/projects
 * @desc Créer un nouveau projet
 * @access Private (nécessiterait une authentification en production)
 */
router.post('/', validateProject, createProject);

/**
 * @route PUT /api/projects/:id
 * @desc Mettre à jour un projet existant
 * @access Private (nécessiterait une authentification en production)
 */
router.put('/:id', validateId, updateProject);

/**
 * @route DELETE /api/projects/:id
 * @desc Supprimer un projet
 * @access Private (nécessiterait une authentification en production)
 */
router.delete('/:id', validateId, deleteProject);

module.exports = router;
