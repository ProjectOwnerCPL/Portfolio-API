// EXEMPLE : Configuration MongoDB avec Mongoose
// Pour utiliser une vraie base de données au lieu des données en mémoire

const mongoose = require('mongoose');

// Configuration et initialisation de MongoDB pour l'API Portfolio Fixer
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fixer', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

// Schéma Employee
const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: String,
  hireDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    required: true
  },
  skills: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Schéma Project
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['En planification', 'En cours', 'Terminé', 'Annulé'],
    default: 'En planification'
  },
  startDate: Date,
  endDate: Date,
  budget: {
    type: Number,
    required: true
  },
  clientName: String,
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  technologies: [String]
}, {
  timestamps: true
});

// Schéma Department
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  budget: Number,
  description: String
}, {
  timestamps: true
});

// Schéma Company Info
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  founded: String,
  industry: String,
  location: String,
  website: String,
  description: String,
  mission: String,
  values: [String]
}, {
  timestamps: true
});

// Création des modèles
const Employee = mongoose.model('Employee', employeeSchema);
const Project = mongoose.model('Project', projectSchema);
const Department = mongoose.model('Department', departmentSchema);
const Company = mongoose.model('Company', companySchema);

// Fonction pour initialiser la base avec des données de test
const seedDatabase = async () => {
  try {
    // Vérifier si des données existent déjà
    const employeeCount = await Employee.countDocuments();
    if (employeeCount > 0) {
      console.log('Base de données déjà initialisée');
      return;
    }

    // Créer la compagnie
    const company = new Company({
      name: "Fixer Solutions",
      founded: "2018",
      industry: "Technologie",
      location: "Montreal, Quebec",
      website: "www.fixer-solutions.com",
      description: "Entreprise spécialisée dans le développement de solutions logicielles innovantes",
      mission: "Transformer les idées en solutions numériques performantes",
      values: ["Innovation", "Qualité", "Collaboration", "Excellence"]
    });
    await company.save();

    // Créer les employés
    const employees = await Employee.create([
      {
        firstName: "Marie",
        lastName: "Dubois",
        position: "Directrice Technique",
        department: "IT",
        email: "marie.dubois@fixer.com",
        phone: "+1 (514) 123-4567",
        hireDate: new Date("2019-03-15"),
        salary: 95000,
        skills: ["JavaScript", "Python", "Architecture", "Leadership"]
      },
      {
        firstName: "Jean",
        lastName: "Martin",
        position: "Développeur Senior",
        department: "Développement",
        email: "pierre.martin@fixer.com",
        phone: "+1 (514) 234-5678",
        hireDate: new Date("2020-01-10"),
        salary: 75000,
        skills: ["React", "Node.js", "MongoDB", "TypeScript"]
      },
      {
        firstName: "Sophie",
        lastName: "Tremblay",
        position: "Designer UX/UI",
        department: "Design",
        email: "sophie.bernard@fixer.com",
        phone: "+1 (514) 345-6789",
        hireDate: new Date("2020-06-20"),
        salary: 65000,
        skills: ["Figma", "Adobe Creative", "Prototyping", "User Research"]
      }
    ]);

    // Créer les départements
    await Department.create([
      {
        name: "IT",
        manager: employees[0]._id,
        budget: 500000,
        description: "Gestion de l'infrastructure et architecture technique"
      },
      {
        name: "Développement",
        manager: employees[1]._id,
        budget: 800000,
        description: "Développement des solutions logicielles"
      }
    ]);

    // Créer les projets
    await Project.create([
      {
        name: "Plateforme E-commerce",
        description: "Développement d'une plateforme e-commerce complète avec paiement intégré",
        status: "Terminé",
        startDate: new Date("2023-01-15"),
        endDate: new Date("2023-06-30"),
        budget: 250000,
        clientName: "Retail Plus Inc.",
        teamMembers: [employees[0]._id, employees[1]._id, employees[2]._id],
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe API"]
      }
    ]);

        console.log('✅ Base de données Fixer initialisée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  }
};

// Contrôleur MongoDB (exemple)
const getEmployeesFromDB = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      data: employees,
      total: employees.length,
      message: "Employés récupérés depuis MongoDB"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des employés",
      error: error.message
    });
  }
};

const getProjectsFromDB = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('teamMembers', 'firstName lastName position')
      .select('-__v');
    
    res.json({
      success: true,
      data: projects,
      total: projects.length,
      message: "Projets récupérés depuis MongoDB"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des projets",
      error: error.message
    });
  }
};

// Instructions d'installation MongoDB
const mongoInstructions = `
🍃 INSTRUCTIONS MONGODB :

1. Installer MongoDB :
   npm install mongoose

2. Configurer les variables d'environnement (.env) :
   MONGODB_URI=mongodb://localhost:27017/fixer
   
3. Démarrer MongoDB localement :
   - Installer MongoDB Community Server
   - Ou utiliser MongoDB Atlas (cloud)

4. Remplacer les contrôleurs dans companyController.js :
   - Importer ces fonctions
   - Utiliser getEmployeesFromDB au lieu de getAllEmployees
   - Utiliser getProjectsFromDB au lieu de getAllProjects

5. Dans server.js, ajouter :
   const { connectDB, seedDatabase } = require('./database/mongodb-setup');
   
   // Après les imports
   connectDB().then(() => {
     seedDatabase();
   });

6. Avantages MongoDB :
   ✅ Persistance des données
   ✅ Relations entre collections
   ✅ Requêtes complexes
   ✅ Scalabilité
   ✅ Indexation automatique
`;

module.exports = {
  connectDB,
  seedDatabase,
  Employee,
  Project,
  Department,
  Company,
  getEmployeesFromDB,
  getProjectsFromDB,
  mongoInstructions
};
