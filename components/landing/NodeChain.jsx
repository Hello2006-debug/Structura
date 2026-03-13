'use client'
import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import NodeCircle from './NodeCircle'
import Arrow from './Arrow'

export default function NodeChain(){
    const containerRef = useRef(null);
    useEffect(() => {
        if(containerRef.current){
            const nodes = containerRef.current.querySelectorAll('.node-circle');
            animate(nodes, {
                opacity: [0.3, 1],   // animate from 0.3 to 1
                duration: 1000,
                delay: stagger(250), // each element starts 250ms after the previous
                loop: true,
                alternate: true,     // after reaching 1, animate back to 0.3
                ease: 'feaseInOutSine'
            })
        }
    }, []);
    return (
        <div ref={containerRef} className="flex items-center gap-2">
            <NodeCircle value="01" />
            <Arrow />
            <NodeCircle value="02" />
            <Arrow />
            <NodeCircle value="03" />
            <Arrow/>
            <NodeCircle value="04" />  
            <Arrow />
            <span className='text-muted font-mono text-sm'>null</span>
        </div>
    );
}