import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="not-found">
      <span className="mono">404 / NOT FOUND</span>
      <h1>That project isn&apos;t here.</h1>
      <Link className="text-link" href="/projects">Browse all projects <span aria-hidden="true">↗</span></Link>
    </section>
  );
}