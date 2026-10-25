import { fetchProfile, fetchProjects, fetchSkills } from '../lib/api';
import About from '../components/About';
import Contact from '../components/Contact';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Skills from '../components/Skills';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [profile, projects, skills] = await Promise.all([
    fetchProfile(),
    fetchProjects(),
    fetchSkills(),
  ]);

  return (
    <>
      <About profile={profile} />
      <Experience />
      <Projects projects={projects} />
      <Skills skillGroups={skills} />
      <Contact />
    </>
  );
}