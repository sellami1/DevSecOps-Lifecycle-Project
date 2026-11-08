# Activité 9

**Wahid Hamdi** • Oct 16
Due Nov 20, 8:30 AM

---

## 47. Progressive Delivery

**243-** Installez **Argo Rollouts**.

**244-** Déployez une nouvelle version de l'API avec une **stratégie Blue/Green**.

**245-** Déployez une nouvelle version avec une **stratégie Canary**.

**246-** Configurez une **progression de trafic** par étapes :
*10 % → 25 % → 50 % → 100 %*

**247-** Configurez un **rollback automatique** basé sur une **analyse Prometheus** lorsqu'un seuil d'erreurs est dépassé.
**README.md :** ajoutez une capture d'un rollback automatique.

**248-** Ajoutez un **Feature Flag** avec **OpenFeature** pour activer une fonctionnalité sans redéployer l'application.
**README.md :** expliquez la différence entre déploiement technique et activation fonctionnelle.

## 48. PostgreSQL Operator

**249-** Installez **CloudNativePG**.

**250-** Déployez PostgreSQL avec le **CloudNativePG Operator**.

**251-** Comparez : **PostgreSQL Deployment classique** et **CloudNativePG**

**252-** Configurez une **sauvegarde** de la base de données vers un **bucket S3 de Floci**.
**README.md :** ajoutez la preuve de sauvegarde.

## 49. Sauvegarde et Disaster Recovery

**253-** Installez **Velero** en utilisant un bucket S3 de Floci comme stockage des sauvegardes.

**254-** **Sauvegardez** le **namespace** du DevSecOps Portfolio.

**255-** Supprimez volontairement le namespace.

**256-** **Restaurez** l'application avec Velero.
**README.md :** ajoutez les preuves de sauvegarde et de restauration.

## 50. IAM et authentification

**257-** Installez **Keycloak**.

**258-** Configurez un **realm** et un client **OpenID Connect / OAuth2**.

**259-** Ajoutez une **authentification OIDC** au DevSecOps Portfolio.

**260-** Créez les rôles : **user**, **developer** et **admin**

**261-** **Protégez** au moins une **route** de l'API selon le rôle de l'utilisateur.
**README.md :** ajoutez un exemple d'accès autorisé et d'accès refusé.

## 51. Service Mesh

**262-** Installez **Istio** (comparez le à **Linkerd**) dans le cluster de laboratoire.

**263-** Activez **mTLS** entre les services frontend et backend.

**264-** Vérifiez que les **communications** frontend/backend sont **chiffrées**.

**265-** Créez une **règle de trafic** permettant de **distribuer les requêtes** entre deux versions de l'API.
**README.md :** comparez cette approche avec le *Canary d'Argo Rollouts*.

## 52. Sécurisation avancée de la CI/CD

**266-** Remplacez les credentials cloud statiques de GitHub Actions par **OIDC / Workload Identity Federation** lorsque le fournisseur utilisé le permet.
**README.md :** expliquez pourquoi un *token éphémère* est préférable à un *secret statique*.

**267-** Déployez des **self-hosted GitHub Actions Runners** dans Kubernetes (Actions Runner Controller).

**268-** Appliquez le principe du **moindre privilège** aux runners CI/CD : *namespace dédié*, *ServiceAccount limité*, *runners éphémères*.