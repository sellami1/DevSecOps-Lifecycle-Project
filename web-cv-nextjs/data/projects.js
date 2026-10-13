export const projects = [
  {
    slug: 'secure-ci-cd-pipeline',
    category: 'CI/CD · SECURITY',
    title: 'Secure CI/CD Pipeline',
    description:
      'A Jenkins delivery workflow that builds container images, runs automated checks, and publishes versioned artifacts.',
    tools: ['Jenkins', 'Docker', 'Git'],
    detail:
      'This project brings build automation and security checks into one repeatable delivery workflow. Source changes trigger a Jenkins pipeline, which validates the application, builds a Docker image, and prepares a versioned artifact for release.',
    outcome:
      'A consistent path from a Git commit to a validated, versioned container image.',
  },
  {
    slug: 'gitops-application-delivery',
    category: 'KUBERNETES · GITOPS',
    title: 'GitOps Application Delivery',
    description:
      'A Kubernetes deployment flow managed through declarative configuration and synchronized GitOps releases.',
    tools: ['Kubernetes', 'Argo CD', 'Git'],
    detail:
      'The desired application state is described in Git and reconciled against a Kubernetes cluster. Argo CD watches the configuration repository and reports when a deployment is synchronized or needs attention.',
    outcome:
      'Traceable deployments where Git records the desired state and change history.',
  },
  {
    slug: 'repeatable-infrastructure',
    category: 'INFRASTRUCTURE · AUTOMATION',
    title: 'Repeatable Infrastructure',
    description:
      'An infrastructure-as-code and configuration-management workflow for provisioning and preparing consistent environments.',
    tools: ['Terraform', 'Ansible'],
    detail:
      'Terraform describes the infrastructure resources while Ansible configures provisioned machines. Keeping these responsibilities in version-controlled files makes environments easier to reproduce and review.',
    outcome:
      'A documented and repeatable environment setup with fewer manual configuration steps.',
  },
];