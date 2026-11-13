# TP Node.js - API REST

TP d'initiation à Node.js pour créer une API REST de gestion de posts.

## Structure du projet

```
tp-nodejs-api/
├── seed.js              # Script de récupération des données
├── posts.json           # Fichier de données (généré)
├── server.js            # Serveur API REST
├── postManager.js       # Module de gestion des posts
├── api-tests.http       # Tests REST Client
├── client/
│   └── index.html       # Interface web
└── package.json         # Configuration du projet
```

## Démarrage

### 1. Récupérer les données

```bash
node seed.js
```

### 2. Démarrer le serveur

```bash
node server.js
```

Le serveur démarre sur `http://localhost:3000`

### 3. Tester l'API

**Option A : REST Client (VS Code)**
- Installez l'extension "REST Client"
- Ouvrez `api-tests.http`
- Cliquez sur "Send Request"

**Option B : Interface web**
- Ouvrez `client/index.html` dans le navigateur

**Option C : PowerShell**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/posts"
```

## Routes API

| Méthode | Route             | Description              |
|---------|-------------------|--------------------------|
| GET     | /api/posts        | Tous les posts           |
| GET     | /api/posts/:id    | Un post par ID           |
| POST    | /api/posts        | Créer un post            |
| PUT     | /api/posts/:id    | Modifier un post         |
| DELETE  | /api/posts/:id    | Supprimer un post        |

## Format des données

```json
{
  "id": 1,
  "userId": 1,
  "title": "Titre du post",
  "body": "Contenu du post"
}
```
