'use client';
import React from 'react';

export default function CodePanel({ activeOperation, activeLine }) {
    const addNodeCode = [
        "function addNode(label) {",
        "  const node = { label }",
        "  adjacencyList[label] = []",
        "  return node",
        "}"
    ];

    const addEdgeCode = [
        "function addEdge(from, to) {",
        "  adjacencyList[from].push(to)",
        "  adjacencyList[to].push(from)",
        "}"
    ];

    const currentCode = activeOperation === 'addEdge' ? addEdgeCode : addNodeCode;

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
