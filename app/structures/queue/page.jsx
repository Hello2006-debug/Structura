'use client';
import React, {useState, useRef, useEffect} from 'react';
import QueueNode from './QueueNode';
import CodePanel from './CodePanel';
import Navbar from '@/components/Navbar';
import ConfettiBlast from '@/components/ConfettiBlast';
import {animate} from 'animejs';
import Link from 'next/link';

export default function QueuePage() {
    const [nodes, setNodes] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [activeOperation, setActiveOperation] = useState("enqueue");
    const [hasEnqueued, setHasEnqueued] = useState(false);
    const [hasDequeued, setHasDequeued] = useState(false);
    const [stepsComplete, setStepsComplete] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [sandboxActive, setSandboxActive] = useState(false);
    const [codePanelActive, setCodePanelActive] = useState(false);

    const tryItRef = useRef(null);
    const frontNodeRef = useRef(null);

    const enqueueSteps = [
        { description: "Begin enqueue — add a new value to the rear of the queue", line: 0 },
        { description: "Create a new node wrapping the given value", line: 1 },
        { description: "Link the current rear node's next pointer to the new node", line: 2 },
        { description: "Move the rear pointer to the new node", line: 3 },
        { description: "Increment size — node is now at the rear of the queue", line: 4 },
    ];

    const dequeueSteps = [
        { description: "Begin dequeue — prepare to remove from the front", line: 0 },
        { description: "If the queue is empty, return null immediately", line: 1 },
        { description: "Save a reference to the front node before losing it", line: 2 },
        { description: "Move the front pointer to the next node in line", line: 3 },
        { description: "Decrement size — the removed value is returned", line: 4 },
    ];

    const currentSteps = activeOperation === "enqueue" ? enqueueSteps : dequeueSteps;

    function enqueue() {
        if (inputValue.trim() === "") return;
        const newNode = {id: Date.now(), value: inputValue};
        setNodes(prev => [...prev, newNode]);
        setInputValue("");
        setActiveOperation("enqueue");
        setCodePanelActive(true);
        setCurrentStep(0);
        setHasEnqueued(true);
    }

    async function dequeue() {
        if (nodes.length === 0) return;
        if (frontNodeRef.current) {
            await new Promise((resolve) => {
                animate(frontNodeRef.current, {
                    opacity: [1, 0],
                    translateX: [0, -20],
                    duration: 300,
                    ease: 'easeInExpo',
                    onComplete: resolve
                });
            });
        }
        setNodes(prev => prev.slice(1));
        setActiveOperation("dequeue");
        setCurrentStep(0);
        setHasDequeued(true);
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
                        <h2 className="font-mono font-bold text-xl leading-tight mb-3 text-primary">What is a Queue?</h2>
                        <p className="text-white text-sm">A queue is a collection where items enter from one end and leave from the other — first in, first out (FIFO). Think of a line at a ticket counter: the first person in line is the first person served. New arrivals join at the rear. No cutting ahead. The order of arrival is the order of service.</p>
                    </div>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">A Brief History</h2>
                        <p className="text-white text-sm">Queues emerged alongside operating systems in the late 1950s as computer scientists grappled with process scheduling: how should a machine decide which task runs next? The ready queue — the list of processes waiting for CPU time — is still the mechanism at the heart of every modern operating system. Every time you open an app, a queue decides when it gets to run.</p>
                    </div>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">Question the Design</h2>
                        <p className="text-white text-sm">The queue enforces fairness through strict ordering: first in, first out. But this "fairness" is a design choice, not a universal truth. Priority queues deliberately break this rule — some tasks jump the line. Emergency dispatching, real-time systems, and resource-constrained environments all demand more nuanced ordering. Who decided that fairness means arrival time?</p>
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
                                <span>Click Enqueue to add it to the rear of the queue</span>
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
                                <span>Try dequeuing to see how FIFO works</span>
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
                                <div className="flex flex-1 items-center gap-4 overflow-x-auto">
                                    {nodes.length === 0 && (
                                        <p className="text-muted font-mono text-xs">Queue is empty</p>
                                    )}
                                    {nodes.map((node, index) => (
                                        <React.Fragment key={node.id}>
                                            <QueueNode
                                                value={node.value}
                                                isFront={index === 0}
                                                isRear={index === nodes.length - 1}
                                                ref={index === 0 ? frontNodeRef : null}
                                            />
                                            {index < nodes.length - 1 && (
                                                <span className="mx-2 text-secondary font-mono">→</span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    {nodes.length > 0 && (
                                        <>
                                            <span className="mx-2 text-secondary font-mono">→</span>
                                            <span className="font-mono text-muted text-sm">null</span>
                                        </>
                                    )}
                                </div>
                                <p className="text-primary font-mono text-xs py-2">{currentSteps[currentStep].description}</p>
                                <div className="flex gap-3 items-center pt-2 flex-wrap">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && enqueue()}
                                        placeholder="Enter a value..."
                                        className="bg-[#242424] text-white placeholder:text-gray-500 border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#00F5A0] font-mono px-3 py-2 rounded text-sm"
                                    />
                                    <button onClick={enqueue} className="px-4 py-2 rounded font-mono text-sm bg-[#00F5A0] text-black">Enqueue</button>
                                    <button onClick={dequeue} className="px-4 py-2 rounded font-mono text-sm border border-[#FF4C4C] text-[#FF4C4C]">Dequeue</button>
                                    <button onClick={handleNextStep} className="px-4 py-2 rounded font-mono text-sm border border-[#6C63FF] text-[#6C63FF]">Next Step →</button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Code Panel */}
                    <div className="h-[35vh] md:h-[45%] border-t border-[#00A86B] p-4 md:p-6 overflow-hidden" style={{backgroundColor: '#0D0D0D'}}>
                        {!codePanelActive ? (
                            <p className="text-muted font-mono text-sm">Enqueue a node to see the algorithm code</p>
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
                    <Link href="/structures/stack" className="text-muted font-mono text-sm hover:text-primary">
                        ← Stack
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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${hasEnqueued && hasDequeued ? 'bg-primary text-black' : 'border border-muted text-muted'}`}>3</div>
                        <span className="text-xs text-muted mt-1">Done</span>
                    </div>
                </div>

                <div className="w-[25%] text-right">
                    <Link href="/structures/tree" className="text-muted font-mono text-sm hover:text-primary">
                        Binary Tree →
                    </Link>
                </div>
            </footer>
        <ConfettiBlast triggered={hasEnqueued && hasDequeued} />
        </div>
    );
}
