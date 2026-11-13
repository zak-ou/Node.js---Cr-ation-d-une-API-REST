// server.js
const http = require('http');
const url = require('url');
const postManager = require('./postManager');

const PORT = 3000;

// Fonction pour parser le body JSON
function parseJsonBody(request, callback) {
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });
    request.on('end', () => {
        try {
            const data = JSON.parse(body);
            callback(null, data);
        } catch (error) {
            callback(error, null);
        }
    });
}

// Créer le serveur en testant sur la méthode HTTP method et le pathname
const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const method = request.method;
    
    // Headers CORS pour permettre l'accès depuis le client web
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Content-Type', 'application/json');
    
    // Logger pour débugger
    console.log(`${method} ${pathname}`);
    
    // Gérer les requêtes OPTIONS (pre-flight CORS)
    if (method === 'OPTIONS') {
        response.writeHead(200);
        response.end();
        return;
    }
    
    // Routes API
    
    // GET /api/posts - Obtenir tous les posts
    if (pathname === '/api/posts' && method === 'GET') {
        postManager.getAllPosts((err, posts) => {
            if (err) {
                response.writeHead(500);
                response.end(JSON.stringify({ error: 'Erreur serveur' }));
            } else {
                response.writeHead(200);
                response.end(JSON.stringify(posts));
            }
        });
    }
    
    // GET /api/posts/:id - Obtenir un post par ID
    else if (pathname.match(/^\/api\/posts\/\d+$/) && method === 'GET') {
        const id = pathname.split('/')[3];
        
        postManager.getPost(id, (err, post) => {
            if (err) {
                response.writeHead(404);
                response.end(JSON.stringify({ error: 'Post non trouvé' }));
            } else {
                response.writeHead(200);
                response.end(JSON.stringify(post));
            }
        });
    }
    
    // POST /api/posts - Créer un nouveau post
    else if (pathname === '/api/posts' && method === 'POST') {
        parseJsonBody(request, (err, newPost) => {
            if (err) {
                response.writeHead(400);
                response.end(JSON.stringify({ error: 'JSON invalide' }));
                return;
            }
            
            postManager.insertPost(newPost, (err, createdPost) => {
                if (err) {
                    response.writeHead(500);
                    response.end(JSON.stringify({ error: 'Erreur lors de la création' }));
                } else {
                    response.writeHead(201);
                    response.end(JSON.stringify(createdPost));
                }
            });
        });
    }
    
    // PUT /api/posts/:id - Mettre à jour un post
    else if (pathname.match(/^\/api\/posts\/\d+$/) && method === 'PUT') {
        const id = pathname.split('/')[3];
        
        parseJsonBody(request, (err, updatedPost) => {
            if (err) {
                response.writeHead(400);
                response.end(JSON.stringify({ error: 'JSON invalide' }));
                return;
            }
            
            postManager.updatePost(id, updatedPost, (err, post) => {
                if (err) {
                    response.writeHead(404);
                    response.end(JSON.stringify({ error: 'Post non trouvé' }));
                } else {
                    response.writeHead(200);
                    response.end(JSON.stringify(post));
                }
            });
        });
    }
    
    // DELETE /api/posts/:id - Supprimer un post
    else if (pathname.match(/^\/api\/posts\/\d+$/) && method === 'DELETE') {
        const id = pathname.split('/')[3];
        
        postManager.deletePost(id, (err, deletedPost) => {
            if (err) {
                response.writeHead(404);
                response.end(JSON.stringify({ error: 'Post non trouvé' }));
            } else {
                response.writeHead(200);
                response.end(JSON.stringify({ 
                    message: 'Post supprimé avec succès',
                    post: deletedPost 
                }));
            }
        });
    }
    
    // Route non trouvée
    else {
        response.writeHead(404);
        response.end(JSON.stringify({ error: 'Route non trouvée' }));
    }
});

// Démarrer le serveur
server.listen(PORT, () => {
    console.log(`✅ Serveur API démarré sur http://localhost:${PORT}`);
    console.log('Routes disponibles:');
    console.log('  GET    /api/posts');
    console.log('  GET    /api/posts/:id');
    console.log('  POST   /api/posts');
    console.log('  PUT    /api/posts/:id');
    console.log('  DELETE /api/posts/:id');
});
