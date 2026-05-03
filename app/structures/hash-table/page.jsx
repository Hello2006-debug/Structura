'use client';
import React, { useState, useRef, useEffect } from 'react';
import CodePanel from './CodePanel';
import Navbar from '@/components/Navbar';
import ConfettiBlast from '@/components/ConfettiBlast';
import { animate } from 'animejs';
import Link from 'next/link';

const NUM_BUCKETS = 8;

function hashFn(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash + key.charCodeAt(i)) % NUM_BUCKETS;
    return hash;
}

export default function HashTablePage() {
    const [buckets, setBuckets] = useState(() => Array.from({ length: NUM_BUCKETS }, () => []));
    const [keyInput, setKeyInput] = useState('');
    const [valueInput, setValueInput] = useState('');
    const [activeOperation, setActiveOperation] = useState('insert');
    const [hasInserted, setHasInserted] = useState(false);
    const [hasDeleted, setHasDeleted] = useState(false);
    const [stepsComplete, setStepsComplete] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [sandboxActive, setSandboxActive] = useState(false);
    const [codePanelActive, setCodePanelActive] = useState(false);
    const [newItemId, setNewItemId] = useState(null);
    const [highlightedBucket, setHighlightedBucket] = useState(null);
    const [inputError, setInputError] = useState('');

    const tryItRef = useRef(null);
    const itemRefs = useRef({});
    const animatedItemIds = useRef(new Set());

    const insertSteps = [
        { description: "Begin insert — the key will be hashed to find its destination bucket", line: 0 },
        { description: "Compute the bucket index by running the hash function on the key", line: 1 },
        { description: "Retrieve the chain stored at this index in the table", line: 2 },
        { description: "Search the chain for an existing entry with the same key", line: 3 },
        { description: "Key already exists — update its value in place and return early", line: 4 },
        { description: "No collision — push the new key-value pair onto the chain", line: 5 },
    ];

    const deleteSteps = [
        { description: "Begin delete — hash the key to locate its bucket", line: 0 },
        { description: "Compute the bucket index using the same hash function", line: 1 },
        { description: "Access the chain stored at this index in the table", line: 2 },
        { description: "Find the position of the matching entry in the chain", line: 3 },
        { description: "Key not found in this bucket — nothing to delete, return", line: 4 },
        { description: "Splice the entry out of the chain at the found position", line: 5 },
    ];

    const currentSteps = activeOperation === 'delete' ? deleteSteps : insertSteps;

    function handleInsert() {
        const key = keyInput.trim();
        const value = valueInput.trim();
        if (!key || !value) { setInputError('Enter both a key and a value'); return; }
        setInputError('');

        const index = hashFn(key);
        const existingItem = buckets[index].find(item => item.key === key);

        if (existingItem) {
            setBuckets(prev => {
                const next = prev.map(b => [...b]);
                const i = next[index].findIndex(item => item.key === key);
                next[index][i] = { ...next[index][i], value };
                return next;
            });
            setNewItemId(null);
        } else {
            const newId = Date.now();
            setBuckets(prev => {
                const next = prev.map(b => [...b]);
                next[index].push({ id: newId, key, value });
                return next;
            });
            setNewItemId(newId);
        }

        setHighlightedBucket(index);
        setKeyInput('');
        setValueInput('');
        setActiveOperation('insert');
        setCodePanelActive(true);
        setCurrentStep(0);
        setHasInserted(true);
    }

    async function handleDelete() {
        const key = keyInput.trim();
        if (!key) { setInputError('Enter a key to delete'); return; }
        setInputError('');

        const index = hashFn(key);
        const existing = buckets[index].find(item => item.key === key);
        if (!existing) { setInputError(`"${key}" not found in the table`); return; }

        const el = itemRefs.current[existing.id];
        if (el) await animate(el, { opacity: [1, 0], translateX: [0, -10], duration: 300, ease: 'easeInExpo' });

        setBuckets(prev => {
            const next = prev.map(b => [...b]);
            next[index] = next[index].filter(item => item.key !== key);
            return next;
        });
        setHighlightedBucket(index);
        setNewItemId(null);
        setKeyInput('');
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

    // Animate new item fade-in
    useEffect(() => {
        if (!newItemId || animatedItemIds.current.has(newItemId)) return;
        const el = itemRefs.current[newItemId];
        if (!el) return;
        animatedItemIds.current.add(newItemId);
        animate(el, { opacity: [0, 1], translateX: [10, 0], duration: 400, ease: 'easeOutExpo' });
    }, [newItemId, buckets]);

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

    return (
        <div className='min-h-screen md:h-screen flex flex-col md:overflow-hidden'>
            <Navbar />
            <main className="flex flex-col md:flex-row flex-1 md:overflow-hidden">

                {/* Left Panel — Story */}
                <div className="w-full h-[40vh] md:w-[50%] md:h-full overflow-y-auto border-b md:border-b-0 md:border-r border-[#00A86B] p-4" style={{backgroundColor: '#1E1E1E'}}>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight mb-3 text-primary">What is a Hash Table?</h2>
                        <p className="text-white text-sm">A hash table stores key-value pairs and retrieves them in near-constant time. A hash function converts a key — any string or number — into an array index. The value is stored there. To look up a value, you run the same hash function on the key and read from that index directly. No searching, no comparing, no scanning. The hash function is what makes it fast.</p>
                    </div>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">A Brief History</h2>
                        <p className="text-white text-sm">Hash tables were first described by IBM researchers in the early 1950s while working on assembly language compilers. Hans Peter Luhn proposed a chaining approach in 1953. By the 1960s they were standard in symbol tables — the data structures compilers use to track variable names. Today, hash tables underpin dictionaries in Python, objects in JavaScript, and databases across the entire industry.</p>
                    </div>
                    <div className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">Question the Design</h2>
                        <p className="text-white text-sm">The hash table trades ordering for speed. You cannot iterate keys in sorted order, find the minimum efficiently, or do range queries — for all of that you need a tree. And the "constant time" guarantee is probabilistic: a bad hash function causes all keys to collide into one bucket, degrading to O(n). Distributed systems discovered a further problem — when the number of buckets changes, all keys must be rehashed. Consistent hashing was invented specifically to work around this.</p>
                    </div>
                    <div ref={tryItRef} className="border-l border-[#00F5A0] px-4">
                        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">Try it Yourself</h2>
                        <ol className="list-none space-y-2 mt-3">
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">01.</span>
                                <span>Type a key and a value, then click Insert</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">02.</span>
                                <span>Watch the key hash to a bucket index</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">03.</span>
                                <span>Insert two keys that hash to the same bucket to see chaining</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">04.</span>
                                <span>Click Next Step → to walk through the algorithm</span>
                            </li>
                            <li className="flex gap-3 text-white text-sm">
                                <span className="text-primary font-mono">05.</span>
                                <span>Try deleting a key to see the remove operation</span>
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
                                {/* Bucket rows */}
                                <div className="flex flex-col flex-1 gap-1 overflow-y-auto">
                                    {Array.from({ length: NUM_BUCKETS }, (_, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center gap-2 py-1 px-2 rounded ${highlightedBucket === i ? 'border-l-2 border-[#00F5A0] bg-[#1A1A1A]' : 'border-l-2 border-transparent'}`}
                                        >
                                            <span className="font-mono text-[#6C63FF] text-xs w-6 shrink-0">[{i}]</span>
                                            <span className="text-muted font-mono text-xs shrink-0">→</span>
                                            {buckets[i].length === 0 ? (
                                                <span className="text-muted font-mono text-xs">null</span>
                                            ) : (
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {buckets[i].map((item, j) => (
                                                        <React.Fragment key={item.id}>
                                                            <div
                                                                ref={(el) => { if (el) itemRefs.current[item.id] = el; }}
                                                                className="border border-[#00F5A0] rounded px-2 py-0.5 font-mono text-xs text-white"
                                                                style={{ opacity: newItemId === item.id && !animatedItemIds.current.has(item.id) ? 0 : 1 }}
                                                            >
                                                                {item.key}: {item.value}
                                                            </div>
                                                            {j < buckets[i].length - 1 && (
                                                                <span className="text-[#6C63FF] font-mono text-xs">→</span>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-primary font-mono text-xs py-2">{currentSteps[currentStep].description}</p>
                                <div className="flex gap-3 items-center pt-2 flex-wrap">
                                    <input
                                        type="text"
                                        value={keyInput}
                                        onChange={(e) => { setKeyInput(e.target.value); setInputError(''); }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                                        placeholder="Key..."
                                        className="bg-[#242424] text-white placeholder:text-gray-500 border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#00F5A0] font-mono px-3 py-2 rounded text-sm w-28"
                                    />
                                    <input
                                        type="text"
                                        value={valueInput}
                                        onChange={(e) => { setValueInput(e.target.value); setInputError(''); }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                                        placeholder="Value..."
                                        className="bg-[#242424] text-white placeholder:text-gray-500 border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#00F5A0] font-mono px-3 py-2 rounded text-sm w-28"
                                    />
                                    <button onClick={handleInsert} className="px-4 py-2 rounded font-mono text-sm bg-[#00F5A0] text-black">Insert</button>
                                    <button onClick={handleDelete} className="px-4 py-2 rounded font-mono text-sm border border-[#FF4C4C] text-[#FF4C4C]">Delete</button>
                                    <button onClick={handleNextStep} className="px-4 py-2 rounded font-mono text-sm border border-[#6C63FF] text-[#6C63FF]">Next Step →</button>
                                </div>
                                {inputError && <p className="text-[#FF4C4C] font-mono text-xs mt-1">{inputError}</p>}
                            </>
                        )}
                    </div>

                    {/* Code Panel */}
                    <div className="h-[35vh] md:h-[45%] border-t border-[#00A86B] p-4 md:p-6 overflow-hidden" style={{backgroundColor: '#0D0D0D'}}>
                        {!codePanelActive ? (
                            <p className="text-muted font-mono text-sm">Insert or delete a key to see the algorithm code</p>
                        ) : (
                            <CodePanel activeOperation={activeOperation} activeLine={currentSteps[currentStep].line} />
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="flex items-center justify-between py-2 px-4 border-t border-[#1A1A1A]" style={{backgroundColor: '#1E1E1E'}}>
                <div className="w-[25%]">
                    <Link href="/structures/graph" className="text-muted font-mono text-sm hover:text-primary">
                        ← Graph
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

                <div className="w-[25%]"></div>
            </footer>
        <ConfettiBlast triggered={hasInserted && hasDeleted} />
        </div>
    );
}
