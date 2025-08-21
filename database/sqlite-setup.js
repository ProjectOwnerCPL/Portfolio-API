// EXEMPLE : Configuration SQLite avec Sequelize
// Alternative plus simple à MongoDB pour tester une vraie base de données

const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Configuration SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'techcorp.sqlite'),
  logging: console.log, // Mettre à false en production
});

// Modèle Employee
const Employee = sequelize.define('Employee', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: DataTypes.STRING,
  hireDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  salary: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

// Modèle Project
const Project = sequelize.define('Project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('En planification', 'En cours', 'Terminé', 'Annulé'),
    defaultValue: 'En planification',
  },
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
  budget: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  clientName: DataTypes.STRING,
  technologies: {
    type: DataTypes.JSON,
    defaultValue: [],
  }
});

// Modèle Department
const Department = sequelize.define('Department', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  budget: DataTypes.INTEGER,
  description: DataTypes.TEXT,
});

// Modèle Company
const Company = sequelize.define('Company', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  founded: DataTypes.STRING,
  industry: DataTypes.STRING,
  location: DataTypes.STRING,
  website: DataTypes.STRING,
  description: DataTypes.TEXT,
  mission: DataTypes.TEXT,
  values: {
    type: DataTypes.JSON,
    defaultValue: [],
  }
});

// Table de liaison pour les équipes de projet
const ProjectTeam = sequelize.define('ProjectTeam', {});

// Relations
Employee.belongsTo(Department, { foreignKey: 'departmentId' });
Department.hasMany(Employee, { foreignKey: 'departmentId' });

Employee.belongsToMany(Project, { through: ProjectTeam });
Project.belongsToMany(Employee, { through: ProjectTeam });

// Fonction d'initialisation
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion SQLite établie');
    
    // Synchroniser les modèles avec la base
    await sequelize.sync({ force: false }); // force: true réinitialise la DB
    console.log('✅ Base de données synchronisée');
    
  } catch (error) {
    console.error('❌ Erreur de connexion SQLite:', error);
  }
};

// Fonction pour remplir la base avec des données de test
const seedSQLiteDatabase = async () => {
  try {
    // Vérifier si des données existent
    const employeeCount = await Employee.count();
    if (employeeCount > 0) {
      console.log('📊 Base SQLite déjà remplie');
      return;
    }

    // Créer la compagnie
    const company = await Company.create({
      name: "TechCorp Solutions",
      founded: "2018",
      industry: "Technologie",
      location: "Montreal, Quebec",
      website: "www.techcorp-solutions.com",
      description: "Entreprise spécialisée dans le développement de solutions logicielles innovantes",
      mission: "Transformer les idées en solutions numériques performantes",
      values: ["Innovation", "Qualité", "Collaboration", "Excellence"]
    });

    // Créer les départements
    const itDept = await Department.create({
      name: "IT",
      budget: 500000,
      description: "Gestion de l'infrastructure et architecture technique"
    });

    const devDept = await Department.create({
      name: "Développement",
      budget: 800000,
      description: "Développement des solutions logicielles"
    });

    const designDept = await Department.create({
      name: "Design",
      budget: 300000,
      description: "Design d'interface et expérience utilisateur"
    });

    // Créer les employés
    const marie = await Employee.create({
      firstName: "Marie",
      lastName: "Dubois",
      position: "Directrice Technique",
      department: "IT",
      departmentId: itDept.id,
      email: "marie.dubois@techcorp.com",
      phone: "+1 (514) 123-4567",
      hireDate: new Date("2019-03-15"),
      salary: 95000,
      skills: ["JavaScript", "Python", "Architecture", "Leadership"]
    });

    const jean = await Employee.create({
      firstName: "Jean",
      lastName: "Martin",
      position: "Développeur Senior",
      department: "Développement",
      departmentId: devDept.id,
      email: "jean.martin@techcorp.com",
      phone: "+1 (514) 234-5678",
      hireDate: new Date("2020-01-10"),
      salary: 75000,
      skills: ["React", "Node.js", "MongoDB", "TypeScript"]
    });

    const sophie = await Employee.create({
      firstName: "Sophie",
      lastName: "Tremblay",
      position: "Designer UX/UI",
      department: "Design",
      departmentId: designDept.id,
      email: "sophie.tremblay@techcorp.com",
      phone: "+1 (514) 345-6789",
      hireDate: new Date("2020-06-20"),
      salary: 65000,
      skills: ["Figma", "Adobe Creative", "Prototyping", "User Research"]
    });

    // Créer les projets
    const project1 = await Project.create({
      name: "Plateforme E-commerce",
      description: "Développement d'une plateforme e-commerce complète avec paiement intégré",
      status: "Terminé",
      startDate: new Date("2023-01-15"),
      endDate: new Date("2023-06-30"),
      budget: 250000,
      clientName: "Retail Plus Inc.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe API"]
    });

    const project2 = await Project.create({
      name: "Application Mobile Banking",
      description: "Application mobile sécurisée pour services bancaires",
      status: "En cours",
      startDate: new Date("2023-07-01"),
      endDate: new Date("2024-02-28"),
      budget: 400000,
      clientName: "Banque Nationale",
      technologies: ["React Native", "Express.js", "MongoDB", "JWT"]
    });

    // Associer les employés aux projets
    await project1.addEmployees([marie, jean, sophie]);
    await project2.addEmployees([marie, jean]);

    console.log('🎉 Base SQLite initialisée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du seeding SQLite:', error);
  }
};

// Contrôleurs SQLite
const getEmployeesFromSQLite = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { isActive: true },
      include: [{ model: Department, attributes: ['name', 'description'] }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: employees,
      total: employees.length,
      message: "Employés récupérés depuis SQLite"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des employés",
      error: error.message
    });
  }
};

const getProjectsFromSQLite = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{
        model: Employee,
        attributes: ['id', 'firstName', 'lastName', 'position'],
        through: { attributes: [] }
      }]
    });
    
    res.json({
      success: true,
      data: projects,
      total: projects.length,
      message: "Projets récupérés depuis SQLite avec équipes"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des projets",
      error: error.message
    });
  }
};

const searchInSQLite = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Paramètre 'query' requis"
      });
    }

    const searchTerm = `%${query.toLowerCase()}%`;

    // Recherche dans les employés
    const employees = await Employee.findAll({
      where: {
        [Sequelize.Op.or]: [
          { firstName: { [Sequelize.Op.like]: searchTerm } },
          { lastName: { [Sequelize.Op.like]: searchTerm } },
          { position: { [Sequelize.Op.like]: searchTerm } },
          { department: { [Sequelize.Op.like]: searchTerm } }
        ]
      }
    });

    // Recherche dans les projets
    const projects = await Project.findAll({
      where: {
        [Sequelize.Op.or]: [
          { name: { [Sequelize.Op.like]: searchTerm } },
          { description: { [Sequelize.Op.like]: searchTerm } },
          { clientName: { [Sequelize.Op.like]: searchTerm } }
        ]
      }
    });

    res.json({
      success: true,
      data: {
        employees,
        projects,
        totalResults: employees.length + projects.length
      },
      searchTerm: query,
      message: `Recherche SQLite pour "${query}"`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche SQLite",
      error: error.message
    });
  }
};

// Instructions d'installation SQLite
const sqliteInstructions = `
🗄️  INSTRUCTIONS SQLITE :

1. Installer Sequelize et SQLite :
   npm install sequelize sqlite3

2. Dans server.js, ajouter :
   const { initDatabase, seedSQLiteDatabase } = require('./database/sqlite-setup');
   
   // Après les imports
   initDatabase().then(() => {
     seedSQLiteDatabase();
   });

3. Remplacer les contrôleurs :
   - getEmployeesFromSQLite au lieu de getAllEmployees
   - getProjectsFromSQLite au lieu de getAllProjects
   - searchInSQLite pour les recherches

4. Avantages SQLite :
   ✅ Pas de serveur requis
   ✅ Fichier de base de données local
   ✅ Relations entre tables
   ✅ Requêtes SQL complètes
   ✅ Parfait pour le développement

5. Le fichier techcorp.sqlite sera créé automatiquement
`;

module.exports = {
  sequelize,
  initDatabase,
  seedSQLiteDatabase,
  Employee,
  Project,
  Department,
  Company,
  getEmployeesFromSQLite,
  getProjectsFromSQLite,
  searchInSQLite,
  sqliteInstructions
};
