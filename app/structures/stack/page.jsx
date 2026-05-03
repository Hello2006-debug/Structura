'use client';
import React, {useState, useRef, useEffect} from 'react';
import NodeBlock from './NodeBlock';
import CodePanel from './CodePanel';
import Navbar from '@/components/Navbar';
import ConfettiBlast from '@/components/ConfettiBlast';
import {animate} from 'animejs';
import Link from 'next/link';

export default function StackPage() {
    const [nodes, setNodes] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [activeOperation, setActiveOperation] = useState("push");
    const [hasInserted, setHasInserted] = useState(false);
    const [hasPopped, setHasPopped] = useState(false);
    const [stepsComplete, setStepsComplete] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [sandboxActive, setSandboxActive] = useState(false);
    const [codePanelActive, setCodePanelActive] = useState(false);

    const tryItRef = useRef(null);
    const topNodeRef = useRef(null);

    const pushSteps = [
        { description: "Begin the push — call push(value) to add to the top", line: 0 },
        { description: "Create a new node wrapping the given value", line: 1 },
        { description: "Point the new node's next at the current top", line: 2 },
        { description: "Move the top pointer to the new node", line: 3 },
        { description: "Increment size — node is now at the top of the stack", line: 4 },
    ];

    const popSteps = [
        { description: "Begin the pop — prepare to remove the top node", line: 0 },
        { description: "If the stack is empty, return null immediately", line: 1 },
        { description: "Save a reference to the top node before losing it", line: 2 },
        { description: "Move the top pointer down to the next node", line: 3 },
        { description: "Decrement size — the removed value is returned", line: 4 },
    ];

    const currentSteps = activeOperation === "push" ? pushSteps : popSteps;

    function push() {
        if (inputValue.trim() === "") return;
        const newNode = {id: Date.now(), value: inputValue};
        setNodes(prev => [newNode, ...prev]);
        setInputValue("");
        setActiveOperation("push");
        setCodePanelActive(true);
        setCurrentStep(0);
        setHasInserted(true);
    }

    async function pop() {
        if (nodes.length === 0) return;
        if (topNodeRef.current) {
            await new Promise((resolve) => {
                animate(topNodeRef.current, {
                    opacity: [1, 0],
                    translateY: [0, -20],
                    duration: 300,
                    ease: 'easeInExpo',
                    onComplete: resolve
                });
            });
        }
        setNodes(prev => prev.slice(1));
        setActiveOperation("pop");
        setCurrentStep(0);
        setHasPopped(true);
    }

    function handleNextStep() {
        const next = Math.min(currentStep + 1, currentSteps.length - 1);
        setCurrentStep(next);
        if (next === currentSteps.length - 1) {
            setStepsComplete(true);
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setSandboxActive(true);
                observer.disconnect();
            }
        }, {threshold: 0.5});

        observer.observe(tryItRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className='min-h-screen md:h-screen flex flex-col md:overflow-hidden'>
            <Navbar />
            <main className="flex flex-col md:flex-row flex-1 md:overflow-hidden">

                {/* Left Panel — Story */}
                <div className="w-full h-[40vh] md:w-[50%] md:h-full overflow-y-auto border-b md:border-b-0 md:border-r border-[#00A86B] p-4" style={{backgroundColor: '#1E1E1E'}}>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight mb-3 text-primary">What is a Stack?</h2>
                        <p className="text-white text-sm">A stack is a collection where items are added and removed from the same end — the top. The rule is simple: last in, first out (LIFO). Think of a stack of plates: you add to the top and take from the top. You can never reach the middle without first removing everything above it.</p>
                    </div>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">A Brief History</h2>
                        <p className="text-white text-sm">The stack was formalized by Friedrich L. Bauer and Klaus Samelson in 1957 as a mechanism for expression evaluation in compilers. It became fundamental to the design of programming languages — every function call you write pushes a stack frame, and every return pops one. The call stack you see in crash reports today is this same structure, unchanged for nearly 70 years.</p>
                    </div>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">Question the Design</h2>
                        <p className="text-white text-sm">The stack enforces strict LIFO order — a constraint built in by design. But who does this serve? Early compiler designers built the stack around sequential, synchronous execution. Concurrent systems, event-driven architectures, and distributed computing often need something more flexible. The stack is powerful, but its constraints shape what programs built on top of it can even imagine doing.</p>
                    </div>
                    <div ref={tryItRef} className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">Try it Yourself</h2>
                        <ol className="list-none space-y-2 mt-3">
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">01.</span>
                                <span>Type a value in the input field</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">02.</span>
                                <span>Click Push to add it to the top of the stack</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">03.</span>
                                <span>Click Next Step → to walk through the algorithm</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">04.</span>
                                <span>Watch the code panel highlight each line</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">05.</span>
                                <span>Try popping a node to see how LIFO works</span>
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
                                <div className="flex flex-1 flex-col items-center gap-0 overflow-y-auto">
                                    {nodes.length === 0 && (
                                        <p className="text-muted font-mono text-xs mt-4">Stack is empty</p>
                                    )}
                                    {nodes.map((node, index) => (
                                        <NodeBlock
                                            key={node.id}
                                            value={node.value}
                                            isTop={index === 0}
                                            ref={index === 0 ? topNodeRef : null}
                                        />
                                    ))}
                                    {nodes.length > 0 && (
                                        <div className="flex flex-col items-center w-full max-w-[10rem]">
                                            <div className="mt-1 font-mono text-muted text-xs">null</div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-primary font-mono text-xs py-2">{currentSteps[currentStep].description}</p>
                                <div className="flex gap-3 items-center pt-2 flex-wrap">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && push()}
                                        placeholder="Enter a value..."
                                        className="bg-[#242424] text-white placeholder:text-gray-500 border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#00F5A0] font-mono px-3 py-2 rounded text-sm"
                                    />
                                    <button onClick={push} className="px-4 py-2 rounded font-mono text-sm bg-[#00F5A0] text-black">Push</button>
                                    <button onClick={pop} className="px-4 py-2 rounded font-mono text-sm border border-[#FF4C4C] text-[#FF4C4C]">Pop</button>
                                    <button onClick={handleNextStep} className="px-4 py-2 rounded font-mono text-sm border border-[#6C63FF] text-[#6C63FF]">Next Step →</button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Code Panel */}
                    <div className="h-[35vh] md:h-[45%] border-t border-[#00A86B] p-4 md:p-6 overflow-hidden" style={{backgroundColor: '#0D0D0D'}}>
                        {!codePanelActive ? (
                            <p className="text-muted font-mono text-sm">Push a node to see the algorithm code</p>
                        ) : (
                            <CodePanel
                                activeOperation={activeOperation}
                                activeLine={currentSteps[currentStep].line}
                            />
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="flex items-center justify-between py-2 px-4 border-t border-[#1A1A1A]" style={{backgroundColor: '#1E1E1E'}}>
                <div className="w-[25%]">
                    <Link href="/structures/linked-list" className="text-muted font-mono text-sm hover:text-primary">
                        ← Linked List
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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${hasInserted && hasPopped ? 'bg-primary text-black' : 'border border-muted text-muted'}`}>3</div>
                        <span className="text-xs text-muted mt-1">Done</span>
                    </div>
                </div>

                <div className="w-[25%] text-right">
                    <Link href="/structures/queue" className="text-muted font-mono text-sm hover:text-primary">
                        Queue →
                    </Link>
                </div>
            </footer>
        <ConfettiBlast triggered={hasInserted && hasPopped} />
        </div>
    );
}
