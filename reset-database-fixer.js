// Script pour réinitialiser la base MongoDB avec les données Fixer
require('dotenv').config();
const { connectDB, Company, Employee, Project, Department, Financial } = require('./config/mongodb');

async function resetDatabase() {
    console.log('🔄 Réinitialisation de la base de données avec les données Fixer...');
    
    try {
        // Connexion à MongoDB
        await connectDB();
        
        // Suppression des anciennes données
        console.log('🗑️  Suppression des anciennes données...');
        await Company.deleteMany({});
        await Employee.deleteMany({});
        await Project.deleteMany({});
        await Department.deleteMany({});
        await Financial.deleteMany({});
        
        // Données Fixer Solutions
        console.log('📝 Insertion des nouvelles données Fixer...');
        
        // 1. Compagnie
        const company = await Company.create({
            name: "Fixer Solutions",
            description: "Entreprise spécialisée dans le développement web et mobile, offrant des solutions technologiques innovantes.",
            founded: "2020",
            industry: "Technologie",
            location: "Montreal, QC, Canada",
            employees: 15,
            headquarters: "Montreal, QC, Canada",
            website: "www.fixer-solutions.com",
            email: "contact@fixer-solutions.com",
            phone: "+1-514-555-0123"
        });
        
        // 2. Employés
        const employees = await Employee.insertMany([
            {
                name: "Marie Dubois",
                position: "Développeuse Full-Stack Senior",
                department: "Développement",
                email: "marie.dubois@fixer.com",
                phone: "+1-514-555-0101",
                salary: 95000,
                hireDate: new Date("2021-03-15"),
                skills: ["React", "Node.js", "MongoDB", "TypeScript"]
            },
            {
                name: "Pierre Martin",
                position: "Architecte Logiciel",
                department: "Développement",
                email: "pierre.martin@fixer.com",
                phone: "+1-514-555-0102",
                salary: 110000,
                hireDate: new Date("2020-06-01"),
                skills: ["System Design", "Microservices", "Docker", "Kubernetes"]
            },
            {
                name: "Sophie Bernard",
                position: "Designer UX/UI",
                department: "Design",
                email: "sophie.bernard@fixer.com",
                phone: "+1-514-555-0103",
                salary: 75000,
                hireDate: new Date("2021-09-20"),
                skills: ["Figma", "Adobe Creative", "User Research", "Prototyping"]
            },
            {
                name: "Lucas Petit",
                position: "DevOps Engineer",
                department: "Infrastructure",
                email: "lucas.petit@fixer.com",
                phone: "+1-514-555-0104",
                salary: 90000,
                hireDate: new Date("2022-01-10"),
                skills: ["AWS", "Docker", "Jenkins", "Terraform"]
            },
            {
                name: "Camille Roux",
                position: "Chef de Projet",
                department: "Management",
                email: "camille.roux@fixer.com",
                phone: "+1-514-555-0105",
                salary: 85000,
                hireDate: new Date("2021-11-05"),
                skills: ["Agile", "Scrum", "Leadership", "Communication"]
            }
        ]);
        
        // 3. Projets
        const projects = await Project.insertMany([
            {
                name: "Plateforme E-commerce Next-Gen",
                description: "Développement d'une plateforme e-commerce moderne avec React et Node.js",
                status: "Terminé",
                startDate: new Date("2023-01-15"),
                endDate: new Date("2023-09-30"),
                budget: 250000,
                clientName: "RetailCorp",
                teamMembers: [employees[0]._id, employees[1]._id, employees[2]._id],
                technologies: ["React", "Node.js", "PostgreSQL", "Stripe API"]
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
                technologies: ["React Native", "Express.js", "MongoDB", "JWT"]
            },
            {
                name: "Dashboard Analytics",
                description: "Tableau de bord pour visualisation de données temps réel",
                status: "En planification",
                startDate: new Date("2024-01-15"),
                endDate: new Date("2024-05-30"),
                budget: 180000,
                clientName: "DataViz Inc",
                teamMembers: [employees[0]._id, employees[2]._id],
                technologies: ["Vue.js", "D3.js", "Python", "FastAPI"]
            }
        ]);
        
        // 4. Départements
        const departments = await Department.insertMany([
            {
                name: "Développement",
                manager: "Pierre Martin",
                employeeCount: 8,
                budget: 800000,
                description: "Équipe de développement logiciel"
            },
            {
                name: "Design",
                manager: "Sophie Bernard",
                employeeCount: 3,
                budget: 250000,
                description: "Équipe de design et expérience utilisateur"
            },
            {
                name: "Infrastructure",
                manager: "Lucas Petit",
                employeeCount: 2,
                budget: 300000,
                description: "Gestion infrastructure et DevOps"
            },
            {
                name: "Marketing",
                manager: "Julie Moreau",
                employeeCount: 2,
                budget: 150000,
                description: "Marketing digital et communication"
            },
            {
                name: "Management",
                manager: "Catherine Roy",
                employeeCount: 5,
                budget: 400000,
                description: "Gestion de projet et coordination"
            }
        ]);
        
        // 5. Données Financières
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
            employeeCosts: 1200000,
            operatingCosts: 600000
        });
        
        console.log('✅ Base de données Fixer initialisée avec succès!');
        console.log(`📊 Compagnie: ${company.name}`);
        console.log(`👥 Employés: ${employees.length}`);
        console.log(`📋 Projets: ${projects.length}`);
        console.log(`🏢 Départements: ${departments.length}`);
        console.log(`💰 Données financières: Année ${financial.year}`);
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur lors de la réinitialisation:', error);
        process.exit(1);
    }
}

resetDatabase();
