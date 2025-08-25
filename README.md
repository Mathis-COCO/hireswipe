# MESSAGE AU JURY D'YNOV :
La version du code présente dans le Zip n'est pas la version finale du projet conformément au message d'Aurore DUGUET. 
Dans le cadre de la notation du bloc 2, veuillez effectuer un git pull sur la branche main pour avoir la dernière version stable du projet, ou, vous connecter à la version déployée sur le lien suivant :
(attention : le premier appel au backend va prendre du temps car le serveur Render est en pause au bout de 15min d'inactivité et doit démarrer)

## [Disponible ici !](https://hireswipe-neon.vercel.app/)

# HireSwipe

## Sommaire

- [Historique des versions (Changelog)](#historique-des-versions-changelog)
- [Présentation](#présentation)
- [Prérequis](#prérequis)
- [Installation et lancement](#installation-et-lancement)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Base de données Postgres](#base-de-données-postgres)
- [Lancement avec Docker](#lancement-avec-docker)
- [Variables d'environnement](#variables-denvironnement)
- [Lancer les tests avec coverage](#lancer-les-tests-avec-coverage)
- [Cahier des recettes](#cahier-des-recettes)
- [Plan de correction et détection des bugs](#plan-de-correction-et-détection-des-bugs)
- [Protocole de déploiement continu](#protocole-de-déploiement-continu)
- [Critères de qualité et de performance](#critères-de-qualité-et-de-performance)
- [Protocole d'intégration continue](#protocole-dintégration-continue)

---

## Historique des versions (Changelog)

| Date      | Version / Fonctionnalités                                                                                                         |
|-----------|-----------------------------------------------------------------------------------------------------------------------------------|
| **05 août**  | - Mise en place du projet frontend (React) et backend (NestJS)<br>- Liaison entre front et back<br>- Ajout du système de login et register avec JWT<br>- Mise en place du router (navigation) |
| **10 août**  | - Ajout de l'onboarding pour les clients<br> • Onboarding candidat :<br>  - Informations personnelles<br>  - Localisation & Mobilité<br>  - Expérience professionnelle<br>  - Compétences techniques<br>  - Compétences humaines<br>  - Préférences<br>  - Photo de profil<br>  - Résumé<br> • Onboarding entreprise :<br>  - Informations entreprise<br>  - Détails<br>  - Localisation<br>  - Présentation entreprise<br>  - Logo entreprise<br>  - Résumé<br>- Redirection vers l'application après onboarding<br>- Protection des routes (authentification requise)<br>- Création de la navbar de l'application |
| **15 août**  | - Ajout de la page d'ajout d'offre<br>- Ajout de la page de visualisation des offres<br>- Modification des offres<br>- Modification des paramètres de l'onboarding |
| **19 août**  | - Ajout de la fonctionnalité de matchs :<br> • Quand un recruteur valide la demande d'un utilisateur<br> • Mise à jour des statuts des candidatures <br>Ajout de la page de consultation des candidatures des offres <br>- Ajout du feed candidat<br>- Ajout de la réception des likes dans la page des offres <br>Ajout de la page de visualisation du profil du candidat<br> |
| **21 août**  | - Visualisation du profil connecté<br>- Modification des champs du profil<br>- Refonte visuelle du feed utilisateur |
| **23 août ~1:00AM**  | V1.0.0 <br> - Visualisation des matchs<br>- visualisation des profils utilisateurs avec lesquels l'utilisateur connecté a match<br>- Sécurisation du routing |
| **26 août**  | V1.1.0 <br> - Swipes fonctionnels |

---

<p align="center">
  <img src="HireSwipeLogo.png" alt="HireSwipe Logo" width="200"/>
</p>

## Présentation

HireSwipe est une application web permettant aux candidats et entreprises de se rencontrer via un système de "swipe" sur des offres d'emploi. Elle se compose d'un backend NestJS, d'un frontend React et d'une base de données PostgreSQL.

---

## Prérequis

- Node.js >= 18
- npm >= 9
- Docker & Docker Compose
- PostgreSQL (si non utilisé via Docker)

---

## Installation et lancement

### Backend

```bash
cd backend
npm install
# Créez un fichier .env (voir section Variables d'environnement)
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Base de données Postgres

Vous pouvez lancer un conteneur Postgres avec Docker :

```bash
docker run --name hireswipe-postgres -e POSTGRES_USER=hireswipe -e POSTGRES_PASSWORD=hireswipe -e POSTGRES_DB=hireswipe -p 5432:5432 -d postgres:15
```

---

## Lancement avec Docker

Un exemple de lancement complet avec Docker Compose :

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: hireswipe
      POSTGRES_PASSWORD: hireswipe
      POSTGRES_DB: hireswipe
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_USER: hireswipe
      DATABASE_PASSWORD: hireswipe
      DATABASE_NAME: hireswipe
      JWT_SECRET: votresecret
    depends_on:
      - postgres
    ports:
      - "3000:3000"

  frontend:
    build: ./frontend
    ports:
      - "4200:4200"
    depends_on:
      - backend

volumes:
  pgdata:
```

Lancez l'ensemble :

```bash
docker-compose up --build
```

---

## Variables d'environnement

### Backend (.env)

> **Attention** :  
> Si vous lancez le backend en local (sans Docker), utilisez `DATABASE_HOST=localhost`.  
> Si vous lancez le backend avec Docker Compose, utilisez `DATABASE_HOST=postgres` (nom du service Postgres dans le docker-compose).

**Exemple pour Docker Compose :**
```
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=hireswipe
DATABASE_PASSWORD=hireswipe
DATABASE_NAME=hireswipe
JWT_SECRET=un_secret_pour_le_jwt
```

**Exemple pour un lancement local :**
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=hireswipe
DATABASE_PASSWORD=hireswipe
DATABASE_NAME=hireswipe
JWT_SECRET=un_secret_pour_le_jwt
```

### Frontend

Le frontend utilise généralement les variables via `.env` ou directement dans le code pour l'URL du backend :

```
REACT_APP_API_URL=http://localhost:3000
```

---

## Lancer les tests avec coverage

### Backend

```bash
cd backend
npm run test
npm run test:cov
```

### Frontend

```bash
cd frontend
npm run test
npm run test:cov
```

---

## Cahier des recettes

### Authentification

- [x] Création de compte candidat/entreprise
- [x] Connexion/déconnexion
- [x] Redirection après login

### Onboarding

- [x] Saisie des informations personnelles/entreprise
- [x] Validation des étapes
- [x] Sauvegarde du progrès

### Offres

- [x] Création/modification/suppression d'offres (entreprise)
- [x] Swipe sur les offres (candidat)
- [x] Visualisation des candidats (entreprise) de l'offre
- [ ] filtrer les offres en fonction des paramètres du candidat
- [ ] filtrer les annonces par distance

### Profil

- [x] visualiser et modifier mon profil
- [x] visualiser le profil d'un candidat spécifique d'une offre
- [ ] visualiser le profil d'un recruteur après un match

### Matchs

- [x] Création d'un match lors d'un swipe réciproque
- [x] Affichage des matchs
- [ ] Messagerie
- [ ] Feed recruteur pour envoyer des like avec des annonces rattachées pour proposer un recrutement 

### Tests

- [x] Couverture des services backend

---

## Plan de correction et détection des bugs

1. **Détection**
   - Utiliser la couverture de tests (`npm run test:cov`)
   - Activer le mode debug (`npm run start:dev`)
   - Vérifier les logs d'erreur dans la console et dans les conteneurs Docker

2. **Correction**
   - Reproduire le bug localement
   - Ajouter un test unitaire ou d'intégration pour le cas défaillant
   - Corriger le code et vérifier que le test passe
   - Documenter la correction dans le changelog

3. **Outils**
   - ESLint/Prettier pour la qualité du code
   - Sentry ou équivalent pour la collecte des erreurs en production
   - CI/CD avec tests automatiques

---

## Protocole de déploiement continu

Le déploiement continu est automatisé via Github Actions :

- **Backend** : déployé automatiquement sur [Render](https://render.com) à chaque push sur la branche principale. Render détecte les changements et lance le build puis le déploiement du serveur NestJS.
- **Frontend** : déployé automatiquement sur [Vercel](https://vercel.com) à chaque push sur la branche principale. Vercel build le projet React et le met en ligne.
- **Base de données** : la base PostgreSQL est hébergée sur [Neon](https://neon.tech), service cloud scalable. Les variables d'environnement du backend sont configurées pour pointer vers Neon.

**Étapes principales :**
1. Push sur Github (branche principale).
2. Github Actions déclenche le workflow CI/CD.
3. Render déploie le backend, Vercel déploie le frontend.
4. La base Neon reste accessible et persistante.

---

## Critères de qualité et de performance

- **Qualité du code**
  - Utilisation de ESLint et Prettier pour le linting et le formatage.
  - Revue de code avant chaque merge (Pull Request).
  - Tests unitaires et d'intégration avec couverture (`npm run test:cov`).
  - Documentation des endpoints et des composants.
- **Performance**
  - Backend NestJS optimisé pour la rapidité des requêtes (pagination, index sur la BDD).
  - Frontend React optimisé (lazy loading, code splitting).
  - Monitoring des temps de réponse via les outils Render/Vercel.
  - Utilisation de Neon pour une base scalable et rapide.
- **Sécurité**
  - Gestion des tokens JWT.
  - Validation des entrées utilisateur.
  - Variables d'environnement sécurisées (jamais commit dans le repo).
- **Accessibilité**
  - Respect des critères RGAA (Référentiel Général d'Amélioration de l'Accessibilité) grâce à l'utilisation d'une extension dédiée pour vérifier et améliorer l'accessibilité de l'application.

---

## Protocole d’intégration continue

L'intégration continue est assurée par Github Actions :

- À chaque push ou pull request :
  - Lancement des tests backend et frontend.
  - Vérification du linting.
  - Génération du rapport de couverture.
  - Build du projet pour s'assurer qu'il compile.
- Si tous les tests passent, le déploiement continu est déclenché (voir section précédente).
- Les erreurs sont remontées dans Github (checks).

**Exemple de workflow CI :**
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Lint
        run: npm run lint
      - name: Test
        run: npm run test
      - name: Coverage
        run: npm run test:cov
```

---

## Support


Pour toute question provenant du jury chargé de la notation du projet, vous pouvez me contacter via mail à sur mon adresse Ynov ou via Microsoft Teams.




