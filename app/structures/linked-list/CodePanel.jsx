export default function CodePanel({activeOperation}){
    const insertCode = [
    "function insertAtHead(value) {",
    "  const node = new Node(value)",
    "  node.next = head",
    "  head = node",
    "  size++",
    "  return node",
    "}"
    ]
    const deleteCode = [
    "function deleteAtHead() {",
    "  if (!head) return null",
    "  const removed = head",
    "  head = head.next",
    "  size--",
    "  return removed",
    "}"
]
    const code = activeOperation === "insert" ? insertCode.join("\n") : deleteCode.join("\n");
    return (
        <div className="bg-[#1E1E1E] text-white p-4 rounded-md overflow-x-auto font-mono text-sm">
            <pre>{code}</pre>
        </div>
    )
}