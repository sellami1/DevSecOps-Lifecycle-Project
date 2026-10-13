# Activité 2

**Auteur :** Wahid Hamdi  
**Date :** 7 octobre  
**Barème :** 20 points

## V. Migration du Portfolio vers Next.js

### 18. Créer une version Next.js

Créez une nouvelle version du DevSecOps Portfolio avec **Next.js**. Conservez au minimum les mêmes sections que dans la version HTML/CSS/JavaScript.

**À documenter dans `README.md` :** commande de création du projet et capture d'écran de l'application.

### 19. Créer des composants réutilisables

Transformez les principales parties du Portfolio en composants réutilisables :

- Header
- About
- Skills
- Projects
- Contact
- Footer

**À documenter dans `README.md` :** structure des composants.

### 20. Séparer les données

Déplacez les informations des projets et des compétences dans des fichiers de données ou des objets JavaScript séparés.

**À documenter dans `README.md` :** exemple de données utilisées.

### 21. Ajouter une page dédiée à un projet

Ajoutez une page dédiée à l'affichage d'un projet du Portfolio, avec les routes suivantes :

- `/projects`
- `/projects/project-name`

**À documenter dans `README.md` :** capture d'écran.

## VI. Premier pipeline Jenkins

### 22. Créer un premier pipeline Jenkins

Créez un premier **Jenkins Pipeline** capable de récupérer automatiquement le dépôt GitHub du DevSecOps Portfolio.

**À documenter dans `README.md` :** `Jenkinsfile` et capture d'écran du pipeline exécuté.

### 23. Installer les dépendances dans le pipeline

Ajoutez au pipeline une étape permettant d'installer les dépendances du projet Next.js.

**À documenter dans `README.md` :** capture d'écran du stage correspondant.

### 24. Construire l'application dans le pipeline

Ajoutez au pipeline une étape permettant de construire automatiquement l'application Next.js.

**À documenter dans `README.md` :** capture d'écran du résultat du build.