export default function NodeCircle({value}){
    return (
        <div className="node-circle w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center font-mono text-sm text-primary" style={{backgroundColor:'#1A1A1A'}}>{value}</div>
    )
}