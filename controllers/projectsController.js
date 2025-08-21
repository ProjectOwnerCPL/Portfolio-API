/**
 * Contrôleur pour la gestion des projets
 */

// Données simulées pour les projets
let projects = [
    {
        id: 1,
        title: "Site E-commerce",
        description: "Développement d'une plateforme e-commerce moderne avec React et Node.js",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        category: "Web Development",
        status: "Terminé",
        startDate: "2023-01-15",
        endDate: "2023-06-30",
        githubUrl: "https://github.com/username/ecommerce-project",
        liveUrl: "https://ecommerce-demo.com",
        images: [
            "https://via.placeholder.com/800x400",
            "https://via.placeholder.com/800x400"
        ],
        featured: true
    },
    {
        id: 2,
        title: "Application Mobile ToDo",
        description: "Application mobile de gestion des tâches avec synchronisation cloud",
        technologies: ["React Native", "Firebase", "Redux"],
        category: "Mobile Development",
        status: "En cours",
        startDate: "2023-07-01",
        endDate: null,
        githubUrl: "https://github.com/username/todo-mobile",
        liveUrl: null,
        images: [
            "https://via.placeholder.com/400x800"
        ],
        featured: false
    },
    {
        id: 3,
        title: "Dashboard Analytics",
        description: "Tableau de bord pour l'analyse de données avec visualisations interactives",
        technologies: ["Vue.js", "Chart.js", "Express", "PostgreSQL"],
        category: "Data Visualization",
        status: "Terminé",
        startDate: "2022-09-01",
        endDate: "2022-12-15",
        githubUrl: "https://github.com/username/analytics-dashboard",
        liveUrl: "https://analytics-demo.com",
        images: [
            "https://via.placeholder.com/800x400"
        ],
        featured: true
    }
];

/**
 * Récupérer tous les projets
 */
const getAllProjects = (req, res) => {
    try {
        const { category, status, featured } = req.query;
        let filteredProjects = [...projects];

        // Filtrage par catégorie
        if (category) {
            filteredProjects = filteredProjects.filter(
                project => project.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Filtrage par statut
        if (status) {
            filteredProjects = filteredProjects.filter(
                project => project.status.toLowerCase() === status.toLowerCase()
            );
        }

        // Filtrage par projets mis en avant
        if (featured === 'true') {
            filteredProjects = filteredProjects.filter(project => project.featured);
        }

        res.json({
            success: true,
            count: filteredProjects.length,
            data: filteredProjects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des projets",
            error: error.message
        });
    }
};

/**
 * Récupérer un projet par ID
 */
const getProjectById = (req, res) => {
    try {
        const { id } = req.params;
        const project = projects.find(p => p.id === parseInt(id));

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Projet non trouvé"
            });
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du projet",
            error: error.message
        });
    }
};

/**
 * Créer un nouveau projet
 */
const createProject = (req, res) => {
    try {
        const {
            title,
            description,
            technologies,
            category,
            status,
            startDate,
            endDate,
            githubUrl,
            liveUrl,
            images,
            featured
        } = req.body;

        // Validation des champs requis
        if (!title || !description || !technologies || !category) {
            return res.status(400).json({
                success: false,
                message: "Les champs title, description, technologies et category sont requis"
            });
        }

        // Création du nouveau projet
        const newProject = {
            id: Math.max(...projects.map(p => p.id)) + 1,
            title,
            description,
            technologies: Array.isArray(technologies) ? technologies : [technologies],
            category,
            status: status || "En cours",
            startDate: startDate || new Date().toISOString().split('T')[0],
            endDate: endDate || null,
            githubUrl: githubUrl || null,
            liveUrl: liveUrl || null,
            images: images || [],
            featured: featured || false
        };

        projects.push(newProject);

        res.status(201).json({
            success: true,
            message: "Projet créé avec succès",
            data: newProject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création du projet",
            error: error.message
        });
    }
};

/**
 * Mettre à jour un projet
 */
const updateProject = (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const projectIndex = projects.findIndex(p => p.id === parseInt(id));

        if (projectIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Projet non trouvé"
            });
        }

        // Mise à jour du projet
        projects[projectIndex] = { ...projects[projectIndex], ...updates };

        res.json({
            success: true,
            message: "Projet mis à jour avec succès",
            data: projects[projectIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du projet",
            error: error.message
        });
    }
};

/**
 * Supprimer un projet
 */
const deleteProject = (req, res) => {
    try {
        const { id } = req.params;
        const projectIndex = projects.findIndex(p => p.id === parseInt(id));

        if (projectIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Projet non trouvé"
            });
        }

        // Suppression du projet
        const deletedProject = projects.splice(projectIndex, 1)[0];

        res.json({
            success: true,
            message: "Projet supprimé avec succès",
            data: deletedProject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression du projet",
            error: error.message
        });
    }
};

/**
 * Récupérer les catégories de projets
 */
const getCategories = (req, res) => {
    try {
        const categories = [...new Set(projects.map(project => project.category))];
        
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des catégories",
            error: error.message
        });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getCategories
};
