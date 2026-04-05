import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-background border-b border-border-custom">
      <Link href="/" className="font-mono text-primary text-lg tracking-tight">&gt; Structura</Link>
      <div className="flex gap-8 text-sm text-muted">
        <a href="/" className="hover:text-white transition-colors">Home</a>
        <a href="/#about" className="hover:text-white transition-colors">About</a>
        <a href="/#structures" className="hover:text-white transition-colors">Structures</a>
      </div>
    </nav>
  )
}