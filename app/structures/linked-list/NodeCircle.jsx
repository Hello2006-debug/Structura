'use client'
import {animate} from 'animejs'
import {useRef, useEffect} from 'react'

export default function NodeCircle({value, isHead, ref}){
    const nodeRef = useRef(null)

    useEffect(() => {
        if (nodeRef.current) animate(nodeRef.current, {
            opacity: [0, 1],
            translateX: [-30, 0],
            duration: 400,
            ease: 'easeOutExpo'
        })
    }, [])

    return (
        <div className="flex flex-col items-center" ref={(el) => {
            nodeRef.current = el;
            if (typeof ref === 'function') ref(el);
            else if (ref) ref.current = el;
        }}>
            <label className="text-xs text-primary mb-1">{isHead && <span>Head</span>}</label>
            <div className="node-circle w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center font-mono text-sm text-white" style={{backgroundColor:'#1A1A1A'}}>{value}</div>
        </div>
    )
}