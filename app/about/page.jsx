import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AboutPage() {
    const structures = [
        { name: 'Linked List', href: '/structures/linked-list' },
        { name: 'Stack', href: '/structures/stack' },
        { name: 'Queue', href: '/structures/queue' },
        { name: 'Binary Tree', href: '/structures/tree' },
        { name: 'Graph', href: '/structures/graph' },
        { name: 'Hash Table', href: '/structures/hash-table' },
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
            <Navbar />
            <main className="max-w-2xl mx-auto px-4 sm:px-8 py-12 lg:py-16">

                {/* Hero */}
                <div className="mb-16">
                    <h1 className="font-mono text-3xl lg:text-4xl font-bold text-primary mb-4">About Structura</h1>
                    <p className="font-mono text-lg" style={{ color: '#A0A0A0' }}>
                        An interactive learning tool for data structures that asks harder questions than most textbooks.
                    </p>
                </div>

                {/* What is Structura */}
                <div className="border-l border-[#00F5A0] px-6 mb-12">
                    <h2 className="font-mono font-bold text-xl leading-tight mb-3 text-white">What is Structura?</h2>
                    <p className="text-white text-sm leading-relaxed">Structura is an interactive learning environment for data structures. Each structure gets its own page: a scrollable story on the left that covers history and critical context, and a live sandbox on the right where you insert and delete elements in real time. A code panel highlights each line of the algorithm as it executes. The goal is to build genuine understanding — not just pattern recognition from memorized pseudocode.</p>
                </div>

                {/* Why it matters */}
                <div className="border-l border-[#00F5A0] px-6 mb-12">
                    <h2 className="font-mono font-bold text-xl leading-tight mb-3 text-white">Why it Matters</h2>
                    <p className="text-white text-sm leading-relaxed">Data structures are usually taught as neutral, technical facts. But every structure was invented by someone, somewhere, to solve a specific problem — and those problems came from specific communities with specific resources. Linked lists came from Cold War AI research at RAND. Hash tables came from IBM compiler engineers. Binary trees emerged from academic computer science with access to expensive machines. The assumptions embedded in these designs — about what problems are worth solving, what hardware is available, who counts as a user — were never neutral. Structura asks you to notice those assumptions and question them.</p>
                </div>

                {/* Six structures */}
                <div className="border-l border-[#00F5A0] px-6 mb-12">
                    <h2 className="font-mono font-bold text-xl leading-tight mb-3 text-white">Structures Covered</h2>
                    <p className="text-white text-sm mb-6">Six foundational structures, each with its own interactive page.</p>
                    <div className="grid grid-cols-2 gap-3">
                        {structures.map(s => (
                            <Link
                                key={s.name}
                                href={s.href}
                                className="border border-[#2A2A2A] rounded px-4 py-3 font-mono text-sm text-white hover:border-[#00F5A0] hover:text-primary transition-colors"
                            >
                                {s.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Built by */}
                <div className="border-l border-[#00F5A0] px-6 mb-12">
                    <h2 className="font-mono font-bold text-xl leading-tight mb-3 text-white">Built By</h2>
                    <p className="text-white text-sm leading-relaxed mb-3">
                        <span className="text-primary font-mono">Melissa Mugengano</span> is a student at Davidson College. Structura was built for DIG 345: Radical Software — a course that examines software not just as a technical artifact, but as a cultural and political one. The course asks whose problems software solves, who gets to build it, and what values are encoded into the tools we treat as objective.
                    </p>
                    <p className="font-mono text-xs" style={{ color: '#606060' }}>
                        Davidson College · DIG 345 Radical Software · Spring 2026
                    </p>
                </div>

            </main>
        </div>
    );
}
