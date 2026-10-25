# Activité 4

**Wahid Hamdi** • Oct 16
**20 points** | Due Oct 28, 8:30 AM

---

## 11. Infrastructure automatisée avec Vagrant + Ansible

**43-** Créez un **playbook** permettant de **déployer** automatiquement le DevSecOps Portfolio avec **Docker Compose** sur une VM.
**README.md :** ajoutez la commande ansible-playbook utilisée et une capture du Portfolio accessible.

**44-** Modifiez votre projet Vagrant pour **lancer automatiquement** le playbook Ansible après la création de la VM.
L'objectif est d'obtenir :
*vagrant up -> création VM -> configuration Ansible -> installation Docker -> déploiement Portfolio*

**README.md :** ajoutez une capture montrant l'automatisation complète.

**45- Détruisez** complètement la **VM** : *vagrant destroy*
Puis recréez-la avec : *vagrant up*
Vérifiez que le Portfolio est automatiquement redéployé.
**README.md :** documentez le test.

## 12. Évolution et sécurisation de l'API

**46-** Ajoutez à l'API une route : **POST /api/contact**
permettant au formulaire de contact du Portfolio d'envoyer des données au backend.
**README.md :** ajoutez un exemple de requête et de réponse.

**47-** **Connectez** le formulaire de contact **Next.js à l'API Express**.
**README.md :** ajoutez une capture d'un envoi réussi.

**48-** Ajoutez une **validation** stricte des données reçues par l'API avec **Zod**. Le backend doit refuser les données invalides.
**README.md :** ajoutez un exemple de requête refusée.

**49-** Ajoutez une **gestion centralisée des erreurs** côté API.
**README.md :** ajoutez un exemple de réponse d'erreur.

**50-** Ajoutez les **headers HTTP** de sécurité avec **Helmet** côté Express.
**README.md :** ajoutez le résultat de *curl -I* montrant les headers ajoutés.

**51-** Ajoutez un mécanisme de **rate limiting** sur les routes sensibles de l'API, en particulier *POST /api/contact*
**README.md :** ajoutez un exemple de réponse *429 Too Many Requests*.

**52-** Étudiez l'**OWASP API Security Top 10** et **identifiez les risques** qui concernent votre API.
**README.md :** ajoutez un tableau indiquant pour chaque risque retenu la mesure déjà mise en place ou prévue.

## 13. Base de données PostgreSQL

**53-** Ajoutez un **service PostgreSQL** dans le fichier **Docker Compose** du projet.
**README.md :** ajoutez le service Compose et le résultat de docker compose ps.

**54-** Modifiez l'API Express pour **enregistrer** les messages du formulaire **Contact** dans **PostgreSQL**.
**README.md :** ajoutez une capture des données enregistrées dans la table.

**55-** Ajoutez des **migrations** de base de données avec **Prisma**.
**README.md :** ajoutez la commande permettant d'exécuter les migrations.

**56-** Ajoutez les **variables de connexion** à la base de données dans *.env.example*

## 14. Tests applicatifs

**57-** Ajoutez au minimum un **test automatisé** pour le frontend Next.js.

**58-** Ajoutez au minimum un **test automatisé** pour une route de l'API Express.
**README.md :** ajoutez les commandes utilisées et une capture des tests réussis.

**59-** Ajoutez des **tests automatisés** contre les entrées invalides, les tentatives d'injection et les requêtes malformées.
**README.md :** ajoutez les résultats des tests.

**60-** Ajoutez des **tests d'intégration** vérifiant la chaîne :
*frontend -> API -> PostgreSQL*
**README.md :** ajoutez les commandes utilisées et une capture des tests réussis.

## 15. Jenkins : tests et images Docker

**61-** Modifiez Jenkins pour **exécuter automatiquement les tests** du frontend et de l'API.
**README.md :** ajoutez une capture des stages correspondants.

**62-** Ajoutez au pipeline Jenkins une étape permettant de **construire automatiquement les images** :
*devsecops-portfolio*
*devsecops-api*
**README.md :** ajoutez une capture.

**63-** Configurez Jenkins pour **utiliser le Git SHA** comme **tag** des images Docker :
*devsecops-portfolio:a1b2c3d*
*devsecops-api:a1b2c3d*
**README.md :** ajoutez un exemple d'images générées.

## 16. Pipeline DevSecOps Jenkins

**64-** Ajoutez au pipeline Jenkins une étape de **scan** des **secrets** avec **Gitleaks**.

**65-** Ajoutez une étape de **SAST** avec **Semgrep** pour analyser le code frontend et backend.

**66-** Ajoutez une étape de **contrôle des dépendances** Node.js (*npm audit*).

**67-** Ajoutez **OWASP Dependency-Check** en complément du **contrôle des packages** Node.js.
**README.md :** ajoutez un exemple de dépendance vulnérable détectée.

**68-** Ajoutez une étape de **scan** des images Docker avec **Trivy**.

**69-** Configurez le pipeline pour **échouer** lorsqu'une **vulnérabilité critique** ou un **secret** est détecté.
**README.md :** ajoutez une capture d'un pipeline réussi et d'un pipeline volontairement échoué.