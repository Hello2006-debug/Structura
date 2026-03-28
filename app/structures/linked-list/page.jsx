'use client';
import React, {useState} from 'react';
import NodeCircle from './NodeCircle'
import Arrow from './Arrow'
import  CodePanel from './CodePanel'
import { set } from 'animejs';
export default function LinkedListPage() {
    const [nodes , setNodes] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [activeOperation, setActiveOperation] = useState("insert");
    function insertAtHead() {
        if (inputValue.trim() === "") return;
        const newNode = {
            id: Date.now(),
            value: inputValue
        }
        setNodes([newNode, ...nodes]);
        setInputValue("");
        setActiveOperation("insert")
    }
    function deleteNode(){
        if (nodes.length === 0) return;
        setNodes(nodes.slice(1));
        setActiveOperation("delete")
    }
    return (
    <main className="flex flex-row h-screen overflow-hidden">
        <div className="w-[50%] overflow-y-auto h-full border-r border-[#00A86B] p-6" style={{backgroundColor:'#1E1E1E'}}>
            <div className="border-l border-[#00F5A0] px-6">
                <h2 className="font-mono font-bold text-3xl leading-tight mb-6 text-primary">The Chain Of Nodes</h2>
                <p className="text-white">A linked list is a sequence of nodes where each node holds a value and a pointer to the next node. Unlike an array, nodes are not stored next to each other in memory — they are connected only by their pointers.</p>
            </div>
            <div className="border-l border-[#00F5A0] px-6">
                <h2 className="font-mono font-bold text-3xl leading-tight my-6  text-primary">RAND Corporation, 1956</h2>
                <p className="text-white">Linked lists were developed by Allen Newell, Cliff Shaw, and Herbert Simon at RAND Corporation while building the Logic Theorist — the first AI program. They needed a flexible way to store symbolic expressions where the size was not known in advance.</p>
            </div>
            <div className="border-l border-[#00F5A0] px-6">
                <h2 className="font-mono font-bold text-3xl leading-tight my-6 text-primary">Where You See It Every Day</h2>
                <p className="text-white">Browser back/forward history. Music playlists. Undo/redo in text editors. OS process scheduling. Any time you need a sequence that grows and shrinks dynamically.</p>
            </div>
            <div className="border-l border-[#00F5A0] px-6">
                <h2 className="font-mono font-bold text-3xl leading-tight my-6 text-primary">Who Built This, and For Whose Problems?</h2>
                <p className="text-white">Linked lists were built for symbolic AI researchers — academics at well-funded US institutions during the Cold War. The structure reflects their needs: flexibility over speed. Whose computing environments were assumed?</p>
            </div>
            <div className="border-l border-[#00F5A0] px-6">
                <h2 className="font-mono font-bold text-3xl leading-tight my-6 text-primary">What You Can Do</h2>
                <p className="text-white">Insert at head in O(1). Insert at tail in O(n). Delete a node in O(n). Traverse the entire list in O(n). No random access — you must walk the chain from the start.</p>
            </div>
            <div className="border-l border-[#00F5A0] px-6">
                <h2 className="font-mono font-bold text-3xl leading-tight my-6 text-primary">Try It Out</h2>
                <p className="text-white"></p>
            </div>
        </div>
        <div className="w-[50%] flex flex-col h-full">
            <div className="h-[55%] p-6 flex flex-col" style={{backgroundColor:'#242424'}}>
                <div className="flex flex-1  items-center gap-4 overflow-x-auto flex-1">
                    {nodes.map((node,index) => (
                    <React.Fragment key={node.id} >
                        <NodeCircle value={node.value} isHead={index === 0}/>
                        {index < nodes.length - 1 && <Arrow /> }
                    </React.Fragment>
                ))}
                {nodes.length > 0 && <><Arrow /><span className="font-mono text-muted text-sm">null</span></>}
                </div>
                <div className="flex gap-3 items-center pt-4">
                    <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter a value..."
                    className="bg-[#242424] text-white placeholder:text-gray-500 border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#00F5A0] font-mono px-3 py-2 rounded text-sm"
                />
                <button onClick={insertAtHead} className="px-4 py-2 rounded font-mono text-sm bg-[#00F5A0] text-black"
>Insert</button>
                <button onClick={deleteNode} className="px-4 py-2 rounded font-mono text-sm border border-[#FF4C4C] text-[#FF4C4C]"
>Delete</button>
                </div>
            </div>
            <div className="h-[45%] border-t border-[#00A86B] p-6" style={{backgroundColor:'#0D0D0D'}}>
                <CodePanel activeOperation={activeOperation}/>
            </div>
        </div>
</main>
    )
}