// Données fictives pour la compagnie "Fixer Solutions"

const companyInfo = {
  id: 1,
  name: "Fixer Solutions",
  founded: "2018",
  industry: "Technologie",
  location: "Montreal, Quebec",
  employees: 150,
  website: "www.fixer-solutions.com",
  description: "Entreprise spécialisée dans le développement de solutions logicielles innovantes",
  mission: "Transformer les idées en solutions numériques performantes",
  values: ["Innovation", "Qualité", "Collaboration", "Excellence"]
};

const employees = [
  {
    id: 1,
    firstName: "Marie",
    lastName: "Dubois",
    position: "Directrice Technique",
    department: "IT",
    email: "marie.dubois@fixer.com",
    phone: "+1 (514) 123-4567",
    hireDate: "2019-03-15",
    salary: 95000,
    skills: ["JavaScript", "Python", "Architecture", "Leadership"]
  },
  {
    id: 2,
    firstName: "Jean",
    lastName: "Martin",
    position: "Développeur Senior",
    department: "Développement",
    email: "camille.roux@fixer.com",
    phone: "+1 (514) 234-5678",
    hireDate: "2020-01-10",
    salary: 75000,
    skills: ["React", "Node.js", "MongoDB", "TypeScript"]
  },
  {
    id: 3,
    firstName: "Sophie",
    lastName: "Tremblay",
    position: "Designer UX/UI",
    department: "Design",
    email: "sophie.bernard@fixer.com",
    phone: "+1 (514) 345-6789",
    hireDate: "2020-06-20",
    salary: 65000,
    skills: ["Figma", "Adobe Creative", "Prototyping", "User Research"]
  },
  {
    id: 4,
    firstName: "Pierre",
    lastName: "Lavoie",
    position: "Analyste de Données",
    department: "Analytics",
    email: "pierre.martin@fixer.com",
    phone: "+1 (514) 456-7890",
    hireDate: "2021-02-01",
    salary: 70000,
    skills: ["Python", "SQL", "Power BI", "Machine Learning"]
  },
  {
    id: 5,
    firstName: "Catherine",
    lastName: "Roy",
    position: "Chef de Projet",
    department: "Management",
    email: "lucas.petit@fixer.com",
    phone: "+1 (514) 567-8901",
    hireDate: "2019-09-12",
    salary: 80000,
    skills: ["Agile", "Scrum", "Communication", "Planning"]
  }
];

const projects = [
  {
    id: 1,
    name: "Plateforme E-commerce",
    description: "Développement d'une plateforme e-commerce complète avec paiement intégré",
    status: "Terminé",
    startDate: "2023-01-15",
    endDate: "2023-06-30",
    budget: 250000,
    clientName: "Retail Plus Inc.",
    teamMembers: [1, 2, 3],
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe API"]
  },
  {
    id: 2,
    name: "Application Mobile Banking",
    description: "Application mobile sécurisée pour services bancaires",
    status: "En cours",
    startDate: "2023-07-01",
    endDate: "2024-02-28",
    budget: 400000,
    clientName: "Banque Nationale",
    teamMembers: [1, 2, 4, 5],
    technologies: ["React Native", "Express.js", "MongoDB", "JWT"]
  },
  {
    id: 3,
    name: "Dashboard Analytics",
    description: "Tableau de bord pour visualisation de données temps réel",
    status: "En planification",
    startDate: "2024-01-15",
    endDate: "2024-05-30",
    budget: 180000,
    clientName: "DataViz Corp",
    teamMembers: [3, 4],
    technologies: ["Vue.js", "D3.js", "Python", "FastAPI"]
  }
];

const departments = [
  {
    id: 1,
    name: "IT",
    manager: "Marie Dubois",
    employeeCount: 3,
    budget: 500000,
    description: "Gestion de l'infrastructure et architecture technique"
  },
  {
    id: 2,
    name: "Développement",
    manager: "Jean Martin",
    employeeCount: 8,
    budget: 800000,
    description: "Développement des solutions logicielles"
  },
  {
    id: 3,
    name: "Design",
    manager: "Sophie Tremblay",
    employeeCount: 4,
    budget: 300000,
    description: "Design d'interface et expérience utilisateur"
  },
  {
    id: 4,
    name: "Analytics",
    manager: "Pierre Lavoie",
    employeeCount: 3,
    budget: 200000,
    description: "Analyse de données et intelligence d'affaires"
  },
  {
    id: 5,
    name: "Management",
    manager: "Catherine Roy",
    employeeCount: 5,
    budget: 400000,
    description: "Gestion de projet et coordination"
  }
];

const financialData = {
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
};

module.exports = {
  companyInfo,
  employees,
  projects,
  departments,
  financialData
};
