'use client';
import React from 'react';

export default function CodePanel({ activeOperation, activeLine }) {
    const insertCode = [
        "function insert(key, value) {",
        "  const index = hash(key)",
        "  const bucket = table[index]",
        "  const found = bucket.find(e => e.key === key)",
        "  if (found) { found.value = value; return }",
        "  bucket.push({ key, value })",
        "}"
    ];

    const deleteCode = [
        "function delete(key) {",
        "  const index = hash(key)",
        "  const bucket = table[index]",
        "  const i = bucket.findIndex(e => e.key === key)",
        "  if (i === -1) return",
        "  bucket.splice(i, 1)",
        "}"
    ];

    const currentCode = activeOperation === 'delete' ? deleteCode : insertCode;

    return (
        <div className="bg-[#1E1E1E] text-white p-4 rounded-md overflow-x-auto font-mono text-sm h-full">
            <pre>
                {currentCode.map((line, index) => (
                    <div key={index} className={index === activeLine ? "bg-[#00F5A0] text-black" : ""}>
                        {line}
                    </div>
                ))}
            </pre>
        </div>
    );
}
