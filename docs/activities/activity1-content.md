# Activité 1

**Auteur :** Wahid Hamdi  
**Date :** 23 septembre (modifiée le 7 octobre)  
**Barème :** 20 points

## I. Mise en place initiale

### 1. Installer Ubuntu Server

Installez **Ubuntu Server 26.04** et configurez un accès distant sécurisé via **SSH**.

### 2. Tester l'accès SSH

Testez l'accès SSH à la machine virtuelle depuis la machine physique.

**À documenter dans `README.md` :** configuration de l'accès SSH et capture d'écran.

### 3. Installer Docker

Installez **Docker** sur la machine virtuelle.

**À documenter dans `README.md` :** étapes d'installation et capture d'écran.

### 4. Installer Jenkins

Installez **Jenkins** en tant que service et vérifiez son bon fonctionnement depuis la machine physique.

**À documenter dans `README.md` :** étapes d'installation et capture d'écran.

### 5. Créer un mini-CV

Créez un mini-CV d'une page avec **HTML5, CSS3 et JavaScript**, dans un dossier géré avec Git, puis fournissez le lien GitHub.

**À documenter dans `README.md` :** capture d'écran du CV.

### 6. Activer les push GitHub via SSH

1. Ouvrez **GitHub → Settings → SSH and GPG keys**.
2. Cliquez sur **New SSH key**, nommez la clé et collez votre clé publique.
3. Enregistrez la clé.
4. Testez la connexion avec `ssh -T git@github.com`.
5. Configurez le dépôt local pour utiliser SSH.

**À documenter dans `README.md` :** commandes exécutées et captures d'écran associées.

## II. Évolution du mini-CV vers un DevSecOps Portfolio

### 7. Faire évoluer le mini-CV

Transformez le mini-CV en une petite application **DevSecOps Portfolio** comprenant au minimum les sections suivantes :

- About
- Skills
- Projects
- Experience
- Contact

**À documenter dans `README.md` :** capture d'écran de la nouvelle version et brève description des principales améliorations.

### 8. Ajouter les compétences DevSecOps

Ajoutez une section **DevSecOps Skills** présentant les technologies utilisées pendant le projet :

- Git
- Docker
- Jenkins
- Kubernetes
- Ansible
- Terraform
- Argo CD

**À documenter dans `README.md` :** capture d'écran.

### 9. Générer les projets dynamiquement

Ajoutez une section **Projects** générée en JavaScript à partir d'un tableau d'objets.

**À documenter dans `README.md` :** extrait du code JavaScript et capture d'écran du résultat.

## III. Dockerisation initiale

### 10. Créer un Dockerfile

Créez un `Dockerfile` qui sert le DevSecOps Portfolio avec Nginx.

**À documenter dans `README.md` :** contenu du Dockerfile et courte explication.

### 11. Construire l'image Docker

Construisez une image Docker nommée `cv-docker`.

**À documenter dans `README.md` :** commande utilisée et capture d'écran du résultat.

### 12. Exécuter un conteneur

Exécutez un conteneur en exposant le Portfolio sur un port accessible, puis vérifiez l'accès depuis la machine physique.

**À documenter dans `README.md` :** commande `docker run`, résultat de `docker ps` et capture d'écran.

### 13. Déployer avec Docker Compose

Déployez le Portfolio avec Docker Compose :

```sh
docker compose up -d
```

**À documenter dans `README.md` :** commande utilisée, résultat de `docker compose ps` et capture d'écran.

### 14. Publier les modifications sur GitHub

Publiez les modifications du projet sur GitHub via SSH.

**À documenter dans `README.md` :** commandes Git utilisées et lien du dépôt GitHub mis à jour.

## IV. Première introduction à l'automatisation

### 15. Installer Vagrant et créer une machine virtuelle

Installez **Vagrant** dans la machine virtuelle et créez un premier `Vagrantfile` permettant de créer automatiquement une machine virtuelle Ubuntu Server. Vérifiez que la machine virtuelle dispose de suffisamment de mémoire vive et d'espace disque.

**À documenter dans `README.md` :** contenu du `Vagrantfile`, commande `vagrant up` et capture d'écran.

### 16. Se connecter à la machine virtuelle Vagrant

Depuis la machine virtuelle, connectez-vous à la machine créée par Vagrant avec :

```sh
vagrant ssh
```

**À documenter dans `README.md` :** capture d'écran et comparaison avec la création manuelle d'une machine virtuelle.

### 17. Configurer la machine virtuelle automatiquement

Modifiez le `Vagrantfile` pour configurer automatiquement :

- le nom de la machine virtuelle ;
- l'adresse IP privée ;
- la mémoire ;
- le nombre de CPU.

**À documenter dans `README.md` :** configuration utilisée et résultat de `vagrant status`.