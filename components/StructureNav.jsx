'use client';
import Link from 'next/link'

export default function StructureNav({prev, next}) {
    return (
        <div className="flex justify-between items-center py-4">
            {prev ? (
                <Link href={prev.href} className="text-muted font-mono text-sm hover:text-primary">
                    ← {prev.label}
                </Link>
            ) : <span></span>}
            
            {next ? (
                <Link href={next.href} className="text-muted font-mono text-sm hover:text-primary">
                    {next.label} →
                </Link>
            ) : <span></span>}
        </div>
    )
}