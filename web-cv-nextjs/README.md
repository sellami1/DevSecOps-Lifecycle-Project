# DevSecOps Portfolio — Next.js

Version Next.js du portfolio HTML/CSS/JavaScript situé dans `../web-cv/`. La page d'accueil conserve les sections About, Experience, Projects, Skills et Contact, avec thème clair/sombre, impression et barre de progression.

## Création et lancement

Commande de création équivalente utilisée pour initialiser l'architecture App Router :

```bash
npx create-next-app@latest web-cv-nextjs --js --eslint --app --no-src-dir --no-tailwind --import-alias "@/*"
```

Depuis ce dossier, installer les dépendances et lancer le serveur :

```bash
npm install
npm run dev
```

Ouvrir `http://localhost:3000`. Pour vérifier une version de production :

```bash
npm run build
npm start
```

## Déploiement Docker

Le `Dockerfile` utilise une construction multi-étapes. Next.js génère une sortie `standalone`, puis l'image finale exécute uniquement le serveur de production sur le port `3000` sous un utilisateur non-root.

Depuis ce dossier, construire puis démarrer le conteneur :

```bash
docker build -t web-cv-nextjs:1.0 .
docker run -d --name web-cv-nextjs --restart unless-stopped -p 3000:3000 web-cv-nextjs:1.0
```

Ouvrir `http://localhost:3000`. Pour vérifier son état et consulter les logs :

```bash
docker ps --filter name=web-cv-nextjs
docker logs -f web-cv-nextjs
```

Pour arrêter puis supprimer le conteneur avant un nouveau déploiement :

```bash
docker rm -f web-cv-nextjs
```

Sur une VM, remplacer `localhost` par son adresse IP et autoriser le port `3000` dans le pare-feu. Le premier `docker build` peut télécharger l'image Node et les dépendances npm requises.

## Composants réutilisables

```text
app/
  layout.jsx                 Layout partagé, métadonnées et styles globaux
  page.jsx                   Page d'accueil du portfolio
  projects/page.jsx          Liste complète des projets (/projects)
  projects/[slug]/page.jsx   Détail dynamique (/projects/project-name)
components/
  Header.jsx                 Navigation, thème et impression
  About.jsx                  Présentation et profil
  Experience.jsx             Formation et expérience
  Skills.jsx                 Compétences DevSecOps
  Projects.jsx               Grille de projets réutilisée sur l'accueil et la liste
  Contact.jsx                Coordonnées et prise de contact
  Footer.jsx                 Pied de page
  ProgressBar.jsx            Indicateur de défilement
data/
  projects.js                Données des cartes et pages projet
  skills.js                  Liste et description des compétences
```

## Données séparées

Les projets sont définis dans `data/projects.js` ; le champ `slug` alimente automatiquement les routes de détail.

```js
{
  slug: 'secure-ci-cd-pipeline',
  title: 'Secure CI/CD Pipeline',
  tools: ['Jenkins', 'Docker', 'Git']
}
```

Les compétences sont déclarées séparément dans `data/skills.js` et affichées par le composant `Skills`.

## Captures d'écran

Capturer les pages depuis le navigateur après `npm run dev`, puis enregistrer les images dans `../screenshots/` :

- Accueil (`http://localhost:3000`) : `screenshots/nextjs-home.png`
- Liste des projets (`http://localhost:3000/projects`) : `screenshots/nextjs-projects.png`
- Détail (`http://localhost:3000/projects/secure-ci-cd-pipeline`) : `screenshots/nextjs-project-detail.png`

Les captures restent à réaliser dans l'environnement navigateur ; aucun screenshot Next.js n'est inclus pour l'instant.