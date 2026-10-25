## 1. Recommended project layout

```text
devsecops-portfolio/
├── frontend/                # Next.js app (from Activity 2)
│   ├── app/
│   ├── components/
│   ├── lib/
│   │   └── api.js           # NEW – fetch helpers
│   ├── Dockerfile           # NEW
│   └── package.json
├── api/                     # NEW – Express API
│   ├── server.js
│   ├── data/
│   │   ├── profile.js
│   │   ├── projects.js
│   │   └── skills.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── ansible/                 # NEW – Ansible assets
│   ├── inventory.ini
│   ├── ansible.cfg
│   └── playbooks/
│       ├── 01-install-packages.yml
│       └── 02-install-docker.yml
├── docker-compose.yml       # NEW
└── README.md
```

---

## 2. Ansible on the admin VM

Create `/etc/ansible/ansible.cfg` (or `~/devsecops-portfolio/ansible/ansible.cfg`):

```ini
[defaults]
inventory = ./inventory.ini
host_key_checking = False
retry_files_enabled = False
stdout_callback = yaml
interpreter_python = auto_silent
```

---

## 3. Ansible inventory and connectivity test

`ansible/inventory.ini`:

```ini
[ubuntu_servers]
cicd-platform ansible_host=192.168.100.20 ansible_user=lab ansible_ssh_private_key_file=~/.ssh/id_ed25519
```

---

## 4. First playbook — install a Linux package

`ansible/playbooks/01-install-packages.yml`:

```yaml
---
- name: Install common packages on Ubuntu servers
  hosts: ubuntu_servers
  become: true
  vars:
    packages:
      - curl
      - git
      - jq
  tasks:
    - name: Update apt cache
      ansible.builtin.apt:
        update_cache: true
        cache_valid_time: 3600

    - name: Install packages
      ansible.builtin.apt:
        name: "{{ packages }}"
        state: present
```

---

## 6. Create the Express API

### 6.1 Package skeleton

`api/package.json`:

```json
{
  "name": "devsecops-api",
  "version": "1.0.0",
  "description": "DevSecOps Portfolio API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  }
}
```

### 6.2 Data files

`api/data/profile.js`:

```javascript
module.exports = {
  name: "Wahid Hamdi",
  title: "DevSecOps Engineer",
  location: "Tunisia",
  summary:
    "Building secure, observable and automated delivery pipelines from code to production.",
  links: {
    github: "https://github.com/<you>",
    linkedin: "https://linkedin.com/in/<you>"
  }
};
```

`api/data/projects.js`:

```javascript
module.exports = [
  {
    id: "devsecops-portfolio",
    name: "DevSecOps Portfolio",
    description:
      "Progressive delivery of a Next.js + Express portfolio with Jenkins, Kubernetes, Argo CD and observability.",
    stack: ["Next.js", "Express", "Docker", "Jenkins", "K3s", "Argo CD"],
    repo: "https://github.com/<you>/devsecops-portfolio"
  },
  {
    id: "iac-lab",
    name: "IaC Lab",
    description: "Terraform + Ansible automation targeting Floci, the local AWS emulator.",
    stack: ["Terraform", "Ansible", "Floci"],
    repo: "https://github.com/<you>/iac-lab"
  }
];
```

`api/data/skills.js`:

```javascript
module.exports = [
  { category: "Containers", items: ["Docker", "Docker Compose", "BuildKit", "Harbor"] },
  { category: "CI/CD", items: ["Jenkins", "GitHub Actions", "GitLab CI", "Argo CD"] },
  { category: "Kubernetes", items: ["K3s", "Helm", "Kustomize", "Kyverno"] },
  { category: "Observability", items: ["Prometheus", "Grafana", "Loki", "Tempo", "OpenTelemetry"] },
  { category: "IaC & Automation", items: ["Terraform", "Ansible", "Vagrant"] },
  { category: "Security", items: ["Trivy", "Semgrep", "Cosign", "Vault", "Kyverno"] }
];
```

### 6.3 Server

`api/server.js`:

```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const profile = require("./data/profile");
const projects = require("./data/projects");
const skills = require("./data/skills");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 30 – Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// 31 – Profile
app.get("/api/profile", (_req, res) => {
  res.json(profile);
});

// 32 – Projects
app.get("/api/projects", (_req, res) => {
  res.json(projects);
});

// 33 – Skills
app.get("/api/skills", (_req, res) => {
  res.json(skills);
});

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});
```

---

## 7. Wire the Next.js frontend to the API

Create a small fetch layer in `frontend/lib/api.js`:

```javascript
const API_URL = process.env.API_URL || "http://localhost:4000";

async function get(path) {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
}

export const fetchProfile  = () => get("/api/profile");
export const fetchProjects = () => get("/api/projects");
export const fetchSkills   = () => get("/api/skills");
export const fetchHealth   = () => get("/api/health");
```

---

## 9. Dockerize the frontend and the API

### 9.1 API Dockerfile

`api/Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "server.js"]
```

`api/.dockerignore`:

```text
node_modules
.env
npm-debug.log
```

### 9.2 Next.js Dockerfile

`frontend/Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
```

`frontend/.dockerignore`:

```text
node_modules
.next
.env.local
npm-debug.log
```

---

### 9.4 Docker Compose

`docker-compose.yml` at the project root:

```yaml
services:
  api:
    image: devsecops-api:latest
    build: ./api
    container_name: devsecops-api
    restart: unless-stopped
    environment:
      - PORT=4000
    ports:
      - "4000:4000"
    networks:
      - devsecops

  frontend:
    image: devsecops-portfolio:latest
    build: ./frontend
    container_name: devsecops-portfolio
    restart: unless-stopped
    environment:
      - API_URL=http://api:4000     # server-side fetch from inside the Docker network
    ports:
      - "3000:3000"
    depends_on:
      - api
    networks:
      - devsecops

networks:
  devsecops:
    driver: bridge
```
