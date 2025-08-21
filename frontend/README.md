# Frontend HireSwipe

## Installation

```bash
npm install
```

## Lancement

```bash
npm start
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000) ou [http://localhost:4200](http://localhost:4200) si lancée via Docker.

## Variables d'environnement

Créez un fichier `.env` à la racine du frontend si besoin :

```
REACT_APP_API_URL=http://localhost:3000
```

## Lancer les tests avec coverage

```bash
npm test -- --coverage
```

## Correction et détection des bugs

- Utilisez la console du navigateur pour les erreurs JS.
- Vérifiez les logs du terminal lors du lancement.
- Ajoutez des tests unitaires pour chaque bug corrigé.
- Utilisez ESLint pour détecter les erreurs de syntaxe.

## Recettes principales

- Authentification utilisateur
- Onboarding candidat/entreprise
- Création et visualisation des offres
- Swipe et match

## Scripts disponibles

Dans le dossier du projet, vous pouvez exécuter :

### `npm start`

Lance l'application en mode développement.\
Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application dans le navigateur.

La page se rechargera si vous modifiez le code.\
Vous verrez également les erreurs de lint dans la console.

### `npm test`

Lance le test runner en mode interactif.\
Voir la section sur [les tests](https://facebook.github.io/create-react-app/docs/running-tests) pour plus d'informations.

### `npm run build`

Construit l'application pour la production dans le dossier `build`.\
Optimise le build pour la meilleure performance.

Le build est minifié et les noms de fichiers incluent les hash.\
Votre application est prête à être déployée !

Voir la section sur [le déploiement](https://facebook.github.io/create-react-app/docs/deployment) pour plus d'informations.

### `npm run eject`

**Attention : cette opération est irréversible. Une fois que vous avez éjecté, vous ne pouvez pas revenir en arrière !**

Si vous n'êtes pas satisfait des choix de configuration, vous pouvez éjecter à tout moment. Cette commande copie tous les fichiers de configuration et les dépendances dans votre projet afin que vous ayez un contrôle total.

Vous n'avez jamais besoin d'utiliser `eject`. La configuration par défaut convient à la plupart des projets.

## Pour en savoir plus

Vous pouvez consulter la documentation [Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

Pour apprendre React, consultez la documentation [React](https://reactjs.org/).
