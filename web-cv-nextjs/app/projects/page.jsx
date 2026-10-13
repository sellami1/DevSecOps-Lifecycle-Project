import Link from 'next/link';
import Projects from '../../components/Projects';

export const metadata = { title: 'Projects — Kadhem Sellami' };

export default function ProjectsPage() {
  return (
    <>
      <section className="route-heading">
        <span className="mono">PORTFOLIO / WORK</span>
        <h1>Projects<span>.</span></h1>
        <p>Practical work in secure delivery, cloud-native operations, and infrastructure automation.</p>
        <Link className="text-link" href="/#projects">Back to portfolio <span aria-hidden="true">↗</span></Link>
      </section>
      <Projects standalone />
    </>
  );
}