# Activité 3

**Wahid Hamdi** • Oct 14 (Edited Oct 16)
**20 points** | Due Oct 23, 8:30 AM

---

## VII. Automatisation avec Ansible

**25-** Installez Ansible sur une **VM dédiée à l'administration**.

**26-** Créez un **fichier inventory** contenant l'adresse IP de votre serveur Ubuntu et testez la communication avec :
*ansible all -m ping*

**README.md :** ajoutez le fichier inventory, la commande et une capture d'écran.

**27-** Créez un premier **playbook Ansible** permettant d'installer automatiquement un package Linux, par exemple curl ou git.
**README.md :** ajoutez le playbook et une capture d'écran de son exécution.

**28-** Créez un **playbook Ansible** permettant d'installer automatiquement Docker sur une nouvelle VM.
**README.md :** ajoutez le playbook et le résultat de docker --version.

## VIII. Création de l'API Node.js / Express

**29-** Créez un dossier api contenant une **application Node.js / Express**. L'API doit pouvoir être lancée indépendamment du frontend.
**README.md :** ajoutez la structure du projet et une capture du serveur démarré.

**30-** Créez une première route : **GET /api/health**
La route doit retourner un état indiquant que l'API fonctionne.
**README.md :** ajoutez une capture du résultat.

**31-** Créez une route : **GET /api/profile**
retournant les principales informations du Portfolio au format JSON.
**README.md :** ajoutez le résultat de l'appel API.

**32-** Créez une route : **GET /api/projects**
retournant la liste des projets du Portfolio.
**README.md :** ajoutez une capture du JSON retourné.

**33-** Créez une route : **GET /api/skills**
retournant la liste des compétences.
**README.md :** ajoutez une capture du résultat.

**34-** Modifiez le frontend Next.js pour **récupérer la liste des projets depuis l'API Express** au lieu d'utiliser uniquement des données locales.
**README.md :** ajoutez une courte explication et une capture du résultat.

**35-** Faites de même pour la liste des compétences.

## IX. Variables d'environnement et configuration

**36-** Configurez l'URL de l'API à l'aide d'une variable d'environnement : **API_URL**
**README.md :** expliquez brièvement pourquoi l'URL de l'API ne doit pas être codée en dur.

**37-** Créez un fichier d'exemple de variables d'environnement sans y placer de secret réel : **.env.example**
**README.md :** ajoutez son contenu.

## X. Dockerisation frontend + API

**38-** Créez un **Dockerfile** permettant de construire et exécuter le frontend Next.js.
**README.md :** ajoutez le Dockerfile et une courte explication.

**39-** Créez un deuxième **Dockerfile** permettant d'exécuter l'API Node.js / Express.
**README.md :** ajoutez le Dockerfile et une courte explication.

**40-** Construisez deux images Docker :
*devsecops-portfolio*
*devsecops-api*

**README.md :** ajoutez les commandes utilisées.

**41-** Créez un fichier **Docker Compose** permettant d'exécuter ensemble :
**frontend**
**api**

**README.md :** ajoutez le fichier Compose et le résultat de : *docker compose ps*

**42-** Vérifiez que le **frontend communique avec l'API** à travers le réseau Docker Compose.
**README.md :** ajoutez une capture du Portfolio affichant les données fournies par l'API.