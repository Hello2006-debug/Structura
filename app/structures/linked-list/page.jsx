export default function LinkedListPage() {
    return (
    <main className="flex flex-row h-screen overflow-hidden">
        <div className="w-[40%] overflow-y-auto h-full border-r border-[#00A86B] p-6" style={{backgroundColor:'#1E1E1E'}}>
            <div className="border-l border-[#00F5A0] px-6">
                <h2 className="font-mono font-bold text-3xl leading-tight mb-6 text-primary">The Chain Of Nodes</h2>
                <p className="text-muted">A linked list is a sequence of nodes where each node holds a value and a pointer to the next node. Unlike an array, nodes are not stored next to each other in memory — they are connected only by their pointers.</p>
            </div>
        </div>
        <div className="w-[60%] flex flex-col h-full">
            <div className="h-[55%] p-6" style={{backgroundColor:'#242424'}}>SandBox</div>
            <div className="h-[45%] border-t border-[#00A86B] p-6" style={{backgroundColor:'#0D0D0D'}}>Code</div>
        </div>
</main>
    )
}