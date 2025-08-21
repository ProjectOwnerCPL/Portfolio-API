#!/usr/bin/env node
// Script pour enrichir la base MongoDB avec plus de données

const mongoose = require('mongoose');
require('dotenv').config();

// Import des modèles (assumant qu'ils sont définis quelque part)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fixer', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🍃 Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

// Recréer les schémas (copie depuis mongodb-setup.js)
const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String,
  hireDate: { type: Date, default: Date.now },
  salary: { type: Number, min: 30000, max: 200000 },
  skills: [String],
  isActive: { type: Boolean, default: true },
  address: { type: String },
  emergencyContact: { type: String }
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['En cours', 'Terminé', 'En attente', 'Annulé'], default: 'En cours' },
  startDate: { type: Date, required: true },
  endDate: Date,
  budget: { type: Number, min: 0 },
  clientName: String,
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  technologies: [String],
  progress: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  budget: Number,
  description: String
}, { timestamps: true });

const financialSchema = new mongoose.Schema({
  year: { type: String, required: true },
  revenue: { type: Number, required: true },
  expenses: { type: Number, required: true },
  profit: { type: Number, required: true },
  employees: { type: Number, required: true },
  projects: { type: Number, required: true }
}, { timestamps: true });

// Création des modèles
const Employee = mongoose.model('Employee', employeeSchema);
const Project = mongoose.model('Project', projectSchema);
const Department = mongoose.model('Department', departmentSchema);
const Financial = mongoose.model('Financial', financialSchema);

const enrichDatabase = async () => {
  try {
    console.log('🌱 Enrichissement de la base MongoDB...');
    
    // Récupérer les employés existants
    const existingEmployees = await Employee.find();
    console.log(`📊 Employés existants: ${existingEmployees.length}`);

    // Ajouter plus d'employés si nécessaire
    const additionalEmployees = [
      {
        firstName: "Pierre",
        lastName: "Lavoie", 
        position: "Analyste de Données",
        department: "Analytics",
        email: "pierre.lavoie@fixer.com",
        phone: "+1 (514) 456-7890",
        hireDate: new Date("2021-02-01"),
        salary: 70000,
        skills: ["Python", "SQL", "Power BI", "Machine Learning"],
        isActive: true
      },
      {
        firstName: "Catherine",
        lastName: "Roy",
        position: "Chef de Projet",
        department: "Management", 
        email: "catherine.roy@fixer.com",
        phone: "+1 (514) 567-8901",
        hireDate: new Date("2019-09-12"),
        salary: 80000,
        skills: ["Agile", "Scrum", "Communication", "Planning"],
        isActive: true
      }
    ];

    // Ajouter les employés supplémentaires s'ils n'existent pas
    for (const empData of additionalEmployees) {
      const exists = await Employee.findOne({ email: empData.email });
      if (!exists) {
        const newEmp = await Employee.create(empData);
        console.log(`✅ Employé ajouté: ${newEmp.firstName} ${newEmp.lastName}`);
      } else {
        console.log(`⏭️  Employé existe déjà: ${empData.firstName} ${empData.lastName}`);
      }
    }

    // Récupérer tous les employés après ajout
    const allEmployees = await Employee.find();

    // Ajouter plus de projets
    const additionalProjects = [
      {
        name: "Application Mobile Banking",
        description: "Application mobile sécurisée pour services bancaires",
        status: "En cours",
        startDate: new Date("2023-07-01"),
        endDate: new Date("2024-02-28"),
        budget: 400000,
        clientName: "Banque Nationale",
        teamMembers: [allEmployees[0]._id, allEmployees[1]._id],
        technologies: ["React Native", "Node.js", "MongoDB", "JWT"],
        progress: 75
      },
      {
        name: "Système de Gestion RH",
        description: "Plateforme complète de gestion des ressources humaines",
        status: "En cours",
        startDate: new Date("2023-09-01"),
        endDate: new Date("2024-03-31"),
        budget: 180000,
        clientName: "TechCorp Inc.",
        teamMembers: allEmployees.slice(0, 3).map(emp => emp._id),
        technologies: ["Vue.js", "Express.js", "PostgreSQL", "Docker"],
        progress: 45
      },
      {
        name: "Site Web Corporate",
        description: "Site web institutionnel avec CMS intégré",
        status: "Terminé", 
        startDate: new Date("2023-03-01"),
        endDate: new Date("2023-05-15"),
        budget: 85000,
        clientName: "Design Studio Pro",
        teamMembers: allEmployees.slice(1, 4).map(emp => emp._id),
        technologies: ["Next.js", "Strapi", "Tailwind CSS"],
        progress: 100
      }
    ];

    // Ajouter les projets s'ils n'existent pas
    for (const projData of additionalProjects) {
      const exists = await Project.findOne({ name: projData.name });
      if (!exists) {
        const newProj = await Project.create(projData);
        console.log(`✅ Projet ajouté: ${newProj.name}`);
      } else {
        console.log(`⏭️  Projet existe déjà: ${projData.name}`);
      }
    }

    // Ajouter des départements supplémentaires
    const additionalDepartments = [
      {
        name: "Analytics",
        manager: allEmployees.find(emp => emp.department === "Analytics")?._id,
        budget: 300000,
        description: "Analyse de données et business intelligence"
      },
      {
        name: "Management",
        manager: allEmployees.find(emp => emp.department === "Management")?._id,
        budget: 400000,
        description: "Gestion de projets et coordination d'équipes"
      }
    ];

    for (const deptData of additionalDepartments) {
      const exists = await Department.findOne({ name: deptData.name });
      if (!exists && deptData.manager) {
        const newDept = await Department.create(deptData);
        console.log(`✅ Département ajouté: ${newDept.name}`);
      }
    }

    // Ajouter des données financières
    const financialData = [
      {
        year: "2023",
        revenue: 2500000,
        expenses: 1800000,
        profit: 700000,
        employees: 5,
        projects: 8
      },
      {
        year: "2024",
        revenue: 3200000,
        expenses: 2300000,
        profit: 900000,
        employees: 5,
        projects: 12
      }
    ];

    for (const finData of financialData) {
      const exists = await Financial.findOne({ year: finData.year });
      if (!exists) {
        const newFin = await Financial.create(finData);
        console.log(`✅ Données financières ajoutées: ${newFin.year}`);
      }
    }

    // Statistiques finales
    const stats = {
      employees: await Employee.countDocuments(),
      projects: await Project.countDocuments(),
      departments: await Department.countDocuments(),
      financialRecords: await Financial.countDocuments()
    };

    console.log('\n🎉 Enrichissement terminé !');
    console.log('📊 Statistiques finales:');
    console.log(`   👥 Employés: ${stats.employees}`);
    console.log(`   🚀 Projets: ${stats.projects}`);
    console.log(`   🏢 Départements: ${stats.departments}`);
    console.log(`   💰 Enregistrements financiers: ${stats.financialRecords}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'enrichissement:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
  }
};

// Exécution
const main = async () => {
  await connectDB();
  await enrichDatabase();
};

if (require.main === module) {
  main();
}

module.exports = { enrichDatabase };
