# Activité 10

**Wahid Hamdi** • Oct 16
**20 points** | Due Nov 27, 8:30 AM

---

## 53. GitLab CI/CD — comparaison

**269-** Reproduisez une partie du pipeline avec **GitLab CI/CD**.

**270-** Comparez : **Jenkins**, **GitHub Actions** et **GitLab CI/CD** sur :
*configuration*
*runners*
*secrets*
*sécurité*
*maintenance*
*intégration Git*
**README.md :** ajoutez un tableau comparatif.

## 54. Flux CD

**271-** Installez **Flux CD** dans un cluster de test.

**272- Déployez** une version simple du Portfolio avec Flux.

**273-** Comparez : **Argo CD** et **Flux CD**

## 55. Kubernetes multi-cluster

**274-** Créez un **second** cluster **K3s** de laboratoire.

**275-** **Déployez** le Portfolio sur les deux clusters.

**276-** Utilisez **Argo CD ApplicationSet** pour gérer les **déploiements multi-clusters**.

**277-** Découvrez **Karmada** pour l'**orchestration multi-cluster**.
**README.md :** comparez ApplicationSet et Karmada.

## 56. Crossplane

**278-** Installez **Crossplane** dans votre cluster Kubernetes.

**279-** **Vérifiez** les nouvelles ressources Kubernetes avec : *kubectl get crd*
**README.md :** ajoutez une capture.

**280-** Installez le **provider AWS** de **Crossplane** configuré vers Floci et créez une première **Managed Resource** (par exemple un bucket S3).

**281-** Créez une **Composite Resource Definition (XRD)** décrivant une ressource : *kind: WebApplication*
avec les paramètres :
*frontend*
*api*
*environment*
*replicas*

**282-** Créez une **Composition** associée.

**283-** Créez une **ressource WebApplication** pouvant générer :
*Namespace*
*Deployment*
*Service*
*Ingress*
*ConfigMap*
*Database*

**README.md :** ajoutez un exemple YAML et le résultat de kubectl get managed.

**284-** Documentez la **différence** entre **Terraform** et **Crossplane** en quelques lignes dans le README.md.

## 57. kro — Kube Resource Orchestrator

**285-** Installez **kro** dans un cluster de test.

**286-** Utilisez kro pour **composer plusieurs ressources** Kubernetes représentant une **WebApplication**.

**287-** Comparez : **Helm**, **Kustomize**, **Crossplane Compositions** et **kro**
**README.md :** ajoutez un tableau comparatif.

## 58. Platform Engineering

**288-** Installez **Backstage**.

**289-** Ajoutez le frontend et l'API au **catalogue Backstage**.

**290-** Créez un **Software Template** permettant de générer automatiquement un nouveau service contenant :
*Git repository*
*Dockerfile*
*CI*
*Kubernetes*
*Monitoring*

**291-** Définissez un **Golden Path / Paved Road** pour le déploiement d'une nouvelle application.

**292-** Faites évoluer votre laboratoire vers une petite **Internal Developer Platform**.

**293- Organisez** l'architecture en trois couches :
*Infrastructure -> Platform -> Applications*

**294-** Identifiez dans votre projet quels outils appartiennent à chaque couche.
**README.md :** ajoutez un schéma de l'architecture en couches.

## 59. DORA Metrics

**295-** **Mesurez** :
*Deployment Frequency*
*Lead Time for Changes*
*Change Failure Rate*
*Mean Time to Recovery*

**296-** Créez un **tableau de bord** présentant les **métriques DORA** du projet.
**README.md :** ajoutez une capture.

## 60. FinOps

**297-** **Comparez** pour chaque **workload** Kubernetes :
*CPU demandé*
*CPU consommé*
*RAM demandée*
*RAM consommée*

**298-** Installez **OpenCost**.

**299-** Identifiez les **workloads surdimensionnés**.

**300-** **Optimisez** les **requests** et **limits** à partir des métriques réelles.

**301-** Comparez les **coûts estimés** avant et après **optimisation**.
**README.md :** ajoutez un tableau avant/après.

## 61. Chaos Engineering

**302-** Installez **Chaos Mesh**.

**303-** **Simulez** la **suppression** d'un **Pod** API.

**304-** **Simulez** une **latence réseau**.

**305-** **Simulez** une **indisponibilité temporaire** de l'API.

**306-** **Vérifiez** que : *Prometheus, Grafana, Loki, Tempo et Alerting*
permettent d'**identifier** chaque **incident** et que les **mécanismes de récupération fonctionnent**.

## 62. Gestion d'incident

**307-** **Déclenchez** volontairement une **panne applicative**.

**308-** **Détectez** l'incident à partir des **alertes** et du monitoring.

**309-** Utilisez les **logs** et les **traces** pour identifier la cause, en suivant le **runbook**.

**310-** Effectuez un rollback.

**311-** Rédigez un **post-mortem** contenant :
*incident*
*impact*
*cause*
*détection*
*résolution*
*actions préventives*