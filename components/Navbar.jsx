'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-background border-b border-border-custom">
        <Link href="/" className="font-mono text-primary text-lg tracking-tight">&gt; Structura</Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-8 text-sm text-muted">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <a href="/about" className="hover:text-white transition-colors">About</a>
          <a href="/#structures" className="hover:text-white transition-colors">Structures</a>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] p-1"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-muted transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-0.5 bg-muted transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-muted transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="fixed top-[60px] left-0 w-full z-40 bg-background border-b border-border-custom md:hidden">
          <div className="flex flex-col px-8 py-4 gap-4 text-sm text-muted">
            <a href="/" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">Home</a>
            <a href="/about" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">About</a>
            <a href="/#structures" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">Structures</a>
          </div>
        </div>
      )}

      <div className="h-[60px] shrink-0" aria-hidden="true" />
    </>
  );
}
