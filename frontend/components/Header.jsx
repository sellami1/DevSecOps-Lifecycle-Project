'use client';

import Link from 'next/link';
import { useEffect, useSyncExternalStore } from 'react';

const themeChangeEvent = 'cv-theme-change';

function getThemeSnapshot() {
  return window.localStorage.getItem('cv-theme') === 'dark';
}

function getServerThemeSnapshot() {
  return false;
}

function subscribeToThemeChanges(onStoreChange) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(themeChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(themeChangeEvent, onStoreChange);
  };
}

const navigation = [
  ['About', '/#about'],
  ['Skills', '/#skills'],
  ['Projects', '/#projects'],
  ['Experience', '/#experience'],
  ['Contact', '/#contact'],
];

export default function Header() {
  const dark = useSyncExternalStore(
    subscribeToThemeChanges,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
  }, [dark]);

  function toggleTheme() {
    const nextTheme = dark ? 'light' : 'dark';
    document.body.classList.toggle('dark', nextTheme === 'dark');
    window.localStorage.setItem('cv-theme', nextTheme);
    window.dispatchEvent(new Event(themeChangeEvent));
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