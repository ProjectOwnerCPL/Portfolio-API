#!/usr/bin/env node

// Script d'installation automatique de MongoDB pour Fixer API
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🍃 Installation MongoDB pour Fixer API');
console.log('=' .repeat(50));

// Fonction pour exécuter des commandes
function runCommand(command, description) {
    return new Promise((resolve, reject) => {
        console.log(`\n📋 ${description}...`);
        console.log(`💻 ${command}`);
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`❌ Erreur: ${error.message}`);
                console.log(`💡 Vous pouvez ignorer cette erreur et continuer manuellement`);
                resolve(false);
            } else {
                console.log(`✅ ${description} terminé`);
                if (stdout) console.log(stdout);
                resolve(true);
            }
        });
    });
}

// Fonction pour vérifier si un module existe
function checkModule(moduleName) {
    try {
        require.resolve(moduleName);
        return true;
    } catch (e) {
        return false;
    }
}

// Fonction principale d'installation
async function installMongoDB() {
    try {
        console.log('\n🔍 Vérification de l\'environnement...');
        
        // Vérifier si on est dans le bon dossier
        if (!fs.existsSync('./package.json')) {
            console.log('❌ Erreur: Exécuter depuis le dossier Portfolio-API');
            process.exit(1);
        }

        console.log('✅ Dossier correct détecté');

        // Vérifier si Mongoose est déjà installé
        if (checkModule('mongoose')) {
            console.log('✅ Mongoose déjà installé');
        } else {
            console.log('📦 Installation de Mongoose...');
            const success = await runCommand('npm install mongoose --save', 'Installation Mongoose');
            if (success) {
                console.log('✅ Mongoose installé avec succès');
            } else {
                console.log('⚠️  Erreur lors de l\'installation de Mongoose');
                console.log('💡 Essayez manuellement: npm install mongoose');
            }
        }

        // Vérifier l'installation
        console.log('\n🧪 Test de l\'installation...');
        const testSuccess = await runCommand(
            'node -e "try { require(\'mongoose\'); console.log(\'✅ Mongoose OK\'); } catch(e) { console.log(\'❌ Mongoose manquant\'); process.exit(1); }"',
            'Vérification Mongoose'
        );

        if (testSuccess) {
            console.log('\n🎉 Installation MongoDB terminée avec succès !');
            console.log('\n📋 Prochaines étapes:');
            console.log('1. 🌐 Créer un compte MongoDB Atlas: https://www.mongodb.com/atlas');
            console.log('2. ⚙️  Configurer l\'URI dans le fichier .env');
            console.log('3. 🚀 Redémarrer le serveur: npm run dev');
            console.log('4. 🧪 Tester: http://localhost:3000/api/company-mongo/health');
            
            console.log('\n📖 Documentation complète: MONGODB-SETUP.md');
            console.log('🌐 Interface de test: test-mongodb-compare.html');
            
        } else {
            console.log('\n⚠️  Installation partielle - Problème avec Mongoose');
            console.log('💡 Essayez les commandes manuelles dans MONGODB-SETUP.md');
        }

    } catch (error) {
        console.error('\n❌ Erreur fatale:', error.message);
        console.log('💡 Consultez MONGODB-SETUP.md pour l\'installation manuelle');
    }
}

// Options de configuration MongoDB Atlas
function showAtlasConfig() {
    console.log('\n🔧 Configuration MongoDB Atlas (Recommandé):');
    console.log('─'.repeat(50));
    console.log('1. Créer un compte sur: https://www.mongodb.com/atlas');
    console.log('2. Créer un cluster gratuit (512MB)');
    console.log('3. Créer un utilisateur de base de données');
    console.log('4. Permettre l\'accès réseau (0.0.0.0/0)');
    console.log('5. Copier l\'URI de connexion');
    console.log('6. Mettre l\'URI dans .env:');
    console.log('   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fixer');
    console.log('\n💡 Gratuit, rapide et sans installation locale !');
}

// Menu principal
function showMenu() {
    console.log('\n🎯 Que voulez-vous faire ?');
    console.log('1. 📦 Installer Mongoose (requis)');
    console.log('2. 🌐 Instructions MongoDB Atlas');
    console.log('3. 🧪 Tester l\'installation actuelle');
    console.log('4. 📖 Ouvrir la documentation');
    console.log('5. ❌ Quitter');
    
    process.stdout.write('\n👉 Votre choix (1-5): ');
}

// Gestion de l'entrée utilisateur
function handleUserInput() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    showMenu();

    rl.on('line', async (input) => {
        const choice = input.trim();

        switch(choice) {
            case '1':
                await installMongoDB();
                showMenu();
                break;
            case '2':
                showAtlasConfig();
                showMenu();
                break;
            case '3':
                console.log('\n🧪 Test de l\'installation...');
                await runCommand(
                    'node -e "try { require(\'mongoose\'); console.log(\'✅ Mongoose disponible\'); } catch(e) { console.log(\'❌ Mongoose manquant\'); }"',
                    'Test Mongoose'
                );
                await runCommand('npm list mongoose', 'Vérification package');
                showMenu();
                break;
            case '4':
                console.log('\n📖 Ouverture de la documentation...');
                console.log('📁 MONGODB-SETUP.md - Guide complet');
                console.log('🌐 test-mongodb-compare.html - Interface de test');
                showMenu();
                break;
            case '5':
                console.log('\n👋 Au revoir ! MongoDB vous attend...');
                rl.close();
                process.exit(0);
                break;
            default:
                console.log('❌ Choix invalide. Tapez 1, 2, 3, 4 ou 5');
                showMenu();
                break;
        }
    });
}

// Démarrage selon les arguments
if (process.argv.includes('--install')) {
    // Installation directe
    installMongoDB();
} else if (process.argv.includes('--atlas')) {
    // Instructions Atlas seulement
    showAtlasConfig();
} else {
    // Menu interactif
    handleUserInput();
}
