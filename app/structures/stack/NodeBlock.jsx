'use client'
import {animate} from 'animejs'
import {useRef, useEffect} from 'react'

export default function NodeBlock({value, isTop, ref}) {
    const nodeRef = useRef(null)

    useEffect(() => {
        if (nodeRef.current) animate(nodeRef.current, {
            opacity: [0, 1],
            translateY: [-30, 0],
            duration: 400,
            ease: 'easeOutExpo'
        })
    }, [])

    return (
        <div className="flex flex-col items-center w-full max-w-[10rem]" ref={(el) => {
            nodeRef.current = el;
            if (typeof ref === 'function') ref(el);
            else if (ref) ref.current = el;
        }}>
            <label className="text-xs text-primary mb-1 h-4">{isTop ? <span>Top</span> : null}</label>
            <div
                className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center font-mono text-sm text-white"
                style={{backgroundColor: '#1A1A1A'}}
            >
                {value}
            </div>
        </div>
    )
}
