'use client';
import React from 'react';

export default function CodePanel({activeOperation, activeLine}) {
    const insertCode = [
        "function insert(root, value) {",
        "  if (!root) return new Node(value)",
        "  if (value < root.value)",
        "    root.left = insert(root.left, value)",
        "  else",
        "    root.right = insert(root.right, value)",
        "  return root",
        "}"
    ];

    const deleteCode = [
        "function deleteNode(root, value) {",
        "  if (!root) return null",
        "  if (value < root.value)",
        "    root.left = deleteNode(root.left, value)",
        "  else if (value > root.value)",
        "    root.right = deleteNode(root.right, value)",
        "  else if (!root.left) return root.right",
        "  else if (!root.right) return root.left",
        "  else { root.value = minValue(root.right);",
        "    root.right = deleteNode(root.right, root.value) }",
        "  return root",
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
