'use client';
import React from 'react';

export default function CodePanel({activeOperation, activeLine}) {
    const enqueueCode = [
        "function enqueue(value) {",
        "  const node = new Node(value)",
        "  rear.next = node",
        "  rear = node",
        "  size++",
        "  return node",
        "}"
    ]
    const dequeueCode = [
        "function dequeue() {",
        "  if (!front) return null",
        "  const removed = front",
        "  front = front.next",
        "  size--",
        "  return removed.value",
        "}"
    ]
    const currentCode = activeOperation === "enqueue" ? enqueueCode : dequeueCode;

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
