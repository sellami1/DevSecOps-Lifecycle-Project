# Activité 7

**Wahid Hamdi** • Oct 16
**20 points** | Due Nov 13, 8:30 AM

---

## 26. Introduction à Kubernetes

**136-** Installez **K3s** sur le serveur Ubuntu.

**137-** **Vérifiez** le cluster avec :
*kubectl get nodes*
*kubectl get pods -A*
**README.md :** ajoutez les commandes et une capture d'écran.

**138-** Créez un **Namespace** dédié au DevSecOps Portfolio.

**139-** Créez un **Deployment** permettant de déployer le frontend Next.js.
**README.md :** ajoutez le manifest et le résultat de *kubectl get pods*

**140-** Créez un **deuxième Deployment** permettant de déployer l'API Express.
**README.md :** ajoutez le manifest et le résultat de *kubectl get pods*

**141-** Créez un **Service** pour le frontend.

**142-** Créez un **Service** pour l'API.
**README.md :** ajoutez le résultat de : *kubectl get svc*

**143-** **Configurez** le frontend pour communiquer avec l'API à travers le Service Kubernetes.
**README.md :** ajoutez une capture montrant les données récupérées depuis l'API.

## 27. Kubernetes avec Ansible

**144-** Créez un **rôle Ansible** permettant d'installer automatiquement K3s sur une VM.
**README.md :** ajoutez le rôle et une capture du résultat de : *kubectl get nodes*

**145-** Automatisez avec **Vagrant + Ansible** la création d'une VM contenant automatiquement :
*Ubuntu > SSH > Docker > K3s*
**README.md :** ajoutez le schéma de l'automatisation et les commandes exécutées.

**146-** Détruisez puis **recréez** le cluster uniquement avec l'automatisation.

## 28. Kubernetes — configuration de l'application

**147-** Créez un **ConfigMap** contenant la configuration non sensible du frontend et de l'API.
**README.md :** ajoutez le manifest YAML et le résultat de *kubectl get configmap*

**148-** Créez un **Secret** Kubernetes contenant une valeur sensible de démonstration utilisée par l'API.
**README.md :** ajoutez les commandes utilisées.

**149-** Modifiez les **Deployments** afin d'utiliser le **ConfigMap** et le **Secret**.

**150-** Déployez **PostgreSQL** dans **Kubernetes** avec un **PersistentVolumeClaim**.
**README.md :** ajoutez le résultat de *kubectl get pvc* et vérifiez que les données survivent à la suppression du Pod.

**151-** Créez un **Ingress** permettant d'accéder au frontend avec un nom local : **portfolio.local**

**152-** **Configurez** également le **routage** vers l'API :
*portfolio.local/api*
**README.md :** ajoutez le manifest et une capture du Portfolio accessible depuis la machine physique.

## 29. HTTPS et certificats

**153-** Installez **cert-manager** dans le cluster.

**154-** Créez un **Issuer** (autosigné ou CA locale) et un **certificat TLS** pour le DevSecOps Portfolio.

**155-** Faites **évoluer l'Ingress** vers :
*https://portfolio.local*
**README.md :** ajoutez une capture de l'accès HTTPS et le résultat de *kubectl get certificate*

## 30. Santé et disponibilité de l'application

**156-** Utilisez la route : **/api/health** comme base pour vérifier l'état de l'API.

**157-** Ajoutez une **readinessProbe** au Deployment de l'API.

**158-** Ajoutez une **livenessProbe** au Deployment de l'API.
**README.md :** ajoutez les manifests et le résultat de *kubectl describe pod*

**159-** Ajoutez les ressources **requests** et **limits** pour le frontend et l'API.

**160-** Ajoutez un **HorizontalPodAutoscaler** pour l'API.
**README.md :** ajoutez le résultat de *kubectl get hpa*

## 31. Kubernetes Security et RBAC

**161-** Créez un **ServiceAccount** pour l'application.

**162-** Créez un **Role** autorisant uniquement les actions nécessaires.

**163-** Créez un **RoleBinding** associant le Role au ServiceAccount.

**164-** **Testez** les permissions avec :
*kubectl auth can-i*
**README.md :** ajoutez les manifests et les résultats des tests.

**165-** Configurez les conteneurs pour **fonctionner sans privilèges élevés**.
**README.md :** ajoutez les paramètres **securityContext** utilisés.

**166-** Appliquez les **Pod Security** Standards sur le namespace avec les profils :
*baseline*
*restricted*
**README.md :** ajoutez les labels utilisés et un exemple de Pod refusé par le profil restricted.

## 32. Network Security

**167-** Créez une **NetworkPolicy** qui **interdit** par défaut les **communications** entre les **Pods** du namespace.

**168-** Autorisez uniquement :
*frontend → API*
*API → PostgreSQL*

**169-** **Vérifiez** qu'un Pod non autorisé ne peut pas contacter l'API.
**README.md :** ajoutez les manifests et le résultat du test.

**170-** Installez **Cilium** comme CNI dans un cluster de test et découvrez les **NetworkPolicies avancées** et l'observabilité réseau **eBPF** avec **Hubble**.
**README.md :** ajoutez une capture des flux réseau observés.

## 33. Policy as Code

**171-** Installez **Kyverno**.

**172-** Créez une **policy** interdisant les images avec le tag : **latest**

**173-** Créez une **policy** interdisant les conteneurs privilégiés.

**174-** Créez une **policy** imposant : **runAsNonRoot**

**175-** Créez une **policy** imposant la présence de : **requests** et **limits**

**176-** **Testez** un Deployment volontairement non conforme et vérifiez qu'il est refusé.
**README.md :** ajoutez le message de refus.

**177-** Découvrez **OPA Gatekeeper** en réécrivant l'une des policies, puis comparez son approche avec **Kyverno**.
**README.md :** ajoutez une courte comparaison.

## 34. Gestion avancée des secrets

**178-** Installez **HashiCorp Vault** dans le cluster de laboratoire.

**179-** Stockez un **secret** de l'API dans Vault.

**180-** Installez **External Secrets Operator**.

**181-** **Synchronisez** le secret Vault vers un Secret Kubernetes utilisé par l'API.

**182-** Configurez **External Secrets Operator** pour synchroniser également un secret depuis **Secrets Manager de Floci**.

**183-** Testez **Sealed Secrets** pour **versionner** un **secret chiffré** dans Git.

**184-** Effectuez une **rotation** d'un **secret** et vérifiez son actualisation dans l'application.
**README.md :** comparez Secret Kubernetes, Vault + External Secrets et Sealed Secrets.

## 35. Sécurité Kubernetes continue

**185-** Installez **Trivy Operator**.

**186-** Analysez les **workloads Kubernetes** et identifiez les vulnérabilités présentes dans le cluster.
**README.md :** ajoutez le résultat de *kubectl get vulnerabilityreports -A*

**187-** Utilisez **Kubescape** ou **Trivy Kubernetes** pour analyser les manifests et la configuration du cluster.

**188-** Installez **Falco** pour détecter les comportements suspects à l'exécution.

**189-** Déclenchez un événement de démonstration (shell dans un conteneur, lecture de /etc/shadow…) et observez l'**alerte Falco**.
**README.md :** ajoutez l'alerte générée.