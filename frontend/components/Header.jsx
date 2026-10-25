'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const navigation = [
  ['About', '/#about'],
  ['Skills', '/#skills'],
  ['Projects', '/#projects'],
  ['Experience', '/#experience'],
  ['Contact', '/#contact'],
];

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('cv-theme');
    const useDark = savedTheme === 'dark';
    document.body.classList.toggle('dark', useDark);
    setDark(useDark);
  }, []);

  function toggleTheme() {
    const nextTheme = dark ? 'light' : 'dark';
    document.body.classList.toggle('dark', nextTheme === 'dark');
    window.localStorage.setItem('cv-theme', nextTheme);
    setDark(nextTheme === 'dark');
  }

  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="Kadhem Sellami portfolio home">
        <span className="brand-mark">KS</span>
        <span className="brand-text">DEVSECOPS / PORTFOLIO</span>
      </Link>
      <nav className="nav" aria-label="Primary navigation">
        {navigation.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
      </nav>
      <div className="actions">
        <button
          className="icon-btn"
          type="button"
          onClick={toggleTheme}
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          title="Toggle theme"
        >
          {dark ? '☀' : '◐'}
        </button>
        <button className="print-btn" type="button" onClick={() => window.print()}>
          Print portfolio
        </button>
      </div>
    </header>
  );
}