# Guide de déploiement sur Vercel

Ce guide vous explique comment déployer votre application de messagerie instantanée sur Vercel pour obtenir une URL permanente.

## Prérequis

- Un compte Vercel (gratuit) - [Créer un compte](https://vercel.com/signup)
- Git installé sur votre machine

## Étapes de déploiement

1. **Téléchargez le projet préparé**
   - J'ai préparé tous les fichiers nécessaires pour le déploiement sur Vercel
   - Téléchargez le dossier complet du projet

2. **Créez un dépôt Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Connectez-vous à Vercel**
   - Allez sur [vercel.com](https://vercel.com) et connectez-vous
   - Cliquez sur "New Project"
   - Importez votre dépôt Git (GitHub, GitLab, Bitbucket) ou utilisez l'option "Import Third-Party Git Repository"

4. **Configurez le projet**
   - Sélectionnez le framework "Next.js"
   - Dans les variables d'environnement, ajoutez:
     - Nom: `DATABASE_URL`
     - Valeur: `file:./prisma/dev.db`
   - Cliquez sur "Deploy"

5. **Après le déploiement**
   - Vercel vous fournira une URL permanente pour votre application
   - Vous pourrez configurer un domaine personnalisé si vous le souhaitez

## Remarques importantes

- La base de données SQLite fonctionne pour le développement, mais pour un environnement de production, il est recommandé d'utiliser une base de données plus robuste comme PostgreSQL
- Vercel propose une intégration avec Vercel Postgres qui serait idéale pour cette application
- Pour les fonctionnalités en temps réel (Socket.io), vous devrez peut-être ajuster la configuration pour qu'elle fonctionne correctement avec Vercel Serverless Functions

## Support

Si vous rencontrez des problèmes lors du déploiement, n'hésitez pas à consulter la [documentation Vercel](https://vercel.com/docs) ou à contacter leur support.
