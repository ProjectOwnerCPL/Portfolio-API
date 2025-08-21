/**
 * Contrôleur pour les informations du portfolio
 */

// Données simulées - en production, cela viendrait d'une base de données
const portfolioData = {
    profile: {
        name: "Votre Nom",
        title: "Développeur Full Stack",
        bio: "Passionné de développement web avec une expertise en technologies modernes.",
        email: "votre.email@example.com",
        phone: "+33 6 12 34 56 78",
        location: "Paris, France",
        avatar: "https://via.placeholder.com/300x300",
        socialLinks: {
            github: "https://github.com/votre-username",
            linkedin: "https://linkedin.com/in/votre-username",
            twitter: "https://twitter.com/votre-username"
        }
    },
    skills: [
        {
            category: "Frontend",
            technologies: ["React", "Vue.js", "HTML5", "CSS3", "JavaScript", "TypeScript"]
        },
        {
            category: "Backend",
            technologies: ["Node.js", "Express", "Python", "PHP", "MongoDB", "MySQL"]
        },
        {
            category: "Outils",
            technologies: ["Git", "Docker", "AWS", "Linux", "VS Code"]
        }
    ],
    experience: [
        {
            id: 1,
            company: "Entreprise A",
            position: "Développeur Senior",
            startDate: "2022-01-01",
            endDate: null,
            description: "Développement d'applications web modernes avec React et Node.js",
            technologies: ["React", "Node.js", "MongoDB"]
        },
        {
            id: 2,
            company: "Entreprise B",
            position: "Développeur Junior",
            startDate: "2020-06-01",
            endDate: "2021-12-31",
            description: "Maintenance et développement de nouvelles fonctionnalités",
            technologies: ["PHP", "MySQL", "jQuery"]
        }
    ]
};

/**
 * Récupérer les informations complètes du portfolio
 */
const getPortfolio = (req, res) => {
    try {
        res.json({
            success: true,
            data: portfolioData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du portfolio",
            error: error.message
        });
    }
};

/**
 * Récupérer uniquement le profil
 */
const getProfile = (req, res) => {
    try {
        res.json({
            success: true,
            data: portfolioData.profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du profil",
            error: error.message
        });
    }
};

/**
 * Récupérer les compétences
 */
const getSkills = (req, res) => {
    try {
        res.json({
            success: true,
            data: portfolioData.skills
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des compétences",
            error: error.message
        });
    }
};

/**
 * Récupérer l'expérience professionnelle
 */
const getExperience = (req, res) => {
    try {
        res.json({
            success: true,
            data: portfolioData.experience
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de l'expérience",
            error: error.message
        });
    }
};

/**
 * Mettre à jour le profil
 */
const updateProfile = (req, res) => {
    try {
        const updates = req.body;
        
        // Validation basique
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Aucune donnée à mettre à jour"
            });
        }

        // Mise à jour des données (en production, cela irait en base de données)
        portfolioData.profile = { ...portfolioData.profile, ...updates };

        res.json({
            success: true,
            message: "Profil mis à jour avec succès",
            data: portfolioData.profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du profil",
            error: error.message
        });
    }
};

module.exports = {
    getPortfolio,
    getProfile,
    getSkills,
    getExperience,
    updateProfile
};
