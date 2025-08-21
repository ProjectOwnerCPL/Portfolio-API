const express = require('express');
const router = express.Router();

// Import du contrôleur MongoDB
const {
  getCompanyInfo,
  getAllEmployees,
  getEmployeeById,
  getEmployeesByDepartment,
  getAllProjects,
  getProjectById,
  getProjectsByStatus,
  getAllDepartments,
  getFinancialData,
  getCompanyStats,
  searchCompanyData,
  createEmployee,
  createProject,
  createDepartment,
  createMessage,
  getAllMessages
} = require('../controllers/companyMongoController');

// ================================
// ROUTES PRINCIPALES
// ================================

// Route racine - Informations de la compagnie
router.get('/', getCompanyInfo);

// Statistiques complètes
router.get('/stats', getCompanyStats);

// Données financières
router.get('/financial', getFinancialData);

// ================================
// ROUTES EMPLOYÉS
// ================================

// Tous les employés (avec pagination)
// ?page=1&limit=10&department=IT&status=active
router.get('/employees', getAllEmployees);

// Employé par ID
router.get('/employees/:id', getEmployeeById);

// Employés par département
router.get('/employees/department/:department', getEmployeesByDepartment);

// ================================
// ROUTES PROJETS
// ================================

// Tous les projets (avec pagination)
// ?page=1&limit=10&status=En cours
router.get('/projects', getAllProjects);

// Projet par ID (avec détails équipe)
router.get('/projects/:id', getProjectById);

// Projets par statut
router.get('/projects/status/:status', getProjectsByStatus);

// ================================
// ROUTES DÉPARTEMENTS
// ================================

// Tous les départements (avec managers et compteurs)
router.get('/departments', getAllDepartments);

// ================================
// ROUTES RECHERCHE
// ================================

// Recherche globale ou par type
// ?query=javascript&type=employees
// ?query=e-commerce
router.get('/search', searchCompanyData);

// ================================
// ROUTES D'ADMINISTRATION (bonus)
// ================================

// Route pour vérifier l'état de MongoDB
router.get('/health', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const isConnected = mongoose.connection.readyState === 1;
    
    res.json({
      success: true,
      mongodb: {
        connected: isConnected,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      message: isConnected ? "MongoDB connecté" : "MongoDB déconnecté"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification MongoDB",
      error: error.message
    });
  }
});

// Route pour obtenir les informations de la base
router.get('/db-info', async (req, res) => {
  try {
    const { Employee, Project, Department, Company, Financial } = require('../config/mongodb');
    
    const collections = await Promise.all([
      Company.countDocuments(),
      Employee.countDocuments(),
      Project.countDocuments(),
      Department.countDocuments(),
      Financial.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        collections: {
          companies: collections[0],
          employees: collections[1],
          projects: collections[2],
          departments: collections[3],
          financials: collections[4]
        },
        total: collections.reduce((sum, count) => sum + count, 0)
      },
      message: "Informations de la base MongoDB"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des infos DB",
      error: error.message
    });
  }
});

// ================================
// ROUTES POST (CRÉATION)
// ================================

// Créer un nouvel employé
router.post('/employees', createEmployee);

// Créer un nouveau projet
router.post('/projects', createProject);

// Créer un nouveau département
router.post('/departments', createDepartment);

// Récupérer tous les messages
router.get('/messages', getAllMessages);

// Créer un nouveau message
router.post('/messages', createMessage);

module.exports = router;
