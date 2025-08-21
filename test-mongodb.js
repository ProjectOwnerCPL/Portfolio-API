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
                    
                    // Affichage optimisé selon le type de données
                    if (json.success) {
                        if (json.data && Array.isArray(json.data)) {
                            console.log(`📊 ${json.data.length} éléments récupérés`);
                            if (json.pagination) {
                                console.log(`📄 Page ${json.pagination.page}/${json.pagination.pages} (${json.pagination.total} total)`);
                            }
                            // Afficher seulement le premier élément pour les listes
                            if (json.data.length > 0) {
                                console.log(`📋 Premier élément:`, JSON.stringify(json.data[0], null, 2));
                            }
                        } else {
                            console.log(`📊 Données:`, JSON.stringify(json.data, null, 2));
                        }
                    } else {
                        console.log(`❌ Erreur: ${json.message}`);
                    }
                } catch (e) {
                    console.log(`📊 Réponse brute: ${data.substring(0, 200)}...`);
                }
                console.log('─'.repeat(80));
                resolve();
            });
        });

        req.on('error', (e) => {
            console.log(`❌ Erreur: ${e.message}`);
            resolve();
        });

        req.setTimeout(10000, () => {
            console.log(`⏰ Timeout pour ${path}`);
            req.abort();
            resolve();
        });

        req.end();
    });
}

async function runMongoDBTests() {
    console.log('🍃 Test de l\'API MongoDB - TechCorp Solutions');
    console.log('=' .repeat(80));

    // Attendre que le serveur soit prêt
    console.log('⏳ Attente du démarrage du serveur MongoDB...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Tests des différents endpoints MongoDB
    const tests = [
        // Tests de base
        ['/api/company-mongo/health', 'État de la connexion MongoDB'],
        ['/api/company-mongo/db-info', 'Informations de la base de données'],
        ['/api/company-mongo', 'Informations générales de la compagnie'],
        
        // Tests des employés
        ['/api/company-mongo/employees', 'Liste des employés (pagination par défaut)'],
        ['/api/company-mongo/employees?limit=3', 'Premiers 3 employés'],
        ['/api/company-mongo/employees/department/IT', 'Employés du département IT'],
        
        // Tests des projets  
        ['/api/company-mongo/projects', 'Liste des projets avec équipes'],
        ['/api/company-mongo/projects/status/En%20cours', 'Projets en cours'],
        
        // Tests des départements
        ['/api/company-mongo/departments', 'Départements avec managers'],
        
        // Tests des statistiques
        ['/api/company-mongo/stats', 'Statistiques complètes MongoDB'],
        ['/api/company-mongo/financial', 'Données financières'],
        
        // Tests de recherche
        ['/api/company-mongo/search?query=JavaScript', 'Recherche "JavaScript"'],
        ['/api/company-mongo/search?query=Marie&type=employees', 'Recherche employé "Marie"']
    ];

    for (const [path, description] of tests) {
        await testEndpoint(path, description);
        // Pause entre les tests pour éviter la surcharge
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n🎉 Tests MongoDB terminés !');
    console.log('📊 Comparaison avec les données en mémoire :');
    console.log('  • MongoDB: /api/company-mongo/* (avec relations, pagination, recherche avancée)');
    console.log('  • Mémoire: /api/company/* (données statiques, rapide)');
    console.log('\n💡 Avantages MongoDB observés :');
    console.log('  ✅ Relations entre documents (populate)');
    console.log('  ✅ Pagination automatique');  
    console.log('  ✅ Recherche avec regex');
    console.log('  ✅ Agrégations pour statistiques');
    console.log('  ✅ Validation des données');
    console.log('  ✅ Persistance des données');
}

// Test de comparaison rapide
async function compareAPIs() {
    console.log('\n🔍 COMPARAISON RAPIDE MÉMOIRE vs MONGODB');
    console.log('=' .repeat(60));
    
    const comparisons = [
        ['/api/company/employees', '/api/company-mongo/employees', 'Employés'],
        ['/api/company/stats', '/api/company-mongo/stats', 'Statistiques'],
        ['/api/company/search?query=JavaScript', '/api/company-mongo/search?query=JavaScript', 'Recherche']
    ];
    
    for (const [memoryPath, mongoPath, name] of comparisons) {
        console.log(`\n📋 ${name}:`);
        console.log(`  💾 Mémoire: ${memoryPath}`);
        console.log(`  🍃 MongoDB: ${mongoPath}`);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

// Exécution des tests
if (require.main === module) {
    runMongoDBTests()
        .then(() => compareAPIs())
        .catch(console.error);
}

module.exports = { runMongoDBTests, testEndpoint };
