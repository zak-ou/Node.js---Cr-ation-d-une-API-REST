// seed.js
const https = require('https');
const fs = require('fs');

// URL de l'API
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Fonction pour récupérer les posts
function fetchPosts() {
    console.log('📥 Récupération des posts depuis l\'API...');
    
    const request = https.get(API_URL, (response) => {
        let data = '';
        
        // Récupérer les données par morceaux
        response.on('data', (chunk) => {
            data += chunk;
        });
        
        // Une fois toutes les données reçues
        response.on('end', () => {
            try {
                const posts = JSON.parse(data);
                console.log(`✅ ${posts.length} posts récupérés`);
                savePosts(posts);
            } catch (error) {
                console.error('❌ Erreur lors du parsing JSON:', error.message);
            }
        });
        
    });
    
    // Gérer les erreurs
    request.on('error', (error) => {
        console.error('❌ Erreur lors de la requête:', error.message);
    });
    
    // Définir un timeout
    request.setTimeout(10000, () => {
        console.error('❌ Timeout - la requête a pris trop de temps');
        request.destroy();
    });
}

// Fonction pour sauvegarder les posts
function savePosts(posts) {
    const filename = 'posts.json';
    
    fs.writeFile(filename, JSON.stringify(posts, null, 2), (err) => {
        if (err) {
            console.error('❌ Erreur lors de la sauvegarde:', err.message);
            return;
        }
        console.log(`✅ Posts sauvegardés dans ${filename}`);
    });
}

// Exécution du script
fetchPosts();
