'use client';
import React, {useState, useRef, useEffect} from 'react';
import CodePanel from './CodePanel';
import Navbar from '@/components/Navbar';
import ConfettiBlast from '@/components/ConfettiBlast';
import {animate} from 'animejs';
import Link from 'next/link';

const NODE_RADIUS = 20;
const Y_SPACING = 90;
const TOP_PADDING = 36;
const SVG_W = 800;
const SVG_H = 500;

// --- Pure BST helpers (module scope, no React) ---

function bstInsert(current, newNode) {
    if (!current) return newNode;
    if (newNode.value < current.value) {
        return { ...current, left: bstInsert(current.left, newNode) };
    }
    if (newNode.value > current.value) {
        return { ...current, right: bstInsert(current.right, newNode) };
    }
    return current; // duplicate — ignore
}

function bstMinValue(node) {
    while (node.left) node = node.left;
    return node.value;
}

function bstDelete(current, value) {
    if (!current) return null;
    if (value < current.value) return { ...current, left: bstDelete(current.left, value) };
    if (value > current.value) return { ...current, right: bstDelete(current.right, value) };
    if (!current.left) return current.right;
    if (!current.right) return current.left;
    const successorValue = bstMinValue(current.right);
    return { ...current, value: successorValue, right: bstDelete(current.right, successorValue) };
}

function applyLayout(node, depth, lo, hi) {
    if (!node) return null;
    const mid = (lo + hi) / 2;
    return {
        ...node,
        x: mid,
        y: depth * Y_SPACING + TOP_PADDING,
        left: applyLayout(node.left, depth + 1, lo, mid),
        right: applyLayout(node.right, depth + 1, mid, hi),
    };
}

function collectNodes(node, acc = []) {
    if (!node) return acc;
    acc.push(node);
    collectNodes(node.left, acc);
    collectNodes(node.right, acc);
    return acc;
}

function collectEdges(node, acc = []) {
    if (!node) return acc;
    if (node.left) {
        acc.push({ id: `${node.id}-L`, x1: node.x, y1: node.y, x2: node.left.x, y2: node.left.y });
        collectEdges(node.left, acc);
    }
    if (node.right) {
        acc.push({ id: `${node.id}-R`, x1: node.x, y1: node.y, x2: node.right.x, y2: node.right.y });
        collectEdges(node.right, acc);
    }
    return acc;
}

// --- Component ---

export default function TreePage() {
    const [root, setRoot] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [hasInserted, setHasInserted] = useState(false);
    const [stepsComplete, setStepsComplete] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [sandboxActive, setSandboxActive] = useState(false);
    const [codePanelActive, setCodePanelActive] = useState(false);
    const [newNodeId, setNewNodeId] = useState(null);
    const [activeOperation, setActiveOperation] = useState('insert');
    const [hasDeleted, setHasDeleted] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const tryItRef = useRef(null);
    const nodeGroupRefs = useRef({});
    const animatedIds = useRef(new Set());

    const insertSteps = [
        { description: "Begin insert — start traversal from the root node", line: 0 },
        { description: "Empty position found — create and place the new node here", line: 1 },
        { description: "Compare the new value against the current node's value", line: 2 },
        { description: "New value is smaller — recurse into the left subtree", line: 3 },
        { description: "New value is larger — recurse into the right subtree", line: 5 },
    ];

    const deleteSteps = [
        { description: "Begin delete — traverse the tree to locate the target value", line: 0 },
        { description: "If we reach null, the value isn't in the tree — stop here", line: 1 },
        { description: "Target found with no left child — return right subtree to replace it", line: 6 },
        { description: "Target found with no right child — return left subtree to replace it", line: 7 },
        { description: "Two children — replace value with in-order successor, delete it from right", line: 8 },
    ];

    const currentSteps = activeOperation === 'delete' ? deleteSteps : insertSteps;

    function handleInsert() {
        const num = parseFloat(inputValue.trim());
        if (isNaN(num)) return;

        const newNode = { id: Date.now(), value: num, left: null, right: null };
        const updated = bstInsert(root, newNode);

        // duplicate check — if root didn't change structure, skip
        const laidOut = applyLayout(updated, 0, 0, SVG_W);
        setRoot(laidOut);
        setNewNodeId(newNode.id);
        setInputValue('');
        setActiveOperation('insert');
        setCodePanelActive(true);
        setCurrentStep(0);
        setHasInserted(true);
    }

    async function handleDelete() {
        console.log('[Delete] inputValue:', JSON.stringify(inputValue), '| root:', root);
        const num = parseFloat(inputValue.trim());
        console.log('[Delete] parsed num:', num, '| isNaN:', isNaN(num), '| root null:', root === null);
        if (isNaN(num)) { setDeleteError('Type a value to delete'); return; }
        setDeleteError('');
        if (!root) return;

        const updated = bstDelete(root, num);

        // Diff old vs new ID sets — the missing ID is the node physically removed.
        // For the two-children case bstDelete removes the in-order successor, not
        // the target itself (which keeps its id but gets the successor's value).
        const oldIds = new Set(collectNodes(root).map(n => n.id));
        const newIds = new Set(updated ? collectNodes(updated).map(n => n.id) : []);
        const removedId = [...oldIds].find(id => !newIds.has(id));
        const el = nodeGroupRefs.current[removedId];
        console.log('[Delete] oldIds:', [...oldIds], '| newIds:', [...newIds], '| removedId:', removedId, '| el:', el);

        if (removedId === undefined) {
            // Value not in tree — nothing to remove
            setInputValue('');
            return;
        }

        // animate() in animejs 4 returns a thenable — await it directly so the
        // Promise resolves as soon as the animation finishes.
        if (el) await animate(el, { opacity: [1, 0], duration: 300, ease: 'easeInExpo' });

        const laidOut = updated ? applyLayout(updated, 0, 0, SVG_W) : null;
        setRoot(laidOut);
        setNewNodeId(null);
        setInputValue('');
        setActiveOperation('delete');
        setCodePanelActive(true);
        setCurrentStep(0);
        setHasDeleted(true);
    }

    function handleNextStep() {
        const next = Math.min(currentStep + 1, currentSteps.length - 1);
        setCurrentStep(next);
        if (next === currentSteps.length - 1) setStepsComplete(true);
    }

    // Animate new node fade-in
    useEffect(() => {
        if (!newNodeId || animatedIds.current.has(newNodeId)) return;
        const el = nodeGroupRefs.current[newNodeId];
        if (!el) return;
        animatedIds.current.add(newNodeId);
        animate(el, { opacity: [0, 1], duration: 450, ease: 'easeOutExpo' });
    }, [newNodeId, root]); // root dep ensures el is in DOM

    // IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setSandboxActive(true);
                observer.disconnect();
            }
        }, { threshold: 0.5 });

        observer.observe(tryItRef.current);
        return () => observer.disconnect();
    }, []);

    const flatNodes = root ? collectNodes(root) : [];
    const edges = root ? collectEdges(root) : [];

    return (
        <div className='min-h-screen md:h-screen flex flex-col md:overflow-hidden'>
            <Navbar />
            <main className="flex flex-col md:flex-row flex-1 md:overflow-hidden">

                {/* Left Panel — Story */}
                <div className="w-full h-[40vh] md:w-[50%] md:h-full overflow-y-auto border-b md:border-b-0 md:border-r border-[#00A86B] p-4" style={{backgroundColor: '#1E1E1E'}}>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight mb-3 text-primary">What is a Binary Tree?</h2>
                        <p className="text-white text-sm">A binary tree is a structure where each node holds a value and can have at most two children — a left child and a right child. A binary search tree (BST) adds a rule: every value in the left subtree is smaller, and every value in the right subtree is larger. This ordering means finding any value only requires halving the search space at each step — O(log n) in the best case.</p>
                    </div>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">A Brief History</h2>
                        <p className="text-white text-sm">Binary search trees were formally studied in the early 1960s, emerging from the problem of efficient dictionary lookup. P.F. Windley, A.D. Booth, and others contributed to the theory. The structure became foundational to computer science after Donald Knuth's treatment in The Art of Computer Programming (1968) — still the canonical reference half a century later.</p>
                    </div>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">Question the Design</h2>
                        <p className="text-white text-sm">A basic BST's performance depends entirely on insertion order — insert values in sorted order and you get a linked list in disguise, not a tree. O(n) instead of O(log n). Self-balancing variants like AVL and Red-Black trees were invented to fix this, but they add significant complexity. The original design assumed random input — encoding the assumption that a specific kind of data is "normal."</p>
                    </div>
                    <div ref={tryItRef} className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">Try it Yourself</h2>
                        <ol className="list-none space-y-2 mt-3">
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">01.</span>
                                <span>Type a number in the input field</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">02.</span>
                                <span>Click Insert to place it in the tree</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">03.</span>
                                <span>Click Next Step → to walk through the algorithm</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">04.</span>
                                <span>Watch the code panel highlight each decision</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">05.</span>
                                <span>Try inserting 1, 2, 3, 4 in order to see the worst case</span>
                            </li>
                        </ol>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full flex flex-col md:w-[50%] md:h-full">

                    {/* Sandbox */}
                    <div className="h-[40vh] md:h-[55%] p-4 md:p-6 flex flex-col" style={{backgroundColor: '#242424'}}>
                        {!sandboxActive ? (
                            <p className="text-muted font-mono text-sm">Scroll through the story to begin</p>
                        ) : (
                            <>
                                <div className="flex flex-1 items-start justify-center overflow-auto">
                                    {root === null ? (
                                        <p className="text-muted font-mono text-xs self-center">Insert a value to build the tree</p>
                                    ) : (
                                        <svg
                                            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                                            width="100%"
                                            style={{minWidth: '280px', overflow: 'visible'}}
                                            aria-label="Binary search tree visualization"
                                        >
                                            {/* Edges beneath nodes */}
                                            {edges.map(edge => (
                                                <line
                                                    key={edge.id}
                                                    x1={edge.x1} y1={edge.y1}
                                                    x2={edge.x2} y2={edge.y2}
                                                    stroke="#6C63FF"
                                                    strokeWidth="1.5"
                                                    strokeOpacity="0.45"
                                                />
                                            ))}
                                            {/* Nodes */}
                                            {flatNodes.map(node => (
                                                <g
                                                    key={node.id}
                                                    ref={(el) => { if (el) nodeGroupRefs.current[node.id] = el; }}
                                                    style={{opacity: animatedIds.current.has(node.id) || node.id !== newNodeId ? 1 : 0}}
                                                >
                                                    <circle
                                                        cx={node.x}
                                                        cy={node.y}
                                                        r={NODE_RADIUS}
                                                        fill="#1A1A1A"
                                                        stroke="#00F5A0"
                                                        strokeWidth="2"
                                                    />
                                                    <text
                                                        x={node.x}
                                                        y={node.y}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                        fill="white"
                                                        fontSize="11"
                                                        fontFamily="'JetBrains Mono', monospace"
                                                        style={{userSelect: 'none'}}
                                                    >
                                                        {node.value}
                                                    </text>
                                                </g>
                                            ))}
                                        </svg>
                                    )}
                                </div>
                                <p className="text-primary font-mono text-xs py-2">{currentSteps[currentStep].description}</p>
                                <div className="flex gap-3 items-center pt-2 flex-wrap">
                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => { setInputValue(e.target.value); setDeleteError(''); }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                                        placeholder={deleteError ? "Enter value to delete..." : "Enter a number..."}
                                        className="bg-[#242424] text-white placeholder:text-gray-500 border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#00F5A0] font-mono px-3 py-2 rounded text-sm w-44"
                                    />
                                    <button onClick={handleInsert} className="px-4 py-2 rounded font-mono text-sm bg-[#00F5A0] text-black">Insert</button>
                                    <button onClick={handleDelete} className="px-4 py-2 rounded font-mono text-sm border border-[#FF4C4C] text-[#FF4C4C]">Delete</button>
                                    <button onClick={handleNextStep} className="px-4 py-2 rounded font-mono text-sm border border-[#6C63FF] text-[#6C63FF]">Next Step →</button>
                                </div>
                                {deleteError && <p className="text-[#FF4C4C] font-mono text-xs mt-1">{deleteError}</p>}
                            </>
                        )}
                    </div>

                    {/* Code Panel */}
                    <div className="h-[35vh] md:h-[45%] border-t border-[#00A86B] p-4 md:p-6 overflow-hidden" style={{backgroundColor: '#0D0D0D'}}>
                        {!codePanelActive ? (
                            <p className="text-muted font-mono text-sm">Insert or delete a node to see the algorithm code</p>
                        ) : (
                            <CodePanel activeOperation={activeOperation} activeLine={currentSteps[currentStep].line} />
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="flex items-center justify-between py-2 px-4 border-t border-[#1A1A1A]" style={{backgroundColor: '#1E1E1E'}}>
                <div className="w-[25%]">
                    <Link href="/structures/queue" className="text-muted font-mono text-sm hover:text-primary">
                        ← Queue
                    </Link>
                </div>

                <div className="flex items-center justify-center gap-0">
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${sandboxActive ? 'bg-primary text-black' : 'border border-muted text-muted'}`}>1</div>
                        <span className="text-xs text-muted mt-1">Read</span>
                    </div>
                    <div className="w-8 h-[1px] bg-muted mb-4"></div>
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${stepsComplete ? 'bg-primary text-black' : 'border border-muted text-muted'}`}>2</div>
                        <span className="text-xs text-muted mt-1">Step</span>
                    </div>
                    <div className="w-8 h-[1px] bg-muted mb-4"></div>
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${hasInserted && hasDeleted ? 'bg-primary text-black' : 'border border-muted text-muted'}`}>3</div>
                        <span className="text-xs text-muted mt-1">Done</span>
                    </div>
                </div>

                <div className="w-[25%] text-right">
                    <Link href="/structures/graph" className="text-muted font-mono text-sm hover:text-primary">
                        Graph →
                    </Link>
                </div>
            </footer>
        <ConfettiBlast triggered={hasInserted && hasDeleted} />
        </div>
    );
}
