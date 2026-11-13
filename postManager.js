// postManager.js
const fs = require('fs');
const path = require('path');

const POSTS_FILE = path.join(__dirname, 'posts.json');

// Lire tous les posts
function getAllPosts(callback) {
    fs.readFile(POSTS_FILE, 'utf8', (err, data) => {
        if (err) {
            return callback(err, null);
        }
        try {
            const posts = JSON.parse(data);
            callback(null, posts);
        } catch (parseError) {
            callback(parseError, null);
        }
    });
}

// Obtenir un post par ID
function getPost(id, callback) {
    getAllPosts((err, posts) => {
        if (err) {
            return callback(err, null);
        }
        
        const post = posts.find(p => p.id === parseInt(id));
        
        if (!post) {
            return callback(new Error('Post non trouvé'), null);
        }
        
        callback(null, post);
    });
}

// Insérer un nouveau post
function insertPost(newPost, callback) {
    getAllPosts((err, posts) => {
        if (err) {
            return callback(err, null);
        }
        
        // Générer un nouvel ID (max ID + 1)
        const maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);
        const postToInsert = {
            id: maxId + 1,
            ...newPost
        };
        
        posts.push(postToInsert);
        
        savePosts(posts, (saveErr) => {
            if (saveErr) {
                return callback(saveErr, null);
            }
            callback(null, postToInsert);
        });
    });
}

// Mettre à jour un post
function updatePost(id, updatedPost, callback) {
    getAllPosts((err, posts) => {
        if (err) {
            return callback(err, null);
        }
        
        const postIndex = posts.findIndex(p => p.id === parseInt(id));
        
        if (postIndex === -1) {
            return callback(new Error('Post non trouvé'), null);
        }
        
        // Mettre à jour le post en conservant l'ID
        posts[postIndex] = {
            ...posts[postIndex],
            ...updatedPost,
            id: parseInt(id) // S'assurer que l'ID ne change pas
        };
        
        savePosts(posts, (saveErr) => {
            if (saveErr) {
                return callback(saveErr, null);
            }
            callback(null, posts[postIndex]);
        });
    });
}

// Supprimer un post
function deletePost(id, callback) {
    getAllPosts((err, posts) => {
        if (err) {
            return callback(err, null);
        }
        
        const postIndex = posts.findIndex(p => p.id === parseInt(id));
        
        if (postIndex === -1) {
            return callback(new Error('Post non trouvé'), null);
        }
        
        const deletedPost = posts[postIndex];
        posts.splice(postIndex, 1);
        
        savePosts(posts, (saveErr) => {
            if (saveErr) {
                return callback(saveErr, null);
            }
            callback(null, deletedPost);
        });
    });
}

// Fonction utilitaire pour sauvegarder les posts
function savePosts(posts, callback) {
    const data = JSON.stringify(posts, null, 2);
    
    fs.writeFile(POSTS_FILE, data, 'utf8', (err) => {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// Exporter les fonctions
module.exports = {
    getAllPosts,
    getPost,
    insertPost,
    updatePost,
    deletePost
};
