function StructureCard({number, title, description, href}) {
    return (
        <div className="bg-card rounded-lg p-6 flex flex-col gap-4 border-l-2 border-primary">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary text-black rounded-full flex items-center justify-center font-bold">
                    {number}
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
            </div>
            <p className="text-muted">{description}</p>
            <a href={href} className="text-primary font-semibold cursor-pointer">Learn More &rarr;</a>
        </div>
    )
}
export default function StructureGrid() {
    return (
        <div className="bg-background p-6 lg:p-16">
            <h2 className="font-mono text-2xl lg:text-3xl font-bold text-center text-primary mb-8">Explore Structures</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StructureCard number="01" title="Linked List" description="The chain of nodes, each pointing to the next" href="/structures/linked-list" />
                <StructureCard number="02" title="Binary Tree" description="A hierarchical structure with nodes having at most two children" href="/structures/tree" />
                <StructureCard number="03" title="Graph" description="A collection of nodes connected by edges, representing relationships" href="/structures/graph" />
                <StructureCard number="04" title="Hash Table" description="A data structure that maps keys to values using a hash function" href="/structures/hash-table" />
                <StructureCard number="05" title="Stack" description="A last-in, first-out (LIFO) data structure" href="/structures/stack" />
                <StructureCard number="06" title="Queue" description="A first-in, first-out (FIFO) data structure" href="/structures/queue" />
            </div>
        </div>
    )
}