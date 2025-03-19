# Documentation de l'Application de Messagerie Instantanée

## Architecture de l'Application

### Vue d'ensemble
L'application de messagerie instantanée est construite avec une architecture moderne basée sur Next.js pour le frontend et le backend, avec SQLite comme base de données. Cette architecture permet une expérience utilisateur fluide et réactive tout en garantissant la sécurité des communications.

### Structure du Projet
```
chat-app/
├── src/
│   ├── app/                    # Routes et API Next.js
│   │   ├── api/                # Points d'entrée API
│   │   │   ├── auth/           # Authentification
│   │   │   ├── contacts/       # Gestion des contacts
│   │   │   ├── conversations/  # Gestion des conversations
│   │   │   ├── messages/       # Gestion des messages
│   │   │   └── users/          # Gestion des utilisateurs
│   ├── components/             # Composants React réutilisables
│   │   ├── auth/               # Composants d'authentification
│   │   ├── chat/               # Composants de l'interface de chat
│   │   └── ui/                 # Composants UI génériques
│   ├── hooks/                  # Hooks React personnalisés
│   ├── lib/                    # Bibliothèques et utilitaires
│   │   ├── encryption.js       # Fonctions de chiffrement
│   │   ├── prisma.js           # Client Prisma pour la base de données
│   │   ├── security.js         # Fonctions de sécurité
│   │   └── rate-limit.js       # Limitation de débit pour la sécurité
│   └── pages/                  # Pages spécifiques (API Socket.io)
├── prisma/                     # Configuration Prisma
│   └── schema.prisma           # Schéma de la base de données
├── public/                     # Fichiers statiques
├── tests/                      # Tests unitaires et d'intégration
└── middleware.js               # Middleware pour la sécurité
```

### Pile Technologique
- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes, Socket.io
- **Base de données**: SQLite avec Prisma ORM
- **Authentification**: NextAuth.js
- **Sécurité**: Crypto-js, bcryptjs, en-têtes de sécurité HTTP
- **Tests**: Vitest

### Modèle de Données
Le schéma de la base de données comprend les entités suivantes:
- **User**: Informations sur les utilisateurs (identifiants, profils)
- **Session**: Sessions d'authentification
- **Contact**: Relations entre utilisateurs
- **Conversation**: Groupes de discussion
- **Participation**: Participation des utilisateurs aux conversations
- **Message**: Messages échangés dans les conversations

### Flux de Communication
1. Les utilisateurs s'authentifient via NextAuth.js
2. Les communications en temps réel sont gérées par Socket.io
3. Les messages sont chiffrés de bout en bout avec Crypto-js
4. Les données sont persistées dans la base de données SQLite via Prisma

## Mesures de Sécurité

### Authentification
- Hachage des mots de passe avec bcryptjs
- Sessions sécurisées avec JWT
- Protection contre les attaques par force brute

### Chiffrement des Messages
- Chiffrement AES pour les messages
- Génération de clés de chiffrement uniques par conversation
- Hachage sécurisé avec SHA-256

### Protection contre les Attaques
- Limitation de débit pour prévenir les attaques DDoS
- Validation et assainissement des entrées utilisateur
- Protection contre les injections SQL
- Protection contre les attaques XSS
- En-têtes de sécurité HTTP (CSP, X-Frame-Options, etc.)

### HTTPS
- Configuration de Strict Transport Security
- Politique de référence stricte
- Protection contre le MIME sniffing

## API Backend

### Authentification
- `POST /api/auth/[...nextauth]` - Authentification utilisateur

### Utilisateurs
- `GET /api/users` - Récupérer la liste des utilisateurs
- `POST /api/users` - Créer un nouvel utilisateur

### Contacts
- `GET /api/contacts` - Récupérer les contacts d'un utilisateur
- `POST /api/contacts` - Ajouter un nouveau contact

### Conversations
- `GET /api/conversations` - Récupérer les conversations d'un utilisateur
- `POST /api/conversations` - Créer une nouvelle conversation

### Messages
- `GET /api/messages` - Récupérer les messages d'une conversation
- `POST /api/messages` - Envoyer un nouveau message

### WebSockets
- `/api/socket` - Point d'entrée pour les communications en temps réel
