const { 
  companyInfo, 
  employees, 
  projects, 
  departments, 
  financialData 
} = require('../data/company-data');

// Obtenir toutes les informations de la compagnie
const getCompanyInfo = (req, res) => {
  try {
    res.json({
      success: true,
      data: companyInfo,
      message: "Informations de la compagnie récupérées avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des informations",
      error: error.message
    });
  }
};

// Obtenir tous les employés
const getAllEmployees = (req, res) => {
  try {
    res.json({
      success: true,
      data: employees,
      total: employees.length,
      message: "Liste des employés récupérée avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des employés",
      error: error.message
    });
  }
};

// Obtenir un employé par ID
const getEmployeeById = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const employee = employees.find(emp => emp.id === id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employé non trouvé"
      });
    }
    
    res.json({
      success: true,
      data: employee,
      message: "Employé trouvé avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'employé",
      error: error.message
    });
  }
};

// Obtenir employés par département
const getEmployeesByDepartment = (req, res) => {
  try {
    const department = req.params.department;
    const departmentEmployees = employees.filter(emp => 
      emp.department.toLowerCase() === department.toLowerCase()
    );
    
    res.json({
      success: true,
      data: departmentEmployees,
      total: departmentEmployees.length,
      department: department,
      message: `Employés du département ${department} récupérés avec succès`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des employés par département",
      error: error.message
    });
  }
};

// Obtenir tous les projets
const getAllProjects = (req, res) => {
  try {
    res.json({
      success: true,
      data: projects,
      total: projects.length,
      message: "Liste des projets récupérée avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des projets",
      error: error.message
    });
  }
};

// Obtenir un projet par ID
const getProjectById = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const project = projects.find(proj => proj.id === id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé"
      });
    }
    
    // Ajouter les détails des membres de l'équipe
    const projectWithTeamDetails = {
      ...project,
      teamDetails: project.teamMembers.map(memberId => {
        const member = employees.find(emp => emp.id === memberId);
        return {
          id: member.id,
          name: `${member.firstName} ${member.lastName}`,
          position: member.position
        };
      })
    };
    
    res.json({
      success: true,
      data: projectWithTeamDetails,
      message: "Projet trouvé avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du projet",
      error: error.message
    });
  }
};

// Obtenir projets par status
const getProjectsByStatus = (req, res) => {
  try {
    const status = req.params.status;
    const filteredProjects = projects.filter(proj => 
      proj.status.toLowerCase() === status.toLowerCase()
    );
    
    res.json({
      success: true,
      data: filteredProjects,
      total: filteredProjects.length,
      status: status,
      message: `Projets avec le statut ${status} récupérés avec succès`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des projets par statut",
      error: error.message
    });
  }
};

// Obtenir tous les départements
const getAllDepartments = (req, res) => {
  try {
    res.json({
      success: true,
      data: departments,
      total: departments.length,
      message: "Liste des départements récupérée avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des départements",
      error: error.message
    });
  }
};

// Obtenir les données financières
const getFinancialData = (req, res) => {
  try {
    res.json({
      success: true,
      data: financialData,
      message: "Données financières récupérées avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des données financières",
      error: error.message
    });
  }
};

// Obtenir statistiques de la compagnie
const getCompanyStats = (req, res) => {
  try {
    const stats = {
      totalEmployees: employees.length,
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === "En cours").length,
      completedProjects: projects.filter(p => p.status === "Terminé").length,
      totalDepartments: departments.length,
      averageSalary: Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length),
      totalBudget: projects.reduce((sum, proj) => sum + proj.budget, 0),
      companyAge: new Date().getFullYear() - parseInt(companyInfo.founded),
      topSkills: getTopSkills()
    };
    
    res.json({
      success: true,
      data: stats,
      message: "Statistiques de la compagnie récupérées avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du calcul des statistiques",
      error: error.message
    });
  }
};

// Fonction helper pour obtenir les compétences les plus populaires
const getTopSkills = () => {
  const skillCount = {};
  employees.forEach(emp => {
    emp.skills.forEach(skill => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });
  
  return Object.entries(skillCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([skill, count]) => ({ skill, count }));
};

// Recherche globale
const searchCompanyData = (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Paramètre de recherche 'query' requis"
      });
    }
    
    const searchTerm = query.toLowerCase();
    
    // Recherche dans les employés
    const matchingEmployees = employees.filter(emp =>
      emp.firstName.toLowerCase().includes(searchTerm) ||
      emp.lastName.toLowerCase().includes(searchTerm) ||
      emp.position.toLowerCase().includes(searchTerm) ||
      emp.department.toLowerCase().includes(searchTerm) ||
      emp.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
    
    // Recherche dans les projets
    const matchingProjects = projects.filter(proj =>
      proj.name.toLowerCase().includes(searchTerm) ||
      proj.description.toLowerCase().includes(searchTerm) ||
      proj.clientName.toLowerCase().includes(searchTerm) ||
      proj.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
    );
    
    // Recherche dans les départements
    const matchingDepartments = departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm) ||
      dept.description.toLowerCase().includes(searchTerm) ||
      dept.manager.toLowerCase().includes(searchTerm)
    );
    
    const results = {
      employees: matchingEmployees,
      projects: matchingProjects,
      departments: matchingDepartments,
      totalResults: matchingEmployees.length + matchingProjects.length + matchingDepartments.length
    };
    
    res.json({
      success: true,
      data: results,
      searchTerm: query,
      message: `Recherche effectuée pour "${query}"`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche",
      error: error.message
    });
  }
};

module.exports = {
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
};
