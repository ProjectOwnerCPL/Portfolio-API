// Configuration MongoDB pour l'API Portfolio Fixer
// Utilise Mongoose pour interagir avec MongoDB

const mongoose = require('mongoose');

// ================================
// CONNEXION MONGODB
// ================================

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`🍃 MongoDB connecté: ${conn.connection.host}`);
    console.log(`📊 Base de données: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

// ================================
// SCHÉMAS MONGOOSE
// ================================

// Schéma Company
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la compagnie est requis'],
    trim: true
  },
  founded: {
    type: String,
    required: [true, 'L\'année de fondation est requise']
  },
  industry: {
    type: String,
    required: [true, 'L\'industrie est requise']
  },
  location: {
    type: String,
    required: [true, 'La localisation est requise']
  },
  employees: {
    type: Number,
    default: 0
  },
  website: String,
  description: String,
  mission: String,
  values: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual pour calculer l'âge de la compagnie
companySchema.virtual('age').get(function() {
  return new Date().getFullYear() - parseInt(this.founded);
});

// Schéma Employee
const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Le poste est requis']
  },
  department: {
    type: String,
    required: [true, 'Le département est requis'],
    enum: ['IT', 'Développement', 'Design', 'Analytics', 'Management', 'Marketing']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  phone: {
    type: String,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Numéro de téléphone invalide']
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    required: [true, 'Le salaire est requis'],
    min: [30000, 'Le salaire minimum est 30,000$'],
    max: [200000, 'Le salaire maximum est 200,000$']
  },
  skills: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual pour le nom complet
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual pour l'ancienneté en années
employeeSchema.virtual('yearsOfService').get(function() {
  return Math.floor((Date.now() - this.hireDate) / (365.25 * 24 * 60 * 60 * 1000));
});

// Index pour optimiser les recherches
employeeSchema.index({ department: 1, isActive: 1 });
employeeSchema.index({ email: 1 });

// Schéma Project
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du projet est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  status: {
    type: String,
    enum: ['En planification', 'En cours', 'Terminé', 'Annulé', 'En pause'],
    default: 'En planification'
  },
  startDate: Date,
  endDate: Date,
  budget: {
    type: Number,
    required: [true, 'Le budget est requis'],
    min: [1000, 'Budget minimum: 1,000$']
  },
  clientName: {
    type: String,
    required: [true, 'Le nom du client est requis']
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  technologies: [String],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual pour la durée du projet
projectSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} jours`;
  }
  return 'Non définie';
});

// Schéma Department
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du département est requis'],
    unique: true,
    trim: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  budget: {
    type: Number,
    required: [true, 'Le budget est requis'],
    min: [50000, 'Budget minimum: 50,000$']
  },
  description: String,
  location: String
}, {
  timestamps: true
});

// Schéma Financial Data
const financialSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  revenue: {
    type: Number,
    required: true,
    min: 0
  },
  expenses: {
    type: Number,
    required: true,
    min: 0
  },
  profit: {
    type: Number,
    required: true
  },
  quarterlyRevenue: {
    Q1: { type: Number, default: 0 },
    Q2: { type: Number, default: 0 },
    Q3: { type: Number, default: 0 },
    Q4: { type: Number, default: 0 }
  },
  monthlyExpenses: {
    salaires: { type: Number, default: 0 },
    infrastructure: { type: Number, default: 0 },
    marketing: { type: Number, default: 0 },
    operations: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// ================================
// MODÈLES MONGOOSE
// ================================

// ================================
// FONCTION D'INITIALISATION
// ================================

const seedDatabase = async () => {
  try {
    console.log('🌱 Initialisation de la base de données...');

    // Vérifier si des données existent déjà
    const companyCount = await Company.countDocuments();
    if (companyCount > 0) {
      console.log('📊 Base de données déjà initialisée');
      return;
    }

    // Créer la compagnie
    const company = await Company.create({
      name: "TechCorp Solutions",
      founded: "2018",
      industry: "Technologie",
      location: "Montreal, Quebec",
      employees: 150,
      website: "www.techcorp-solutions.com",
      description: "Entreprise spécialisée dans le développement de solutions logicielles innovantes",
      mission: "Transformer les idées en solutions numériques performantes",
      values: ["Innovation", "Qualité", "Collaboration", "Excellence"]
    });

    // Créer les employés
    const employees = await Employee.create([
      {
        firstName: "Marie",
        lastName: "Dubois",
        position: "Directrice Technique",
        department: "IT",
        email: "marie.dubois@techcorp.com",
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
        email: "jean.martin@techcorp.com",
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
        email: "sophie.tremblay@techcorp.com",
        phone: "+1 (514) 345-6789",
        hireDate: new Date("2020-06-20"),
        salary: 65000,
        skills: ["Figma", "Adobe Creative", "Prototyping", "User Research"]
      },
      {
        firstName: "Pierre",
        lastName: "Lavoie",
        position: "Analyste de Données",
        department: "Analytics",
        email: "pierre.lavoie@techcorp.com",
        phone: "+1 (514) 456-7890",
        hireDate: new Date("2021-02-01"),
        salary: 70000,
        skills: ["Python", "SQL", "Power BI", "Machine Learning"]
      },
      {
        firstName: "Catherine",
        lastName: "Roy",
        position: "Chef de Projet",
        department: "Management",
        email: "catherine.roy@techcorp.com",
        phone: "+1 (514) 567-8901",
        hireDate: new Date("2019-09-12"),
        salary: 80000,
        skills: ["Agile", "Scrum", "Communication", "Planning"]
      }
    ]);

    // Créer les départements
    const departments = await Department.create([
      {
        name: "IT",
        manager: employees[0]._id,
        budget: 500000,
        description: "Gestion de l'infrastructure et architecture technique",
        location: "Bureau 301"
      },
      {
        name: "Développement",
        manager: employees[1]._id,
        budget: 800000,
        description: "Développement des solutions logicielles",
        location: "Bureau 201-205"
      },
      {
        name: "Design",
        manager: employees[2]._id,
        budget: 300000,
        description: "Design d'interface et expérience utilisateur",
        location: "Bureau 101"
      },
      {
        name: "Analytics",
        manager: employees[3]._id,
        budget: 200000,
        description: "Analyse de données et intelligence d'affaires",
        location: "Bureau 302"
      },
      {
        name: "Management",
        manager: employees[4]._id,
        budget: 400000,
        description: "Gestion de projet et coordination",
        location: "Bureau 401"
      }
    ]);

    // Créer les projets
    const projects = await Project.create([
      {
        name: "Plateforme E-commerce",
        description: "Développement d'une plateforme e-commerce complète avec paiement intégré",
        status: "Terminé",
        startDate: new Date("2023-01-15"),
        endDate: new Date("2023-06-30"),
        budget: 250000,
        clientName: "Retail Plus Inc.",
        teamMembers: [employees[0]._id, employees[1]._id, employees[2]._id],
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe API"],
        progress: 100
      },
      {
        name: "Application Mobile Banking",
        description: "Application mobile sécurisée pour services bancaires",
        status: "En cours",
        startDate: new Date("2023-07-01"),
        endDate: new Date("2024-02-28"),
        budget: 400000,
        clientName: "Banque Nationale",
        teamMembers: [employees[0]._id, employees[1]._id, employees[3]._id, employees[4]._id],
        technologies: ["React Native", "Express.js", "MongoDB", "JWT"],
        progress: 75
      },
      {
        name: "Dashboard Analytics",
        description: "Tableau de bord pour visualisation de données temps réel",
        status: "En planification",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-05-30"),
        budget: 180000,
        clientName: "DataViz Corp",
        teamMembers: [employees[2]._id, employees[3]._id],
        technologies: ["Vue.js", "D3.js", "Python", "FastAPI"],
        progress: 15
      }
    ]);

    // Créer les données financières
    const financial = await Financial.create({
      year: 2023,
      revenue: 2500000,
      expenses: 1800000,
      profit: 700000,
      quarterlyRevenue: {
        Q1: 600000,
        Q2: 650000,
        Q3: 620000,
        Q4: 630000
      },
      monthlyExpenses: {
        salaires: 1200000,
        infrastructure: 300000,
        marketing: 150000,
        operations: 150000
      }
    });

    console.log('✅ Base de données initialisée avec succès !');
    console.log(`📊 Compagnie créée: ${company.name}`);
    console.log(`👥 ${employees.length} employés créés`);
    console.log(`🏢 ${departments.length} départements créés`);
    console.log(`📋 ${projects.length} projets créés`);
    console.log(`💰 Données financières ${financial.year} créées`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    if (error.code === 11000) {
      console.error('💡 Conflit de données (doublon détecté)');
    }
  }
};

// Schéma Message pour les contacts
const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format d\'email invalide']
  },
  subject: {
    type: String,
    default: 'Nouveau message',
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Le message est requis'],
    trim: true
  },
  status: {
    type: String,
    enum: ['nouveau', 'lu', 'traité', 'archivé'],
    default: 'nouveau'
  },
  ip: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les recherches
messageSchema.index({ email: 1 });
messageSchema.index({ status: 1 });
messageSchema.index({ createdAt: -1 });

// Virtual pour le temps écoulé
messageSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffMinutes = Math.floor((now - created) / (1000 * 60));
  
  if (diffMinutes < 1) return 'À l\'instant';
  if (diffMinutes < 60) return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
});

// Modèles Mongoose
const Company = mongoose.model('Company', companySchema);
const Employee = mongoose.model('Employee', employeeSchema);
const Project = mongoose.model('Project', projectSchema);
const Department = mongoose.model('Department', departmentSchema);
const Financial = mongoose.model('Financial', financialSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = {
  connectDB,
  seedDatabase,
  Company,
  Employee,
  Project,
  Department,
  Financial,
  Message
};
