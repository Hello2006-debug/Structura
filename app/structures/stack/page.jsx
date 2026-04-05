'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function StackPage() {
    return (
        <div className="flex flex-col h-screen overflow-hidden" style={{backgroundColor: '#0D0D0D'}}>
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <h1 className="font-mono text-5xl font-bold text-primary">Stack</h1>
                <p className="text-muted text-lg">Coming Soon</p>
                <p className="text-white text-sm">This structure is being built. Check back soon.</p>
                <Link href="/#structures" className="mt-4 bg-primary text-black font-mono px-6 py-2 rounded-md text-sm font-bold hover:opacity-90">
                    ← Back to Structures
                </Link>
            </div>
        </div>
    )
}