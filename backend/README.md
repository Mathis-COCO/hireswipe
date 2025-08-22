<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Backend HireSwipe

## Installation

```bash
npm install
```

## Lancement

```bash
# développement
npm run start:dev

# production
npm run start:prod
```

## Variables d'environnement

Créez un fichier `.env` à la racine du backend :

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=hireswipe
DATABASE_PASSWORD=hireswipe
DATABASE_NAME=hireswipe
JWT_SECRET=un_secret_pour_le_jwt
```

## Lancer les tests avec coverage

```bash
npm run test
npm run test:cov
```

> **Remarque :**  
> Si le fichier `README.md` apparaît dans le rapport de coverage, c'est probablement parce qu'il est inclus par erreur dans la configuration de collecte de couverture.  
> Pour l'exclure, vérifiez le champ `collectCoverageFrom` dans le fichier `jest.config.js` et assurez-vous qu'il ne contient pas de règle incluant les fichiers `.md` ou le dossier racine.

Exemple dans `jest.config.js` :
```js
collectCoverageFrom: [
  '**/*.ts',
  '!**/*.module.ts',
  '!**/*.entity.ts',
  '!**/*.dto.ts',
  '!**/*.interface.ts',
  '!**/jwt.strategy.ts',
  '!main.ts',
  '!../README.md', // Ajoutez cette ligne pour exclure explicitement le README
],
```

## Correction et détection des bugs

- Vérifiez les logs du serveur dans le terminal.
- Utilisez les tests unitaires pour reproduire et corriger les bugs.
- Ajoutez des tests pour chaque correction.
- Utilisez ESLint pour la qualité du code.

## Recettes principales

- Authentification JWT
- Onboarding candidat/entreprise
- Gestion des offres et des matchs
- API REST sécurisée
- Vérifiez les logs du serveur dans le terminal.
- Utilisez les tests unitaires pour reproduire et corriger les bugs.
- Ajoutez des tests pour chaque correction.
- Utilisez ESLint pour la qualité du code.

## Recettes principales

- Authentification JWT
- Onboarding candidat/entreprise
- Gestion des offres et des matchs
- API REST sécurisée
