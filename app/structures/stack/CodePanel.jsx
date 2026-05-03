'use client';
import React from 'react';

export default function CodePanel({activeOperation, activeLine}) {
    const pushCode = [
        "function push(value) {",
        "  const node = new Node(value)",
        "  node.next = top",
        "  top = node",
        "  size++",
        "  return node",
        "}"
    ]
    const popCode = [
        "function pop() {",
        "  if (!top) return null",
        "  const removed = top",
        "  top = top.next",
        "  size--",
        "  return removed.value",
        "}"
    ]
    const currentCode = activeOperation === "push" ? pushCode : popCode;

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
    )
}
