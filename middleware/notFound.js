/**
 * Middleware pour gérer les routes non trouvées (404)
 */

const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route non trouvée: ${req.originalUrl}`,
        availableEndpoints: {
            portfolio: {
                'GET /api/portfolio': 'Récupérer toutes les informations du portfolio',
                'GET /api/portfolio/profile': 'Récupérer le profil personnel',
                'GET /api/portfolio/skills': 'Récupérer les compétences',
                'GET /api/portfolio/experience': 'Récupérer l\'expérience professionnelle',
                'PUT /api/portfolio/profile': 'Mettre à jour le profil personnel'
            },
            projects: {
                'GET /api/projects': 'Récupérer tous les projets',
                'GET /api/projects/categories': 'Récupérer les catégories',
                'GET /api/projects/:id': 'Récupérer un projet par ID',
                'POST /api/projects': 'Créer un nouveau projet',
                'PUT /api/projects/:id': 'Mettre à jour un projet',
                'DELETE /api/projects/:id': 'Supprimer un projet'
            },
            contact: {
                'POST /api/contact': 'Envoyer un message de contact',
                'GET /api/contact': 'Récupérer tous les messages (admin)',
                'GET /api/contact/stats': 'Statistiques des messages (admin)',
                'GET /api/contact/:id': 'Récupérer un message par ID (admin)',
                'PATCH /api/contact/:id/read': 'Marquer comme lu (admin)',
                'DELETE /api/contact/:id': 'Supprimer un message (admin)'
            }
        }
    });
};

module.exports = notFound;
