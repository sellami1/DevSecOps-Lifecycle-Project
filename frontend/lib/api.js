const API_URL = process.env.API_URL || 'http://localhost:4000';

async function get(path) {
  const response = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`API ${path} failed: ${response.status}`);
  }
  return response.json();
}

export const fetchProfile = () => get('/api/profile');
export const fetchProjects = () => get('/api/projects');
export const fetchSkills = () => get('/api/skills');
export const fetchHealth = () => get('/api/health');
