const express = require('express');
const router = express.Router();

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
  searchCompanyData
} = require('../controllers/companyController');

// Routes pour les informations de la compagnie
router.get('/', getCompanyInfo);
router.get('/stats', getCompanyStats);
router.get('/financial', getFinancialData);

// Routes pour les employés
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);
router.get('/employees/department/:department', getEmployeesByDepartment);

// Routes pour les projets
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProjectById);
router.get('/projects/status/:status', getProjectsByStatus);

// Routes pour les départements
router.get('/departments', getAllDepartments);

// Route de recherche
router.get('/search', searchCompanyData);

module.exports = router;
