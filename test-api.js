const http = require('http');

// Fonction pour tester un endpoint
function testEndpoint(path, description) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log(`\n🧪 ${description}`);
                console.log(`📍 ${path}`);
                console.log(`✅ Status: ${res.statusCode}`);
                try {
                    const json = JSON.parse(data);
                    console.log(`📊 Réponse: ${JSON.stringify(json, null, 2)}`);
                } catch (e) {
                    console.log(`📊 Réponse: ${data}`);
                }
                console.log('─'.repeat(80));
                resolve();
            });
        });

        req.on('error', (e) => {
            console.log(`❌ Erreur: ${e.message}`);
            resolve();
        });

        req.end();
    });
}

async function runTests() {
    console.log('🚀 Test de l\'API Compagnie - Fixer Solutions');
    console.log('=' .repeat(80));

    // Tests des différents endpoints
    const tests = [
        ['/api/company', 'Informations générales de la compagnie'],
        ['/api/company/employees', 'Liste de tous les employés'],
        ['/api/company/employees/1', 'Détails employé ID 1'],
        ['/api/company/projects', 'Liste de tous les projets'],
        ['/api/company/projects/1', 'Détails projet ID 1 avec équipe'],
        ['/api/company/departments', 'Liste des départements'],
        ['/api/company/stats', 'Statistiques de la compagnie'],
        ['/api/company/employees/department/IT', 'Employés du département IT'],
        ['/api/company/projects/status/En%20cours', 'Projets en cours'],
        ['/api/company/search?query=JavaScript', 'Recherche "JavaScript"']
    ];

    for (const [path, description] of tests) {
        await testEndpoint(path, description);
        // Petite pause entre les tests
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🎉 Tests terminés !');
    console.log('💡 Vous pouvez maintenant utiliser l\'API dans votre application');
    console.log('📖 Consultez README-COMPANY.md pour la documentation complète');
}

runTests().catch(console.error);
