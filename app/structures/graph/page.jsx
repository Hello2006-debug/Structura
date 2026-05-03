'use client';
import React, { useState, useRef, useEffect } from 'react';
import CodePanel from './CodePanel';
import Navbar from '@/components/Navbar';
import ConfettiBlast from '@/components/ConfettiBlast';
import { animate } from 'animejs';
import Link from 'next/link';

const GRAPH_W = 620;
const GRAPH_H = 360;
const NODE_R = 18;

function getNewNodePosition(index) {
    if (index === 0) return { x: GRAPH_W / 2, y: GRAPH_H / 2 };
    const angle = index * 2.399963; // golden angle in radians — spreads nodes without clustering
    const radius = Math.min(60 + index * 30, Math.min(GRAPH_W, GRAPH_H) * 0.4);
    return {
        x: Math.max(NODE_R + 8, Math.min(GRAPH_W - NODE_R - 8, GRAPH_W / 2 + radius * Math.cos(angle))),
        y: Math.max(NODE_R + 8, Math.min(GRAPH_H - NODE_R - 8, GRAPH_H / 2 + radius * Math.sin(angle))),
    };
}

export default function GraphPage() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [nodeInput, setNodeInput] = useState('');
    const [edgeInput, setEdgeInput] = useState('');
    const [activeOperation, setActiveOperation] = useState('addNode');
    const [hasAddedNode, setHasAddedNode] = useState(false);
    const [hasAddedEdge, setHasAddedEdge] = useState(false);
    const [stepsComplete, setStepsComplete] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [sandboxActive, setSandboxActive] = useState(false);
    const [codePanelActive, setCodePanelActive] = useState(false);
    const [newNodeId, setNewNodeId] = useState(null);
    const [newEdgeId, setNewEdgeId] = useState(null);
    const [nodeError, setNodeError] = useState('');
    const [edgeError, setEdgeError] = useState('');

    const tryItRef = useRef(null);
    const svgRef = useRef(null);
    const nodeGroupRefs = useRef({});
    const edgeLineRefs = useRef({});
    const animatedNodeIds = useRef(new Set());
    const animatedEdgeIds = useRef(new Set());
    const dragRef = useRef(null);

    const addNodeSteps = [
        { description: "Begin addNode — register a new vertex in the graph", line: 0 },
        { description: "Create the node object storing its label identifier", line: 1 },
        { description: "Initialize an empty adjacency list entry for this vertex", line: 2 },
        { description: "Node is ready — return it to the caller", line: 3 },
    ];

    const addEdgeSteps = [
        { description: "Begin addEdge — connect two vertices in the graph", line: 0 },
        { description: "Push the destination into the source vertex's neighbor list", line: 1 },
        { description: "Push the source into the destination's list — undirected graph", line: 2 },
        { description: "Both vertices now reference each other as neighbors", line: 3 },
    ];

    const currentSteps = activeOperation === 'addEdge' ? addEdgeSteps : addNodeSteps;

    function handleAddNode() {
        const label = nodeInput.trim();
        if (!label) { setNodeError('Enter a label'); return; }
        if (nodes.some(n => n.label === label)) { setNodeError('Node already exists'); return; }
        setNodeError('');
        const pos = getNewNodePosition(nodes.length);
        const newNode = { id: Date.now(), label, ...pos };
        setNodes(prev => [...prev, newNode]);
        setNewNodeId(newNode.id);
        setNodeInput('');
        setActiveOperation('addNode');
        setCodePanelActive(true);
        setCurrentStep(0);
        setHasAddedNode(true);
    }

    function handleAddEdge() {
        const parts = edgeInput.split(',').map(s => s.trim());
        if (parts.length !== 2 || !parts[0] || !parts[1]) {
            setEdgeError('Format: A, B');
            return;
        }
        const [from, to] = parts;
        if (from === to) { setEdgeError('Cannot connect a node to itself'); return; }
        if (!nodes.some(n => n.label === from)) { setEdgeError(`Node "${from}" not found`); return; }
        if (!nodes.some(n => n.label === to)) { setEdgeError(`Node "${to}" not found`); return; }
        if (edges.some(e => (e.from === from && e.to === to) || (e.from === to && e.to === from))) {
            setEdgeError('Edge already exists');
            return;
        }
        setEdgeError('');
        const newEdge = { id: Date.now(), from, to };
        setEdges(prev => [...prev, newEdge]);
        setNewEdgeId(newEdge.id);
        setEdgeInput('');
        setActiveOperation('addEdge');
        setCodePanelActive(true);
        setCurrentStep(0);
        setHasAddedEdge(true);
    }

    function handleNextStep() {
        const next = Math.min(currentStep + 1, currentSteps.length - 1);
        setCurrentStep(next);
        if (next === currentSteps.length - 1) setStepsComplete(true);
    }

    // Animate new node fade-in
    useEffect(() => {
        if (!newNodeId || animatedNodeIds.current.has(newNodeId)) return;
        const el = nodeGroupRefs.current[newNodeId];
        if (!el) return;
        animatedNodeIds.current.add(newNodeId);
        animate(el, { opacity: [0, 1], duration: 450, ease: 'easeOutExpo' });
    }, [newNodeId, nodes]);

    // Animate new edge fade-in
    useEffect(() => {
        if (!newEdgeId || animatedEdgeIds.current.has(newEdgeId)) return;
        const el = edgeLineRefs.current[newEdgeId];
        if (!el) return;
        animatedEdgeIds.current.add(newEdgeId);
        animate(el, { opacity: [0, 1], duration: 400, ease: 'easeOutExpo' });
    }, [newEdgeId, edges]);

    // IntersectionObserver — activates sandbox once user scrolls to "Try it Yourself"
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

    function handleMouseDown(e, nodeId) {
        e.preventDefault();
        const svgRect = svgRef.current.getBoundingClientRect();
        const scaleX = GRAPH_W / svgRect.width;
        const scaleY = GRAPH_H / svgRect.height;
        const node = nodes.find(n => n.id === nodeId);
        dragRef.current = {
            id: nodeId,
            startMouseX: (e.clientX - svgRect.left) * scaleX,
            startMouseY: (e.clientY - svgRect.top) * scaleY,
            origX: node.x,
            origY: node.y,
        };
    }

    function handleMouseMove(e) {
        if (!dragRef.current) return;
        const svgRect = svgRef.current.getBoundingClientRect();
        const scaleX = GRAPH_W / svgRect.width;
        const scaleY = GRAPH_H / svgRect.height;
        const mouseX = (e.clientX - svgRect.left) * scaleX;
        const mouseY = (e.clientY - svgRect.top) * scaleY;
        const dx = mouseX - dragRef.current.startMouseX;
        const dy = mouseY - dragRef.current.startMouseY;
        const newX = Math.max(NODE_R + 4, Math.min(GRAPH_W - NODE_R - 4, dragRef.current.origX + dx));
        const newY = Math.max(NODE_R + 4, Math.min(GRAPH_H - NODE_R - 4, dragRef.current.origY + dy));
        setNodes(prev => prev.map(n => n.id === dragRef.current.id ? { ...n, x: newX, y: newY } : n));
    }

    function handleMouseUp() {
        dragRef.current = null;
    }

    function getNodePos(label) {
        const node = nodes.find(n => n.label === label);
        return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
    }

    return (
        <div className='min-h-screen md:h-screen flex flex-col md:overflow-hidden'>
            <Navbar />
            <main className="flex flex-col md:flex-row flex-1 md:overflow-hidden">

                {/* Left Panel — Story */}
                <div className="w-full h-[40vh] md:w-[50%] md:h-full overflow-y-auto border-b md:border-b-0 md:border-r border-[#00A86B] p-4" style={{backgroundColor: '#1E1E1E'}}>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight mb-3 text-primary">What is a Graph?</h2>
                        <p className="text-white text-sm">A graph is a structure made of vertices (nodes) and edges (connections between them). Unlike trees, graphs impose no hierarchy — any node can connect to any other, and cycles are allowed. Graphs model relationships: friendships in a social network, roads between cities, dependencies between packages. Edges can be directed (one-way) or undirected (mutual), and they can carry weights representing cost or distance.</p>
                    </div>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">A Brief History</h2>
                        <p className="text-white text-sm">Graph theory began in 1736 when Leonhard Euler solved the Königsberg Bridge Problem — proving you cannot walk across all seven bridges of the city exactly once. He abstracted landmasses as nodes and bridges as edges, creating a branch of mathematics that would later underpin the internet, GPS routing, and social network analysis. Euler's insight was that the problem was about structure, not geography — the distances and shapes were irrelevant.</p>
                    </div>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">Question the Design</h2>
                        <p className="text-white text-sm">Graphs are among the most expressive data structures — nearly any system of relationships can be modeled as one. But expressiveness has a cost: graph algorithms often have high complexity. Shortest path, cycle detection, and connectivity checks are expensive at scale. When Google or Facebook operate on graphs with billions of nodes, they must make deliberate trade-offs — what can be approximated? What can be precomputed? The tension between expressiveness and efficiency is the central design challenge of graph systems.</p>
                    </div>
                    <div ref={tryItRef} className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">Try it Yourself</h2>
                        <ol className="list-none space-y-2 mt-3">
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">01.</span>
                                <span>Type a label and click Add Node to place a vertex</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">02.</span>
                                <span>Type two labels separated by a comma (e.g. A, B) to connect them</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">03.</span>
                                <span>Drag nodes to rearrange the graph layout</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">04.</span>
                                <span>Click Next Step → to walk through the algorithm</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">05.</span>
                                <span>Watch the code panel highlight each line as it executes</span>
                            </li>
                        </ol>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full flex flex-col md:w-[50%] md:h-full">

                    {/* Sandbox */}
                    <div className="h-[45vh] md:h-[70%] p-4 md:p-6 flex flex-col" style={{backgroundColor: '#242424'}}>
                        {!sandboxActive ? (
                            <p className="text-muted font-mono text-sm">Scroll through the story to begin</p>
                        ) : (
                            <>
                                <div className="flex flex-1 items-center justify-center overflow-hidden">
                                    {nodes.length === 0 ? (
                                        <p className="text-muted font-mono text-xs">Add a node to start building the graph</p>
                                    ) : (
                                        <svg
                                            ref={svgRef}
                                            viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
                                            width="100%"
                                            style={{ overflow: 'visible' }}
                                            onMouseMove={handleMouseMove}
                                            onMouseUp={handleMouseUp}
                                            onMouseLeave={handleMouseUp}
                                            aria-label="Graph visualization"
                                        >
                                            {/* Edges — rendered beneath nodes */}
                                            {edges.map(edge => {
                                                const from = getNodePos(edge.from);
                                                const to = getNodePos(edge.to);
                                                return (
                                                    <line
                                                        key={edge.id}
                                                        ref={(el) => { if (el) edgeLineRefs.current[edge.id] = el; }}
                                                        x1={from.x} y1={from.y}
                                                        x2={to.x} y2={to.y}
                                                        stroke="#6C63FF"
                                                        strokeWidth="1.5"
                                                        strokeOpacity="0.6"
                                                        style={{ opacity: animatedEdgeIds.current.has(edge.id) || edge.id !== newEdgeId ? 1 : 0 }}
                                                    />
                                                );
                                            })}
                                            {/* Nodes */}
                                            {nodes.map(node => (
                                                <g
                                                    key={node.id}
                                                    ref={(el) => { if (el) nodeGroupRefs.current[node.id] = el; }}
                                                    style={{
                                                        opacity: animatedNodeIds.current.has(node.id) || node.id !== newNodeId ? 1 : 0,
                                                        cursor: 'grab',
                                                    }}
                                                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                                                >
                                                    <circle
                                                        cx={node.x}
                                                        cy={node.y}
                                                        r={NODE_R}
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
                                                        fontSize="10"
                                                        fontFamily="'JetBrains Mono', monospace"
                                                        style={{ userSelect: 'none', pointerEvents: 'none' }}
                                                    >
                                                        {node.label}
                                                    </text>
                                                </g>
                                            ))}
                                        </svg>
                                    )}
                                </div>
                                <p className="text-primary font-mono text-xs py-2">{currentSteps[currentStep].description}</p>
                                <div className="flex flex-col gap-2 pt-2">
                                    <div className="flex gap-3 items-center flex-wrap">
                                        <input
                                            type="text"
                                            value={nodeInput}
                                            onChange={(e) => { setNodeInput(e.target.value); setNodeError(''); }}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddNode()}
                                            placeholder="Node label..."
                                            className="bg-[#242424] text-white placeholder:text-gray-500 border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#00F5A0] font-mono px-3 py-2 rounded text-sm w-36"
                                        />
                                        <button onClick={handleAddNode} className="px-4 py-2 rounded font-mono text-sm bg-[#00F5A0] text-black">Add Node</button>
                                        {nodeError && <p className="text-[#FF4C4C] font-mono text-xs">{nodeError}</p>}
                                    </div>
                                    <div className="flex gap-3 items-center flex-wrap">
                                        <input
                                            type="text"
                                            value={edgeInput}
                                            onChange={(e) => { setEdgeInput(e.target.value); setEdgeError(''); }}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddEdge()}
                                            placeholder="A, B"
                                            className="bg-[#242424] text-white placeholder:text-gray-500 border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#00F5A0] font-mono px-3 py-2 rounded text-sm w-36"
                                        />
                                        <button onClick={handleAddEdge} className="px-4 py-2 rounded font-mono text-sm border border-[#6C63FF] text-[#6C63FF]">Add Edge</button>
                                        <button onClick={handleNextStep} className="px-4 py-2 rounded font-mono text-sm border border-[#6C63FF] text-[#6C63FF]">Next Step →</button>
                                        {edgeError && <p className="text-[#FF4C4C] font-mono text-xs">{edgeError}</p>}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Code Panel */}
                    <div className="h-[35vh] md:h-[30%] border-t border-[#00A86B] p-4 md:p-6 overflow-hidden" style={{backgroundColor: '#0D0D0D'}}>
                        {!codePanelActive ? (
                            <p className="text-muted font-mono text-sm">Add a node or edge to see the algorithm code</p>
                        ) : (
                            <CodePanel activeOperation={activeOperation} activeLine={currentSteps[currentStep].line} />
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="flex items-center justify-between py-2 px-4 border-t border-[#1A1A1A]" style={{backgroundColor: '#1E1E1E'}}>
                <div className="w-[25%]">
                    <Link href="/structures/tree" className="text-muted font-mono text-sm hover:text-primary">
                        ← Binary Tree
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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${hasAddedNode && hasAddedEdge ? 'bg-primary text-black' : 'border border-muted text-muted'}`}>3</div>
                        <span className="text-xs text-muted mt-1">Done</span>
                    </div>
                </div>

                <div className="w-[25%] text-right">
                    <Link href="/structures/hash-table" className="text-muted font-mono text-sm hover:text-primary">
                        Hash Table →
                    </Link>
                </div>
            </footer>
        <ConfettiBlast triggered={hasAddedNode && hasAddedEdge} />
        </div>
    );
}
