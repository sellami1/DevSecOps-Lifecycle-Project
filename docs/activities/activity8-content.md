# Activité 8

**Wahid Hamdi** • Oct 16
**20 points** | Due Nov 18, 8:30 AM

---

## 36. Helm

**190-** Installez **Helm** et vérifiez son installation.

**191-** **Transformez** les **manifests Kubernetes** du frontend et de l'API en un **Helm Chart**.
**README.md :** ajoutez la structure du chart et le résultat de : *helm lint*

**192-** Placez dans **values.yaml** au minimum :
*frontend image*
*frontend tag*
*api image*
*api tag*
*replicas*
*ingress*
*resources*

**193-** **Déployez** l'application avec : **helm install**
**README.md :** ajoutez la commande utilisée et une capture.

**194-** Modifiez le nombre de replicas via **values.yaml** puis exécutez :
*helm upgrade*
**README.md :** ajoutez le résultat de *kubectl get pods*

**195-** Revenez à la version précédente avec : **helm rollback**
**README.md :** ajoutez le résultat de *helm history*

## 37. Kustomize

**196-** Créez une **structure Kustomize** contenant :
*base/*
*overlays/dev/*
*overlays/staging/*
*overlays/prod/*

**197-** Configurez :
*DEV → 1 replica frontend + 1 replica API*
*STAGING → 2 replicas*
*PROD → plusieurs replicas*

**198-** Configurez des **valeurs différentes** de **API_URL** selon l'environnement.

**199-** Déployez l'**environnement DEV** avec :
*kubectl apply -k overlays/dev*
**README.md :** ajoutez la structure des fichiers et une capture.

**200-** Comparez : **Helm** et **Kustomize**

## 38. Images du registre et contrôle avant déploiement

**201-** Modifiez les manifests Kubernetes afin d'utiliser les **images de Harbor** au lieu d'images construites localement.

**202-** Configurez un **imagePullSecret** utilisant un **robot account Harbor** en lecture seule.

**203-** Ajoutez une **policy Kyverno verifyImages** qui vérifie la **signature Cosign** des images avant leur déploiement dans Kubernetes.

**204-** Tentez de déployer une **image non signée** et vérifiez qu'elle est refusée.
**README.md :** ajoutez le message de refus.

## 39. GitOps avec Argo CD

**205-** Installez **Argo CD** sur le cluster K3s.

**206-** Créez un **deuxième dépôt GitHub** destiné aux manifests Kubernetes : **devsecops-portfolio-gitops**

**207-** Configurez **Argo CD** pour **déployer automatiquement** le frontend et l'API à partir de ce dépôt.
**README.md :** ajoutez une capture de l'application Argo CD en état *Synced*.

**208-** Modifiez le **nombre de replicas** dans Git, poussez la modification et **vérifiez** qu'**Argo CD applique automatiquement** le changement.
**README.md :** ajoutez une capture avant et après la synchronisation.

**209-** Modifiez manuellement une ressource dans Kubernetes et observez le **self-healing** d'Argo CD.

**210-** **Modifiez** la **version de l'image** de l'API dans le dépôt GitOps et **vérifiez** le déploiement de la nouvelle version.

## 40. Environnements GitOps

**211-** **Organisez** le dépôt GitOps en **trois environnements** : *dev*, *staging* et *production*

**212- Déployez** les trois environnements avec des configurations différentes.

**213-** Mettez en place une **promotion GitOps** sans reconstruire l'image :
*DEV -> STAGING -> PRODUCTION*

**214-** Vérifiez que la même **image signée** (même digest) est utilisée dans les trois environnements.

**215-** Utilisez **Argo CD ApplicationSet** pour générer les applications des différents environnements.
**README.md :** ajoutez une capture des trois applications dans Argo CD.

## 41. Pipeline CI/CD GitOps

**216-** Faites **évoluer Jenkins** afin que le pipeline :
*teste le frontend*
*↓*
*teste l'API*
*↓*
*effectue les scans de sécurité*
*↓*
*construise les images*
*↓*
*génère le SBOM*
*↓*
*signe les images*
*↓*
*publie les images*
*↓*
*mette à jour le dépôt GitOps*

**README.md :** ajoutez une capture du pipeline complet.

**217-** Vérifiez qu'**Argo CD détecte la nouvelle version** et met automatiquement à jour l'application dans K3s.

**218-** Exécutez automatiquement les **migrations de base de données** lors de la livraison (**Job Kubernetes** ou **hook Argo CD PreSync**).

## 42. Monitoring applicatif

**219-** Installez **Prometheus** dans le cluster.

**220-** Installez **Grafana** et connectez-le à Prometheus.

**221-** **Importez** un dashboard permettant de visualiser au minimum :
*- CPU ;*
*- mémoire ;*
*- nombre de Pods ;*
*- redémarrages.*

**README.md :** ajoutez une capture du dashboard.

**222-** Ajoutez à l'API une **route** permettant d'**exposer des métriques applicatives** : *nombre de requêtes HTTP*, *erreurs* et *latence*.
**README.md :** ajoutez un exemple de métrique.

**223-** Configurez Prometheus pour **récupérer les métriques** de l'API.

**224- Affichez** dans Grafana les **requêtes HTTP**, le **taux d'erreurs** et la **latence de l'API**.
**README.md :** ajoutez une capture.

**225- Supprimez** manuellement un **Pod** API et observez sa **recréation** ainsi que son **impact** dans le **monitoring**.

## 43. OpenTelemetry et traces distribuées

**226-** **Instrumentez** l'API Express avec **OpenTelemetry**.

**227-** **Instrumentez** le frontend Next.js avec **OpenTelemetry**.

**228-** Ajoutez un **correlation ID** transmis du frontend Next.js à l'API Express et **présent dans les logs**.

**229-** Installez **Grafana Tempo** pour **collecter les traces** distribuées.

**230-** Visualisez dans Grafana une requête complète :
*Next.js -> Express -> PostgreSQL / Floci*
**README.md :** ajoutez une capture de la trace.

## 44. Centralisation des logs

**231-** Installez **Loki**.

**232-** **Centralisez les logs** du frontend et de l'API.

**233-** Reliez dans Grafana : **métriques**, **logs** et **traces** à l'aide du *correlation ID* pour analyser un même incident.
L'objectif est d'obtenir la stack : **Prometheus + Grafana + Loki + Tempo + OpenTelemetry**
**README.md :** ajoutez une capture montrant le passage d'une métrique à un log puis à une trace.

## 45. SLI, SLO et alerting

**234-** Définissez un **SLI** de disponibilité de l'API.

**235-** Définissez un **SLO**, par exemple : *disponibilité ≥ 99 %*
et expliquez la différence entre **SLI**, **SLO** et **SLA**.

**236-** Créez une **alerte Prometheus** lorsque le SLO n'est plus respecté.

**237-** Rédigez un **runbook** associé à cette alerte expliquant les actions à effectuer.
**README.md :** ajoutez le lien vers le runbook dans l'annotation de l'alerte.

## 46. DAST et tests de performance

**238-** Ajoutez **OWASP ZAP** au pipeline pour effectuer un **scan DAST** de l'application déployée en *DEV* ou *STAGING*.

**239-** Corrigez au moins une alerte détectée par OWASP ZAP.
**README.md :** ajoutez le rapport avant et après correction.

**240-** Installez **k6** et créez un test de charge simple pour l'API.

**241-** Exécutez automatiquement le **test k6** sur STAGING avant toute promotion vers PRODUCTION.

**242-** Définissez un **seuil de performance** provoquant l'échec du pipeline.
**README.md :** ajoutez les résultats k6.