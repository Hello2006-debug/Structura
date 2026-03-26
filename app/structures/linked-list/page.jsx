import NodeCircle from './NodeCircle'
import Arrow from './Arrow'
export default function LinkedListPage() {
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
            <div className="h-[55%] p-6 flex gap-4 items-center " style={{backgroundColor:'#242424'}}>
                <NodeCircle value="12" isHead={true} />
                <Arrow />
                <NodeCircle value="99" />
                <Arrow />
                <NodeCircle value="37" />
                <Arrow />
                <span className="text-muted font-mono text-sm">null</span>
            </div>
            <div className="h-[45%] border-t border-[#00A86B] p-6" style={{backgroundColor:'#0D0D0D'}}>Code</div>
        </div>
</main>
    )
}