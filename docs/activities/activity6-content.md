# Activité 6

**Wahid Hamdi** • Oct 16
**20 points** | Due Nov 6, 8:30 AM

---

## 22. Cloud local avec Floci

**106-** **Installez Floci**, émulateur AWS local open source, en tant que conteneur Docker et démarrez-le.
*docker run -d --name floci -p 4566:4566 floci/floci*
**README.md :** ajoutez la commande utilisée et le résultat de docker ps.

**107- Configurez l'AWS CLI** pour utiliser Floci comme **endpoint local** avec des identifiants fictifs :
*aws configure --profile floci*
*aws --profile floci --endpoint-url http://localhost:4566 sts get-caller-identity*

**108-** Créez un **bucket S3** local avec AWS CLI.
**README.md :** ajoutez la commande et le résultat.

**109-** Envoyez un fichier dans le bucket S3 puis récupérez-le.

**110-** Créez une **file de messages SQS** locale, envoyez un message de test puis lisez-le.

**111-** Créez une **table DynamoDB** locale et ajoutez quelques données.

**112-** Créez une **fonction Lambda** locale simple en Node.js et invoquez-la.

**113-** Stockez une valeur de démonstration dans **Secrets Manager** local.

**114-** Faites **communiquer** l'API Express avec au moins un **service Floci**, par exemple :
*POST /api/contact -> Express -> SQS (notification) / S3 (pièce jointe)*
**README.md :** ajoutez un schéma et une capture du résultat.

**115-** Ajoutez **Floci** dans votre environnement **Docker Compose**.

**116-** Utilisez Floci comme **service container** dans GitHub Actions pour exécuter les tests d'intégration sans compte AWS.

**117-** **Comparez** brièvement : **Floci**, **LocalStack** et **Cloud AWS** réel
**README.md :** ajoutez les différences principales (licence, services, fidélité, coût, usage en CI).

## 23. Introduction à Terraform

**118-** **Installez Terraform** et vérifiez son installation :
*terraform version*
**README.md :** ajoutez une capture d'écran.

**119-** Créez votre **premier projet** Terraform contenant :
*providers.tf*
*main.tf*
*variables.tf*
*outputs.tf*
**Configurez le provider AWS** pour utiliser les endpoints de Floci.

**120-** Exécutez :
*terraform init*
*terraform fmt*
*terraform validate*
*terraform plan*
**README.md :** ajoutez les commandes et une capture du résultat.

**121-** Utilisez Terraform pour **créer** automatiquement des **ressources** dans **Floci** :
*S3*
*SQS*
*DynamoDB*
**README.md :** ajoutez le fichier Terraform et le résultat de terraform apply.

**122-** **Vérifiez** avec AWS CLI que Terraform a correctement créé les ressources.

**123- Détruisez** les ressources avec :
*terraform destroy*
**README.md :** documentez le résultat.

## 24. Terraform avancé

**124-** **Transformez** votre configuration Terraform en **modules réutilisables**.

**125-** Créez des configurations séparées pour : *dev*, *staging* et *prod*

**126-** Expliquez le rôle du fichier **Terraform State**.
**README.md :** ajoutez une courte explication.

**127-** **Configurez** un backend distant S3 hébergé dans Floci pour stocker le state.

**128-** Activez le **verrouillage du state** et vérifiez qu'une deuxième exécution simultanée est bloquée.
**README.md :** ajoutez une capture du verrou.

**129-** Ajoutez **Checkov** ou **Trivy IaC** au pipeline pour analyser le code Terraform.

**130-** **Introduisez** volontairement une **mauvaise configuration** Terraform (bucket public, chiffrement désactivé…) et vérifiez que le pipeline la détecte.
**README.md :** ajoutez une capture du pipeline échoué.

**131-** Testez **OpenTofu** avec la même infrastructure et comparez-le à Terraform.

**132-** Utilisez **Terragrunt** sur un exemple afin de factoriser les configurations DEV/STAGING/PROD.

**133-** Découvrez **Pulumi** en recréant une petite ressource dans Floci avec un langage de programmation (TypeScript ou Python).
**README.md :** comparez Terraform, OpenTofu et Pulumi en quelques lignes.

## 25. Automatisation Terraform + Ansible

**134-** Utilisez **Terraform** pour créer l'infrastructure puis **Ansible** pour la configurer.
L'objectif est d'obtenir : *Terraform -> création infrastructure -> Ansible -> configuration serveur -> Docker / K3s*
**README.md :** ajoutez un schéma et une capture du résultat.

**135-** **Supprimez** toute l'infrastructure puis **reconstruisez**-la uniquement avec les scripts d'automatisation.
**README.md :** indiquez les commandes utilisées et le temps nécessaire pour reconstruire l'environnement.