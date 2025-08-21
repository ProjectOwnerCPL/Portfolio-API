// Contrôleur MongoDB pour l'API TechCorp Solutions

const {
  Company,
  Employee,
  Project,
  Department,
  Financial,
  Message
} = require('../config/mongodb');

// ================================
// INFORMATIONS GÉNÉRALES
// ================================

// Obtenir les informations de la compagnie
const getCompanyInfo = async (req, res) => {
  try {
    let company = await Company.findOne().lean();
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Informations de la compagnie non trouvées"
      });
    }

    // Ajouter le nombre d'employés actuel
    const employeeCount = await Employee.countDocuments({ isActive: true });
    company.employees = employeeCount;

    res.json({
      success: true,
      data: company,
      message: "Informations de la compagnie récupérées depuis MongoDB"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des informations",
      error: error.message
    });
  }
};

// ================================
// EMPLOYÉS
// ================================

// Obtenir tous les employés
const getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, department, status = 'active' } = req.query;

    // Construction du filtre
    let filter = {};
    if (status === 'active') filter.isActive = true;
    if (department) filter.department = department;

    const employees = await Employee.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .select('-__v');

    const total = await Employee.countDocuments(filter);

    res.json({
      success: true,
      data: employees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      message: `${employees.length} employés récupérés depuis MongoDB`
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
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID d'employé invalide"
      });
    }

    const employee = await Employee.findById(id).select('-__v');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employé non trouvé"
      });
    }

    // Ajouter les projets de l'employé
    const projects = await Project.find({ 
      teamMembers: id 
    }).select('name status budget');

    res.json({
      success: true,
      data: {
        ...employee.toObject(),
        projects
      },
      message: "Employé trouvé avec ses projets"
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
const getEmployeesByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const employees = await Employee.find({ 
      department: { $regex: new RegExp(department, 'i') },
      isActive: true
    }).select('-__v');

    res.json({
      success: true,
      data: employees,
      total: employees.length,
      department,
      message: `Employés du département ${department} récupérés depuis MongoDB`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des employés par département",
      error: error.message
    });
  }
};

// ================================
// PROJETS
// ================================

// Obtenir tous les projets
const getAllProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (status) filter.status = { $regex: new RegExp(status, 'i') };

    const projects = await Project.find(filter)
      .populate('teamMembers', 'firstName lastName position email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .select('-__v');

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      message: `${projects.length} projets récupérés depuis MongoDB`
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
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID de projet invalide"
      });
    }

    const project = await Project.findById(id)
      .populate('teamMembers', 'firstName lastName position email department')
      .select('-__v');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet non trouvé"
      });
    }

    res.json({
      success: true,
      data: project,
      message: "Projet trouvé avec détails de l'équipe"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du projet",
      error: error.message
    });
  }
};

// Obtenir projets par statut
const getProjectsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const projects = await Project.find({ 
      status: { $regex: new RegExp(status, 'i') }
    })
    .populate('teamMembers', 'firstName lastName position')
    .select('-__v');

    res.json({
      success: true,
      data: projects,
      total: projects.length,
      status,
      message: `Projets avec le statut "${status}" récupérés depuis MongoDB`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des projets par statut",
      error: error.message
    });
  }
};

// ================================
// DÉPARTEMENTS
// ================================

// Obtenir tous les départements
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('manager', 'firstName lastName position email')
      .select('-__v');

    // Ajouter le nombre d'employés par département
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const employeeCount = await Employee.countDocuments({ 
          department: dept.name, 
          isActive: true 
        });
        return {
          ...dept.toObject(),
          employeeCount
        };
      })
    );

    res.json({
      success: true,
      data: departmentsWithCounts,
      total: departmentsWithCounts.length,
      message: "Départements récupérés depuis MongoDB avec compteurs"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des départements",
      error: error.message
    });
  }
};

// ================================
// DONNÉES FINANCIÈRES
// ================================

// Obtenir les données financières
const getFinancialData = async (req, res) => {
  try {
    const { year } = req.query;
    
    let filter = {};
    if (year) filter.year = parseInt(year);

    const financialData = await Financial.find(filter)
      .sort({ year: -1 })
      .select('-__v');

    if (financialData.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Aucune donnée financière trouvée${year ? ` pour ${year}` : ''}`
      });
    }

    res.json({
      success: true,
      data: year ? financialData[0] : financialData,
      message: "Données financières récupérées depuis MongoDB"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des données financières",
      error: error.message
    });
  }
};

// ================================
// STATISTIQUES
// ================================

// Obtenir statistiques complètes
const getCompanyStats = async (req, res) => {
  try {
    // Statistiques des employés
    const totalEmployees = await Employee.countDocuments({ isActive: true });
    const totalInactiveEmployees = await Employee.countDocuments({ isActive: false });
    
    const salaryStats = await Employee.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          avgSalary: { $avg: '$salary' },
          minSalary: { $min: '$salary' },
          maxSalary: { $max: '$salary' },
          totalSalaries: { $sum: '$salary' }
        }
      }
    ]);

    // Statistiques des projets
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalBudget: { $sum: '$budget' },
          avgProgress: { $avg: '$progress' }
        }
      }
    ]);

    // Statistiques par département
    const departmentStats = await Employee.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgSalary: { $avg: '$salary' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Top compétences
    const topSkills = await Employee.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Données financières récentes
    const latestFinancial = await Financial.findOne().sort({ year: -1 });

    const stats = {
      employees: {
        total: totalEmployees,
        inactive: totalInactiveEmployees,
        salary: salaryStats[0] || {},
        byDepartment: departmentStats
      },
      projects: {
        byStatus: projectStats,
        total: projectStats.reduce((sum, item) => sum + item.count, 0),
        totalBudget: projectStats.reduce((sum, item) => sum + item.totalBudget, 0)
      },
      skills: {
        top: topSkills.map(skill => ({
          skill: skill._id,
          count: skill.count
        }))
      },
      financial: latestFinancial,
      company: {
        age: latestFinancial ? new Date().getFullYear() - parseInt(latestFinancial.year) + 1 : 0,
        departments: await Department.countDocuments()
      }
    };

    res.json({
      success: true,
      data: stats,
      message: "Statistiques complètes calculées depuis MongoDB"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du calcul des statistiques",
      error: error.message
    });
  }
};

// ================================
// RECHERCHE
// ================================

// Recherche globale
const searchCompanyData = async (req, res) => {
  try {
    const { query, type } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Paramètre de recherche 'query' requis"
      });
    }

    const searchRegex = new RegExp(query, 'i');
    let results = {};

    // Recherche dans les employés (si pas de type spécifique ou type=employees)
    if (!type || type === 'employees') {
      results.employees = await Employee.find({
        $and: [
          { isActive: true },
          {
            $or: [
              { firstName: searchRegex },
              { lastName: searchRegex },
              { position: searchRegex },
              { department: searchRegex },
              { email: searchRegex },
              { skills: { $in: [searchRegex] } }
            ]
          }
        ]
      }).select('-__v').limit(20);
    }

    // Recherche dans les projets
    if (!type || type === 'projects') {
      results.projects = await Project.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { clientName: searchRegex },
          { technologies: { $in: [searchRegex] } }
        ]
      })
      .populate('teamMembers', 'firstName lastName')
      .select('-__v')
      .limit(20);
    }

    // Recherche dans les départements
    if (!type || type === 'departments') {
      results.departments = await Department.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { location: searchRegex }
        ]
      })
      .populate('manager', 'firstName lastName')
      .select('-__v');
    }

    const totalResults = Object.values(results).reduce(
      (sum, arr) => sum + arr.length, 0
    );

    res.json({
      success: true,
      data: {
        ...results,
        totalResults
      },
      searchTerm: query,
      searchType: type || 'all',
      message: `Recherche MongoDB effectuée pour "${query}"`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche MongoDB",
      error: error.message
    });
  }
};

// ================================
// MÉTHODES POST (CRÉATION)
// ================================

// Créer un nouvel employé
const createEmployee = async (req, res) => {
  try {
    console.log('📝 Données POST employé reçues:', req.body);
    
    // Générer un email unique qui respecte la regex
    const uniqueEmail = req.body.email ? 
      req.body.email.replace('@', `${Date.now()}@`) : 
      `employee${Date.now()}@fixersolutions.com`;
    
    const employeeData = {
      ...req.body,
      email: uniqueEmail
    };
    
    const employee = new Employee(employeeData);
    const savedEmployee = await employee.save();
    
    console.log('✅ Employé créé:', savedEmployee.firstName, savedEmployee.lastName);
    
    res.status(201).json({
      success: true,
      data: savedEmployee,
      message: "Employé créé avec succès"
    });
  } catch (error) {
    console.error('❌ Erreur POST employé:', error.message);
    res.status(400).json({
      success: false,
      message: "Erreur lors de la création de l'employé",
      error: error.message
    });
  }
};

// Créer un nouveau projet
const createProject = async (req, res) => {
  try {
    console.log('📝 Données POST projet reçues:', req.body);
    
    // Ajouter un nom unique pour éviter les conflits
    const uniqueName = req.body.name ? 
      `${req.body.name} - ${new Date().toLocaleDateString()}` : 
      `Nouveau Projet - ${new Date().toLocaleDateString()}`;
    
    const projectData = {
      ...req.body,
      name: uniqueName
    };
    
    const project = new Project(projectData);
    const savedProject = await project.save();
    
    console.log('✅ Projet créé:', savedProject.name);
    
    res.status(201).json({
      success: true,
      data: savedProject,
      message: "Projet créé avec succès"
    });
  } catch (error) {
    console.error('❌ Erreur POST projet:', error.message);
    res.status(400).json({
      success: false,
      message: "Erreur lors de la création du projet",
      error: error.message
    });
  }
};

// Créer un nouveau département
const createDepartment = async (req, res) => {
  try {
    console.log('📝 Données POST département reçues:', req.body);
    
    // Ajouter un nom unique pour éviter les conflits
    const uniqueName = req.body.name ? 
      `${req.body.name} - ${Date.now()}` : 
      `Nouveau Département - ${Date.now()}`;
    
    const departmentData = {
      ...req.body,
      name: uniqueName
    };
    
    const department = new Department(departmentData);
    const savedDepartment = await department.save();
    
    console.log('✅ Département créé:', savedDepartment.name);
    
    res.status(201).json({
      success: true,
      data: savedDepartment,
      message: "Département créé avec succès"
    });
  } catch (error) {
    console.error('❌ Erreur POST département:', error.message);
    res.status(400).json({
      success: false,
      message: "Erreur lors de la création du département",
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
  searchCompanyData,
  createEmployee,
  createProject,
  createDepartment
};

// ================================
// GESTION DES MESSAGES
// ================================

// Créer un nouveau message de contact
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation des champs requis
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Les champs nom, email et message sont requis"
      });
    }

    // Créer le nouveau message
    const newMessage = new Message({
      name,
      email,
      subject: subject || 'Nouveau message',
      message,
      ip: req.ip || req.connection.remoteAddress
    });

    const savedMessage = await newMessage.save();

    // Log pour notification
    console.log(`📧 Nouveau message MongoDB sauvegardé de ${savedMessage.name} (${savedMessage.email})`);
    console.log(`Sujet: ${savedMessage.subject}`);
    console.log(`Message: ${savedMessage.message}`);

    res.status(201).json({
      success: true,
      data: {
        _id: savedMessage._id,
        name: savedMessage.name,
        email: savedMessage.email,
        subject: savedMessage.subject,
        message: savedMessage.message,
        status: savedMessage.status,
        timeAgo: savedMessage.timeAgo,
        createdAt: savedMessage.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Erreur création message:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la création du message"
    });
  }
};

// Récupérer tous les messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({})
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: messages,
      count: messages.length
    });

  } catch (error) {
    console.error('❌ Erreur récupération messages:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des messages"
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
  searchCompanyData,
  createEmployee,
  createProject,
  createDepartment,
  createMessage,
  getAllMessages
};
