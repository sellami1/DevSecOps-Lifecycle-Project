# Activité 5

**Wahid Hamdi** • Oct 16
**20 points** | Due Nov 4, 8:30 AM

---

## 17. GitHub Actions et sécurité GitHub

**70-** Créez un **workflow GitHub Actions** qui **exécute automatiquement** les tests frontend et API lors d'un **push** et d'une **Pull Request**.

**71-** Ajoutez au workflow le **scan des secrets**, le **SAST** et le **contrôle des dépendances**.

**72-** Ajoutez la **construction** des deux **images** Docker au workflow.

**73-** Ajoutez le **scan** des **images** avec **Trivy**.

**74-** Activez GitHub Advanced Security / **CodeQL** sur le dépôt et comparez ses résultats avec ceux de **Semgrep**.
**README.md :** ajoutez un tableau comparatif des alertes détectées par les deux outils.

**75-** Activez **Dependabot** ou **Renovate** pour **détecter** les **dépendances vulnérables** et proposer automatiquement leur mise à jour.
**README.md :** ajoutez une capture d'une Pull Request générée automatiquement.

**76-** Limitez les **permissions** du **GITHUB_TOKEN** au strict nécessaire avec le bloc permissions: des workflows.

**77-** Configurez les Actions tierces avec des versions immuables (**SHA de commit**) plutôt que des tags modifiables.
**README.md :** expliquez pourquoi les chaînes CI/CD elles-mêmes constituent une surface d'attaque.

**78-** **Comparez** votre workflow GitHub Actions avec le pipeline Jenkins.
**README.md :** ajoutez une courte comparaison.

## 18. Git Workflow

**79-** Mettez en place une **stratégie Git** utilisant :
*branch -> Pull Request -> review -> merge*
**README.md :** décrivez la convention de nommage des branches.

**80-** Activez la **protection de la branche principale** et interdisez les push directs.

**81-** Rendez **obligatoires** les **contrôles** suivants **avant le merge** d'une Pull Request :
*tests, SAST, secrets, dependencies, image scan*
**README.md :** ajoutez une capture d'une Pull Request bloquée par un contrôle en échec.

**82-** Utilisez **Conventional Commits** pour les messages de commit :
*feat: ajout du formulaire de contact*
*fix: correction de la validation email*
*docs: mise à jour du README*

**83-** Utilisez **Semantic Versioning** pour versionner les **releases** :
*MAJOR.MINOR.PATCH*

**84-** **Automatisez** la génération du **changelog** et des **releases** avec **semantic-release**.
**README.md :** ajoutez une capture d'une release générée automatiquement.

## 19. Optimisation des images

**85-** Relevez pour les images actuelles :
*taille image*
*temps de build*
*nombre de vulnérabilités*

**86-** Transformez les **Dockerfiles** Next.js et Express en **builds multi-stage**.

**87- Comparez** les trois indicateurs avant et après optimisation.
**README.md :** ajoutez un tableau comparatif.

**88-** Activez **Docker BuildKit / Buildx** pour les builds.

**89-** Construisez une **image multi-architecture** : *amd64* et *arm64*
**README.md :** ajoutez le résultat de docker buildx imagetools inspect.

## 20. Registre privé Harbor

**90-** Installez **Harbor** comme **registre privé** de conteneurs.

**91-** **Publiez** les **images** du frontend et de l'API dans **Harbor** depuis le pipeline.
**README.md :** ajoutez les noms complets des images et leurs tags.

**92-** Configurez les **permissions d'accès** au registre avec **RBAC** (projet, utilisateurs, robot account pour le pipeline).

**93-** Activez le **scan automatique** des images dans **Harbor** et comparez ses résultats avec le **scan Trivy** du pipeline.

**94-** Configurez une **politique de rétention** des images.

**95-** Comparez : **GitHub Container Registry** et **Harbor**
**README.md :** ajoutez une courte comparaison.

## 21. Software Supply Chain Security

**96-** Générez automatiquement un **SBOM** pour chaque image avec **Syft**.

**97-** Conservez le **SBOM** comme **artefact** du pipeline.

**98-** **Attachez** automatiquement le **SBOM** à chaque **release** GitHub.

**99-** **Signez** les **images** Docker publiées dans le registre avec **Sigstore** / **Cosign**.

**100-** **Vérifiez la signature** d'une image avec **cosign verify** avant son utilisation.
**README.md :** ajoutez la commande et le résultat.

**101-** Générez des **attestations de build** dans GitHub Actions.

**102-** Expliquez la notion de **provenance des artefacts** et vérifiez la provenance d'une image.

**103-** Étudiez les principes **SLSA** et **in-toto**, puis situez votre pipeline sur les niveaux **SLSA**.
**README.md :** ajoutez une courte synthèse.

**104-** Configurez le pipeline pour **refuser** une image **non signée**.

**105-** **Simulez** une attaque de supply chain avec une image non signée ou une dépendance compromise et **vérifiez** que le pipeline bloque la livraison.
**README.md :** documentez le scénario et le blocage obtenu.