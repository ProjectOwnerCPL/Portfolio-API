// Script simple pour insérer les données manquantes via l'API
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/company-mongo';

async function insertData() {
    console.log('🔄 Insertion des données manquantes via API...');
    
    try {
        // 1. Vérifier les employés existants
        console.log('👥 Vérification des employés...');
        const employeesResponse = await axios.get(`${BASE_URL}/employees`);
        
        if (employeesResponse.data.data && employeesResponse.data.data.length === 0) {
            console.log('📝 Insertion des employés...');
            
            const employees = [
                {
                    name: "Marie Dubois",
                    position: "Développeuse Full-Stack Senior",
                    department: "Développement",
                    email: "marie.dubois@fixer.com",
                    phone: "+1-514-555-0101",
                    salary: 95000,
                    hireDate: "2021-03-15",
                    skills: ["React", "Node.js", "MongoDB", "TypeScript"]
                },
                {
                    name: "Pierre Martin", 
                    position: "Architecte Logiciel",
                    department: "Développement",
                    email: "pierre.martin@fixer.com",
                    phone: "+1-514-555-0102",
                    salary: 110000,
                    hireDate: "2020-06-01",
                    skills: ["System Design", "Microservices", "Docker", "Kubernetes"]
                },
                {
                    name: "Sophie Bernard",
                    position: "Designer UX/UI", 
                    department: "Design",
                    email: "sophie.bernard@fixer.com",
                    phone: "+1-514-555-0103",
                    salary: 75000,
                    hireDate: "2021-09-20",
                    skills: ["Figma", "Adobe Creative", "User Research", "Prototyping"]
                },
                {
                    name: "Lucas Petit",
                    position: "DevOps Engineer",
                    department: "Infrastructure", 
                    email: "lucas.petit@fixer.com",
                    phone: "+1-514-555-0104",
                    salary: 90000,
                    hireDate: "2022-01-10",
                    skills: ["AWS", "Docker", "Jenkins", "Terraform"]
                },
                {
                    name: "Camille Roux",
                    position: "Chef de Projet",
                    department: "Management",
                    email: "camille.roux@fixer.com",
                    phone: "+1-514-555-0105", 
                    salary: 85000,
                    hireDate: "2021-11-05",
                    skills: ["Agile", "Scrum", "Leadership", "Communication"]
                }
            ];
            
            for (const employee of employees) {
                try {
                    await axios.post(`${BASE_URL}/employees`, employee);
                    console.log(`✅ Employé créé: ${employee.name}`);
                } catch (error) {
                    console.log(`❌ Erreur employé ${employee.name}:`, error.response?.data?.message || error.message);
                }
            }
        } else {
            console.log(`✅ ${employeesResponse.data.data.length} employés déjà présents`);
        }
        
        // 2. Vérifier les départements
        console.log('🏢 Vérification des départements...');
        const deptResponse = await axios.get(`${BASE_URL}/departments`);
        
        if (deptResponse.data.data && deptResponse.data.data.length === 0) {
            console.log('📝 Insertion des départements...');
            
            const departments = [
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
            ];
            
            for (const dept of departments) {
                try {
                    await axios.post(`${BASE_URL}/departments`, dept);
                    console.log(`✅ Département créé: ${dept.name}`);
                } catch (error) {
                    console.log(`❌ Erreur département ${dept.name}:`, error.response?.data?.message || error.message);
                }
            }
        } else {
            console.log(`✅ ${deptResponse.data.data.length} départements déjà présents`);
        }
        
        // 3. Vérifier les projets
        console.log('📋 Vérification des projets...');
        const projectsResponse = await axios.get(`${BASE_URL}/projects`);
        
        if (projectsResponse.data.data && projectsResponse.data.data.length === 0) {
            console.log('📝 Insertion des projets...');
            
            const projects = [
                {
                    name: "Plateforme E-commerce Next-Gen",
                    description: "Développement d'une plateforme e-commerce moderne avec React et Node.js",
                    status: "Terminé",
                    startDate: "2023-01-15",
                    endDate: "2023-09-30", 
                    budget: 250000,
                    clientName: "RetailCorp",
                    technologies: ["React", "Node.js", "PostgreSQL", "Stripe API"]
                },
                {
                    name: "Application Mobile Banking",
                    description: "Application mobile sécurisée pour services bancaires", 
                    status: "En cours",
                    startDate: "2023-07-01",
                    endDate: "2024-02-28",
                    budget: 400000,
                    clientName: "Banque Nationale",
                    technologies: ["React Native", "Express.js", "MongoDB", "JWT"]
                },
                {
                    name: "Dashboard Analytics",
                    description: "Tableau de bord pour visualisation de données temps réel",
                    status: "En planification", 
                    startDate: "2024-01-15",
                    endDate: "2024-05-30",
                    budget: 180000,
                    clientName: "DataViz Inc",
                    technologies: ["Vue.js", "D3.js", "Python", "FastAPI"]
                }
            ];
            
            for (const project of projects) {
                try {
                    await axios.post(`${BASE_URL}/projects`, project);
                    console.log(`✅ Projet créé: ${project.name}`);
                } catch (error) {
                    console.log(`❌ Erreur projet ${project.name}:`, error.response?.data?.message || error.message);
                }
            }
        } else {
            console.log(`✅ ${projectsResponse.data.data.length} projets déjà présents`);
        }
        
        console.log('🎉 Insertion des données terminée!');
        
    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Assurez-vous que le serveur est démarré: npm start');
        }
    }
}

insertData();
