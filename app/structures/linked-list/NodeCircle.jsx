export default function NodeCircle({value, isHead}){
    return (
        <div className="flex flex-col items-center">
            <label className="text-xs text-primary mb-1">{isHead && <span>Head</span>}</label>
            <div className="node-circle w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center font-mono text-sm text-white" style={{backgroundColor:'#1A1A1A'}} >{value}</div>
        </div>
    )
}