// Script corrigé pour insérer les employés avec les bons champs
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/company-mongo';

async function insertEmployees() {
    console.log('👥 Insertion des employés Fixer...');
    
    const employees = [
        {
            firstName: "Marie",
            lastName: "Dubois",
            position: "Développeuse Full-Stack Senior",
            department: "Développement",
            email: "marie.dubois@fixer.com",
            phone: "+1-514-555-0101",
            salary: 95000,
            hireDate: "2021-03-15",
            skills: ["React", "Node.js", "MongoDB", "TypeScript"]
        },
        {
            firstName: "Pierre",
            lastName: "Martin", 
            position: "Architecte Logiciel",
            department: "Développement",
            email: "pierre.martin@fixer.com",
            phone: "+1-514-555-0102",
            salary: 110000,
            hireDate: "2020-06-01",
            skills: ["System Design", "Microservices", "Docker", "Kubernetes"]
        },
        {
            firstName: "Sophie",
            lastName: "Bernard",
            position: "Designer UX/UI", 
            department: "Design",
            email: "sophie.bernard@fixer.com",
            phone: "+1-514-555-0103",
            salary: 75000,
            hireDate: "2021-09-20",
            skills: ["Figma", "Adobe Creative", "User Research", "Prototyping"]
        },
        {
            firstName: "Lucas",
            lastName: "Petit",
            position: "DevOps Engineer",
            department: "IT", 
            email: "lucas.petit@fixer.com",
            phone: "+1-514-555-0104",
            salary: 90000,
            hireDate: "2022-01-10",
            skills: ["AWS", "Docker", "Jenkins", "Terraform"]
        },
        {
            firstName: "Camille",
            lastName: "Roux",
            position: "Chef de Projet",
            department: "Management",
            email: "camille.roux@fixer.com",
            phone: "+1-514-555-0105", 
            salary: 85000,
            hireDate: "2021-11-05",
            skills: ["Agile", "Scrum", "Leadership", "Communication"]
        }
    ];
    
    try {
        for (const employee of employees) {
            try {
                const response = await axios.post(`${BASE_URL}/employees`, employee);
                console.log(`✅ Employé créé: ${employee.firstName} ${employee.lastName}`);
            } catch (error) {
                console.log(`❌ Erreur ${employee.firstName}:`, error.response?.data?.message || error.message);
            }
        }
        
        console.log('🎉 Insertion des employés terminée!');
        
    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
    }
}

insertEmployees();
