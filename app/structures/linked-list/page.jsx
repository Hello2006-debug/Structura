'use client';
import React, {useState, useRef, useEffect} from 'react';
import NodeCircle from './NodeCircle'
import Arrow from './Arrow'
import  CodePanel from './CodePanel'
import Navbar from '@/components/Navbar';
import {animate} from 'animejs'
import Link from 'next/link'
export default function LinkedListPage() {
    const [nodes , setNodes] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [activeOperation, setActiveOperation] = useState("insert");
    const [hasInserted, setHasInserted] = useState(false)
    const [hasDeleted, setHasDeleted] = useState(false)
    const [stepsComplete, setStepsComplete] = useState(false)
    function insertAtHead() {
        if (inputValue.trim() === "") return;
        const newNode = {
            id: Date.now(),
            value: inputValue
        }
        setNodes([newNode, ...nodes]);
        setInputValue("");
        setActiveOperation("insert");
        setCodePanelActive(true);
        setCurrentStep(0);
        setHasInserted(true);
    }
    async function deleteNode() {
    if (nodes.length === 0) return
    if (firstNodeRef.current) {
    await new Promise((resolve) => {
    animate(firstNodeRef.current, {
        opacity: [1, 0],
        translateY: [0, -20],
        duration: 300,
        ease: 'easeInExpo',
        onComplete: resolve
    })
    })
}
setNodes(nodes.slice(1))
setActiveOperation("delete")
setCurrentStep(0)
setHasDeleted(true)
}


    const insertSteps = [
    { description: "Create a new node with any value", line: 0, action: "show-new-node" },
    { description: "Set node.next to point to current head", line: 1, action: "draw-pointer" },
    { description: "Update head to point to new node", line: 2, action: "move-head-label" },
    { description: "Increase size by 1", line: 3, action: null },
    { description: "Done — node is now at the head", line: 4, action: "complete" },
    ]
    const deleteSteps = [
    { description: "Check if the list is empty — if head is null, nothing to delete", line: 0, action: "check-head" },
    { description: "Save a reference to the current head node before we lose it", line: 1, action: "save-removed" },
    { description: "Move the head pointer to the next node in the chain", line: 2, action: "move-head" },
    { description: "Decrease the size counter by 1", line: 3, action: null },
    { description: "Return the removed node — deletion complete", line: 4, action: "complete" },
]
    const currentSteps = activeOperation === "insert" ? insertSteps : deleteSteps;
    const [currentStep, setCurrentStep] = useState(0)
    const tryItRef = useRef(null);
    const firstNodeRef = useRef(null);
    const [sandboxActive , setSandboxActive] = useState(false)
    const [codePanelActive, setCodePanelActive] = useState(false)
    useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
    setSandboxActive(true)
    observer.disconnect()
    }
    }, { threshold: 0.5 })

    observer.observe(tryItRef.current)
    return () => observer.disconnect()
}, [])
    function handleNextStep() {
        const next = Math.min(currentStep + 1, insertSteps.length - 1)
        setCurrentStep(next)
        if (next === insertSteps.length - 1) {
            setStepsComplete(true)
        }
    }

    return (
        <div className='h-screen flex flex-col overflow-hidden'>
        <Navbar />
    <main className="flex flex-row flex-1  overflow-hidden">
    <div className="w-[50%] overflow-y-auto h-full border-r border-[#00A86B] p-4" style={{backgroundColor:'#1E1E1E'}}>
    <div className="border-l border-[#00F5A0] px-4">
        <h2 className="font-mono font-bold text-xl leading-tight mb-3 text-primary">The Chain Of Nodes</h2>
        <p className="text-white text-sm">A linked list is a sequence of nodes where each node holds a value and a pointer to the next node. Unlike an array, nodes are not stored next to each other in memory — they are connected only by their pointers.</p>
    </div>
    <div className="border-l border-[#00F5A0] px-4">
        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">RAND Corporation, 1956</h2>
        <p className="text-white text-sm">Linked lists were developed by Allen Newell, Cliff Shaw, and Herbert Simon at RAND Corporation while building the Logic Theorist — the first AI program. They needed a flexible way to store symbolic expressions where the size was not known in advance.</p>
    </div>
    <div className="border-l border-[#00F5A0] px-4">
        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">Where You See It Every Day</h2>
        <p className="text-white text-sm">Browser back/forward history. Music playlists. Undo/redo in text editors. OS process scheduling. Any time you need a sequence that grows and shrinks dynamically.</p>
    </div>
    <div className="border-l border-[#00F5A0] px-4">
        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">Who Built This, and For Whose Problems?</h2>
        <p className="text-white text-sm">Linked lists were built for symbolic AI researchers — academics at well-funded US institutions during the Cold War. The structure reflects their needs: flexibility over speed. Whose computing environments were assumed?</p>
    </div>
    <div className="border-l border-[#00F5A0] px-4">
        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">What You Can Do</h2>
        <p className="text-white text-sm">Insert at head in O(1). Insert at tail in O(n). Delete a node in O(n). Traverse the entire list in O(n). No random access — you must walk the chain from the start.</p>
    </div>
    <div ref={tryItRef} className="border-l border-[#00F5A0] px-4">
        <h2 className="font-mono font-bold text-xl leading-tight my-3 text-primary">Try It Yourself</h2>
        <ol className="list-none space-y-2 mt-3">
            <li className="flex gap-3 text-white text-sm">
                <span className="text-primary font-mono">01.</span>
                <span>Type a value in the input field</span>
            </li>
            <li className="flex gap-3 text-white text-sm">
                <span className="text-primary font-mono">02.</span>
                <span>Click Insert to add it to the list</span>
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
                <span>Try deleting a node to see how that works</span>
            </li>
        </ol>
    </div>
</div>
        <div className="w-[50%] flex flex-col h-full">
            <div className="h-[55%] p-6 flex flex-col" style={{backgroundColor:'#242424'}}>
                {!sandboxActive ? (
                    <p className="text-muted font-mon text-sm">Scroll through the story to begin</p>
                ): (
                    <>
                    <div className="flex flex-1  items-center gap-4 overflow-x-auto flex-1">
                    {nodes.map((node,index) => (
                    <React.Fragment key={node.id} >
                        <NodeCircle value={node.value} isHead={index === 0} ref={index === 0 ? firstNodeRef : null} />
                        {index < nodes.length - 1 && <Arrow /> }
                    </React.Fragment>
                ))}
                {nodes.length > 0 && <><Arrow /><span className="font-mono text-muted text-sm">null</span></>}
                </div>
                <p className="text-primary font-mono text-xs py-2">{currentSteps[currentStep].description}</p>
                <div className="flex gap-3 items-center pt-4">
                    <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter a value..."
                    className="bg-[#242424] text-white placeholder:text-gray-500 border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#00F5A0] font-mono px-3 py-2 rounded text-sm"
                />
                <button onClick={insertAtHead} className="px-4 py-2 rounded font-mono text-sm bg-[#00F5A0] text-black">Insert</button>
                <button onClick={deleteNode} className="px-4 py-2 rounded font-mono text-sm border border-[#FF4C4C] text-[#FF4C4C]">Delete</button>
                <button onClick={handleNextStep} className="px-4 py-2 rounded font-mono text-sm border border-[#6C63FF] text-[#6C63FF]">Next Step →</button>
                </div>
                </>
                )}
            </div>
            <div className="h-[45%] border-t border-[#00A86B] p-6" style={{backgroundColor:'#0D0D0D'}}>
                {! codePanelActive ? (
                    <p className="text-muted font-mon text-sm">Insert a node to see the algorithms codes</p>
                ): (
                    <CodePanel 
                activeOperation={activeOperation}
                activeLine={currentSteps[currentStep].line}
                />
                )}
            </div>
        </div>
</main>
<footer className="flex items-center justify-between py-2 px-4 border-t border-[#1A1A1A]" style={{backgroundColor:'#1E1E1E'}}>
    {/* Left — prev button or empty space */}
    <div className="w-[25%]">
        {/* nothing here since Linked List is the first structure */}
    </div>

    {/* Center — progress bubbles */}
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

    {/* Right — next button */}
    <div className="w-[25%] text-right">
        <Link href="/structures/stack" className="text-muted font-mono text-sm hover:text-primary">
            Stack →
        </Link>
    </div>
</footer>
        </div>
    )
}